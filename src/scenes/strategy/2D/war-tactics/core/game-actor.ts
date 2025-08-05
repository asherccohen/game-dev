import { Actor, createActor } from 'xstate';
import { GameLoopContext, gameLoopMachine } from './machine-game-loop';
import { GameLogicContext, gameLogicMachine } from './machine-logic';

// Properly typed initial context
export interface WarTacticsSystemInput {
  gameLoop?: Partial<GameLoopContext>;
  gameLogic?: Partial<GameLogicContext>;
}

export interface WarTacticsSystem {
  gameLoop: Actor<typeof gameLoopMachine>;
  gameLogic: Actor<typeof gameLogicMachine>;
  start(): void;
  stop(): void;
  sendToGameLoop(event: any): void;
  sendToGameLogic(event: any): void;
}

export function createWarTacticsSystem(
  input?: WarTacticsSystemInput,
): WarTacticsSystem {
  // Create both machines with properly typed inputs
  const gameLoopActor = createActor(gameLoopMachine, {
    input: input?.gameLoop || {},
  });

  const gameLogicActor = createActor(gameLogicMachine, {
    input: {
      gameWorld: input?.gameLoop?.gameWorld || null,
      victoryCondition: input?.gameLoop?.victoryCondition || 'elimination',
      ...input?.gameLogic,
    },
  });

  // Set up proper event-based communication
  const system: WarTacticsSystem = {
    gameLoop: gameLoopActor,
    gameLogic: gameLogicActor,

    start() {
      gameLoopActor.start();
      gameLogicActor.start();

      // Set up event listeners for inter-machine communication
      gameLoopActor.subscribe((state) => {
        // Forward relevant events to game logic
        const eventType = (state as any)._event?.type;
        if (eventType === 'TICK' || eventType === 'ADVANCE_TICK') {
          gameLogicActor.send({
            type: 'GAME_LOOP_TICK',
            context: state.context,
          });
        }
      });

      gameLogicActor.subscribe((state) => {
        // Forward victory/defeat events back to game loop
        if (state.matches('victory')) {
          gameLoopActor.send({
            type: 'GAME_LOGIC_VICTORY',
            reason: 'Victory conditions met',
          });
        }

        if (state.matches('defeat')) {
          gameLoopActor.send({
            type: 'GAME_LOGIC_DEFEAT',
            reason: 'Defeat conditions met',
          });
        }
      });
    },

    stop() {
      gameLoopActor.stop();
      gameLogicActor.stop();
    },

    sendToGameLoop(event: any) {
      gameLoopActor.send(event);
    },

    sendToGameLogic(event: any) {
      gameLogicActor.send(event);
    },
  };

  return system;
}

// Helper function for common use cases
export function createTestWarTacticsSystem() {
  return createWarTacticsSystem({
    gameLoop: {
      tickDuration: 1000,
      victoryCondition: 'elimination',
      logs: [],
      turnCount: 0,
    },
  });
}
