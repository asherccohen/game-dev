import { World } from 'miniplex';

export type UnitType =
  | 'Infantry'
  | 'Recon'
  | 'Armor'
  | 'Engineers'
  | 'Artillery'
  | 'UAV';

export interface Unit {
  id: string;
  type: UnitType;
  name: string; // e.g., "Alpha", "Bravo"
  position: string; // e.g., "Ridge-3"
  morale: number; // 0-100
  supplies: number; // 0-100
  readiness: number; // 0-100
  initiative: number; // 0-100
  status: 'idle' | 'moving' | 'engaged' | 'pinned' | 'retreating';
}

export interface Terrain {
  id: string;
  name: string; // e.g., "Ridge-3"
  type: 'ridge' | 'valley' | 'urban' | 'forest' | 'plains';
  cover: number; // 0-100
  connections: string[]; // IDs of connected terrain
}

export interface Order {
  unit: string;
  action: 'move' | 'attack' | 'defend' | 'retreat' | 'support';
  target?: string;
  destination?: string;
  time_constraint?: string;
  modifiers: string[];
}

export interface GameState {
  world: World;
  units: Unit[];
  terrain: Terrain[];
  orders: Order[];
  time: string; // Military time format
  weather: string;
  visibility: 'clear' | 'limited' | 'poor';
  communications: 'normal' | 'disrupted' | 'jammed';
}
