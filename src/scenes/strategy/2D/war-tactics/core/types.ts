import { World } from 'miniplex';
import { GameWorld } from './ecs';

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
  target?: string | undefined;
  destination?: string | undefined;
  time_constraint?: string | undefined;
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

export interface GameContext {
  // World state
  gameWorld: GameWorld | null;
  gameState: GameState | null;

  // Time management
  currentTick: number;
  tickDuration: number; // milliseconds per tick (e.g., 5000 = 5 seconds)
  lastTickTime: number;
  isRealTime: boolean; // true for real-time, false for turn-based

  // Game progression
  turnCount: number;
  missionTimer: number; // total mission time in ticks

  // Orders and state
  pendingOrders: Order[];
  activeOrders: Order[];
  completedOrders: Order[];

  // Logs and reports
  logs: string[];
  sitreps: string[];

  // Victory conditions
  victoryCondition: 'elimination' | 'occupation' | 'survival' | 'time_limit';
  missionTimeLimit?: number | undefined; // in ticks

  // Error handling
  error: string | null;
}
