import { Order } from './types';

// type CommandAction = Order['action'];

// Helper functions for normalization
function normalizeLocation(location: string | undefined): string | undefined {
  return location ? location.toLowerCase().replace(/\s+/g, '-') : undefined;
}

function normalizeUnitName(name: string): string {
  return name.trim();
}

function normalizeModifiers(modifiers: string | undefined): string[] {
  return modifiers ? modifiers.toLowerCase().split(/\s+and\s+/) : [];
}

const COMMAND_PATTERNS = {
  MOVE: /^move\s+([A-Za-z]+(?:\s+Squad)?)\s+to\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)(?:\s+before\s+(\d{4}Z))?(?:\s+under\s+(.+))?$/i,
  ATTACK:
    /^attack\s+([A-Za-z]+(?:\s+Squad)?)\s+with\s+([A-Za-z]+(?:\s+Squad)?)(?:\s+using\s+(.+))?$/i,
  DEFEND:
    /^defend\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+with\s+([A-Za-z]+(?:\s+Squad)?)$/i,
  RETREAT:
    /^retreat\s+([A-Za-z]+(?:\s+Squad)?)(?:\s+to\s+([A-Za-z]+(?:\s+[A-Za-z]+)?))?(?:\s+when\s+(.+))?$/i,
} as const;

export function parseCommand(input: string): Order | null {
  input = input.trim();

  // Try each pattern
  for (const [action, pattern] of Object.entries(COMMAND_PATTERNS)) {
    const match = input.match(pattern);

    if (match) {
      switch (action) {
        case 'MOVE': {
          const [_, unit, destination, time, modifiers] = match;
          const normalizedDest = normalizeLocation(destination);
          if (!normalizedDest) return null;

          return {
            unit: normalizeUnitName(unit),
            action: 'move' as const,
            destination: normalizedDest,
            ...(time && { time_constraint: time }),
            modifiers: normalizeModifiers(modifiers),
          };
        }
        case 'ATTACK': {
          const [_, target, unit, modifiers] = match;
          return {
            unit: normalizeUnitName(unit),
            action: 'attack',
            target: normalizeUnitName(target),
            modifiers: normalizeModifiers(modifiers),
          };
        }
        case 'DEFEND': {
          const [_, location, unit] = match;
          const normalizedLoc = normalizeLocation(location);
          if (!normalizedLoc) return null;

          return {
            unit: normalizeUnitName(unit),
            action: 'defend' as const,
            destination: normalizedLoc,
            modifiers: [],
          };
        }
        case 'RETREAT': {
          const [_, unit, destination, condition] = match;
          const normalizedDest = normalizeLocation(destination);

          return {
            unit: normalizeUnitName(unit),
            action: 'retreat' as const,
            ...(normalizedDest && { destination: normalizedDest }),
            modifiers: condition ? [condition.toLowerCase()] : [],
          };
        }
      }
    }
  }
  return null;
}
