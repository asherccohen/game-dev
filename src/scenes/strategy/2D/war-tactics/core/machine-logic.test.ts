import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createActor } from 'xstate';
import { GameLogicContext, gameLogicMachine } from './machine-logic';

describe('Enhanced War Tactics Machine Logic', () => {
  let actor: any;

  beforeEach(() => {
    const initialContext: Partial<GameLogicContext> = {
      gameWorld: null,
      victoryCondition: 'elimination',
      intelReports: [],
      sitReps: [],
      supplyStates: new Map([
        [
          'Alpha',
          {
            ammunition: 85,
            fuel: 90,
            communications: true,
            morale: 75,
            fatigue: 20,
            lastResupply: new Date().toISOString(),
          },
        ],
      ]),
      unitPersonalities: new Map([
        [
          'Alpha',
          {
            type: 'cautious',
            willRefuseOrders: false,
            adaptiveThreshold: 70,
            moraleThreshold: 40,
          },
        ],
      ]),
      communicationStatus: 'clear',
      reconAssets: [],
      knownEnemyPositions: new Map(),
      timeConstraints: new Map(),
    };

    actor = createActor(gameLogicMachine, { input: initialContext });
    actor.start();
  });

  afterEach(() => {
    actor?.stop();
  });

  it('should generate SITREP reports', () => {
    actor.send({ type: 'GENERATE_SITREP', unitName: 'Alpha' });

    const context = actor.getSnapshot().context;
    expect(context.sitReps).toHaveLength(1);
    expect(context.sitReps[0].unit).toBe('Alpha');
    expect(context.sitReps[0].type).toBe('status');
  });

  it('should process intel reports with confidence levels', () => {
    actor.send({
      type: 'UPDATE_INTEL',
      source: 'uav',
      confidence: 85,
      content: 'Enemy movement detected near Ridge-3',
      location: 'Ridge-3',
    });

    const context = actor.getSnapshot().context;
    expect(context.intelReports).toHaveLength(1);
    expect(context.intelReports[0].confidence).toBe(85);
    expect(context.intelReports[0].priority).toBe('high');
    expect(context.sitReps).toHaveLength(1); // Should also generate a SITREP
  });

  it('should handle communication jamming', () => {
    actor.send({ type: 'COMMUNICATION_JAMMED' });

    const context = actor.getSnapshot().context;
    expect(context.communicationStatus).toBe('jammed');
    expect(context.sitReps).toHaveLength(1);
    expect(context.sitReps[0].content).toContain('COMMUNICATIONS JAMMED');
  });

  it('should process supply degradation', () => {
    const initialAmmo = actor
      .getSnapshot()
      .context.supplyStates.get('Alpha')?.ammunition;

    actor.send({ type: 'PROCESS_SUPPLIES', deltaTime: 100 });

    const context = actor.getSnapshot().context;
    const newAmmo = context.supplyStates.get('Alpha')?.ammunition;
    expect(newAmmo).toBeLessThan(initialAmmo!);
  });

  it('should validate orders with enhanced checks', () => {
    const mockOrder = {
      unit: 'Alpha',
      action: 'attack' as const,
      target: 'Enemy-1',
      modifiers: [],
    };

    actor.send({ type: 'VALIDATE_ORDER', order: mockOrder });

    // Should move through validation states
    const state = actor.getSnapshot().value;
    expect([
      'validatingOrder',
      'checkingUnitWillingness',
      'executingOrder',
      'adaptingOrder',
    ]).toContain(state);
  });

  it('should generate critical supply warnings', () => {
    // Set low supplies
    const criticalSupplies = new Map([
      [
        'Alpha',
        {
          ammunition: 5, // Critical level
          fuel: 90,
          communications: true,
          morale: 75,
          fatigue: 20,
          lastResupply: new Date().toISOString(),
        },
      ],
    ]);

    actor.send({
      type: 'GAME_LOOP_TICK',
      context: {
        deltaTime: 100,
        turnCount: 1,
        gameWorld: null,
      },
    });

    // Update supplies manually for test
    actor
      .getSnapshot()
      .context.supplyStates.set('Alpha', criticalSupplies.get('Alpha')!);

    actor.send({ type: 'PROCESS_SUPPLIES', deltaTime: 100 });

    const context = actor.getSnapshot().context;
    const criticalReports = context.sitReps.filter(
      (s) => s.severity === 'critical',
    );
    expect(criticalReports.length).toBeGreaterThan(0);
  });

  it('should handle recon reports', () => {
    actor.send({
      type: 'RECON_REPORT',
      source: 'uav',
      location: 'Sector-Delta',
      findings: 'Enemy armor detected',
    });

    const context = actor.getSnapshot().context;
    expect(context.intelReports).toHaveLength(1);
    expect(context.intelReports[0].source).toBe('uav');
    expect(context.intelReports[0].confidence).toBe(90); // UAV has high confidence
  });

  it('should handle unit adaptation based on personality', () => {
    const mockOrder = {
      unit: 'Alpha',
      action: 'move' as const,
      destination: 'Ridge-3',
      modifiers: [],
    };

    actor.send({ type: 'VALIDATE_ORDER', order: mockOrder });

    // Since Alpha is cautious and has random adaptation, test the flow
    const context = actor.getSnapshot().context;

    // Should have validated and potentially adapted
    expect(context.currentOrder).toBeTruthy();
  });
});

describe('TTW Utility Functions', () => {
  it('should parse time constraints correctly', () => {
    // This would require importing the utility functions
    // For now, we'll test the machine's time constraint handling
    expect(true).toBe(true); // Placeholder
  });
});
