import { createActor } from 'xstate';
import {
  gameLogicMachine,
  initializeUnitPersonality,
  initializeUnitSupplies,
} from './machine-logic';
import { parseCommand } from './parser';

/**
 * TTW Game Session Demo
 * Demonstrates the enhanced Text-Tactical Wargame features
 */

export class TTWGameSession {
  private actor: any;
  private unitNames = ['Alpha', 'Bravo', 'Charlie', 'Delta'];

  constructor() {
    this.initializeSession();
  }

  private initializeSession() {
    // Initialize unit supplies and personalities
    const supplyStates = new Map();
    const unitPersonalities = new Map();

    this.unitNames.forEach((unitName) => {
      supplyStates.set(unitName, initializeUnitSupplies(unitName));
      unitPersonalities.set(unitName, initializeUnitPersonality('Infantry'));
    });

    // Create the enhanced machine with TTW features
    this.actor = createActor(gameLogicMachine, {
      input: {
        gameWorld: null,
        victoryCondition: 'elimination',
        supplyStates,
        unitPersonalities,
        communicationStatus: 'clear',
        intelReports: [],
        sitReps: [],
        reconAssets: [
          { id: 'uav-1', type: 'uav', location: 'base', status: 'ready' },
          {
            id: 'scout-1',
            type: 'scout',
            location: 'ridge-2',
            status: 'active',
          },
        ],
      },
    });

    this.actor.start();
  }

  /**
   * Process a natural language command using the parser
   */
  issueCommand(commandText: string): { success: boolean; response: string } {
    console.log(`\n🎯 COMMAND: ${commandText}`);

    const parsedOrder = parseCommand(commandText);

    if (!parsedOrder) {
      return {
        success: false,
        response:
          'Command not recognized. Try: "move Alpha to Ridge-3" or "attack Enemy-1 with Bravo"',
      };
    }

    console.log(`📋 PARSED ORDER:`, parsedOrder);

    // Send to enhanced machine
    this.actor.send({ type: 'VALIDATE_ORDER', order: parsedOrder });

    // Get the latest SITREPs
    const context = this.actor.getSnapshot().context;
    const latestSitRep = context.sitReps[context.sitReps.length - 1];

    return {
      success: true,
      response: latestSitRep?.content || 'Order processed',
    };
  }

  /**
   * Simulate enemy intel reports
   */
  simulateIntelReport(
    source: 'uav' | 'scout' | 'sigint',
    findings: string,
    location?: string,
  ) {
    const confidence = {
      uav: 90,
      scout: 75,
      sigint: 60,
    }[source];

    console.log(`\n📡 INTEL REPORT [${source.toUpperCase()}]: ${findings}`);

    this.actor.send({
      type: 'UPDATE_INTEL',
      source,
      confidence,
      content: findings,
      location,
    });

    return this.getLatestIntel();
  }

  /**
   * Simulate communication jamming
   */
  jamCommunications() {
    console.log('\n📵 COMMUNICATIONS JAMMED');
    this.actor.send({ type: 'COMMUNICATION_JAMMED' });
  }

  /**
   * Restore communications
   */
  restoreCommunications() {
    console.log('\n📶 COMMUNICATIONS RESTORED');
    this.actor.send({ type: 'COMMUNICATION_RESTORED' });
  }

  /**
   * Simulate recon mission
   */
  deployRecon(type: 'uav' | 'scout', location: string): string {
    const findings = [
      'No enemy activity detected',
      'Light enemy presence observed',
      'Heavy enemy fortifications identified',
      'Enemy patrol routes mapped',
      'Supply convoy spotted',
    ][Math.floor(Math.random() * 5)];

    console.log(`\n🔍 RECON DEPLOYED: ${type.toUpperCase()} to ${location}`);

    this.actor.send({
      type: 'RECON_REPORT',
      source: type,
      location,
      findings,
    });

    return findings;
  }

  /**
   * Advance game time and process systems
   */
  advanceTick() {
    console.log('\n⏰ ADVANCING GAME TICK');

    this.actor.send({
      type: 'GAME_LOOP_TICK',
      context: {
        deltaTime: 100,
        turnCount: Math.floor(Date.now() / 10000), // Simple turn counter
        gameWorld: null,
      },
    });

    // Show supply status
    this.showSupplyStatus();
  }

  /**
   * Get current SITREPs
   */
  getSitReps(): any[] {
    return this.actor.getSnapshot().context.sitReps;
  }

  /**
   * Get latest intel reports
   */
  getLatestIntel(): any {
    const intel = this.actor.getSnapshot().context.intelReports;
    return intel[intel.length - 1];
  }

  /**
   * Show current supply status for all units
   */
  showSupplyStatus() {
    const context = this.actor.getSnapshot().context;
    console.log('\n📦 SUPPLY STATUS:');

    context.supplyStates.forEach((supply: any, unitName: string) => {
      const status =
        supply.ammunition < 20 ? '🔴' : supply.ammunition < 50 ? '🟡' : '🟢';
      console.log(
        `  ${status} ${unitName}: Ammo ${supply.ammunition}%, Fuel ${supply.fuel}%, Morale ${supply.morale}%`,
      );
    });
  }

  /**
   * Show recent SITREPs formatted as military reports
   */
  showSitReps(count: number = 5) {
    const sitReps = this.getSitReps().slice(-count);

    console.log('\n📋 RECENT SITREPS:');
    sitReps.forEach((report) => {
      const urgency =
        report.severity === 'critical'
          ? '🚨'
          : report.severity === 'warning'
            ? '⚠️'
            : 'ℹ️';
      console.log(`  ${urgency} [${report.timestamp}] ${report.content}`);
    });
  }

  /**
   * Demonstrate full TTW scenario
   */
  async demoScenario() {
    console.log('🎮 WAR TACTICS - Text-Tactical Wargame Demo');
    console.log('='.repeat(50));

    // 1. Issue movement commands
    console.log('\n📍 PHASE 1: DEPLOYMENT');
    this.issueCommand('move Alpha to Ridge-3 before dawn under radio silence');
    this.issueCommand('move Bravo to Valley-2');

    // 2. Deploy reconnaissance
    console.log('\n🔍 PHASE 2: RECONNAISSANCE');
    this.deployRecon('uav', 'enemy-sector');
    this.simulateIntelReport(
      'sigint',
      'Radio chatter indicates enemy movement',
      'ridge-4',
    );

    // 3. Advance time to process supplies
    this.advanceTick();

    // 4. Simulate communication issues
    console.log('\n📵 PHASE 3: COMMUNICATION DISRUPTION');
    this.jamCommunications();
    this.issueCommand('attack Enemy-1 with Charlie'); // This should show degraded communication effects

    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.restoreCommunications();

    // 5. Show final status
    console.log('\n📊 FINAL STATUS:');
    this.showSupplyStatus();
    this.showSitReps();

    return {
      sitReps: this.getSitReps(),
      intelReports: this.actor.getSnapshot().context.intelReports,
      communicationStatus: this.actor.getSnapshot().context.communicationStatus,
    };
  }
}

// Example usage
if (require.main === module) {
  const game = new TTWGameSession();
  game.demoScenario().then((result) => {
    console.log('\n✅ Demo completed!');
    console.log(
      `Generated ${result.sitReps.length} SITREPs and ${result.intelReports.length} intel reports`,
    );
  });
}
