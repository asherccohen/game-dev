# WAR TACTICS

## 🎯 Ideation: A New Genre

Let’s imagine a new genre: **Text‑Tactical Wargame (TTW)**.

### Core Pillars

- **Minimal or ASCII‑level UI**
  No sprites or maps. Everything is text or simple symbols. E.g. ASCII grid, or turn‑based command interface.

- **Tactical Simulation Engine**
  Focus strictly on operations: unit command, logistics, terrain effects abstracted. No base building, just squad or small unit migrations and engagements.

- **Asynchronous Multiplayer & PBEM Hybrid**
  Players issue orders by text or API (web or CLI), then simulation runs and returns results later. Keeps pace manageable.

- **Resource‑light & cross‑platform**
  Light frontend (web, terminal, mobile via chatbots). Backend could run in Remix‑Run or Fastify + Postgres.

### Structure & Modes

- **Scenario Library**
  Pre‑built historical or fictional battles you can replay in text form—e.g. defensive mountain pass, river crossing, urban raid.

- **Squad/Sector Command**
  Command a handful of units; use commands like `move sectorA sectorB`, `fire artillery zone‑1`, `scan`, `ambush zone‑3`.

- **Fog of War & Intel**
  Reports are oblique (“scouts report enemy presence east sector”) unless you invest in recon or UAV.

- **Turn Tick Mechanic**
  You get limited action points per tick (daily or hourly). Encourages planning, not grinding.

- **Community & Competition**
  Alliances, clans, territory zones. Turn-based but can support real-time duels.

---

## ⚙️ Feature Breakdown

### 1. **Interface / UI**

- ASCII grid (e.g. 10×10 sectors).
- Units represented by symbols (e.g. `I` infantry, `T` tank).
- Text logs describe outcomes: “Your platoon engaged enemy at sector C3—two casualties, enemy withdrew to C4.”

### 2. **Engine Mechanics**

- Units: infantry, armor, recon, artillery, UAV drones.
- Terrain modifiers: forest, hill, marsh.
- Fog/Intel: partial Fog of War with recon investment.
- Sim rules: deterministic or low RNG, with battle resolution based on strength, terrain, flanking.

### 3. **Command Flow**

- **Action Phase**: you issue orders up to your available points per unit/squad.
- **Resolution Phase**: simulation runs after deadline or both players submit.
- **Report Phase**: you get a plaintext log + updated map snapshot.

### 4. **Progression & Meta**

- Persistent account or campaign progress.
- Unit experience, veteran squads (morale, effectiveness).
- Tech tree unlocks: drones, comm upgrades, electronic warfare.

### 5. **Modes**

- Skirmish (2‑4 players).
- PvE: campaigns vs AI, chain of linked missions.
- Grand campaign: persistent world, territories to conquer.

---

## 🧠 Genre Refinement

### Naming & Positioning

- Call it **TTW (Text‑Tactical Wargame)** or **T‑TAC War**.
- “A tactical wargame delivered through text, built for deep strategy, accessible anywhere.”

### Differentiators from existing games

| Feature     | Existing                       | Proposed                                                      |
| ----------- | ------------------------------ | ------------------------------------------------------------- |
| UI          | Browser menus, simple drawings | ASCII/grid + log only                                         |
| Graphics    | Minimal pixel art              | Text-only, CLI-friendly                                       |
| Scale       | Empire/economy focus           | Squad-level tactical focus                                    |
| Multiplayer | MMO or PBEM                    | Hybrid asynchronous tactical                                  |
| Platform    | Web/PHP legacy                 | Modern stack: typescript, rtK-query, xstate, tRPC, Remix/Next |
| Deployment  | Browser only                   | Also terminal or Discord/Telegram bots UI                     |

- Almost **no visual representation**
- No ASCII grids, maps, or tiles
- Pure **textual or symbolic output**
- Fully focused on **strategy, tactics, and decision-making**

---

## 🧠 Game Core: Tactical Command by Language

### Game Concept

You’re a **field commander**, **task force leader**, or **special operations director**. You give high-level orders via a command interface (text or predefined structured commands). The system interprets those and simulates outcomes. You get briefings, reports, and intel, all in written or symbolic form.

Imagine:

```bash
> Deploy recon drone to sector Echo
> Ambush convoy along Route 4
> Coordinate artillery strike at gridpoint Lima-2
> Initiate fallback from urban AO by 0400Z
```

The game plays out like a mix of:

