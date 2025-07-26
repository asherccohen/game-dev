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
