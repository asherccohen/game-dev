# WAR TACTICS – Product Requirements Document

## 📘 Overview

**WAR TACTICS** is a new genre of military strategy game: a **Text‑Tactical Wargame (TTW)**. It removes all graphical or map-based gameplay in favor of **language-driven tactical command**. Players issue structured or natural-language orders, receive simulated battle results, and adapt to fog-of-war, morale shifts, and logistical pressure—all through textual interaction.

---

## 🎯 Core Goals

* Design a **tactical simulation game** playable without maps or visuals
* Focus on **squad-level command**, intel interpretation, and decision-making
* Build around **asynchronous play**, **text interfaces**, and **emergent outcomes**
* Launch cross-platform, with CLI, web, mobile, or even chatbot UIs

---

## 🎮 Gameplay Mechanics

### Key Features

| Feature                | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| **Textual Commands**   | Input actions via structured or natural language            |
| **World Simulation**   | Game engine resolves orders based on terrain, intel, morale |
| **No UI Dependency**   | No grids, maps, or sprites—only descriptive reports         |
| **Ticks + Fog of War** | Time advances in turns with imperfect information           |
| **Autonomous Units**   | Units may adapt, fail, or refuse orders dynamically         |

---

## 📦 Feature Modules

### 1. Tactical Command Interface

Players write directives such as:

```bash
> Move Alpha to Ridge-3 before dawn under radio silence
> Establish overwatch on convoy route
> Delay retreat until Bravo confirms extraction
```

These are parsed into:

```ts
{
  unit: "Alpha",
  action: "move",
  destination: "Ridge-3",
  time_constraint: "before 0600Z",
  modifiers: ["stealth"]
}
```

### 2. Simulation Engine

Each tick simulates:

1. **Preparation** – Movement, recon, setup
2. **Contact** – Engagement triggers
3. **Combat** – Battle mechanics
4. **Logistics** – Supplies, comms, delays
5. **Morale** – Panic, retreat, refusal
6. **Output** – Player reports

Text-based outputs:

```bash
[0530Z] UNIT FOXTROT: Ambushed patrol near Crossroads. 3 hostiles down. One casualty. Holding position.
```

### 3. Units & World State

* Units: Infantry, Recon, Armor, Engineers, Artillery, UAV
* Traits: morale, supplies, readiness, initiative
* Terrain: abstracted zones ("Ridge", "Bridgepoint", "Sector D5")
* World described in logs, not visualized

### 4. Game Modes

| Mode                 | Description                                    |
| -------------------- | ---------------------------------------------- |
| **Skirmish**         | 2–4 players in short-form tactical matches     |
| **Campaign**         | Narrative PvE missions across linked scenarios |
| **Persistent World** | Long-form territory-based grand campaign       |
| **Duels**            | Real-time or asynchronous PvP                  |

---

## 🧠 Genre Definition: "Directive-Driven Tactical Sim"

| Element         | Description                             |
| --------------- | --------------------------------------- |
| **Input**       | Natural or structured command           |
| **Output**      | SITREPs, logs, and field reports        |
| **Uncertainty** | Fog of war, misintel, weather           |
| **Autonomy**    | Units act/react based on internal state |
| **Strategy**    | Deception, logistics, flanking, timing  |

---

## 🧩 Simulation Breakdown

### Order Parsing

* Language → structured directive
* Intent tree generation
* Sequenced sub-actions

### State Management

* Zone-based abstract terrain
* Tick-based clock (e.g., 5–15 min steps)
* Global context: weather, radio jamming, delays

### Combat Resolution Factors

* Firepower ratio
* Initiative & surprise
* Cover & terrain bonuses
* Fatigue, morale, experience
* Support (e.g., artillery or air)

### Reports

All player feedback is via text:

* `"SIGINT: Intercepted chatter indicates movement east of Ridge"`
* `"ALPHA is pinned down. Ammunition low."`

---

## 🔁 Gameplay Loop

1. Player receives briefing / intel
2. Issues commands
3. Sim tick processes orders
4. Logs & SITREPs generated
5. Player re-assesses and adjusts
6. Loop continues until victory/defeat/abort

---

## 🛠 Optional Systems

* **Signal Jamming**: orders may delay, garble, or fail
* **Commander AI**: traits per squad (cautious, aggressive)
* **PsyOps**: false intel, misinformation
* **Bandwidth Constraint**: limited # of orders per tick
* **Doctrine/Tech Trees**: unlocks for recon, EW, advanced tactics

---

## 🗺 Inspirations

* *Invisible Inc* (uncertainty + planning)
* *Dwarf Fortress – Adventure Mode* (simulation over UI)
* *Command: Modern Operations* (realistic warfare logic)
* PBEM / Forum-based wargames
* Real-world military command structure

---

## ✅ Differentiation

