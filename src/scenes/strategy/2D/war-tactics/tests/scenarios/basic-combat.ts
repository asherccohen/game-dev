import { createGameWorld } from '../../core/ecs';

export const createBasicCombatScenario = () => {
  const { world, factories, systems } = createGameWorld();

  // Create terrain features
  const ridge = factories.createTerrain('Ridge Alpha', 'ridge', [
    'valley-1',
    'forest-1',
  ]);

  const valley = factories.createTerrain('Valley Beta', 'valley', [
    'ridge-1',
    'forest-1',
  ]);

  const forest = factories.createTerrain('Forest Gamma', 'forest', [
    'ridge-1',
    'valley-1',
  ]);

  // Add terrain to world
  world.add(ridge);
  world.add(valley);
  world.add(forest);

  // Create friendly units
  const alphaSquad = factories.createUnit(
    'Infantry',
    'Alpha Squad',
    'ridge-1',
    'friendly',
  );

  const bravoSquad = factories.createUnit(
    'Recon',
    'Bravo Squad',
    'forest-1',
    'friendly',
  );

  // Create enemy unit
  const enemySquad = factories.createUnit(
    'Infantry',
    'Enemy Squad',
    'valley-1',
    'hostile',
  );

  // Add units to world
  world.add(alphaSquad);
  world.add(bravoSquad);
  world.add(enemySquad);

  return {
    world,
    units: {
      alphaSquad,
      bravoSquad,
      enemySquad,
    },
    terrain: {
      ridge,
      valley,
      forest,
    },
    systems,
  };
};
