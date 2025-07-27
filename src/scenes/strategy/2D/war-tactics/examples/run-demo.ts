import { actions } from '../core/ecs';
import { parseCommand } from '../core/parser';
import { createBasicCombatScenario } from '../tests/scenarios/basic-combat';

const runInteractiveDemo = async () => {
  console.log('=== WAR TACTICS Basic Combat Demo ===\n');

  const scenario = createBasicCombatScenario();
  const { world, units, terrain, systems } = scenario;

  // Print initial situation
  console.log('Initial Deployment:');
  console.log('------------------');
  console.log('FRIENDLY FORCES:');
  console.log(`- Alpha Squad (Infantry) at ${units.alphaSquad.zone}`);
  console.log(`- Bravo Squad (Recon) at ${units.bravoSquad.zone}`);
  console.log('\nHOSTILE FORCES:');
  console.log(`- Enemy Infantry spotted at ${units.enemySquad.zone}`);
  console.log('\nTERRAIN:');
  Object.values(terrain).forEach((t) => {
    console.log(`- ${t.name}: Cover Rating ${t.cover}`);
  });

  // Simulate some turns
  const turns = [
    'Move Alpha Squad to Valley Beta',
    'Bravo Squad establish overwatch on Valley Beta',
    'Alpha Squad attack Enemy Squad',
  ];

  console.log('\nBeginning Operation:');
  console.log('-------------------');

  for (let i = 0; i < turns.length; i++) {
    console.log(`\nTurn ${i + 1}:`);
    console.log(`Command: ${turns[i]}`);

    const command = parseCommand(turns[i]);
    if (!command) {
      console.log('Invalid command!');
      continue;
    }

    // Execute command
    switch (command.action) {
      case 'move':
        const unit = Object.values(units).find((u) => u.name === command.unit);
        if (unit) {
          actions.moveUnit(unit, command.destination!);
          systems.movement(1.0);
        }
        break;
      case 'attack':
        const attacker = Object.values(units).find(
          (u) => u.name === command.unit,
        );
        const target = Object.values(units).find(
          (u) => u.name === command.target,
        );
        if (attacker && target) {
          actions.engageTarget(attacker, target);
          systems.combat(1.0);
        }
        break;
    }

    // Run all systems
    systems.morale(1.0);

    // Print status update
    console.log('\nStatus Report:');
    Object.values(units).forEach((unit) => {
      console.log(`${unit.name}:`);
      console.log(`- Position: ${unit.zone}`);
      console.log(`- Status: ${unit.state}`);
      console.log(`- Morale: ${unit.morale}`);
      console.log(`- Readiness: ${unit.readiness}\n`);
    });
  }
};

runInteractiveDemo().catch(console.error);
