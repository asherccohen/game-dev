import {
  assertEvent,
  assign,
  EventObject,
  fromCallback,
  raise,
  setup,
} from 'xstate';
import { actions, createGameWorld, GameWorld, TerrainNode, Unit } from './ecs';
import { GameState, Order } from './types';

// Input type for the machine
export interface GameInput {
  tickInterval?: number;
  victoryCondition?: 'elimination' | 'occupation' | 'survival';
  gameWorld?: GameWorld | null;
  gameState?: GameState | null;
  logs?: string[];
  turnCount?: number;
  lastSaveTimestamp?: number | null;
}

// Context type including required fields
export interface GameContext
  extends Required<Omit<GameInput, 'gameWorld' | 'gameState'>> {
  gameWorld: GameWorld | null;
  gameState: GameState | null;
  currentOrder: Order | null;
  error: string | null;
  lastFrameTime: number;
  accumulatedTime: number;
  fixedTimestep: number;
  isPaused: boolean;
}

interface TickEvent extends EventObject {
  type: 'TICK';
  timestamp: number;
  delta?: number;
}

type GameEvent =
  | { type: 'GAME_READY' }
  | { type: 'SUBMIT_ORDER'; order: Order }
  | { type: 'ORDER_VALID' }
  | { type: 'ORDER_INVALID' }
  | { type: 'ORDER_COMPLETE' }
  | { type: 'ORDER_FAILED' }
  | TickEvent
  | { type: 'ERROR'; error: string }
  | { type: 'RETRY' }
  | { type: 'RESET' }
  | { type: 'SAVE_GAME' }
  | { type: 'LOAD_GAME'; state: GameState }
  | { type: 'END_TURN' } // Added END_TURN event
  | { type: 'PAUSE' } // Also add PAUSE/RESUME for completeness
  | { type: 'RESUME' };

export const createGameLoop = () =>
  fromCallback<TickEvent>(({ sendBack }) => {
    let frameId: number; // Declare as mutable
    let lastTime = performance.now();

    const loop = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;

      // Send tick event with timing information
      sendBack({
        type: 'TICK',
        timestamp: currentTime,
        delta: deltaTime / 1000, // Convert to seconds
      });

      lastTime = currentTime;
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  });

