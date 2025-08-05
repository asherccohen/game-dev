import { assertEvent, assign, sendTo, setup } from 'xstate';
import { GameWorld, TerrainNode, Unit, actions } from './ecs';
import { GameContext, Order } from './types';

// Game logic context - focused on war tactics specific logic
export interface GameLogicContext {
  gameWorld: GameWorld | null;
  victoryCondition: 'elimination' | 'occupation' | 'survival' | 'time_limit';
  currentOrder: Order | null;
  orderValidationErrors: string[];
  combatResults: Array<{
    tick: number;
    attacker: string;
    target: string;
    result: 'hit' | 'miss' | 'killed';
  }>;
}

// Game logic events - focused on tactical operations
type GameLogicEvent =
  | { type: 'GAME_LOOP_TICK'; context: GameContext }
  | { type: 'VALIDATE_ORDER'; order: Order }
  | { type: 'EXECUTE_ORDER'; order: Order }
  | { type: 'CHECK_VICTORY_CONDITIONS' }
  | { type: 'PROCESS_COMBAT'; deltaTime: number }
  | { type: 'UPDATE_MORALE'; deltaTime: number }
  | { type: 'ORDER_VALIDATION_COMPLETE'; valid: boolean; errors?: string[] }
  | { type: 'ORDER_EXECUTION_COMPLETE'; success: boolean; result?: string };

