import { assertEvent, assign, fromPromise, sendTo, setup } from 'xstate';
import { GameWorld, TerrainNode, Unit, actions } from './ecs';
import { GameContext, Order } from './types';

// Utility functions for TTW features
function parseTimeConstraint(constraint: string): string {
  // Simple time constraint parsing - could be enhanced
  const timePatterns = {
    dawn: '0600Z',
    dusk: '1800Z',
    midnight: '0000Z',
    noon: '1200Z',
  };

  // Check for military time pattern (e.g., "0530Z", "before 0600Z")
  const militaryTime = constraint.match(/(\d{4}Z)/);
  if (militaryTime) {
    return militaryTime[1];
  }

  // Check for named times
  for (const [name, time] of Object.entries(timePatterns)) {
    if (constraint.toLowerCase().includes(name)) {
      return time;
    }
  }

  // Default to 1 hour from now
  const future = new Date();
  future.setHours(future.getHours() + 1);
  return future.toISOString().slice(11, 16) + 'Z';
}

function generateMissionTime(): string {
  const now = new Date();
  return now.toISOString().slice(11, 16) + 'Z';
}

export function initializeUnitSupplies(unitName: string): SupplyState {
  console.log(`Initializing supplies for unit: ${unitName}`);
  return {
    ammunition: 100,
    fuel: 100,
    communications: true,
    morale: 85,
    fatigue: 10,
    lastResupply: new Date().toISOString(),
  };
}

export function initializeUnitPersonality(unitType: string): UnitPersonality {
  const personalities = {
    Infantry: {
      type: 'reliable' as const,
      willRefuseOrders: false,
      adaptiveThreshold: 60,
      moraleThreshold: 40,
    },
    Recon: {
      type: 'cautious' as const,
      willRefuseOrders: false,
      adaptiveThreshold: 80,
      moraleThreshold: 30,
    },
    Armor: {
      type: 'aggressive' as const,
      willRefuseOrders: false,
      adaptiveThreshold: 40,
      moraleThreshold: 50,
    },
    Artillery: {
      type: 'reliable' as const,
      willRefuseOrders: false,
      adaptiveThreshold: 70,
      moraleThreshold: 35,
    },
    Engineers: {
      type: 'cautious' as const,
      willRefuseOrders: false,
      adaptiveThreshold: 75,
      moraleThreshold: 25,
    },
    UAV: {
      type: 'reliable' as const,
      willRefuseOrders: false,
      adaptiveThreshold: 90,
      moraleThreshold: 0,
    },
  };

  return (
    personalities[unitType as keyof typeof personalities] ||
    personalities.Infantry
  );
}

// Intel and reconnaissance types
export interface IntelReport {
  id: string;
  source: 'visual' | 'sigint' | 'humint' | 'uav' | 'recon';
  confidence: number; // 0-100
  timestamp: string;
  content: string;
  location?: string | undefined;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Supply and logistics types
export interface SupplyState {
  ammunition: number; // 0-100
  fuel: number; // 0-100
  communications: boolean;
  morale: number; // 0-100
  fatigue: number; // 0-100
  lastResupply: string; // timestamp
}

// Unit autonomy and behavior
export interface UnitPersonality {
  type: 'aggressive' | 'cautious' | 'reliable' | 'unpredictable';
  willRefuseOrders: boolean;
  adaptiveThreshold: number; // 0-100, when unit will adapt orders
  moraleThreshold: number; // minimum morale to accept dangerous orders
}

// SITREP and narrative reporting
export interface SitRep {
  id: string;
  timestamp: string;
  type: 'combat' | 'movement' | 'intel' | 'supply' | 'status';
  unit?: string | undefined;
  location?: string | undefined;
  content: string;
  severity: 'info' | 'warning' | 'critical';
}

// Time constraint parsing and tracking
export interface TimeConstraint {
  deadline: string; // e.g., "0600Z", "dawn", "nightfall"
  type: 'absolute' | 'relative' | 'condition';
  urgency: 'low' | 'medium' | 'high';
}

// Game logic context - enhanced for TTW features
export interface GameLogicContext {
  gameWorld: GameWorld | null;
  victoryCondition: 'elimination' | 'occupation' | 'survival' | 'time_limit';
  currentOrder: Order | null;
  orderValidationErrors: string[];