- **Military D\&D**: you issue narrative-level commands
- **PBEM Wargaming**: orders submitted, simulation runs
- **Intel/Command Sim**: you only see the battlefield through reports, dispatches, and decoded messages

---

## 📦 Structure: Modular Layers of Complexity

### 1. **World State**

No visible map. World state is described through:

- Named **zones** or **regions** ("Sector Echo", "Bridgepoint", "Ridge 7")
- Temporal anchors ("before 0500Z", "at nightfall")
- Status descriptions ("contested", "reinforced", "no contact")

Example:

```bash
[0415Z] SIGINT: Enemy unit movement detected near Forest Line, estimated platoon strength.
[0430Z] SQUAD CHARLIE: In contact, minor resistance at Crossroads.
```

### 2. **Unit Abstraction**

You never micromanage. Units are:

- Referenced by call signs (`Alpha`, `Foxtrot-2`, `Delta Mobile`)
- Have traits: strength, morale, equipment, mission status
- Have autonomous logic: they can abort, adapt, withdraw

You issue commands like:

```bash
> Task Unit Echo with flanking maneuver via east ridge
```

And get results like:

```bash
[ETA+10] UNIT ECHO: Encountered minefield. Progress halted. Requesting engineers or reroute.
```

### 3. **Command Layer**

Instead of UI inputs, you operate in **natural language** or structured command lines:

Examples:

- `move Alpha to Ridge-3 before dawn, under radio silence`
- `establish overwatch on enemy supply route`
- `coordinate with Lima for timed breach at 0600Z`

These get parsed into:

- **Intent** (movement, action, coordination)
- **Time** (when it happens)
- **Priority/Constraints** (stealth, speed, comms)

### 4. **Simulation Engine**

Each tick (turn):

- Orders resolve based on current state, weather, logistics, terrain, morale, enemy activity
- Outcomes generate **Intel Reports**, **Action Logs**, **Casualty Reports**, **Requests**

No visible feedback—only text results. Example:

```bash
--- SITREP 0530Z ---
UNIT BRAVO encountered entrenched enemy force at CHOKEPOINT 4.
Engaged under heavy fire. Requested CAS. ETA 12 mins.
Alpha proceeding through fallback route Delta.
```

---

## 🎯 Gameplay Loop

1. **Briefing Phase**: You receive mission context, assets, threats.
2. **Command Phase**: You issue orders via structured or natural input.
3. **Resolution Phase**: Sim runs, logs outcomes, units adapt/react.
4. **Intel Phase**: You receive textual reports and make new plans.

Each round gives:

- Fog of war (some info is inaccurate)
- Situational surprises (ambush, weather, unit panic)
- Logistics/supply strain (limited radio, ammo, fuel)

Looking at your test file, I can see your machine processes orders every 100ms when using `ADVANCE_TICK` or `TICK` events. Whether this is "ok" depends on your game's requirements:

## 🎮 **100ms is Generally Fine For:**

- **Turn-based strategy games** (like your war tactics game)
- **Real-time strategy** with moderate pace
- **Simulation games**
- **Most multiplayer games** (under typical network latency)

## ⚡ **When 100ms Might Be Too Slow:**

- **Fast-paced action games** (FPS, racing, fighting games need 16-33ms)
- **Real-time competitive games** requiring frame-perfect timing
- **Games with precise physics simulation**

## 🎯 **For Your War Tactics Game:**

100ms (10 ticks per second) is **perfectly appropriate** because:

1. **Strategic Decision Making**: Players need time to think, not react instantly
2. **Order Processing**: Military commands don't need split-second execution
3. **Network Tolerance**: Allows for network latency in multiplayer
4. **Resource Efficiency**: Less CPU/battery usage than 60fps game loops

## 🔧 **Your Current Implementation is Smart:**

```typescript
// Your machine allows configurable tick duration
tickDuration: 5000,  // Default 5 seconds for turn-based
// But can be set to 100ms for real-time mode

// And you handle both modes:
CHANGE_TICK_SPEED: { actions: 'setTickSpeed' }
```

## 📊 **Common Game Loop Frequencies:**

| Game Type         | Frequency               | Use Case              |
| ----------------- | ----------------------- | --------------------- |
| 16ms (60fps)      | Action/FPS              | Frame-perfect timing  |
| 33ms (30fps)      | Real-time strategy      | Smooth visual updates |
| **100ms (10fps)** | **Turn-based strategy** | **Your use case ✅**  |
| 1000ms (1fps)     | Slow simulation         | Chess, board games    |