export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
    input: {} as GameInput,
  },

  guards: {
    checkVictory: ({ context }) => {
      const { gameWorld, victoryCondition } = context;
      if (!gameWorld) return false;

      const friendlyUnits = Array.from(gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'friendly',
      );

      const enemyUnits = Array.from(gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'hostile',
      );

      switch (victoryCondition) {
        case 'elimination':
          return enemyUnits.length === 0 && friendlyUnits.length > 0;

        case 'occupation': {
          // Fixed type guard to check for objective terrain
          const objectives = Array.from(gameWorld.world.entities).filter(
            (e): e is TerrainNode =>
              'type' in e &&
              'properties' in e &&
              e.properties.isObjective === true,
          );

          return objectives.every((obj) =>
            friendlyUnits.some((unit) => unit.zone === obj.id),
          );
        }

        case 'survival':
          return context.turnCount >= 10 && friendlyUnits.length > 0;

        default:
          return false;
      }
    },
    checkDefeat: ({ context }) => {
      const { gameWorld } = context;
      if (!gameWorld) return false;

      const friendlyUnits = Array.from(gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'friendly',
      );

      return friendlyUnits.length === 0;
    },
  },
  actions: {
    initializeWorld: assign({
      gameWorld: () => createGameWorld(),
    }),
    setCurrentOrder: assign({
      currentOrder: ({ event }) => {
        assertEvent(event, 'SUBMIT_ORDER');
        return event.order;
      },
    }),
    validateOrder: ({ context, event }) => {
      assertEvent(event, 'SUBMIT_ORDER');
      const { gameWorld } = context;
      if (!gameWorld) {
        raise({ type: 'ORDER_INVALID' });
        return;
      }

      // Validate order based on world state
      const unit = Array.from(gameWorld.world.entities).find(
        (e): e is Unit => 'type' in e && e.name === event.order.unit,
      );

      if (!unit) {
        raise({ type: 'ORDER_INVALID' });
        return;
      }

      // Validate destination if it's a move order
      if (event.order.action === 'move' && event.order.destination) {
        const destination = Array.from(gameWorld.world.entities).find(
          (e): e is TerrainNode =>
            'type' in e && e.id === event.order.destination,
        );
        if (!destination) {
          raise({ type: 'ORDER_INVALID' });
          return;
        }
      }

      // Validate target if it's an attack order
      if (event.order.action === 'attack' && event.order.target) {
        const target = Array.from(gameWorld.world.entities).find(
          (e): e is Unit => 'type' in e && e.name === event.order.target,
        );
        if (!target) {
          raise({ type: 'ORDER_INVALID' });
          return;
        }
      }

      raise({ type: 'ORDER_VALID' });
    },
    executeOrder: assign({
      logs: ({ context, event }) => {
        const { currentOrder } = context;
        if (!currentOrder) return context.logs;
        return [
          ...context.logs,
          `Executing order: ${currentOrder.action} for ${currentOrder.unit}`,
        ];
      },
    }),
    executeMove: ({ context }) => {
      const { gameWorld, currentOrder } = context;
      if (!gameWorld || !currentOrder) {
        raise({ type: 'ORDER_FAILED' });
        return;
      }

      const unit = Array.from(gameWorld.world.entities).find(
        (e): e is Unit => 'type' in e && e.name === currentOrder.unit,
      );

      if (!unit) {
        raise({ type: 'ORDER_FAILED' });
        return;
      }

      switch (currentOrder.action) {
        case 'move':
          if (currentOrder.destination) {
            actions.moveUnit(unit, currentOrder.destination);
            raise({ type: 'ORDER_COMPLETE' });
            return;
          }
          break;
        case 'attack':
          const target = Array.from(gameWorld.world.entities).find(
            (e): e is Unit => 'type' in e && e.name === currentOrder.target,
          );
          if (target) {
            actions.engageTarget(unit, target);
            raise({ type: 'ORDER_COMPLETE' });
            return;
          }
          break;
      }
      raise({ type: 'ORDER_FAILED' });
    },
    handleError: assign({
      error: ({ context, event }) => {
        assertEvent(event, 'ERROR');
        return event.error;
      },
      logs: ({ context, event }) => {
        assertEvent(event, 'ERROR');
        return [...context.logs, `Error: ${event.error}`];
      },
    }),

    saveGame: assign({
      lastSaveTimestamp: () => Date.now(),
      logs: ({ context }) => [...context.logs, 'Game saved successfully'],
    }),

    loadGame: assign({
      gameState: ({ context, event }) => {
        assertEvent(event, 'LOAD_GAME');
        return event.state;
      },
      logs: ({ context }) => [...context.logs, 'Game loaded successfully'],
    }),

    incrementTurn: assign({
      turnCount: ({ context }) => context.turnCount + 1,
      logs: ({ context }) => [
        ...context.logs,
        `Turn ${context.turnCount + 1} begins`,
      ],
    }),

    updateRealTime: assign({
      accumulatedTime: ({ context, event }) => {
        if (event.type !== 'TICK' || context.isPaused) {
          return context.accumulatedTime;
        }

        return context.accumulatedTime + (event.delta ?? 0);
      },
      gameWorld: ({ context, event }) => {
        if (event.type !== 'TICK' || !context.gameWorld || context.isPaused) {
          return context.gameWorld;
        }

        // Create a new world reference to ensure state updates are detected
        const newWorld = {
          ...context.gameWorld,
          // world: { ...context.gameWorld.world },
          // systems: { ...context.gameWorld.systems },
        };

        const delta = event.delta ?? 0;

        // Update real-time systems (movement, animations)
        newWorld.systems.movement(delta);

        // Fixed timestep updates
        while (context.accumulatedTime >= context.fixedTimestep) {
          // Physics and other fixed-rate systems
          newWorld.systems.combat(context.fixedTimestep / 1000);
        }

        return newWorld;
      },
      lastFrameTime: ({ event }) =>
        event.type === 'TICK' ? event.timestamp : performance.now(),
    }),

    // Turn-based updates
    processTurnEffects: assign({
      turnCount: ({ context }) => context.turnCount + 1,
      gameWorld: ({ context }) => {
        if (!context.gameWorld) return null;

        // Process turn-based systems
        context.gameWorld.systems.morale(1); // Turn-based update
        return context.gameWorld;
      },
      logs: ({ context }) => {
        if (!context.gameWorld) return context.logs;

        const movingUnits = Array.from(context.gameWorld.world.entities).filter(
          (e): e is Unit => 'isMoving' in e && e.isMoving,
        );
        const engagedUnits = Array.from(
          context.gameWorld.world.entities,
        ).filter((e): e is Unit => 'state' in e && e.state === 'engaged');

        const newLogs = [`Turn ${context.turnCount + 1}: Processing effects`];

        if (movingUnits.length > 0) {
          newLogs.push(
            `Units in movement: ${movingUnits.map((u) => u.name).join(', ')}`,
          );
        }
        if (engagedUnits.length > 0) {
          newLogs.push(
            `Units in combat: ${engagedUnits.map((u) => u.name).join(', ')}`,
          );
        }

        return [...context.logs, ...newLogs];
      },
    }),
  },
  actors: {
    gameLoop: createGameLoop(),
  },
}).createMachine({
  id: 'warTactics',
  initial: 'initializing',
  context: ({ input }) => ({
    gameWorld: input.gameWorld ?? null,
    currentOrder: null,
    error: null,
    tickInterval: input.tickInterval ?? 1000 / 60, // 60 FPS default
    victoryCondition: input.victoryCondition ?? 'elimination',
    logs: input.logs ?? [],
    turnCount: input.turnCount ?? 0,
    lastSaveTimestamp: input.lastSaveTimestamp ?? null,
    gameState: input.gameState ?? null,
    lastFrameTime: performance.now(),
    accumulatedTime: 0,
    fixedTimestep: 1000 / 60, // 60 FPS physics
    isPaused: false,
  }),
  states: {
    initializing: {
      entry: ['initializeWorld'],
      on: {
        GAME_READY: 'awaitingCommand',
        ERROR: {
          target: 'error',
          actions: 'handleError',
        },
      },
    },
    error: {
      on: {
        RETRY: 'initializing',
        RESET: {
          target: 'initializing',
          actions: assign({
            error: null,
            logs: [],
            gameWorld: null,
            gameState: null,
            currentOrder: null,
            turnCount: 0,
            lastSaveTimestamp: null,
          }),
        },
      },
    },
    awaitingCommand: {
      on: {
        SUBMIT_ORDER: {
          target: 'processingOrder',
          actions: 'setCurrentOrder',
        },
      },
    },
    processingOrder: {
      entry: 'validateOrder',
      on: {
        ORDER_VALID: 'executingOrder',
        ORDER_INVALID: 'awaitingCommand',
      },
    },
    executingOrder: {
      entry: ['executeOrder'],
      after: {
        100: {
          target: 'running',
          actions: 'executeMove',
          guard: ({ context }) => {
            const result =
              context.currentOrder?.action === 'move' ||
              context.currentOrder?.action === 'attack';
            return Boolean(result);
          },
        },
      },
      on: {
        ORDER_COMPLETE: {
          target: 'running',
          actions: assign({
            logs: ({ context }) => [
              ...context.logs,
              'Order completed successfully',
            ],
            currentOrder: null,
          }),
        },
        ORDER_FAILED: {
          target: 'awaitingCommand',
          actions: assign({
            logs: ({ context }) => [...context.logs, 'Order failed to execute'],
            currentOrder: null,
          }),
        },
      },
    },
    running: {
      entry: ['incrementTurn'],
      invoke: {
        id: 'gameLoop',
        src: 'gameLoop',
      },
      on: {
        SUBMIT_ORDER: {
          target: 'processingOrder',
          actions: 'setCurrentOrder',
        },
        TICK: {
          actions: ['updateRealTime'],
        },
        END_TURN: {
          actions: ['processTurnEffects'],
          target: 'awaitingCommand',
        },
        PAUSE: {
          actions: assign({ isPaused: true }),
        },
        RESUME: {
          actions: assign({ isPaused: false }),
        },
        SAVE_GAME: {
          actions: 'saveGame',
        },
        LOAD_GAME: {
          actions: 'loadGame',
        },
        ERROR: {
          target: 'error',
          actions: 'handleError',
        },
      },
      always: [
        { target: 'victory', guard: 'checkVictory' },
        { target: 'defeat', guard: 'checkDefeat' },
      ],
    },
    victory: {
      type: 'final',
      entry: assign({
        logs: ({ context }) => [
          ...context.logs,
          '🎉 Victory! Mission accomplished.',
        ],
      }),
    },
    defeat: {
      type: 'final',
      entry: assign({
        logs: ({ context }) => [...context.logs, '❌ Defeat. Mission failed.'],
      }),
    },
  },
});
