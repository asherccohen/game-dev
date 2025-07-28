import { World } from 'miniplex';
import { UnitType } from './types';

// Components
export interface Position {
  zone: string;
  isMoving: boolean;
  destination?: string;
}

export interface Combat {
  firepower?: number | undefined;
  range?: number | undefined;
  ammunition?: number | undefined;
}

export interface Status {
  morale: number;
  supplies: number;
  readiness: number;
  initiative: number | undefined;
  state: 'idle' | 'moving' | 'engaged' | 'pinned' | 'retreating';
}

export interface Identity {
  id: string;
  name: string;
  type: UnitType;
  faction: 'friendly' | 'hostile' | 'neutral';
}

export interface Order {
  type: 'move' | 'attack' | 'defend' | 'retreat' | 'support';
  target?: string;
  destination?: string;
  timeConstraint?: string;
  modifiers: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

// Entity Types
export type Unit = Position & Combat & Status & Identity;
// export type TerrainNode = {
//   id: string;
//   name: string;
//   type: 'ridge' | 'valley' | 'urban' | 'forest' | 'plains';
//   cover: number;
//   connections: string[];
// };
export type TerrainType =
  | 'ridge'
  | 'valley'
  | 'urban'
  | 'forest'
  | 'plains'
  | 'objective';

export interface TerrainNode {
  id: string;
  type: TerrainType;
  zone: string;
  name: string;
  connections: string[];
  cover: number;
  properties: {
    isObjective?: boolean;
    coverValue?: number;
    movementCost?: number;
  };
}

// Create World
export const createGameWorld = () => {
  const world = new World<Unit | TerrainNode>();

  // Systems
  const movementSystem = (delta: number) => {
    // Get all entities with Position that are moving
    for (const entity of world.entities) {
      if ('isMoving' in entity && entity.isMoving && 'zone' in entity) {
        const unit = entity as Unit;
        const currentTerrain = Array.from(world.entities).find(
          (e): e is TerrainNode => 'connections' in e && e.id === unit.zone,
        );

        if (currentTerrain && unit.destination) {
          // Check if destination is connected to current position
          if (currentTerrain.connections.includes(unit.destination)) {
            unit.zone = unit.destination;
            unit.isMoving = false;
            unit.state = 'idle';
            delete unit.destination;
          }
        }
      }
    }
  };

  const combatSystem = (delta: number) => {
    const engagedUnits = Array.from(world.entities).filter(
      (e): e is Unit =>
        'state' in e && e.state === 'engaged' && 'firepower' in e,
    );

    for (const unit of engagedUnits) {
      // Find enemy units in the same zone
      const enemiesInZone = Array.from(world.entities).filter(
        (e): e is Unit =>
          'zone' in e &&
          e.zone === unit.zone &&
          'faction' in e &&
          e.faction !== unit.faction,
      );

      for (const enemy of enemiesInZone) {
        // Calculate combat effectiveness
        const unitTerrain = Array.from(world.entities).find(
          (e): e is TerrainNode => 'cover' in e && e.id === unit.zone,
        );

        const coverModifier = unitTerrain ? unitTerrain.cover / 100 : 1;
        const baseDamage = unit.firepower || 0;
        const effectiveDamage = baseDamage * (1 - coverModifier);

        // Apply morale damage scaled by time
        const timeDamage = effectiveDamage * delta;
        enemy.morale = Math.max(0, enemy.morale - timeDamage);

        // Update ammunition and status
        if (unit.ammunition !== undefined) {
          const ammoUse = delta; // Ammo use per second
          unit.ammunition = Math.max(0, unit.ammunition - ammoUse);
        }

        // Check for low ammo retreat
        if (unit.ammunition !== undefined && unit.ammunition < 10) {
          unit.state = 'retreating';
        }
      }
    }
  };

  const moraleSystem = (delta: number) => {
    for (const entity of world.entities) {
      if ('morale' in entity && 'state' in entity) {
        const unit = entity as Unit;

        // Units in combat lose morale over time
        if (unit.state === 'engaged') {
          const combatStress = 5 * delta; // 5 morale loss per second
          unit.morale = Math.max(0, unit.morale - combatStress);
        }

        // Low morale triggers retreat
        if (unit.morale < 20 && unit.state !== 'retreating') {
          unit.state = 'retreating';
        }

        // Units not in combat slowly recover morale
        if (unit.state === 'idle') {
          const recovery = 2 * delta; // 2 morale recovery per second
          unit.morale = Math.min(100, unit.morale + recovery);
        }
      }
    }
  };

  // Unit Factory
  const createUnit = (
    type: UnitType,
    name: string,
    position: string,
    faction: 'friendly' | 'hostile' | 'neutral',
  ): Unit => {
    const baseStats = getUnitBaseStats(type);

    return {
      id: `${type}-${Date.now()}`,
      type,
      name,
      faction,
      zone: position,
      isMoving: false,
      ...baseStats,
      morale: 100,
      supplies: 100,
      readiness: 100,
      initiative: baseStats.initiative,
      state: 'idle',
    };
  };

  // Terrain Factory
  const createTerrain = (
    name: string,
    type: TerrainNode['type'],
    connections: string[],
  ): TerrainNode => ({
    id: `${type}-${Date.now()}`,
    name,
    type,
    cover: getTerrainCover(type),
    connections,
    zone: name, // Assuming zone is the same as name for simplicity
    properties: {
      isObjective: type === 'objective',
      coverValue: getTerrainCover(type),
      movementCost: 1, // Default movement cost, can be adjusted per terrain type
    },
  });

  return {
    world,
    systems: {
      movement: movementSystem,
      combat: combatSystem,
      morale: moraleSystem,
    },
    factories: {
      createUnit,
      createTerrain,
    },
  };
};

export type GameWorld = ReturnType<typeof createGameWorld>;

// Helper Functions
function getUnitBaseStats(type: UnitType): Partial<Unit> {
  const stats = {
    Infantry: { firepower: 5, range: 2, ammunition: 100, initiative: 70 },
    Recon: { firepower: 3, range: 4, ammunition: 50, initiative: 90 },
    Armor: { firepower: 10, range: 3, ammunition: 50, initiative: 60 },
    Engineers: { firepower: 2, range: 1, ammunition: 30, initiative: 65 },
    Artillery: { firepower: 8, range: 6, ammunition: 30, initiative: 40 },
    UAV: { firepower: 0, range: 8, ammunition: 0, initiative: 100 },
  };

  return stats[type];
}

function getTerrainCover(type: TerrainNode['type']): number {
  const cover = {
    ridge: 80,
    valley: 60,
    urban: 90,
    forest: 70,
    plains: 20,
    objective: 100, // Objectives provide maximum cover
  };

  return cover[type];
}

// Action Creators
export const actions = {
  moveUnit: (unit: Unit, destination: string) => {
    unit.isMoving = true;
    unit.state = 'moving';
    unit.destination = destination;
  },

  engageTarget: (attacker: Unit, defender: Unit) => {
    // Only engage if in the same zone
    if (attacker.zone === defender.zone) {
      attacker.state = 'engaged';
      defender.state = 'engaged';
    }
  },

  updateMorale: (unit: Unit, delta: number) => {
    unit.morale = Math.max(0, Math.min(100, unit.morale + delta));
    if (unit.morale < 20) {
      unit.state = 'retreating';
    }
  },
};
