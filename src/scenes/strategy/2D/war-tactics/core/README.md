Key Features
🎮 Game Loop Control
Tick-based progression with configurable tick duration (default: 5 seconds)
Dual modes: Turn-based (manual advancement) and Real-time (automatic ticking)
Order processing pipeline: Pending → Active → Completed
⏰ Time Management
Mission timer tracking total elapsed time
Turn counter for turn-based mechanics
Configurable tick speed for different game paces
📋 Order Processing
Each tick processes orders through phases:

Process Orders: Move pending orders to active
Execute Orders: Run ECS actions for active orders
Run Simulation: Update all ECS systems
Generate Reports: Create SITREPs and logs
🎯 Game States
Idle: Waiting to start
Initializing: Setting up the game world
Running: Main game loop with substates:
turnBased: Manual tick advancement
realTime: Automatic ticking
processingTick: Processing game logic
Paused: Game suspended
Victory/Defeat: End states
🔄 Key Events
START_GAME: Initialize and begin
SUBMIT_ORDER: Queue new orders
ADVANCE_TICK: Manual tick (turn-based)
END_TURN: Advance turn counter
SET_REAL_TIME: Switch between modes
PAUSE_GAME/RESUME_GAME: Pause control
📊 Victory/Defeat Conditions
Elimination (destroy all enemies)
Occupation (hold objectives)
Survival (survive X turns)
Time limit (complete within time)
📝 Logging & Reports
Comprehensive logging system
SITREP generation each tick
Error handling with recovery options
Usage Example
The machine integrates with your existing ECS system and provides a robust foundation for your text-tactical wargame's progression system!

missionTimeLimit

```bash
import { createActor } from 'xstate';
import { gameLoopMachine } from './machine-two';

// Create the machine with initial context
const gameActor = createActor(gameLoopMachine, {
  input: {
    tickDuration: 3000, // 3-second ticks
    victoryCondition: 'elimination',
    isRealTime: false, // Start turn-based
  }
});

// Start the game
gameActor.start();
gameActor.send({ type: 'START_GAME' });

// Submit orders
gameActor.send({
  type: 'SUBMIT_ORDER',
  order: {
    unit: 'Alpha Squad',
    action: 'move',
    destination: 'Ridge Point'
  }
});

// Advance manually (turn-based)
gameActor.send({ type: 'ADVANCE_TICK' });

// Switch to real-time
gameActor.send({ type: 'SET_REAL_TIME', enabled: true });
```