  // Enhanced TTW features
  intelReports: IntelReport[];
  sitReps: SitRep[];
  supplyStates: Map<string, SupplyState>; // keyed by unit name
  unitPersonalities: Map<string, UnitPersonality>; // keyed by unit name
  timeConstraints: Map<string, TimeConstraint>; // keyed by order ID

  // Fog of war and intel
  knownEnemyPositions: Map<string, { confidence: number; lastSeen: string }>;
  communicationStatus: 'clear' | 'jammed' | 'degraded';
  reconAssets: Array<{
    id: string;
    type: 'uav' | 'scout';
    location: string;
    status: string;
  }>;

  // Combat and results tracking
  combatResults: Array<{
    tick: number;
    attacker: string;
    target: string;
    result: 'hit' | 'miss' | 'killed';
    confidence: number; // fog of war factor
  }>;
}

// Game logic events - focused on tactical operations
type GameLogicEvent =
  | { type: 'GAME_LOOP_TICK'; context: GameContext }
  | { type: 'VALIDATE_ORDER'; order: Order }
  | { type: 'EXECUTE_ORDER'; order: Order }
  | { type: 'CHECK_VICTORY_CONDITIONS' }
  | { type: 'PROCESS_COMBAT'; deltaTime: number }
  | { type: 'UPDATE_MORALE'; deltaTime: number }
  | { type: 'ORDER_VALIDATION_COMPLETE'; valid: boolean; errors?: string[] }
  | { type: 'ORDER_EXECUTION_COMPLETE'; success: boolean; result?: string }
  // New TTW events
  | { type: 'GENERATE_SITREP'; unitName?: string; reportType?: string }
  | {
      type: 'UPDATE_INTEL';
      source: string;
      confidence: number;
      content: string;
      location?: string;
    }
  | { type: 'PROCESS_SUPPLIES'; deltaTime: number }
  | { type: 'CHECK_TIME_CONSTRAINTS' }
  | { type: 'UNIT_ADAPT_ORDER'; unitName: string; reason: string }
  | { type: 'UNIT_REFUSE_ORDER'; unitName: string; reason: string }
  | { type: 'COMMUNICATION_JAMMED' }
  | { type: 'COMMUNICATION_RESTORED' }
  | {
      type: 'RECON_REPORT';
      source: 'uav' | 'scout';
      location: string;
      findings: string;
    };

export const gameLogicMachine = setup({
  types: {
    context: {} as GameLogicContext,
    events: {} as GameLogicEvent,
    input: {} as Partial<GameLogicContext>,
  },

  actors: {
    checkTimeConstraints: fromPromise(
      async ({
        input,
      }: {
        input: { order: Order; timeConstraint?: TimeConstraint | undefined };
      }) => {
        const { order, timeConstraint } = input;

        if (!timeConstraint) {
          console.log(
            `No time constraint for order: ${order.action} by ${order.unit}`,
          );
          return { success: true };
        }

        const currentTime = generateMissionTime();
        const deadline = parseTimeConstraint(timeConstraint.deadline);

        // Simple time check - enhance as needed
        const success = currentTime < deadline;

        if (!success) {
          throw new Error(
            `Time constraint violated for ${order.unit}: ${deadline} passed`,
          );
        }

        return { success };
      },
    ),

    analyzeIntelligence: fromPromise(
      async ({ input }: { input: { reports: IntelReport[] } }) => {
        // Simulate intel analysis processing
        await new Promise((resolve) => setTimeout(resolve, 500));

        const { reports } = input;
        const highConfidenceReports = reports.filter((r) => r.confidence > 80);

        return {
          analysis: `Processed ${reports.length} reports, ${highConfidenceReports.length} high confidence`,
          recommendations:
            highConfidenceReports.length > 0
              ? ['Immediate action recommended']
              : ['Continue monitoring'],
        };
      },
    ),
  },

  guards: {
    // Victory condition checks from original machine.ts
    eliminationAchieved: ({ context }) => {
      if (!context.gameWorld) return false;

      const friendlyUnits = Array.from(context.gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'friendly',
      );

      const enemyUnits = Array.from(context.gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'hostile',
      );

      return enemyUnits.length === 0 && friendlyUnits.length > 0;
    },

    occupationAchieved: ({ context }) => {
      if (!context.gameWorld) return false;

      const friendlyUnits = Array.from(context.gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'friendly',
      );

      const objectives = Array.from(context.gameWorld.world.entities).filter(
        (e): e is TerrainNode =>
          'type' in e && 'properties' in e && e.properties.isObjective === true,
      );

      return objectives.every((obj) =>
        friendlyUnits.some((unit) => unit.zone === obj.id),
      );
    },

    survivalAchieved: (
      { context },
      { gameLoopContext }: { gameLoopContext: GameContext },
    ) => {
      if (!context.gameWorld) return false;

      const friendlyUnits = Array.from(context.gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'friendly',
      );

      return gameLoopContext.turnCount >= 10 && friendlyUnits.length > 0;
    },

    defeatConditionsMet: ({ context }) => {
      if (!context.gameWorld) return false;

      const friendlyUnits = Array.from(context.gameWorld.world.entities).filter(
        (e): e is Unit => 'faction' in e && e.faction === 'friendly',
      );

      return friendlyUnits.length === 0;
    },

    orderIsValid: ({ context }) => context.orderValidationErrors.length === 0,

    // New TTW guards
    unitWillAcceptOrder: ({ context }) => {
      if (!context.currentOrder) return true;

      const unitName = context.currentOrder.unit;
      const personality = context.unitPersonalities.get(unitName);
      const supplies = context.supplyStates.get(unitName);

      if (!personality || !supplies) return true; // Default accept

      // Check morale threshold for dangerous orders
      if (
        context.currentOrder.action === 'attack' &&
        supplies.morale < personality.moraleThreshold
      ) {
        return false;
      }

      // Check supplies for combat orders
      if (
        context.currentOrder.action === 'attack' &&
        supplies.ammunition < 20
      ) {
        return false;
      }

      return !personality.willRefuseOrders;
    },

    timeConstraintMet: ({ context }) => {
      if (!context.currentOrder?.time_constraint) return true;

      const constraint = context.timeConstraints.get(context.currentOrder.unit);
      if (!constraint) return true;

      const currentTime = new Date().toISOString();
      const deadline = constraint.deadline;

      // Simple time comparison - could be enhanced with proper military time parsing
      return currentTime < deadline;
    },

    communicationsActive: ({ context }) => {
      return context.communicationStatus === 'clear';
    },
  },

  actions: {
    // Order validation logic from machine.ts
    validateOrder: assign({
      currentOrder: ({ event }) => {
        assertEvent(event, 'VALIDATE_ORDER');
        return event.order;
      },
      orderValidationErrors: ({ context, event }) => {
        assertEvent(event, 'VALIDATE_ORDER');
        const { gameWorld } = context;
        const errors: string[] = [];

        if (!gameWorld) {
          errors.push('No game world available');
          return errors;
        }

        const unit = Array.from(gameWorld.world.entities).find(
          (e): e is Unit => 'type' in e && e.name === event.order.unit,
        );

        if (!unit) {
          errors.push(`Unit "${event.order.unit}" not found`);
        }

        // Validate destination for move orders
        if (event.order.action === 'move' && event.order.destination) {
          const destination = Array.from(gameWorld.world.entities).find(
            (e): e is TerrainNode =>
              'type' in e && e.id === event.order.destination,
          );
          if (!destination) {
            errors.push(`Destination "${event.order.destination}" not found`);
          }
        }

        // Validate target for attack orders
        if (event.order.action === 'attack' && event.order.target) {
          const target = Array.from(gameWorld.world.entities).find(
            (e): e is Unit => 'type' in e && e.name === event.order.target,
          );
          if (!target) {
            errors.push(`Target "${event.order.target}" not found`);
          }
        }

        return errors;
      },
    }),

    // Enhanced order execution with TTW features
    executeOrder: assign({
      gameWorld: ({ context }) => {
        if (!context.gameWorld || !context.currentOrder) {
          return context.gameWorld;
        }

        const unit = Array.from(context.gameWorld.world.entities).find(
          (e): e is Unit =>
            'type' in e && e.name === context.currentOrder!.unit,
        );

        if (!unit) return context.gameWorld;

        switch (context.currentOrder.action) {
          case 'move':
            if (context.currentOrder.destination) {
              actions.moveUnit(unit, context.currentOrder.destination);
            }
            break;
          case 'attack':
            if (context.currentOrder.target) {
              const target = Array.from(context.gameWorld.world.entities).find(
                (e): e is Unit =>
                  'type' in e && e.name === context.currentOrder!.target,
              );
              if (target) {
                actions.engageTarget(unit, target);
              }
            }
            break;
          case 'defend':
            // Implement defend logic
            break;
          case 'retreat':
            // Implement retreat logic
            break;
        }

        return context.gameWorld;
      },

      sitReps: ({ context }) => {
        // Generate SITREP for order execution
        const timestamp = new Date().toISOString().slice(11, 16) + 'Z';
        const newSitRep: SitRep = {
          id: `sitrep-${Date.now()}`,
          timestamp,
          type: 'status',
          unit: context.currentOrder?.unit,
          content: `${context.currentOrder?.unit} executing ${context.currentOrder?.action} order`,
          severity: 'info',
        };

        return [...context.sitReps, newSitRep].slice(-50); // Keep last 50 reports
      },

      currentOrder: null,
      orderValidationErrors: [],
    }),

    // SITREP generation action
    generateSitrep: assign({
      sitReps: ({ context, event }) => {
        assertEvent(event, 'GENERATE_SITREP');
        const timestamp = new Date().toISOString().slice(11, 16) + 'Z';

        let content = '';
        let severity: 'info' | 'warning' | 'critical' = 'info';
        let reportType: 'combat' | 'movement' | 'intel' | 'supply' | 'status' =
          'status';

        if (event.unitName) {
          const supplies = context.supplyStates.get(event.unitName);
          if (supplies) {
            if (supplies.ammunition < 20) {
              content = `${event.unitName}: Ammunition low (${supplies.ammunition}%)`;
              severity = 'warning';
              reportType = 'supply';
            } else if (supplies.morale < 30) {
              content = `${event.unitName}: Morale critical (${supplies.morale}%)`;
              severity = 'critical';
              reportType = 'status';
            } else {
              content = `${event.unitName}: Operational. Status green.`;
            }
          }
        } else {
          // General SITREP
          content = `All units reporting. Communications ${context.communicationStatus}.`;
        }

        const newSitRep: SitRep = {
          id: `sitrep-${Date.now()}`,
          timestamp,
          type: reportType,
          unit: event.unitName,
          content,
          severity,
        };

        return [...context.sitReps, newSitRep].slice(-50);
      },
    }),

    // Intel processing action
    updateIntel: assign({
      intelReports: ({ context, event }) => {
        let source: IntelReport['source'] = 'visual';
        let confidence = 50;
        let content = 'Intelligence update';
        let location: string | undefined;

        if (event.type === 'UPDATE_INTEL') {
          source = event.source as IntelReport['source'];
          confidence = event.confidence;
          content = event.content;
          location = event.location;
        } else if (event.type === 'RECON_REPORT') {
          source = event.source === 'uav' ? 'uav' : 'visual';
          confidence = event.source === 'uav' ? 90 : 70;
          content = event.findings;
          location = event.location;
        }

        const newIntel: IntelReport = {
          id: `intel-${Date.now()}`,
          source,
          confidence,
          timestamp: generateMissionTime(),
          content,
          location,
          priority:
            confidence > 80 ? 'high' : confidence > 50 ? 'medium' : 'low',
        };

        return [...context.intelReports, newIntel].slice(-30);
      },

      sitReps: ({ context, event }) => {
        let confidence = 50;
        let content = 'Intelligence update';
        let location: string | undefined;

        if (event.type === 'UPDATE_INTEL') {
          confidence = event.confidence;
          content = event.content;
          location = event.location;
        } else if (event.type === 'RECON_REPORT') {
          confidence = event.source === 'uav' ? 90 : 70;
          content = event.findings;
          location = event.location;
        }

        const timestamp = generateMissionTime();
        const confidenceText =
          confidence > 80
            ? 'CONFIRMED'
            : confidence > 50
              ? 'PROBABLE'
              : 'UNCONFIRMED';

        const newSitRep: SitRep = {
          id: `sitrep-intel-${Date.now()}`,
          timestamp,
          type: 'intel',
          location,
          content: `[${confidenceText}] ${content}`,
          severity: confidence > 80 ? 'critical' : 'info',
        };

        return [...context.sitReps, newSitRep].slice(-50);
      },
    }),

    // Supply processing action
    processSupplies: assign({
      supplyStates: ({ context }) => {
        const newSupplyStates = new Map(context.supplyStates);
        const degradationRate =
          context.communicationStatus === 'jammed' ? 2 : 1;

        // Degrade supplies over time for all units
        newSupplyStates.forEach((supply, unitName) => {
          supply.ammunition = Math.max(0, supply.ammunition - degradationRate);
          supply.fuel = Math.max(0, supply.fuel - degradationRate);
          supply.fatigue = Math.min(100, supply.fatigue + degradationRate);

          // Morale affected by supplies and communication status
          if (supply.ammunition < 20 || supply.fuel < 20) {
            supply.morale = Math.max(0, supply.morale - 2);
          }

          if (context.communicationStatus === 'jammed') {
            supply.morale = Math.max(0, supply.morale - 1);
            supply.communications = false;
          } else {
            supply.communications = true;
          }

          // Log critical supply shortages for each unit
          if (supply.ammunition < 10) {
            console.log(
              `WARNING: ${unitName} critically low on ammunition: ${supply.ammunition}%`,
            );
          }
        });

        return newSupplyStates;
      },

      sitReps: ({ context }) => {
        const criticalSupplies: SitRep[] = [];
        const timestamp = generateMissionTime();

        context.supplyStates.forEach((supply, unitName) => {
          if (supply.ammunition < 10) {
            criticalSupplies.push({
              id: `supply-critical-${Date.now()}-${unitName}`,
              timestamp,
              type: 'supply',
              unit: unitName,
              content: `${unitName}: CRITICAL ammunition shortage (${supply.ammunition}%)`,
              severity: 'critical',
            });
          }
        });

        return [...context.sitReps, ...criticalSupplies].slice(-50);
      },
    }),

    // Unit adaptation action
    adaptOrder: assign({
      currentOrder: ({ context }) => {
        if (!context.currentOrder) return context.currentOrder;

        const personality = context.unitPersonalities.get(
          context.currentOrder.unit,
        );
        if (!personality || personality.type !== 'cautious')
          return context.currentOrder;

        // Cautious units add stealth modifiers
        return {
          ...context.currentOrder,
          modifiers: [
            ...context.currentOrder.modifiers,
            'request backup',
            'proceed with caution',
          ],
        };
      },

      sitReps: ({ context }) => {
        if (!context.currentOrder) return context.sitReps;

        const timestamp = generateMissionTime();
        const newSitRep: SitRep = {
          id: `adapt-${Date.now()}`,
          timestamp,
          type: 'status',
          unit: context.currentOrder.unit,
          content: `${context.currentOrder.unit}: Adapting orders. Reason: Tactical assessment suggests modified approach`,
          severity: 'warning',
        };

        return [...context.sitReps, newSitRep].slice(-50);
      },
    }),

    // Communication management
    jamCommunications: assign({
      communicationStatus: 'jammed',
      sitReps: ({ context }) => {
        const timestamp = new Date().toISOString().slice(11, 16) + 'Z';
        const newSitRep: SitRep = {
          id: `comm-jam-${Date.now()}`,
          timestamp,
          type: 'status',
          content: 'COMMUNICATIONS JAMMED - Orders may be delayed or fail',
          severity: 'critical',
        };

        return [...context.sitReps, newSitRep].slice(-50);
      },
    }),

    restoreCommunications: assign({
      communicationStatus: 'clear',
      sitReps: ({ context }) => {
        const timestamp = new Date().toISOString().slice(11, 16) + 'Z';
        const newSitRep: SitRep = {
          id: `comm-restore-${Date.now()}`,
          timestamp,
          type: 'status',
          content: 'Communications restored - Normal operations resumed',
          severity: 'info',
        };

        return [...context.sitReps, newSitRep].slice(-50);
      },
    }),

    // Victory/defeat condition checking
    checkVictoryConditions: ({ context, event }) => {
      // Only process when it's a game loop tick
      if (event.type !== 'GAME_LOOP_TICK') return;

      const gameLoopContext = event.context;
      let victoryAchieved = false;
      let victoryReason = '';

      switch (context.victoryCondition) {
        case 'elimination':
          if (context.gameWorld) {
            const friendlyUnits = Array.from(
              context.gameWorld.world.entities,
            ).filter(
              (e): e is Unit => 'faction' in e && e.faction === 'friendly',
            );
            const enemyUnits = Array.from(
              context.gameWorld.world.entities,
            ).filter(
              (e): e is Unit => 'faction' in e && e.faction === 'hostile',
            );

            if (enemyUnits.length === 0 && friendlyUnits.length > 0) {
              victoryAchieved = true;
              victoryReason = 'All enemy units eliminated';
            }
          }
          break;

        case 'occupation':
          if (context.gameWorld) {
            const friendlyUnits = Array.from(
              context.gameWorld.world.entities,
            ).filter(
              (e): e is Unit => 'faction' in e && e.faction === 'friendly',
            );
            const objectives = Array.from(
              context.gameWorld.world.entities,
            ).filter(
              (e): e is TerrainNode =>
                'type' in e &&
                'properties' in e &&
                e.properties.isObjective === true,
            );

            if (
              objectives.every((obj) =>
                friendlyUnits.some((unit) => unit.zone === obj.id),
              )
            ) {
              victoryAchieved = true;
              victoryReason = 'All objectives occupied';
            }
          }
          break;

        case 'survival':
          if (context.gameWorld && gameLoopContext.turnCount >= 10) {
            const friendlyUnits = Array.from(
              context.gameWorld.world.entities,
            ).filter(
              (e): e is Unit => 'faction' in e && e.faction === 'friendly',
            );

            if (friendlyUnits.length > 0) {
              victoryAchieved = true;
              victoryReason = `Survived ${gameLoopContext.turnCount} turns`;
            }
          }
          break;
      }

      if (victoryAchieved) {
        sendTo('gameLoop', {
          type: 'GAME_LOGIC_VICTORY',
          reason: victoryReason,
        });
      }

      // Check defeat conditions
      if (context.gameWorld) {
        const friendlyUnits = Array.from(
          context.gameWorld.world.entities,
        ).filter((e): e is Unit => 'faction' in e && e.faction === 'friendly');

        if (friendlyUnits.length === 0) {
          sendTo('gameLoop', {
            type: 'GAME_LOGIC_DEFEAT',
            reason: 'All friendly units lost',
          });
        }
      }
    },

    // Game world updates
    updateGameWorld: assign({
      gameWorld: ({ context, event }) => {
        assertEvent(event, 'GAME_LOOP_TICK');

        if (!context.gameWorld) {
          return event.context.gameWorld;
        }

        // Update local game world state with loop context
        return event.context.gameWorld;
      },
    }),

    // Combat processing with fog of war
    processCombat: assign({
      gameWorld: ({ context, event }) => {
        assertEvent(event, 'PROCESS_COMBAT');

        if (!context.gameWorld) return null;

        // Run combat systems
        context.gameWorld.systems.combat(event.deltaTime);
        return context.gameWorld;
      },

      combatResults: ({ context, event }) => {
        assertEvent(event, 'PROCESS_COMBAT');

        // Add fog of war to combat results
        const baseConfidence =
          context.communicationStatus === 'clear' ? 85 : 60;
        const weatherPenalty = 10; // Could be dynamic based on weather
        const finalConfidence = Math.max(30, baseConfidence - weatherPenalty);

        // Mock combat result with confidence
        const newResult = {
          tick: Date.now(),
          attacker: 'Alpha',
          target: 'Enemy-1',
          result: 'hit' as const,
          confidence: finalConfidence,
        };

        return [...context.combatResults, newResult].slice(-20);
      },

      sitReps: ({ context, event }) => {
        assertEvent(event, 'PROCESS_COMBAT');

        const timestamp = new Date().toISOString().slice(11, 16) + 'Z';
        const confidence = context.communicationStatus === 'clear' ? 85 : 60;
        const confidenceText = confidence > 80 ? 'CONFIRMED' : 'UNCONFIRMED';

        const newSitRep: SitRep = {
          id: `combat-${Date.now()}`,
          timestamp,
          type: 'combat',
          content: `[${confidenceText}] Contact reported. Engaging hostile forces.`,
          severity: 'critical',
        };

        return [...context.sitReps, newSitRep].slice(-50);
      },
    }),

    // Morale updates
    updateMorale: assign({
      gameWorld: ({ context, event }) => {
        assertEvent(event, 'UPDATE_MORALE');

        if (!context.gameWorld) return null;

        context.gameWorld.systems.morale(event.deltaTime);
        return context.gameWorld;
      },
    }),

    // Send completion events back to game loop
    notifyOrderComplete: sendTo('gameLoop', ({ context }) => ({
      type: 'GAME_LOGIC_ORDER_COMPLETE',
      order: context.currentOrder!,
    })),

    notifyOrderFailed: sendTo('gameLoop', ({ context }) => ({
      type: 'GAME_LOGIC_ORDER_FAILED',
      order: context.currentOrder!,
      reason: context.orderValidationErrors.join(', '),
    })),
  },
}).createMachine({
  id: 'warTacticsGameLogic',
  initial: 'idle',

  context: ({ input }) => ({
    gameWorld: input?.gameWorld ?? null,
    victoryCondition: input?.victoryCondition ?? 'elimination',
    currentOrder: input?.currentOrder ?? null,
    orderValidationErrors: input?.orderValidationErrors ?? [],

    // Enhanced TTW features
    intelReports: input?.intelReports ?? [],
    sitReps: input?.sitReps ?? [],
    supplyStates: input?.supplyStates ?? new Map(),
    unitPersonalities: input?.unitPersonalities ?? new Map(),
    timeConstraints: input?.timeConstraints ?? new Map(),

    // Fog of war and intel
    knownEnemyPositions: input?.knownEnemyPositions ?? new Map(),
    communicationStatus: input?.communicationStatus ?? 'clear',
    reconAssets: input?.reconAssets ?? [],

    // Combat results with confidence
    combatResults: input?.combatResults ?? [],
  }),

  states: {
    idle: {
      on: {
        GAME_LOOP_TICK: {
          target: 'active',
          actions: 'updateGameWorld',
        },
      },
    },

    active: {
      entry: 'checkVictoryConditions',

      on: {
        GAME_LOOP_TICK: {
          actions: [
            'updateGameWorld',
            'checkVictoryConditions',
            'processSupplies',
            'generateSitrep',
          ],
        },

        VALIDATE_ORDER: [
          {
            target: 'checkingUnitWillingness',
            actions: 'validateOrder',
            guard: 'orderIsValid',
          },
          {
            target: 'active',
            actions: 'notifyOrderFailed',
          },
        ],

        PROCESS_COMBAT: {
          actions: 'processCombat',
        },

        UPDATE_MORALE: {
          actions: 'updateMorale',
        },

        UPDATE_INTEL: {
          actions: 'updateIntel',
        },

        GENERATE_SITREP: {
          actions: 'generateSitrep',
        },

        COMMUNICATION_JAMMED: {
          actions: 'jamCommunications',
        },

        COMMUNICATION_RESTORED: {
          actions: 'restoreCommunications',
        },

        RECON_REPORT: {
          actions: 'updateIntel',
        },
      },
    },

    validatingOrder: {
      always: [
        {
          target: 'executingOrder',
          guard: 'orderIsValid',
        },
        {
          target: 'active',
          actions: 'notifyOrderFailed',
        },
      ],
    },

    // New state: Check if unit will accept/adapt the order
    checkingUnitWillingness: {
      always: [
        {
          target: 'adaptingOrder',
          guard: ({ context }) => {
            if (!context.currentOrder) return false;
            const personality = context.unitPersonalities.get(
              context.currentOrder.unit,
            );
            return personality?.type === 'cautious' && Math.random() > 0.7; // 30% chance to adapt
          },
        },
        {
          target: 'executingOrder',
          guard: 'unitWillAcceptOrder',
        },
        {
          target: 'refusingOrder',
        },
      ],
    },

    // New state: Unit adapts the order based on personality/situation
    adaptingOrder: {
      entry: ['adaptOrder', 'generateSitrep'],
      after: {
        200: {
          target: 'executingOrder',
        },
      },
    },

    // New state: Unit refuses the order
    refusingOrder: {
      entry: 'generateSitrep',
      after: {
        100: {
          target: 'active',
          actions: 'notifyOrderFailed',
        },
      },
    },

    executingOrder: {
      entry: 'executeOrder',

      // Check time constraints during execution
      invoke: {
        src: 'checkTimeConstraints',
        input: ({ context }) => {
          const timeConstraint = context.timeConstraints.get(
            context.currentOrder?.unit || '',
          );
          return {
            order: context.currentOrder!,
            timeConstraint: timeConstraint || undefined,
          };
        },
        onDone: {
          target: 'active',
          actions: 'notifyOrderComplete',
        },
        onError: {
          target: 'active',
          actions: 'notifyOrderFailed',
        },
      },

      after: {
        100: {
          target: 'active',
          actions: 'notifyOrderComplete',
          guard: 'timeConstraintMet',
        },
      },

      on: {
        CHECK_TIME_CONSTRAINTS: [
          {
            target: 'active',
            guard: ({ context }) =>
              !context.timeConstraints.has(context.currentOrder?.unit || ''),
            actions: 'notifyOrderComplete',
          },
          {
            target: 'active',
            actions: 'notifyOrderFailed',
          },
        ],
      },
    },

    // New state: Processing intel and reconnaissance
    processingIntel: {
      invoke: {
        src: 'analyzeIntelligence',
        input: ({ context }) => ({
          reports: context.intelReports,
        }),
        onDone: {
          target: 'active',
          actions: 'updateIntel',
        },
        onError: {
          target: 'active',
          actions: 'generateSitrep',
        },
      },
    },

    // New state: Supply shortage handling
    supplyShortage: {
      on: {
        PROCESS_SUPPLIES: [
          {
            target: 'active',
            guard: ({ context }) => {
              // Check if any unit has adequate supplies
              return Array.from(context.supplyStates.values()).some(
                (supply) => supply.ammunition > 20 && supply.fuel > 20,
              );
            },
          },
        ],
      },

      after: {
        5000: {
          // Wait 5 seconds for potential resupply
          target: 'active',
          actions: 'generateSitrep',
        },
      },
    },

    // New state: Communication blackout
    communicationBlackout: {
      entry: 'jamCommunications',

      on: {
        COMMUNICATION_RESTORED: {
          target: 'active',
          actions: 'restoreCommunications',
        },
      },

      after: {
        10000: {
          // Auto-restore after 10 seconds
          target: 'active',
          actions: 'restoreCommunications',
        },
      },
    },
  },
});
