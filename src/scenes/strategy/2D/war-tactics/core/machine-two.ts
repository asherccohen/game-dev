import { assign, EventObject, fromCallback, setup } from 'xstate';
import { createGameWorld, GameWorld } from './ecs';
import { GameState, Order } from './types';

// Core game loop context
export interface GameLoopContext {
  // World state
  gameWorld: GameWorld | null;
  gameState: GameState | null;

  // Time management
  currentTick: number;
  tickDuration: number; // milliseconds per tick (e.g., 5000 = 5 seconds)
  lastTickTime: number;
  isRealTime: boolean; // true for real-time, false for turn-based

  // Game progression
  turnCount: number;
  missionTimer: number; // total mission time in ticks

  // Orders and state
  pendingOrders: Order[];
  activeOrders: Order[];
  completedOrders: Order[];

  // Logs and reports
  logs: string[];
  sitreps: string[];

  // Victory conditions
  victoryCondition: 'elimination' | 'occupation' | 'survival' | 'time_limit';
  missionTimeLimit?: number | undefined; // in ticks

  // Error handling
  error: string | null;
}

// Tick event with timing data
interface TickEvent extends EventObject {
  type: 'TICK';
  timestamp: number;
}

// Game loop events
type GameLoopEvent =
  | { type: 'START_GAME' }
  | TickEvent
  | { type: 'SUBMIT_ORDER'; order: Order }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'END_TURN' }
  | { type: 'ADVANCE_TICK' }
  | { type: 'SET_REAL_TIME'; enabled: boolean }
  | { type: 'CHANGE_TICK_SPEED'; duration: number }
  | { type: 'MISSION_COMPLETE' }
  | { type: 'MISSION_FAILED' }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET_GAME' };

// Game loop timer that sends tick events
export const createGameTimer = () =>
  fromCallback<TickEvent>(({ sendBack, input }) => {
    const context = input as GameLoopContext;
    let intervalId: NodeJS.Timeout;

    const sendTick = () => {
      sendBack({
        type: 'TICK',
        timestamp: Date.now(),
      });
    };

    // Start the timer with the configured tick duration
    intervalId = setInterval(sendTick, context.tickDuration);

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  });