## 💡 **Recommendations:**

1. **Keep 100ms for order processing** - it's appropriate for your game type
2. **Consider separate render loop** - UI updates can be 60fps while game logic runs at 10fps
3. **Make it configurable** - let players adjust if they want faster/slower pace
4. **Batch operations** - process multiple orders per tick for efficiency

Your 100ms game loop is well-suited for a tactical strategy game! 🎯

---

## 📘 Example Turn

### Player Turn

```bash
> Dispatch UAV to scan urban zone
> Send Alpha and Charlie to encircle enemy at Substation
> Detonate bridge if contact confirmed
```

### System Response

```bash
[0515Z] UAV scan initiated. Enemy light armor confirmed in north corridor.
[0520Z] ALPHA: Flanking via west alley. No resistance so far.
[0525Z] CHARLIE: Contact. Small arms fire. Holding at corner building.
[0527Z] Engineering charge placed. Standing by for trigger.
```

---

## 🔁 Genre Definition: “Directive-Driven Tactical Sim”

**New Genre Traits:**

| Element     | Description                                            |
| ----------- | ------------------------------------------------------ |
| Input       | Natural or structured command interface                |
| Output      | Textual intel, logs, and field reports                 |
| Visuals     | None or symbolic only                                  |
| Focus       | Decision-making, timing, interpretation, improvisation |
| Players     | Solo or asynchronous multiplayer                       |
| Uncertainty | Fog of war, timing variance, limited comms             |
| Strategy    | High-level ops: maneuver, deception, supply lines      |

---

## 💡 Inspirations (Abstracted)

- **Invisible Inc (but without visuals)**: tension through hidden info, timers
- **Dwarf Fortress (Adventure Mode)**: simulation over presentation
- **Military AI Wargames**: red team/blue team intel cycles
- **Command: Modern Ops**: real-world logic but purely text-delivered

---

## 🎯 Goal

Define a simulation engine that takes high-level **orders**, interprets them into **actions**, and resolves them into **outcomes**, all with uncertainty, constraints, and emergent behavior—purely through **textual feedback**.

---

## 🧩 Simulation Engine Design

We'll break this into components:

### 1. **Order Parsing → Intent Tree**

Each player-issued command becomes a structured **intent**:

```bash
"Move Alpha to Ridge-3 before dawn under radio silence"
→ {
  unit: 'Alpha',
  action: 'move',
  target: 'Ridge-3',
  time_constraint: 'before 0600Z',
  modifiers: ['stealth'],
}
```

This gets normalized into a **directive**, which the engine processes. Complex orders are split into sub-steps (move, observe, hold).

---

### 2. **State Snapshot**

Each tick (say, 5 min or 1 hour) the simulation:

- Reads current world state:
  - unit positions, morale, health, supply, objectives
  - weather, time, known/unknown enemy intel
  - terrain type, line of sight

- Compares it to all **pending orders**
- Evaluates **context-aware feasibility**

---

### 3. **Resolver Passes**

Order resolution happens in **passes** per tick:

| Pass                 | Description                                               |
| -------------------- | --------------------------------------------------------- |
| 1. Preparation       | Units begin actions: move, set up, scout, request support |
| 2. Contact Check     | Any overlapping zones trigger engagements                 |
| 3. Combat            | Firefights, ambushes, artillery, suppression              |
| 4. Logistics         | Fuel, ammo, comms degradation, supplies en route          |
| 5. Morale            | Panic, retreat, loss of cohesion, AI aborts order         |
| 6. Report Generation | Dispatch logs are created for the player                  |

---

### 4. **Combat / Encounter Model**

Not dice-roll heavy. Resolve based on:

- **Force balance** (weapons, squad strength)
- **Initiative** (stealth, recon advantage)
- **Positioning** (cover, flanking)
- **Morale** (exhaustion, cohesion)
- **Intel** (fog of war, wrong target)

📄 Sample combat outcome:

```bash
[0630Z] FOXTROT ambushed convoy on Route-9.
Destroyed 2 vehicles before enemy reacted.
Retreated under mortar fire. One casualty. Ammo depleted.
```

---

### 5. **Emergent Behavior**

Units are semi-autonomous:

- Abort actions if outmatched or isolated
- Re-route around known threats
- Request backup or refuse orders (low morale)
- Execute fallback protocols if cut off

That means your command doesn't always play out 1:1.

Example:

```bash
> Assault power station with Bravo and Delta

→ Bravo encountered heavy fire and stalled.
→ Delta redirected to flank on its own initiative.
→ Bravo now requesting smoke cover to extract.
```

---

### 6. **Fog of War / Misinformation**

Critical to realism. Every report has a **confidence level**:

- “Unconfirmed enemy contact east sector”
- “Visual on enemy armor – likely T-72, range 800m”
- “Intermittent radio traffic suggests movement near ridge”

This gives a **narrative deduction loop**. You infer patterns over time.

---

### 7. **Tick Cycle (Turn Resolution)**

1. Receive new reports
2. Issue next set of orders
3. Engine simulates N minutes/hours forward
4. Generate SITREP/logs
5. Repeat

Example:

```bash
--- TICK 0700Z ---
CHARLIE: No contact. Holding perimeter.
FOXTROT: Mines cleared. Moving north.
UAV: Thermal contacts detected, 2 targets, 1 km west of your position.
HQ: Supplies delayed due to weather.
```

---

## 🛠️ Optional Mechanics to Layer Later

- **Signal Jamming / Electronic Warfare**
  Messages delayed, misrouted, blocked.

- **Psychological Warfare / Rumors**
  False reports affecting enemy morale or yours.

- **Command Pressure / Limited Orders**
  Can only issue X commands per turn based on bandwidth, staff, or HQ pressure.

- **Agent-based Commanders**
  Sub-commanders with personality traits—aggressive, cautious, disloyal, etc.

---

### Memory Management

✅ Cleanup Logic Works: After processing 105 orders, exactly 100 are retained
✅ Most Recent Orders Kept: Alpha1 through Alpha100 (the last 100)
✅ Oldest Orders Dropped: Alpha0 was properly removed by slice(-100)
✅ Memory Management: No unlimited growth of completed orders

✅ Log limiting (50 entries)
✅ SITREP limiting (10 entries)
✅ Completed orders limiting (100 entries)
✅ No memory leaks in long sessions

### COMMAND EXAMPLE

Move Commands

```bash
move Alpha Squad to Ridge Point
move Bravo Squad to Valley Beta before 1200Z
move Charlie Squad to Forest Edge under radio silence
move Delta Squad to High Ground before 1500Z under smoke cover and radio silence
```

Attack Commands

```bash
attack Enemy Squad with Alpha Squad
attack Hostile Unit with Bravo Squad using suppressing fire
attack Enemy Position with Charlie Squad using flanking maneuver and artillery support
```

Defend Commands

```bash
defend Ridge Point with Alpha Squad
defend Valley Beta with Bravo Squad
defend Forest Edge with Charlie Squad
```

Retreat Commands

```bash
retreat Alpha Squad
retreat Bravo Squad to Ridge Point
retreat Charlie Squad to Valley Beta when under heavy fire
retreat Delta Squad when morale low
```

## War Tactics Command Grammar

### Command Syntax Patterns

The war tactics game uses a **natural language parser** (`core/parser.ts`) that converts military commands into structured game actions. All commands follow strict regex patterns for consistency.

### Movement Commands

```bash
# Basic movement
move [Unit] to [Location]
move Alpha Squad to Ridge Point
move Bravo to Valley Beta

# Time-constrained movement
move [Unit] to [Location] before [Time]
move Charlie Squad to Forest Edge before 1200Z
move Delta Squad to High Ground before 1500Z

# Movement with modifiers
move [Unit] to [Location] under [Modifiers]
move Alpha Squad to Ridge Point under radio silence
move Bravo Squad to Valley Beta under smoke cover and radio silence

# Combined constraints
move [Unit] to [Location] before [Time] under [Modifiers]
move Delta Squad to High Ground before 1500Z under smoke cover and radio silence
```

**Regex Pattern**: `/^move\s+([A-Za-z]+(?:\s+Squad)?)\s+to\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)(?:\s+before\s+(\d{4}Z))?(?:\s+under\s+(.+))?$/i`

### Attack Commands

```bash
# Basic attack
attack [Target] with [Unit]
attack Enemy Squad with Alpha Squad
attack Hostile Unit with Bravo Squad

# Attack with tactics
attack [Target] with [Unit] using [Tactics]
attack Enemy Position with Charlie Squad using flanking maneuver
attack Hostile Unit with Bravo Squad using suppressing fire
attack Enemy Position with Charlie Squad using flanking maneuver and artillery support
```

