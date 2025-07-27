import { assertEvent, assign, setup } from 'xstate';
import { actions, createGameWorld, Unit } from './ecs';
import { GameState, Order } from './types';

type GameEvent =
  | { type: 'GAME_READY' }
  | { type: 'SUBMIT_ORDER'; order: Order }
  | { type: 'ORDER_VALID' }
  | { type: 'ORDER_INVALID' }
  | { type: 'ORDER_COMPLETE' }
  | { type: 'ORDER_FAILED' }
  | { type: 'TICK' };

interface GameContext {
  gameState: GameState | null;
  currentOrder: Order | null;
  logs: string[];
  gameWorld: ReturnType<typeof createGameWorld> | null;
  tickInterval: number;
}

export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
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
      if (!gameWorld) return;

      // Validate order based on world state
      const unit = Array.from(gameWorld.world.entities).find(
        (e): e is Unit => 'type' in e && e.name === event.order.unit,
      );

      if (!unit) {
        return { type: 'ORDER_INVALID' };
      }

      // Add more validation logic here
      return { type: 'ORDER_VALID' };
    },
    executeOrder: ({ context }) => {
      const { gameWorld, currentOrder } = context;
      if (!gameWorld || !currentOrder) return;

      const unit = Array.from(gameWorld.world.entities).find(
        (e): e is Unit => 'type' in e && e.name === currentOrder.unit,
      );

      if (!unit) return;

      switch (currentOrder.action) {
        case 'move':
          if (currentOrder.destination) {
            actions.moveUnit(unit, currentOrder.destination);
          }
          break;
        // Add other action types
      }
    },
    tick: ({ context }) => {
      const { gameWorld } = context;
      if (!gameWorld) return;

      // Run all systems
      const delta = context.tickInterval / 1000; // Convert to seconds
      gameWorld.systems.movement(delta);
      gameWorld.systems.combat(delta);
      gameWorld.systems.morale(delta);
    },
  },
}).createMachine({
  id: 'warTactics',
  initial: 'initializing',
  context: {
    gameState: null,
    currentOrder: null,
    logs: [],
    gameWorld: null,
    tickInterval: 1000, // 1 second ticks
  },
  states: {
    initializing: {
      entry: ['initializeWorld'],
      on: {
        GAME_READY: 'awaitingCommand',
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
      entry: 'executeOrder',
    },
  },
});
