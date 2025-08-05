import { beforeEach, describe, expect, test } from 'vitest';
import { createActor } from 'xstate';
import { GameContext, gameMachine } from './machine';
import { createBasicCombatScenario } from './tests/scenarios/basic-combat';

const createTestActor = (overrides: Partial<GameContext> = {}) => {
  return createActor(gameMachine, {
    input: {
      tickInterval: 1000,
      victoryCondition: 'elimination',
      logs: [],
      turnCount: 0,
      ...overrides,
    },
  });
};

describe.skip('War Tactics State Machine', () => {
  describe('Initialization', () => {
    test('should start in initializing state', () => {
      const actor = createTestActor({
        tickInterval: 1000,
        victoryCondition: 'elimination',
        logs: [],
        turnCount: 0,
      });
      actor.start();
      expect(actor.getSnapshot().value).toBe('initializing');
    });

    test('should transition to awaitingCommand on GAME_READY', () => {
      const actor = createTestActor({
        tickInterval: 1000,
        victoryCondition: 'elimination',
        logs: [],
        turnCount: 0,
      });
      actor.start();
      actor.send({ type: 'GAME_READY' });
      expect(actor.getSnapshot().value).toBe('awaitingCommand');
    });

    test('should initialize game world on start', () => {
      const actor = createTestActor({
        tickInterval: 1000,
        victoryCondition: 'elimination',
        logs: [],
        turnCount: 0,
      });
      actor.start();
      expect(actor.getSnapshot().context.gameWorld).toBeTruthy();
    });
  });

  describe('Command Processing', () => {
    let actor: ReturnType<typeof createActor>;

    beforeEach(() => {
      actor = createTestActor();
      actor.start();
      actor.send({ type: 'GAME_READY' });
    });

    test('should accept valid move command', () => {
      actor.send({
        type: 'SUBMIT_ORDER',
        order: {
          unit: 'Alpha Squad',
          action: 'move',
          destination: 'ridge-1',
          modifiers: [],
        },
      });
      expect(actor.getSnapshot().value).toBe('processingOrder');
    });

    test('should store current order in context', () => {
      const order = {
        unit: 'Alpha Squad',
        action: 'move',
        destination: 'ridge-1',
        modifiers: [],
      };

      actor.send({
        type: 'SUBMIT_ORDER',
        order,
      });

      expect(actor.getSnapshot().context.currentOrder).toEqual(order);
    });

    test('should reject invalid unit', () => {
      actor.send({
        type: 'SUBMIT_ORDER',
        order: {
          unit: 'NonexistentUnit',
          action: 'move',
          destination: 'ridge-1',
          modifiers: [],
        },
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('awaitingCommand');
      expect(snapshot.context.logs).toContain('Order failed to execute');
    });
  });

  describe('Game Systems', () => {
    let actor: ReturnType<typeof createActor>;

    beforeEach(() => {
      actor = createTestActor();
      actor.start();
      actor.send({ type: 'GAME_READY' });
    });

    test('should update game state on tick', () => {
      actor.send({ type: 'TICK' });
      const logs = actor.getSnapshot().context.logs;
      expect(logs[logs.length - 1]).toBeTruthy(); // Should have some log entry
    });

    test('should track turn count', () => {
      const initialTurns = actor.getSnapshot().context.turnCount;
      actor.send({ type: 'TICK' });
      expect(actor.getSnapshot().context.turnCount).toBe(initialTurns + 1);
    });
  });

  describe('Victory Conditions', () => {
    let actor;

    beforeEach(() => {
      actor = createTestActor();
      actor.start();
      actor.send({ type: 'GAME_READY' });
    });

    test('should trigger victory on elimination', () => {
      // Setup world with only friendly units
      const gameWorld = createBasicCombatScenario();
      const enemyUnits = Array.from(gameWorld.world.entities).filter(
        (e) => 'faction' in e && e.faction === 'hostile',
      );
      enemyUnits.forEach((unit) => gameWorld.world.remove(unit));

      actor = createTestActor({
        gameWorld,
        victoryCondition: 'elimination',
        logs: [],
        turnCount: 0,
        tickInterval: 1000,
      });
      actor.start();

      expect(actor.getSnapshot().value).toBe('victory');
    });

    test('should trigger defeat when all friendly units lost', () => {
      // Setup world with only enemy units
      const gameWorld = createBasicCombatScenario();
      const friendlyUnits = Array.from(gameWorld.world.entities).filter(
        (e) => 'faction' in e && e.faction === 'friendly',
      );
      friendlyUnits.forEach((unit) => gameWorld.world.remove(unit));

      actor = createTestActor({
        gameWorld,
        victoryCondition: 'elimination',
        logs: [],
        turnCount: 0,
        tickInterval: 1000,
      });
      actor.start();

      expect(actor.getSnapshot().value).toBe('defeat');
    });
  });

  describe('Error Handling', () => {
    let actor: ReturnType<typeof createActor>;

    beforeEach(() => {
      actor = createTestActor();
      actor.start();
    });

    test('should handle initialization errors', () => {
      actor.send({ type: 'ERROR', error: 'Failed to initialize game world' });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('error');
      expect(snapshot.context.error).toBe('Failed to initialize game world');
    });

    test('should allow retry from error state', () => {
      actor.send({ type: 'ERROR', error: 'Test error' });
      actor.send({ type: 'RETRY' });
      expect(actor.getSnapshot().value).toBe('initializing');
    });

    test('should clear error on reset', () => {
      actor.send({ type: 'ERROR', error: 'Test error' });
      actor.send({ type: 'RESET' });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('initializing');
      expect(snapshot.context.error).toBeNull();
    });
  });
});