**Regex Pattern**: `/^attack\s+([A-Za-z]+(?:\s+Squad)?)\s+with\s+([A-Za-z]+(?:\s+Squad)?)(?:\s+using\s+(.+))?$/i`

### Defend Commands

```bash
# Positional defense
defend [Location] with [Unit]
defend Ridge Point with Alpha Squad
defend Valley Beta with Bravo Squad
defend Forest Edge with Charlie Squad
```

**Regex Pattern**: `/^defend\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+with\s+([A-Za-z]+(?:\s+Squad)?)$/i`

### Retreat Commands

```bash
# Simple retreat
retreat [Unit]
retreat Alpha Squad

# Retreat to location
retreat [Unit] to [Location]
retreat Bravo Squad to Ridge Point
retreat Charlie Squad to Valley Beta

# Conditional retreat
retreat [Unit] when [Condition]
retreat Delta Squad when morale low
retreat Charlie Squad to Valley Beta when under heavy fire
```

**Regex Pattern**: `/^retreat\s+([A-Za-z]+(?:\s+Squad)?)(?:\s+to\s+([A-Za-z]+(?:\s+[A-Za-z]+)?))?(?:\s+when\s+(.+))?$/i`

### Command Processing Pipeline

1. **Input Normalization**: Trim whitespace, case-insensitive matching
2. **Pattern Matching**: Try each regex pattern in sequence (MOVE → ATTACK → DEFEND → RETREAT)
3. **Data Extraction**: Extract unit names, locations, time constraints, modifiers
4. **Field Normalization**:
   - Locations: lowercase with spaces → hyphens (`Ridge Point` → `ridge-point`)
   - Units: preserve original formatting (`Alpha Squad`)
   - Modifiers: split on "and", lowercase (`smoke cover and radio silence` → `["smoke cover", "radio silence"]`)
5. **Order Structure**: Convert to typed `Order` interface

### Supported Unit Types

- **Infantry Units**: `Alpha Squad`, `Bravo Squad`, `Charlie Squad`
- **Short Names**: `Alpha`, `Bravo`, `Charlie` (automatically normalized)
- **Faction Types**: `friendly`, `hostile`, `neutral`

### Location Naming Conventions

- **Geographic**: `Ridge Point`, `Valley Beta`, `Forest Edge`, `High Ground`
- **Military Grid**: `Ridge-3`, `Zone-Alpha`, `Sector-7`
- **Normalized Format**: All spaces converted to hyphens for internal processing

### Time Constraints

- **Military Time**: `1200Z`, `1500Z`, `0400Z` (Zulu time format)
- **Relative Time**: `before dawn`, `at nightfall` (parsed as modifiers)

### Tactical Modifiers

- **Stealth**: `radio silence`, `under cover`
- **Support**: `smoke cover`, `artillery support`
- **Tactics**: `flanking maneuver`, `suppressing fire`
- **Conditions**: `when morale low`, `when under heavy fire`

### Parser Error Handling

- Returns `null` for invalid commands
- Case-insensitive matching for flexibility
- Validates required fields (unit, destination for moves)
- Graceful degradation for optional parameters

### Integration with State Machine

```typescript
// Terminal UI → Parser → XState Machine
onCommand={(command) =>
  send({
    type: 'SUBMIT_ORDER',
    order: {
      unit: command.unit,
      action: command.action,
      modifiers: command.modifiers,
      destination: command.destination,
      target: command.target,
      time_constraint: command.time_constraint,
    },
  })
}
```

---

## 👣 Next Steps

Want to go deeper into:

- Command grammar?
- How simulation resolves orders?
- Narrative style for intel logs?
- A sample mission pack?
- Example of a full tick execution?
- Order grammar and how players write directives?
- Narrative design of reports/intel/logs?
- Want to sketch some commands or design data model next? Happy to break it down in TypeScript.

## 🛠️ Roadmap Summary

1. Prototype engine: CLI or terminal-first version. Represent sector grid and units.
2. Rule spec: define command grammar, unit data, terrain rules.
3. Build turn execution: command parser → simulation → log output.
4. Minimal web UI: grid + command input + log.
5. Add multiplayer ticks and persistence.
6. Add meta features: progression, recon, tech unlocks.
7. Add community/clan features and PvP leaderboard.

## ✅ Summary

Yes, minimal‑graphic or pure‑text military tactics games exist in niche browser/PBEM space, but nothing with squad‑level tactical depth delivered via ASCII text with modern multiplayer and data‑intensive design. By grounding it in a text‑only interface and focusing on asynchronous tactical simulation, you carve a new genre: **Text‑Tactical Wargame**.

