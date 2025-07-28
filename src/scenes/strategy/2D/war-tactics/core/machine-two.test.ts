import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createActor } from 'xstate';
import {
  createGameLoopMachine,
  GameLoopContext,
  gameLoopMachine,
} from './machine-two';
import { Order } from './types';

// Mock the ECS module
vi.mock('./ecs', () => ({
  createGameWorld: vi.fn(() => ({
    world: { entities: new Set() },
    systems: {
      movement: vi.fn(),
      combat: vi.fn(),
      morale: vi.fn(),
    },
  })),
  actions: {
    moveUnit: vi.fn(),
    engageTarget: vi.fn(),
  },
}));

const createTestActor = (overrides: Partial<GameLoopContext> = {}) => {
  return createActor(gameLoopMachine, {
    input: {
      victoryCondition: 'elimination',
      isRealTime: false,
      ...overrides,
    },
  });
};

describe('GameLoopMachine', () => {
  let actor: ReturnType<typeof createTestActor>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (actor) {
      actor.stop();
    }
    vi.useRealTimers();
  });

  describe('Initial State and Initialization', () => {
    it('should start in idle state', () => {
      actor = createTestActor();
      actor.start();

      expect(actor.getSnapshot().value).toBe('idle');
    });

    it('should initialize with default context values', () => {
      actor = createTestActor();
      actor.start();

      const context = actor.getSnapshot().context;
      expect(context.currentTick).toBe(0);
      expect(context.turnCount).toBe(0);
      expect(context.missionTimer).toBe(0);
      expect(context.tickDuration).toBe(5000);
      expect(context.isRealTime).toBe(false);
      expect(context.pendingOrders).toEqual([]);
      expect(context.activeOrders).toEqual([]);
      expect(context.completedOrders).toEqual([]);
      expect(context.logs).toEqual([]);
      expect(context.sitreps).toEqual([]);
      expect(context.victoryCondition).toBe('elimination');
      expect(context.error).toBe(null);
    });

    it('should accept custom initial context', () => {
      const customInput: Partial<GameLoopContext> = {
        tickDuration: 3000,
        victoryCondition: 'survival',
        isRealTime: true,
        logs: ['Custom start'],
      };

      actor = createActor(gameLoopMachine, { input: customInput });
      actor.start();

      const context = actor.getSnapshot().context;
      expect(context.tickDuration).toBe(3000);
      expect(context.victoryCondition).toBe('survival');
      expect(context.isRealTime).toBe(true);
      expect(context.logs).toEqual(['Custom start']);
    });
  });

  describe('Game Initialization Flow', () => {
    it('should transition from idle to initializing to running when START_GAME is sent', async () => {
      actor = createTestActor();
      actor.start();

      expect(actor.getSnapshot().value).toBe('idle');

      actor.send({ type: 'START_GAME' });
      expect(actor.getSnapshot().value).toBe('initializing');

      // Fast forward past the 1000ms delay
      vi.advanceTimersByTime(1000);

      expect(actor.getSnapshot().value).toEqual({
        running: 'turnBased',
      });
    });

    it('should initialize game world and reset counters on START_GAME', () => {
      actor = createTestActor();
      actor.start();

      actor.send({ type: 'START_GAME' });

      const context = actor.getSnapshot().context;
      expect(context.gameWorld).not.toBe(null);
      expect(context.currentTick).toBe(0);
      expect(context.turnCount).toBe(0);
      expect(context.missionTimer).toBe(0);
      expect(context.logs).toContain('Game initialized');
    });
  });

  describe('Turn-Based Mode', () => {
    beforeEach(async () => {
      actor = createTestActor({ isRealTime: false });
      actor.start();
      actor.send({ type: 'START_GAME' });
      vi.advanceTimersByTime(1000);
    });

    it('should start in turn-based mode by default', () => {
      expect(actor.getSnapshot().value).toEqual({
        running: 'turnBased',
      });
      expect(actor.getSnapshot().context.isRealTime).toBe(false);
    });

    it('should process tick when ADVANCE_TICK is sent', () => {
      const initialTick = actor.getSnapshot().context.currentTick;

      actor.send({ type: 'ADVANCE_TICK' });
      vi.advanceTimersByTime(100); // Wait for processingTick to complete

      const context = actor.getSnapshot().context;
      expect(context.currentTick).toBe(initialTick + 1);
      expect(context.missionTimer).toBe(initialTick + 1);
    });

    it('should advance turn and process tick when END_TURN is sent', () => {
      const initialTurn = actor.getSnapshot().context.turnCount;

      actor.send({ type: 'END_TURN' });
      vi.advanceTimersByTime(100);

      const context = actor.getSnapshot().context;
      expect(context.turnCount).toBe(initialTurn + 1);
      expect(context.logs).toContain(`--- TURN ${initialTurn + 1} BEGINS ---`);
    });
  });

  describe('Real-Time Mode', () => {
    beforeEach(async () => {
      actor = createTestActor({ isRealTime: true });
      actor.start();
      actor.send({ type: 'START_GAME' });
      vi.advanceTimersByTime(1000);
    });

    it('should switch to real-time mode when SET_REAL_TIME is sent with enabled: true', () => {
      actor.send({ type: 'SET_REAL_TIME', enabled: true });

      expect(actor.getSnapshot().value).toEqual({
        running: 'realTime',
      });
      // expect(actor.getSnapshot().context.isRealTime).toBe(true);
    });

    it('should switch back to turn-based mode when SET_REAL_TIME is sent with enabled: false', () => {
      // First switch to real-time
      actor.send({ type: 'SET_REAL_TIME', enabled: true });
      expect(actor.getSnapshot().value).toEqual({
        running: 'realTime',
      });

      // Then switch back to turn-based
      actor.send({ type: 'SET_REAL_TIME', enabled: false });
      expect(actor.getSnapshot().value).toEqual({
        running: 'turnBased',
      });
      expect(actor.getSnapshot().context.isRealTime).toBe(false);
    });
  });

  describe('Order Processing', () => {
    beforeEach(async () => {
      actor = createTestActor();
      actor.start();
      actor.send({ type: 'START_GAME' });
      vi.advanceTimersByTime(1000);
    });

    it('should add orders to pending queue when SUBMIT_ORDER is sent', () => {
      const order: Order = {
        unit: 'Alpha Squad',
        action: 'move',
        destination: 'Ridge Point',
        modifiers: [],
      };

      actor.send({ type: 'SUBMIT_ORDER', order });

      const context = actor.getSnapshot().context;
      expect(context.pendingOrders).toHaveLength(1);
      expect(context.pendingOrders[0]).toEqual(order);
      expect(context.logs).toContain('Order received: move for Alpha Squad');
    });

    it('should process pending orders during tick processing', () => {
      const order: Order = {
        unit: 'Bravo Squad',
        action: 'attack',
        target: 'Enemy Unit',
        modifiers: [],
      };

      actor.send({ type: 'SUBMIT_ORDER', order });
      actor.send({ type: 'ADVANCE_TICK' });
      vi.advanceTimersByTime(100);

      const context = actor.getSnapshot().context;
      expect(context.pendingOrders).toHaveLength(0);
      expect(context.completedOrders).toHaveLength(1);
      expect(context.logs).toContain('Processing 1 new order(s)');
      expect(context.logs).toContain('Executed 1 order(s)');
    });

    it('should handle multiple orders in sequence', () => {
      const orders: Order[] = [
        {
          unit: 'Alpha Squad',
          action: 'move',
          destination: 'Ridge Point',
          modifiers: [],
        },
        {
          unit: 'Bravo Squad',
          action: 'attack',
          target: 'Enemy',
          modifiers: [],
        },
        {
          unit: 'Charlie Squad',
          action: 'defend',
          destination: 'Base',
          modifiers: [],
        },
      ];

      orders.forEach((order) => {
        actor.send({ type: 'SUBMIT_ORDER', order });
      });

      expect(actor.getSnapshot().context.pendingOrders).toHaveLength(3);

      actor.send({ type: 'ADVANCE_TICK' });
      vi.advanceTimersByTime(100);

      const context = actor.getSnapshot().context;
      expect(context.pendingOrders).toHaveLength(0);
      expect(context.completedOrders).toHaveLength(3);
    });
  });

  describe.only('Tick Processing Pipeline', () => {
    beforeEach(async () => {
      actor = createTestActor();
      actor.start();
      actor.send({ type: 'START_GAME' });
      vi.advanceTimersByTime(1000);
    });

    it('should execute all tick processing actions in correct order', () => {
      actor.send({ type: 'ADVANCE_TICK' });
      vi.advanceTimersByTime(100);

      const context = actor.getSnapshot().context;

      // Check that tick was incremented
      expect(context.currentTick).toBe(1);
      expect(context.missionTimer).toBe(1);

      // Check that SITREP was generated
      expect(context.sitreps).toHaveLength(1);
      expect(context.sitreps[0]).toContain('SITREP: All units operational');

      // Check that logs were updated appropriately
      expect(context.logs).toContain('Generated SITREP for tick 1');
    });

    it.only('should update mission timer correctly', () => {
      const context = actor.getSnapshot().context;
      const initialTime = context.missionTimer;
      const tickDuration = context.tickDuration;

      actor.send({ type: 'ADVANCE_TICK' });
      vi.advanceTimersByTime(100);

      const newContext = actor.getSnapshot().context;
      const expectedMissionTime = Math.floor(
        ((initialTime + 1) * tickDuration) / 1000,
      );

      console.log('🚀 ~ actor:', actor.getSnapshot().context);
      expect(newContext.logs).toContain(
        `[TICK 1] Mission time: ${expectedMissionTime}s`,
      );
    });
  });

  describe('Game Settings and Configuration', () => {
    beforeEach(async () => {
      actor = createTestActor();
      actor.start();
      actor.send({ type: 'START_GAME' });
      vi.advanceTimersByTime(1000);
    });

    it('should change tick speed when CHANGE_TICK_SPEED is sent', () => {
      const newDuration = 3000;

      actor.send({ type: 'CHANGE_TICK_SPEED', duration: newDuration });

      const context = actor.getSnapshot().context;
      expect(context.tickDuration).toBe(newDuration);
      expect(context.logs).toContain('Tick speed changed to 3000ms');
    });

    it('should update logs with mode changes', () => {
      actor.send({ type: 'SET_REAL_TIME', enabled: true });

      let context = actor.getSnapshot().context;
      expect(context.logs).toContain('Game mode: Real-time');

      actor.send({ type: 'SET_REAL_TIME', enabled: false });

      context = actor.getSnapshot().context;
      expect(context.logs).toContain('Game mode: Turn-based');
    });
  });

  describe('Pause and Resume', () => {
    beforeEach(async () => {
      actor = createTestActor();
      actor.start();
      actor.send({ type: 'START_GAME' });
      vi.advanceTimersByTime(1000);
    });

    it('should pause the game when PAUSE_GAME is sent', () => {
      actor.send({ type: 'PAUSE_GAME' });

      expect(actor.getSnapshot().value).toBe('paused');
      expect(actor.getSnapshot().context.logs).toContain('Game paused');
    });

    it('should resume the game when RESUME_GAME is sent from paused state', () => {
      actor.send({ type: 'PAUSE_GAME' });
      expect(actor.getSnapshot().value).toBe('paused');

      actor.send({ type: 'RESUME_GAME' });

      expect(actor.getSnapshot().value).toEqual({
        running: 'turnBased',
      });
      expect(actor.getSnapshot().context.logs).toContain('Game resumed');
    });

    it('should allow orders to be submitted while paused', () => {
      actor.send({ type: 'PAUSE_GAME' });

      const order: Order = {
        unit: 'Alpha Squad',
        action: 'move',
        destination: 'Ridge Point',
        modifiers: [],
      };

      actor.send({ type: 'SUBMIT_ORDER', order });

      // Orders should still be accepted in paused state
      expect(actor.getSnapshot().context.pendingOrders).toHaveLength(1);
    });
  });

  describe('Victory and Defeat Conditions', () => {
    beforeEach(async () => {
      actor = createActor(gameLoopMachine, {
        input: { victoryCondition: 'survival' },
      });
      actor.start();
      actor.send({ type: 'START_GAME' });
      vi.advanceTimersByTime(1000);
    });

    it('should check victory condition after each tick', () => {
      // Advance turns to reach survival victory condition (20 turns)
      for (let i = 0; i < 20; i++) {
        actor.send({ type: 'END_TURN' });
        vi.advanceTimersByTime(100);
      }

      expect(actor.getSnapshot().value).toBe('victory');
      expect(actor.getSnapshot().context.logs).toContain(
        '🎉 MISSION ACCOMPLISHED! Victory achieved.',
      );
    });

    it('should include final stats in victory message', () => {
      // Advance to victory
      for (let i = 0; i < 20; i++) {
        actor.send({ type: 'END_TURN' });
        vi.advanceTimersByTime(100);
      }

      const context = actor.getSnapshot().context;
      const finalStatsMessage = context.logs.find((log) =>
        log.includes('Final stats:'),
      );

      expect(finalStatsMessage).toBeDefined();
      expect(finalStatsMessage).toMatch(/Final stats: \d+ turns, \d+ ticks/);
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      actor = createTestActor();
      actor.start();
    });

    it('should handle errors during initialization', () => {
      actor.send({ type: 'ERROR', error: 'Initialization failed' });

      expect(actor.getSnapshot().value).toBe('error');
      expect(actor.getSnapshot().context.error).toBe('Initialization failed');
      expect(actor.getSnapshot().context.logs).toContain(
        'ERROR: Initialization failed',
      );
    });

    it('should allow recovery from error state', () => {
      actor.send({ type: 'ERROR', error: 'Test error' });
      expect(actor.getSnapshot().value).toBe('error');

      actor.send({ type: 'START_GAME' });
      expect(actor.getSnapshot().value).toBe('initializing');
    });

    it('should allow game reset from error state', () => {
      actor.send({ type: 'START_GAME' });
      vi.advanceTimersByTime(1000);

      // Simulate error during running
      actor.send({ type: 'ERROR', error: 'Runtime error' });
      expect(actor.getSnapshot().value).toBe('error');

      actor.send({ type: 'RESET_GAME' });
      expect(actor.getSnapshot().value).toBe('idle');
      expect(actor.getSnapshot().context.error).toBe(null);
    });
  });

  describe('Game Reset', () => {
    beforeEach(async () => {
      actor = createTestActor();
      actor.start();
      actor.send({ type: 'START_GAME' });
      vi.advanceTimersByTime(1000);
    });

    it('should reset all game state when RESET_GAME is sent', () => {
      // Add some game state
      actor.send({
        type: 'SUBMIT_ORDER',
        order: { unit: 'Test', action: 'move', modifiers: [] },
      });
      actor.send({ type: 'ADVANCE_TICK' });
      vi.advanceTimersByTime(100);

      // Verify state exists
      expect(actor.getSnapshot().context.currentTick).toBeGreaterThan(0);
      expect(
        actor.getSnapshot().context.completedOrders.length,
      ).toBeGreaterThan(0);

      // Reset from paused state
      actor.send({ type: 'PAUSE_GAME' });
      actor.send({ type: 'RESET_GAME' });

      expect(actor.getSnapshot().value).toBe('idle');

      const context = actor.getSnapshot().context;
      expect(context.currentTick).toBe(0);
      expect(context.turnCount).toBe(0);
      expect(context.missionTimer).toBe(0);
      expect(context.pendingOrders).toHaveLength(0);
      expect(context.activeOrders).toHaveLength(0);
      expect(context.completedOrders).toHaveLength(0);
      expect(context.logs).toEqual(['Game reset']);
      expect(context.sitreps).toHaveLength(0);
      expect(context.error).toBe(null);
    });
  });

  describe('Log Management', () => {
    beforeEach(async () => {
      actor = createTestActor();
      actor.start();
      actor.send({ type: 'START_GAME' });
      vi.advanceTimersByTime(1000);
    });

    it('should limit logs to last 50 entries', () => {
      // Generate more than 50 log entries
      for (let i = 0; i < 60; i++) {
        actor.send({ type: 'ADVANCE_TICK' });
        vi.advanceTimersByTime(100);
      }

      const context = actor.getSnapshot().context;
      expect(context.logs.length).toBeLessThanOrEqual(52); // 50 + a few extra from initialization
    });

    it('should limit sitreps to last 10 entries', () => {
      // Generate more than 10 sitreps
      for (let i = 0; i < 15; i++) {
        actor.send({ type: 'ADVANCE_TICK' });
        vi.advanceTimersByTime(100);
      }

      const context = actor.getSnapshot().context;
      expect(context.sitreps.length).toBeLessThanOrEqual(10);
    });
  });
});

describe('createGameLoopMachine helper', () => {
  it('should create a machine with provided actors', () => {
    const machine = createGameLoopMachine();
    expect(machine).toBeDefined();

    const actor = createTestActor();
    actor.start();

    expect(actor.getSnapshot().value).toBe('idle');
  });
});