| Category    | TTW Stance                     |
| ----------- | ------------------------------ |
| UI          | Text only                      |
| Maps        | None                           |
| Actions     | Language/commands              |
| Output      | Logs, dispatches, SITREPs      |
| Multiplayer | Async + real-time optional     |
| Graphics    | None or symbolic               |
| Feel        | Narrative strategy + intel ops |

---

## 🧪 Roadmap

### Phase 1 – MVP

* Parser for commands
* Engine with movement/combat/morale logic
* CLI or chatbot interface
* One PvE scenario (e.g., urban extraction)

### Phase 2 – Core Game

* Tick-based multiplayer backend
* Command grammar refinement
* Mission scripting (templated YAML or JSON)
* Report generator with confidence scoring

### Phase 3 – Meta Systems

* Commander XP, upgrades
* Replay log viewer
* Mission builder / editor
* Alliance system and grand campaign mode

---

## 🧠 Next Priorities

* Design command grammar
* Define unit schema and traits
* Build sample tick: input → sim → log output
* Create a few reusable terrain zones & encounters
* Begin CLI prototype or chatbot integration

---

## 📌 Existing Games (Reference Only)

* *Ultimate Warfare*
* *Ambroid*, *Promisance*, *Earth-2025*
* *Naked War*
* *Xconq*
* *Door Kickers 2*

All have partial overlaps, but none hit the mark of TTW: deep tactical decision-making via command interface with no visual layer.

I’ll walk you through how the game logic flows from command to outcome, and then outline what influences the simulation at each stage.


---

🔄 Command-to-Outcome Pipeline (Game Tick Lifecycle)

Let’s break down what happens when a player issues a command and how the engine turns that into game state + output.

1. Command Issued

Player sends something like:

> Move Alpha to Ridge-3 before dawn under radio silence

2. Parsing + Intent Extraction

Command is parsed into a structured directive:

{
  unit: "Alpha",
  action: "move",
  destination: "Ridge-3",
  time_constraint: "before 0600Z",
  modifiers: ["stealth"]
}

This parsing phase involves:

Tokenization (semantic segmentation)

Entity extraction (units, objectives, time)

Intent classification (move, attack, hold, etc.)

Modifier interpretation (e.g., "radio silence" implies comms delay)



---

3. Action Queueing / Scheduling

Parsed directive is added to a tick-based scheduler.

tickEngine.queueAction({
  unitId: "Alpha",
  action: "move",
  targetZone: "Ridge-3",
  startTick: currentTick,
  conditions: ["radio_silence"],
  deadline: tickBefore(0600Z),
});


---

4. Tick Processing Loop

Each game tick (e.g., every 5 min simulated), the engine runs:

a. Prep Phase

Units start executing commands (e.g., Alpha begins moving)

Delay modifiers (e.g., stealth = slower)

Logistics check (e.g., enough fuel, no blocked roads)

Signal jamming may garble or delay commands


b. Contact Detection

Based on proximity, recon, or sound, opposing units may become aware of each other

Random rolls + modifiers determine whether contact occurs this tick


c. Combat Phase

If contact:

Calculate surprise/initiative (who saw whom first)

Check terrain bonuses

Resolve combat round(s)


Example:

resolveCombat({
  attacker: "Alpha",
  defender: "Foxtrot",
  terrain: "Ridge",
  modifiers: ["stealth", "high_ground"],
});

d. Morale + Behavior Checks

Is unit low on ammo?

Are they pinned or flanked?

What’s their morale and personality trait?

Trigger possible refusal to follow next command or initiate retreat


e. Logistics Phase

Ammo, supplies, medical evac

Resupply progress if initiated in previous ticks

Communications: were new orders received?



---

5. Simulation State Update

World state is updated:

Zones are marked with presence or conflict

Unit positions adjusted

Morale/fatigue values updated



---

6. Generate Output

Player receives:

[0545Z] ALPHA reached Ridge-3 under cover of darkness. No enemy contact.
[0550Z] FOXTROT reports spotting movement east. Possible UAV pinged.

Generated using a templated message system that factors:

Outcome

Confidence (was the info partial or intercepted?)

Style (based on player preferences or mission tone)



---

🧠 Key Factors that Influence the Simulation

Here are the primary inputs to the simulation engine each tick:

🎯 Command Factors

Action type: move, recon, engage, extract

Modifiers: stealth, speed, delay, deception

Constraints: time, conditions, dependencies


🪖 Unit Traits

Morale, fatigue, experience

Loadout (weapons, gear)

Commander behavior (aggressive, cautious, defiant)


🌍 World State

Zone traits (e.g., "Ridge-3" = high ground, low visibility)

Time of day (e.g., "before dawn" = lower visibility)

Weather (rain = reduced mobility and recon)

Fog of war / jamming zones