export const gameLoopMachine = setup({
  types: {
    context: {} as GameLoopContext,
    events: {} as GameLoopEvent,
    input: {} as Partial<GameLoopContext>,
  },

  guards: {
    isRealTimeMode: ({ context }) => context.isRealTime,
    isTurnBasedMode: ({ context }) => !context.isRealTime,
    hasActiveOrders: ({ context }) => context.activeOrders.length > 0,
    missionTimeExpired: ({ context }) => {
      return context.missionTimeLimit
        ? context.missionTimer >= context.missionTimeLimit
        : false;
    },
    victoryAchieved: ({ context }) => {
      const { gameWorld, victoryCondition, turnCount, missionTimeLimit } =
        context;
      if (!gameWorld) return false;

      // Add your victory condition logic here
      switch (victoryCondition) {
        case 'elimination':
          // Check if all enemy units are eliminated
          return false; // Implement based on your ECS
        case 'occupation':
          // Check if objectives are held
          return false; // Implement based on your ECS
        case 'survival':
          // Check if survived long enough
          return turnCount >= 20; // Example: survive 20 turns
        case 'time_limit':
          // Check if mission completed within time limit
          return missionTimeLimit
            ? context.missionTimer < missionTimeLimit
            : false;
        default:
          return false;
      }
    },
    defeatConditions: ({ context }) => {
      const { gameWorld } = context;
      if (!gameWorld) return false;

      // Add defeat condition logic (e.g., all friendly units lost)
      return false; // Implement based on your ECS
    },
  },

  actions: {
    initializeGame: assign({
      gameWorld: () => createGameWorld(),
      currentTick: 0,
      turnCount: 0,
      missionTimer: 0,
      lastTickTime: () => Date.now(),
      pendingOrders: [],
      activeOrders: [],
      completedOrders: [],
      logs: () => ['Game initialized'],
      sitreps: [],
      error: null,
    }),

    processTick: assign({
      currentTick: ({ context }) => context.currentTick + 1,
      missionTimer: ({ context }) => context.missionTimer + 1,
      lastTickTime: ({ event }) =>
        event.type === 'TICK' ? event.timestamp : Date.now(),

      logs: ({ context, event }) => {
        const tickInfo =
          event.type === 'TICK'
            ? `[TICK ${context.currentTick + 1}] Mission time: ${Math.floor(((context.missionTimer + 1) * context.tickDuration) / 1000)}s`
            : `[TICK ${context.currentTick + 1}] Manual advance`;

        return [...context.logs.slice(-50), tickInfo]; // Keep last 50 logs
      },
    }),

    processOrders: assign({
      activeOrders: ({ context }) => {
        // Move pending orders to active
        const newActiveOrders = [
          ...context.activeOrders,
          ...context.pendingOrders,
        ];
        return newActiveOrders;
      },
      pendingOrders: [],

      logs: ({ context }) => {
        if (context.pendingOrders.length > 0) {
          return [
            ...context.logs,
            `Processing ${context.pendingOrders.length} new order(s)`,
          ];
        }
        return context.logs;
      },
    }),

    executeOrders: assign({
      gameWorld: ({ context }) => {
        if (!context.gameWorld) return null;

        // Execute all active orders
        context.activeOrders.forEach((order) => {
          // Execute order logic here using your ECS actions
          switch (order.action) {
            case 'move':
              // actions.moveUnit(unit, destination);
              break;
            case 'attack':
              // actions.engageTarget(unit, target);
              break;
            // Add other order types
          }
        });

        return context.gameWorld;
      },

      completedOrders: ({ context }) => {
        // For now, assume all orders complete in one tick
        // In reality, you'd check order status and move only completed ones
        return [...context.completedOrders, ...context.activeOrders];
      },

      activeOrders: [],

      logs: ({ context }) => {
        if (context.activeOrders.length > 0) {
          return [
            ...context.logs,
            `Executed ${context.activeOrders.length} order(s)`,
          ];
        }
        return context.logs;
      },
    }),

    runSimulation: assign({
      gameWorld: ({ context }) => {
        if (!context.gameWorld) return null;

        // Run ECS systems for this tick
        const deltaTime = context.tickDuration / 1000; // Convert to seconds

        // Update all systems
        context.gameWorld.systems.movement(deltaTime);
        context.gameWorld.systems.combat(deltaTime);
        context.gameWorld.systems.morale(deltaTime);

        return context.gameWorld;
      },
    }),

    generateReports: assign({
      sitreps: ({ context }) => {
        if (!context.gameWorld) return context.sitreps;

        // Generate situation reports based on current world state
        const timestamp = new Date().toLocaleTimeString();
        const newSitrep = `[${timestamp}] SITREP: All units operational. No contact.`;

        return [...context.sitreps.slice(-10), newSitrep]; // Keep last 10 sitreps
      },

      logs: ({ context }) => [
        ...context.logs,
        `Generated SITREP for tick ${context.currentTick}`,
      ],
    }),

    addOrder: assign({
      pendingOrders: ({ context, event }) => {
        if (event.type === 'SUBMIT_ORDER') {
          return [...context.pendingOrders, event.order];
        }
        return context.pendingOrders;
      },

      logs: ({ context, event }) => {
        if (event.type === 'SUBMIT_ORDER') {
          return [
            ...context.logs,
            `Order received: ${event.order.action} for ${event.order.unit}`,
          ];
        }
        return context.logs;
      },
    }),

    advanceTurn: assign({
      turnCount: ({ context }) => context.turnCount + 1,
      logs: ({ context }) => [
        ...context.logs,
        `--- TURN ${context.turnCount + 1} BEGINS ---`,
      ],
    }),

    setRealTimeMode: assign({
      isRealTime: ({ event }) =>
        event.type === 'SET_REAL_TIME' ? event.enabled : true,
      logs: ({ context, event }) => [
        ...context.logs,
        `Game mode: ${event.type === 'SET_REAL_TIME' && event.enabled ? 'Real-time' : 'Turn-based'}`,
      ],
    }),

    setTickSpeed: assign({
      tickDuration: ({ event }) =>
        event.type === 'CHANGE_TICK_SPEED' ? event.duration : 5000,
      logs: ({ context, event }) => [
        ...context.logs,
        `Tick speed changed to ${event.type === 'CHANGE_TICK_SPEED' ? event.duration : 5000}ms`,
      ],
    }),

    handleError: assign({
      error: ({ event }) =>
        event.type === 'ERROR' ? event.error : 'Unknown error',
      logs: ({ context, event }) => [
        ...context.logs,
        `ERROR: ${event.type === 'ERROR' ? event.error : 'Unknown error'}`,
      ],
    }),

    resetGame: assign({
      gameWorld: null,
      gameState: null,
      currentTick: 0,
      turnCount: 0,
      missionTimer: 0,
      pendingOrders: [],
      activeOrders: [],
      completedOrders: [],
      logs: () => ['Game reset'],
      sitreps: [],
      error: null,
    }),
  },

  actors: {
    gameTimer: createGameTimer(),
  },
}).createMachine({
  id: 'warTacticsGameLoop',
  initial: 'idle',

  context: ({ input }) => ({
    gameWorld: input.gameWorld ?? null,
    gameState: input.gameState ?? null,
    currentTick: input.currentTick ?? 0,
    tickDuration: input.tickDuration ?? 5000, // 5 second ticks by default
    lastTickTime: input.lastTickTime ?? Date.now(),
    isRealTime: input.isRealTime ?? false, // Start in turn-based mode
    turnCount: input.turnCount ?? 0,
    missionTimer: input.missionTimer ?? 0,
    pendingOrders: input.pendingOrders ?? [],
    activeOrders: input.activeOrders ?? [],
    completedOrders: input.completedOrders ?? [],
    logs: input.logs ?? [],
    sitreps: input.sitreps ?? [],
    victoryCondition: input.victoryCondition ?? 'elimination',
    missionTimeLimit: input.missionTimeLimit,
    error: input.error ?? null,
  }),

  states: {
    idle: {
      on: {
        START_GAME: {
          target: 'initializing',
          actions: 'initializeGame',
        },
        RESET_GAME: {
          actions: 'resetGame',
        },
      },
    },

    initializing: {
      after: {
        1000: {
          target: 'running',
          actions: assign({
            logs: ({ context }) => [...context.logs, 'Game started'],
          }),
        },
      },
      on: {
        ERROR: {
          target: 'error',
          actions: 'handleError',
        },
      },
    },

    running: {
      initial: 'turnBased',

      on: {
        SUBMIT_ORDER: {
          actions: 'addOrder',
        },
        PAUSE_GAME: 'paused',

        // Fix: Handle SET_REAL_TIME at parent level with proper transitions
        SET_REAL_TIME: [
          {
            target: '.realTime',
            guard: ({ event }) => event.enabled === true,
            actions: 'setRealTimeMode',
          },
          {
            target: '.turnBased',
            guard: ({ event }) => event.enabled === false,
            actions: 'setRealTimeMode',
          },
        ],

        // Fix: Add missing MISSION_COMPLETE and MISSION_FAILED transitions
        MISSION_COMPLETE: {
          target: 'victory',
          actions: assign({
            logs: ({ context }) => [
              ...context.logs,
              'Mission completed successfully!',
            ],
          }),
        },

        MISSION_FAILED: {
          target: 'defeat',
          actions: assign({
            logs: ({ context }) => [...context.logs, 'Mission failed!'],
          }),
        },

        CHANGE_TICK_SPEED: {
          actions: 'setTickSpeed',
        },
        ERROR: {
          target: 'error',
          actions: 'handleError',
        },
      },

      always: [
        { target: 'victory', guard: 'victoryAchieved' },
        { target: 'defeat', guard: 'defeatConditions' },
        { target: 'defeat', guard: 'missionTimeExpired' },
      ],

      states: {
        turnBased: {
          entry: assign({
            logs: ({ context }) => [...context.logs, 'Turn-based mode active'],
          }),

          on: {
            ADVANCE_TICK: 'processingTick',
            END_TURN: {
              target: 'processingTick',
              actions: 'advanceTurn',
            },
            // Removed SET_REAL_TIME - now handled by parent state
          },
        },

        realTime: {
          entry: assign({
            logs: ({ context }) => [...context.logs, 'Real-time mode active'],
          }),

          invoke: {
            id: 'gameTimer',
            src: 'gameTimer',
            input: ({ context }) => context,
          },

          on: {
            TICK: 'processingTick',
            // Fix: Allow END_TURN in real-time mode for manual turn advancement
            END_TURN: {
              actions: 'advanceTurn',
            },
            // Removed SET_REAL_TIME - now handled by parent state
          },
        },

        processingTick: {
          entry: [
            'processTick',
            'processOrders',
            'executeOrders',
            'runSimulation',
            'generateReports',
          ],

          after: {
            100: [
              {
                target: 'realTime',
                guard: 'isRealTimeMode',
              },
              {
                target: 'turnBased',
                guard: 'isTurnBasedMode',
              },
            ],
          },
        },
      },
    },

    paused: {
      entry: assign({
        logs: ({ context }) => [...context.logs, 'Game paused'],
      }),

      on: {
        RESUME_GAME: {
          target: 'running',
          actions: assign({
            logs: ({ context }) => [...context.logs, 'Game resumed'],
          }),
        },

        // Fix: Handle orders while paused - queue them for when game resumes
        SUBMIT_ORDER: {
          actions: [
            'addOrder',
            assign({
              logs: ({ context }) => [
                ...context.logs,
                'Order queued while game is paused',
              ],
            }),
          ],
        },

        RESET_GAME: {
          target: 'idle',
          actions: 'resetGame',
        },
      },
    },

    victory: {
      type: 'final',
      entry: assign({
        logs: ({ context }) => [
          ...context.logs,
          '🎉 MISSION ACCOMPLISHED! Victory achieved.',
          `Final stats: ${context.turnCount} turns, ${context.currentTick} ticks`,
        ],
      }),
    },

    defeat: {
      type: 'final',
      entry: assign({
        logs: ({ context }) => [
          ...context.logs,
          '❌ MISSION FAILED! Defeat conditions met.',
          `Final stats: ${context.turnCount} turns, ${context.currentTick} ticks`,
        ],
      }),
    },

    error: {
      entry: assign({
        logs: ({ context }) => [
          ...context.logs,
          `Game encountered an error: ${context.error}`,
        ],
      }),

      on: {
        RESET_GAME: {
          target: 'idle',
          actions: 'resetGame',
        },
        START_GAME: {
          target: 'initializing',
          actions: 'initializeGame',
        },
      },
    },
  },
});

// Helper function to create and start the machine
export function createGameLoopMachine(
  initialContext?: Partial<GameLoopContext>,
) {
  return gameLoopMachine.provide({
    actors: {
      gameTimer: createGameTimer(),
    },
  });
}