export const gameLogicMachine = setup({
  types: {
    context: {} as GameLogicContext,
    events: {} as GameLogicEvent,
    input: {} as Partial<GameLogicContext>,
  },

  guards: {
    // Victory condition checks from original machine.ts
    eliminationAchieved: ({ context }) => {
      if (!context.gameWorld) return false;

      const friendlyUnits = Array.from(context.gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'friendly',
      );

      const enemyUnits = Array.from(context.gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'hostile',
      );

      return enemyUnits.length === 0 && friendlyUnits.length > 0;
    },

    occupationAchieved: ({ context }) => {
      if (!context.gameWorld) return false;

      const friendlyUnits = Array.from(context.gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'friendly',
      );

      const objectives = Array.from(context.gameWorld.world.entities).filter(
        (e): e is TerrainNode =>
          'type' in e && 'properties' in e && e.properties.isObjective === true,
      );

      return objectives.every((obj) =>
        friendlyUnits.some((unit) => unit.zone === obj.id),
      );
    },

    survivalAchieved: (
      { context },
      { gameLoopContext }: { gameLoopContext: GameContext },
    ) => {
      if (!context.gameWorld) return false;

      const friendlyUnits = Array.from(context.gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'friendly',
      );

      return gameLoopContext.turnCount >= 10 && friendlyUnits.length > 0;
    },

    defeatConditionsMet: ({ context }) => {
      if (!context.gameWorld) return false;

      const friendlyUnits = Array.from(context.gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'friendly',
      );

      return friendlyUnits.length === 0;
    },

    orderIsValid: ({ context }) => context.orderValidationErrors.length === 0,
  },

  actions: {
    // Order validation logic from machine.ts
    validateOrder: assign({
      currentOrder: ({ event }) => {
        assertEvent(event, 'VALIDATE_ORDER');
        return event.order;
      },
      orderValidationErrors: ({ context, event }) => {
        assertEvent(event, 'VALIDATE_ORDER');
        const { gameWorld } = context;
        const errors: string[] = [];

        if (!gameWorld) {
          errors.push('No game world available');
          return errors;
        }

        const unit = Array.from(gameWorld.world.entities).find(
          (e): e is Unit => 'type' in e && e.name === event.order.unit,
        );

        if (!unit) {
          errors.push(`Unit "${event.order.unit}" not found`);
        }

        // Validate destination for move orders
        if (event.order.action === 'move' && event.order.destination) {
          const destination = Array.from(gameWorld.world.entities).find(
            (e): e is TerrainNode =>
              'type' in e && e.id === event.order.destination,
          );
          if (!destination) {
            errors.push(`Destination "${event.order.destination}" not found`);
          }
        }

        // Validate target for attack orders
        if (event.order.action === 'attack' && event.order.target) {
          const target = Array.from(gameWorld.world.entities).find(
            (e): e is Unit => 'type' in e && e.name === event.order.target,
          );
          if (!target) {
            errors.push(`Target "${event.order.target}" not found`);
          }
        }

        return errors;
      },
    }),

    // Order execution logic from machine.ts
    executeOrder: assign({
      gameWorld: ({ context }) => {
        if (!context.gameWorld || !context.currentOrder) {
          return context.gameWorld;
        }

        const unit = Array.from(context.gameWorld.world.entities).find(
          (e): e is Unit =>
            'type' in e && e.name === context.currentOrder!.unit,
        );

        if (!unit) return context.gameWorld;

        switch (context.currentOrder.action) {
          case 'move':
            if (context.currentOrder.destination) {
              actions.moveUnit(unit, context.currentOrder.destination);
            }
            break;
          case 'attack':
            if (context.currentOrder.target) {
              const target = Array.from(context.gameWorld.world.entities).find(
                (e): e is Unit =>
                  'type' in e && e.name === context.currentOrder!.target,
              );
              if (target) {
                actions.engageTarget(unit, target);
              }
            }
            break;
          case 'defend':
            // Implement defend logic
            break;
          case 'retreat':
            // Implement retreat logic
            break;
        }

        return context.gameWorld;
      },

      combatResults: ({ context }) => {
        // Track combat results for reporting
        return context.combatResults;
      },

      currentOrder: null,
      orderValidationErrors: [],
    }),

    // Victory/defeat condition checking
    checkVictoryConditions: (
      { context },
      { gameLoopContext }: { gameLoopContext: GameContext },
    ) => {
      let victoryAchieved = false;
      let victoryReason = '';

      switch (context.victoryCondition) {
        case 'elimination':
          if (context.gameWorld) {
            const friendlyUnits = Array.from(
              context.gameWorld.world.entities,
            ).filter(
              (e): e is Unit => 'faction' in e && e.faction === 'friendly',
            );
            const enemyUnits = Array.from(
              context.gameWorld.world.entities,
            ).filter(
              (e): e is Unit => 'faction' in e && e.faction === 'hostile',
            );

            if (enemyUnits.length === 0 && friendlyUnits.length > 0) {
              victoryAchieved = true;
              victoryReason = 'All enemy units eliminated';
            }
          }
          break;

        case 'occupation':
          if (context.gameWorld) {
            const friendlyUnits = Array.from(
              context.gameWorld.world.entities,
            ).filter(
              (e): e is Unit => 'faction' in e && e.faction === 'friendly',
            );
            const objectives = Array.from(
              context.gameWorld.world.entities,
            ).filter(
              (e): e is TerrainNode =>
                'type' in e &&
                'properties' in e &&
                e.properties.isObjective === true,
            );

            if (
              objectives.every((obj) =>
                friendlyUnits.some((unit) => unit.zone === obj.id),
              )
            ) {
              victoryAchieved = true;
              victoryReason = 'All objectives occupied';
            }
          }
          break;

        case 'survival':
          if (context.gameWorld && gameLoopContext.turnCount >= 10) {
            const friendlyUnits = Array.from(
              context.gameWorld.world.entities,
            ).filter(
              (e): e is Unit => 'faction' in e && e.faction === 'friendly',
            );

            if (friendlyUnits.length > 0) {
              victoryAchieved = true;
              victoryReason = `Survived ${gameLoopContext.turnCount} turns`;
            }
          }
          break;
      }

      if (victoryAchieved) {
        sendTo('gameLoop', {
          type: 'GAME_LOGIC_VICTORY',
          reason: victoryReason,
        });
      }

      // Check defeat conditions
      if (context.gameWorld) {
        const friendlyUnits = Array.from(
          context.gameWorld.world.entities,
        ).filter((e): e is Unit => 'faction' in e && e.faction === 'friendly');

        if (friendlyUnits.length === 0) {
          sendTo('gameLoop', {
            type: 'GAME_LOGIC_DEFEAT',
            reason: 'All friendly units lost',
          });
        }
      }
    },

    // Game world updates
    updateGameWorld: assign({
      gameWorld: ({ context, event }) => {
        assertEvent(event, 'GAME_LOOP_TICK');

        if (!context.gameWorld) {
          return event.context.gameWorld;
        }

        // Update local game world state with loop context
        return event.context.gameWorld;
      },
    }),

    // Combat processing
    processCombat: assign({
      gameWorld: ({ context, event }) => {
        assertEvent(event, 'PROCESS_COMBAT');

        if (!context.gameWorld) return null;

        // Run combat systems
        context.gameWorld.systems.combat(event.deltaTime);
        return context.gameWorld;
      },

      combatResults: ({ context, event }) => {
        assertEvent(event, 'PROCESS_COMBAT');
        // Track combat results for this tick
        return context.combatResults; // Add new results as needed
      },
    }),

    // Morale updates
    updateMorale: assign({
      gameWorld: ({ context, event }) => {
        assertEvent(event, 'UPDATE_MORALE');

        if (!context.gameWorld) return null;

        context.gameWorld.systems.morale(event.deltaTime);
        return context.gameWorld;
      },
    }),

    // Send completion events back to game loop
    notifyOrderComplete: sendTo('gameLoop', ({ context }) => ({
      type: 'GAME_LOGIC_ORDER_COMPLETE',
      order: context.currentOrder!,
    })),

    notifyOrderFailed: sendTo('gameLoop', ({ context }) => ({
      type: 'GAME_LOGIC_ORDER_FAILED',
      order: context.currentOrder!,
      reason: context.orderValidationErrors.join(', '),
    })),
  },
}).createMachine({
  id: 'warTacticsGameLogic',
  initial: 'idle',

  context: ({ input }) => ({
    gameWorld: input?.gameWorld ?? null,
    victoryCondition: input?.victoryCondition ?? 'elimination',
    currentOrder: input?.currentOrder ?? null,
    orderValidationErrors: input?.orderValidationErrors ?? [],
    combatResults: input?.combatResults ?? [],
  }),

  states: {
    idle: {
      on: {
        GAME_LOOP_TICK: {
          target: 'active',
          actions: 'updateGameWorld',
        },
      },
    },

    active: {
      entry: {
        type: 'checkVictoryConditions',
        params: ({ event }) => {
          // Only call this entry when event is GAME_LOOP_TICK, so we can safely cast
          return { gameLoopContext: (event as any).context as GameContext };
        },
      },

      on: {
        GAME_LOOP_TICK: {
          actions: [
            { type: 'updateGameWorld' },
            {
              type: 'checkVictoryConditions',
              params: ({ event }) => ({ gameLoopContext: event.context }),
            },
          ],
        },

        VALIDATE_ORDER: {
          target: 'validatingOrder',
          actions: 'validateOrder',
        },

        PROCESS_COMBAT: {
          actions: 'processCombat',
        },

        UPDATE_MORALE: {
          actions: 'updateMorale',
        },
      },
    },

    validatingOrder: {
      always: [
        {
          target: 'executingOrder',
          guard: 'orderIsValid',
        },
        {
          target: 'active',
          actions: 'notifyOrderFailed',
        },
      ],
    },

    executingOrder: {
      entry: 'executeOrder',

      after: {
        100: {
          target: 'active',
          actions: 'notifyOrderComplete',
        },
      },
    },
  },
});