🔫 Opponent Behavior

Enemy AI may:

Patrol

Ambush

Delay movement

Fall back


Your actions influence theirs (especially in PvP or adaptive AI)



---

🧱 Summary: Data Flow from Command to Result

Command (Text/NL)
   ↓
Parse → Structured Intent
   ↓
Queue Action in Tick Scheduler
   ↓
Game Tick Runs
   ↓
→ Prep → Contact → Combat → Morale → Logistics
   ↓
Update Unit & World State
   ↓
Output: Logs, Reports, Alerts


---
Before involving LLMs, you can build deterministic game logic that simulates realistic outcomes based on structured commands and autonomous systems.


---

🧠 Foundational Plan (No LLMs Yet)

You're right: two primary triggers exist:

1. Player-driven events (intentional, parsed commands)


2. System-driven events (world state, time progression, enemy AI)



We can build the simulation core that handles both using deterministic logic — structured rules, ECS, and state machines.


---

✅ Step-by-Step Plan

1. Define the Game State

Start by modeling:

Units: who they are, where they are, what they’re doing

Zones: what terrain they represent, who controls them

World Context: time, weather, global modifiers

Command Queue: pending directives waiting to execute


Example (simplified):

type Unit = {
  id: string;
  position: string;
  status: "idle" | "moving" | "engaging" | "retreating";
  morale: number;
  fatigue: number;
  orders: Command[];
};

type Command = {
  action: "move" | "attack" | "hold" | "recon";
  target: string;
  modifiers?: string[];
  startTick: number;
  deadlineTick?: number;
};


---

2. Build the Game Loop (Tick Engine)

Each tick (e.g., 5 min), you’ll process:

Player Commands

Environmental Events

AI/Enemy Decisions

State-based Reactions (e.g., morale loss → disobey)


Structure:

function gameTick(currentTick: number) {
  handlePlayerCommands(currentTick);
  handleEnvironmentEvents(currentTick);
  handleEnemyAI(currentTick);
  updateMoraleAndSupplies();
  resolveCombatIfTriggered();
}


---

3. Handle Player Commands

Start with command resolution:

function handlePlayerCommands(tick: number) {
  for (const unit of allUnits) {
    const cmd = unit.orders.find(c => c.startTick === tick);
    if (!cmd) continue;

    switch (cmd.action) {
      case "move":
        resolveMovement(unit, cmd);
        break;
      case "attack":
        queueCombat(unit, cmd.target);
        break;
      case "hold":
        // Defensive bonuses, overwatch mode
        break;
      // Add more as needed
    }
  }
}


---

4. Environmental or System-Driven Triggers

This is where fog of war, weather, morale dropouts come in.

function handleEnvironmentEvents(tick: number) {
  // Change weather
  // Block a road
  // Reduce visibility in certain zones
  // Broadcast intercepted intel
}


---

5. Enemy Logic / AI

This can be rule-based for now. Later: LLM-augmented strategies.

function handleEnemyAI(tick: number) {
  for (const enemy of enemyUnits) {
    if (enemy.status === "idle" && seesPlayer(enemy)) {
      enemy.orders.push({
        action: "attack",
        target: getPlayerUnitInSight(enemy),
        startTick: tick,
      });
    }
  }
}


---

6. Simulate Emergent Reactions

Your system should also be able to trigger internal state-based reactions, like morale loss causing panic.

function updateMoraleAndSupplies() {
  for (const unit of allUnits) {
    if (unit.fatigue > 80 || unit.morale < 30) {
      maybePanic(unit);
    }
  }
}

function maybePanic(unit: Unit) {
  const chance = 100 - unit.morale;
  if (Math.random() * 100 < chance) {
    unit.status = "retreating";
    generateLog(`${unit.id} begins retreat under stress.`);
  }
}


---

🔄 Design Summary: Command vs Emergent Systems

Trigger Type	Source	Handler	Example Outcome

Command	Player input	handlePlayerCommands	Alpha starts moving to Ridge
Tick Event	World model	handleEnvironmentEvents	Rain begins, visibility drops in all valleys
Enemy AI	Autonomous units	handleEnemyAI	Hostile unit flanks Alpha
State Decay	Unit state	updateMoraleAndSupplies	Bravo refuses to push forward, fatigue high



---

✅ What This Gets You (Before LLMs)

A predictable simulation engine

Hooks for when and where to bring in adaptive behavior

Easily testable game logic

Foundation for recording logs/SITREPs from unit state changes



---

🧩 Next Logical Steps

If you're building this now:

1. Define unit state + orders in memory


2. Build a simple tick engine + CLI output (print logs per tick)


3. Add scripted enemy behavior or random events


4. Create a few test commands (e.g., move → contact → panic)


5. Later: swap in LLMs only for text generation or fuzzy interpretation

----

