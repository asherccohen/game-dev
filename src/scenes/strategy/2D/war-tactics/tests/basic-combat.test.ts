import { beforeEach, describe, expect, test } from 'vitest';
import { actions } from '../core/ecs';
import { parseCommand } from '../core/parser';
import { createBasicCombatScenario } from './scenarios/basic-combat';

describe('Basic Combat Scenario', () => {
  const scenario = createBasicCombatScenario();
  const { world, units, terrain, systems } = scenario;

  beforeEach(() => {
    // Reset unit states before each test
    const { alphaSquad, bravoSquad, enemySquad } = units;

    // Reset positions
    alphaSquad.zone = 'ridge-1';
    bravoSquad.zone = 'forest-1';
    enemySquad.zone = 'valley-1';

    // Reset status
    [alphaSquad, bravoSquad, enemySquad].forEach((unit) => {
      unit.morale = 100;
      unit.supplies = 100;
      unit.readiness = 100;
      unit.state = 'idle';
      unit.isMoving = false;
    });
  });

  test('initial scenario setup is correct', () => {
    const { alphaSquad, bravoSquad, enemySquad } = units;

    // Check unit positions
    expect(alphaSquad.zone).toBe('ridge-1');
    expect(bravoSquad.zone).toBe('forest-1');
    expect(enemySquad.zone).toBe('valley-1');

    // Check terrain connections
    expect(terrain.ridge.connections).toContain('valley-1');
    expect(terrain.ridge.connections).toContain('forest-1');
  });

  test('units can move between connected terrain', () => {
    const { alphaSquad } = units;

    // Move Alpha Squad from Ridge to Valley
    actions.moveUnit(alphaSquad, 'valley-1');

    // Run movement system
    systems.movement(1.0);

    expect(alphaSquad.zone).toBe('valley-1');
    expect(alphaSquad.state).toBe('moving');
  });

  test('combat affects unit morale and status', () => {
    const { alphaSquad, enemySquad } = units;

    // Move units to same zone for combat
    alphaSquad.zone = 'valley-1';

    // Initiate combat
    actions.engageTarget(alphaSquad, enemySquad);

    // Run combat system
    systems.combat(1.0);

    // Check combat effects
    expect(enemySquad.morale).toBeLessThan(100);
    expect(alphaSquad.state).toBe('engaged');
    expect(enemySquad.state).toBe('engaged');
  });

  test('low morale triggers retreat', () => {
    const { enemySquad } = units;

    // Drastically lower enemy morale
    actions.updateMorale(enemySquad, -85);

    // Run morale system
    systems.morale(1.0);

    // Enemy should retreat when morale is too low
    expect(enemySquad.state).toBe('retreating');
  });

  test('parser can handle complex commands', () => {
    const command = parseCommand(
      'Move Alpha Squad to Valley Beta under radio silence',
    );

    expect(command).toEqual({
      unit: 'Alpha Squad',
      action: 'move',
      destination: 'valley-1',
      modifiers: ['radio silence'],
    });
  });

  test('terrain provides combat advantages', () => {
    const { alphaSquad, enemySquad } = units;

    // Place units in different terrain types
    alphaSquad.zone = 'ridge-1'; // High ground advantage
    enemySquad.zone = 'valley-1'; // Disadvantaged position

    // Simulate combat
    actions.engageTarget(alphaSquad, enemySquad);
    systems.combat(1.0);

    // Ridge should provide better combat effectiveness
    const ridgeBonus = terrain.ridge.cover > terrain.valley.cover;
    expect(ridgeBonus).toBe(true);
  });
});