The simulation engine:

- Interprets intent, not raw instructions
- Runs in discrete time steps (ticks)
- Resolves actions through layered passes (movement, contact, combat, morale, logistics)
- Outputs situational text logs based on uncertain, partial information
- Encourages deductive reasoning, improvisation, and layered strategic planning

🎮 Core Components

Game Engine (ECS)

Located in core/ecs.ts
Uses Miniplex for Entity Component System
Manages units, terrain, and game state
Handles game logic like movement and combat

Command System
Located in core/parser.ts
Parses text commands like "Move Alpha to Ridge"
Converts human text into game actions

State Management
Located in core/machine.ts
Uses XState for game state management
Handles turns, combat resolution, and game flow

UI Layer
Located in Terminal.tsx
React-based terminal interface
Shows game output and accepts commands
Styled with Tailwind CSS

📝 Data Structure

Units
Have properties like position, morale, supplies
Can be friendly or hostile
Stored in the ECS world

Terrain
Represents locations like "Ridge Alpha"
Has connections to other terrain
Affects combat and movement

Game State
Tracks current situation
Manages fog of war
Handles turn progression

🔄 Basic Flow

- Player types command in Terminal
- Parser converts text to game action
- State machine processes the action
- ECS updates game world
- Results display in Terminal

All systems properly use the delta time parameter to scale their effects based on elapsed time. This means:

Movement system checks for valid moves (already time-independent)

Combat system:
Morale damage is now per-second (e.g., 10 damage/sec instead of just 10)
Ammunition consumption is time-based (1 unit/sec)

Morale system:
Combat stress is 5 morale loss per second
Idle recovery is 2 morale gain per second

This makes the simulation more realistic and independent of the tick rate.

Error Handling

New error state with retry/reset options
Error logging and recovery
Victory/Defeat Conditions

Three victory conditions: elimination, occupation, survival
Automatic checks after each turn
Final states with appropriate messages
Save/Load System

Save game action with timestamp
Load game capability
Persistance of game state
Turn Management

Turn counter
Turn-based events and logging
Time-based game progression
Enhanced Logging

More detailed system feedback
Error tracking
Game state transitions
The machine now handles:

Game initialization and error recovery
Command processing and execution
Continuous game simulation with the tick system
Victory and defeat conditions
Save/load functionality
Turn management
Comprehensive error handling

Think of it like a text-based chess game, where instead of moving pieces on a board, you're commanding units through text, and the game calculates and describes what happens.

### Test Categories

We'll organize our tests into these categories:

State Machine Tests

State transitions
Command processing
Victory/defeat conditions
Command Parser Tests

Order validation
Command syntax parsing
Error handling
Game World Tests

Unit movement
Combat resolution
Terrain effects
System Tests

Movement system
Combat system
Morale system

### 📌 Existing Examples

- **Ultimate Warfare** – a browser‑based, fully text strategy war game open‑sourced on GitHub. It once had thousands of players; features include turn ticking, resource queues, battle simulation, research, world generation. Designed in PHP originally and ported later ([Reddit][1]).

- **Ambroid**, **Promisance**, **Earth‑2025** – browser text‑based war/conquest games with strategy, economy, online players, minimal UI ([Reddit][2]).

- **Naked War** – turn‑based strategy, play‑by‑email, commanding squads via text only (no realtime graphics) ([Wikipedia][3]).

- **Xconq** – early X‑windows or curses client, multiplayer empire building, text/hex‑based UI, open source system from the 1980s ([Wikipedia][4]).

- **Door Kickers 2: Task Force North** – minimal graphics but tactical real‑time raids; top‑down, small view, few effects. Still graphical though ([scenescoop.com][5]).

So your idea occupies territory that exists in niche browser war games, PBEM (play‑by‑email) strategy, and minimalist indie tactics titles—but there's room to define something new, especially focusing on ultra-light UI and deep tactical-military mechanics.

---

### Marketing

Hey! Quick question—would you be into a tactical war game where you issue military-style commands using just text (like chat or CLI)?
No maps or visuals, just pure strategy, unit control, and battle reports.
Think: “> Move Alpha to Ridge-3 before dawn under radio silence” … then the engine simulates what happens.

It’s async, works on web or mobile, and all the gameplay is through SITREPs and command logs. Basically a war sim for nerds who like tactics and decision-making over graphics.

Curious if that sounds fun to you?
