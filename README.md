# Rsbuild Project

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get Started

Start the dev server:

```bash
pnpm dev
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

# Game Development Framework: Multi-Genre Approach

## Game Genres and Technical Architectures

### 3D Genres

#### First-Person and Open World Games

**Core Technologies:**

- three.js - https://threejs.org/
- React Three Fiber - https://r3f.docs.pmnd.rs/
- Rapier Physics - https://rapier.rs/
- Drei - https://drei.docs.pmnd.rs/getting-started/introduction
- XState - https://stately.ai/docs
- TypeScript
- react-compiler - https://react.dev/learn/react-compiler

**Key Implementation Features:**

- Advanced character movement
- Physics-based interactions
- Complex state machines
- Performance-optimized rendering

**Technical Considerations:**

- Realistic terrain generation
- Atmospheric effects
- Dynamic lighting
- Collision detection

#### Space and Exploration Simulators

**Specialized Technologies:**

- Orthographic and perspective camera systems
- Advanced shader techniques
- Procedural generation algorithms
- Complex physics simulations

**Unique Development Challenges:**

- Infinite terrain rendering
- Realistic celestial body interactions
- Performance optimization for large-scale environments

### 2D Genres

#### Platformers and Side-Scrolling Adventures

**Rendering Approach:**

- Sprite-based animation
- Orthographic camera
- Lightweight physics simulation
- Efficient state management

**Implementation Strategies:**

- Use `@react-three/drei` for sprite handling
- Implement frame-independent movement
- Create modular character state machines

#### Top-Down RPGs

**Technical Architecture:**

- Isometric rendering
- Grid-based movement
- Complex interaction systems
- Inventory and character progression management

**Development Focus:**

- Efficient state management with Zustand
- Modular component design
- Performance-optimized rendering

### 2.5D Hybrid Genres

#### Perspective-Shifting Puzzle Games

**Unique Technical Requirements:**

- Dynamic camera perspective changes
- Complex collision detection
- Adaptive rendering techniques
- State-based game mechanics

**Implementation Techniques:**

- Use XState for complex state transitions
- Implement flexible rendering systems
- Create adaptive physics interactions

## Cross-Cutting Technical Foundations

### Core Development Principles

1. **Modularity**: Create reusable, composable game components
2. **Performance**: Optimize rendering and state management
3. **Flexibility**: Support multiple game genres and mechanics
4. **Type Safety**: Leverage TypeScript for robust development

### Recommended Technology Stack

- **Frontend**: React
- **3D/2D Rendering**: React Three Fiber
- **Physics**: Rapier
- **State Management**:
  - Global State: Zustand
  - State Machines: XState
- **Language**: TypeScript

### Performance Optimization Strategies

- Use `InstancedMesh` for multiple objects
- Implement object pooling
- Minimize state transitions
- Use memoization techniques
- Leverage WebGL optimization

### Input and Control Systems

- Support multiple input methods
- Create abstraction layers for controls
- Implement adaptive input handling
- Support keyboard, gamepad, and touch interfaces

## Development Workflow

### Phases of Game Development

1. Concept Definition
2. Core Mechanics Implementation
3. Basic Prototype Creation
4. Feature Expansion
5. Performance Optimization
6. User Experience Refinement

### Debugging and Monitoring

- Use React DevTools
- Implement performance profiling
- Create debug overlays
- Log entity lifecycle events

## Advanced Techniques

### Entity Component System (ECS)

- Use libraries like Miniplex
- Create modular, reusable entities
- Implement efficient entity lifecycle management
- Support dynamic component composition

### Networking and Multiplayer

- Implement client-server architecture
- Create state synchronization mechanisms
- Support real-time multiplayer interactions
- Design latency compensation strategies

## Emerging Development Trends

- Web-first game development
- Cross-platform compatibility
- Performance-optimized rendering
- Modular, composable game architectures

## Conclusion

This framework provides a comprehensive approach to game development across multiple genres, emphasizing flexibility, performance, and modern web technologies. By leveraging React Three Fiber, TypeScript, and advanced state management techniques, developers can create sophisticated, performant games for web platforms.

# Game Development Prompt for AI Assistance: 3D Web Game with React Three Fiber

## Tech Stack

- TypeScript
- React Three Fiber
- Rapier Physics
- XState
- Three.js
- @react-three/drei
- @react-three/postprocessing

## Project Goals

Create a 3D web-based game with the following core requirements:

- Fully typed TypeScript implementation
- 3D character movement
- Physics-based interactions
- State management
- Performance optimization

## Key Components to Develop

### 1. Scene Setup

- Use React Three Fiber Canvas
- Implement lighting (ambient, point, directional)
- Create ground/terrain
- Add infinite grid for debugging
- Implement camera positioning
- FPS monitoring

### 2. Character Development

- 3D model loading (FBX support)
- Texture application
- Physics-based movement
- State machine for movement logic
- Keyboard/input controls
- Ground positioning

### 3. Technical Considerations

- TypeScript strict typing
- Performance optimization
- Error handling
- Debugging techniques
- Cross-browser compatibility

## Specific Implementation Details

### Model Loading

- Support FBX file format
- Texture application methods
- Scale and positioning
- Error handling for model imports

### Movement System

- XState for state management
- Rapier physics integration
- Keyboard control mapping
- Complex movement states (idle, walking, jumping)

### Performance

- FPS monitoring
- Performance scaling
- Adaptive rendering
- Optimization techniques

## Debugging Tools

- Grid helpers
- Light visualization
- Camera helpers
- Performance monitors
- Error boundaries

## Advanced Features to Consider

- Character animations
- Terrain interaction
- Collision detection
- Dynamic lighting
- Post-processing effects

## Coding Standards

- Strict TypeScript typing
- Modular component design
- Performance-conscious implementations
- Comprehensive error handling

## Potential Challenges

- Cross-browser compatibility
- Performance optimization
- Complex state management
- Physics simulation accuracy
- Smooth character movement

## Deliverables

- Fully functional 3D web game
- Modular, reusable components
- Comprehensive documentation
- Performance-optimized implementation

## Additional Context

- Target platform: Web browsers
- Recommended development environment: React
- Focus on smooth, responsive gameplay
- Emphasis on clean, maintainable code

Would you like me to elaborate on any specific aspect of this game development approach?

_-_-

# Comprehensive Game Development Framework Prompt

## 🎮 Technology Stack

- **Frontend**: React
- **3D/2D Rendering**: React Three Fiber
- **Physics**: Rapier
- **Routing**: React Router
- **State Management**:
  - Global State: Zustand
  - State Machines: XState
- **Language**: TypeScript

## 🏗️ Game Engine Core Components

1. Rendering System
2. Physics Engine
3. Input Management
4. Scene Management
5. State Management
6. Event Handling
7. Audio System

## 🎲 Supported Game Genres

### 3D Genres

- First-Person Shooter
- Open World RPG
- Survival Games
- Space Simulators
- Exploration Games

### 2D Genres

- Platformers
- Top-Down RPGs
- Side-Scrolling Adventures
- Puzzle Games
- Roguelikes

### 2.5D Genres

- Isometric RPGs
- Perspective-Shifting Puzzles
- Hybrid Exploration Games

## 🔧 State Management Architecture

### Zustand (Global State)

- Persistent game state
- Game configuration
- Player progress
- Inventory management

### XState (State Machines)

- Complex game logic flows
- AI behavior management
- Level progression
- Game state transitions

## 🚀 Development Principles

1. Modular component architecture
2. Declarative game logic
3. Efficient state management
4. Minimal render calls
5. Cross-platform compatibility

## 💻 Technical Constraints

- Web-based rendering
- Performance optimization
- Browser compatibility
- Lightweight game design

## 🎯 Implementation Strategies

### Rendering Techniques

- Orthographic camera for 2D
- Sprite-based rendering
- WebGL optimization
- Minimal depth rendering

### Physics Integration

- Collision detection
- Rigid body dynamics
- Gravity simulation
- Performance-optimized calculations

## 🤖 LLM Assistance Requirements

### Desired Outputs

- Architectural guidance
- Component structure generation
- Implementation strategies
- Code snippets
- Optimization techniques

### Evaluation Criteria

- Code quality
- Performance efficiency
- Scalability
- Maintainability
- Web compatibility

## 🔍 Development Phases

1. Concept definition
2. Core mechanics implementation
3. Basic prototype
4. Feature expansion
5. Performance optimization
6. User experience refinement

## 🚧 Key Challenges

- Web rendering limitations
- Complex game mechanics
- State synchronization
- Performance bottlenecks
- Cross-browser compatibility

## 📋 Prompt Instructions for LLM

- Provide detailed architectural designs
- Generate modular component structures
- Suggest optimal state management strategies
- Recommend performance optimization techniques
- Help design complex game mechanics
- Ensure type safety and scalability
- Focus on web-first, responsive design

## 🌐 Development Environment

- Primary platform: Modern web browsers
- Performance budget: Lightweight, efficient
- User experience: Responsive, intuitive

# React Three Fiber Character Movement Development Guide

## Core Objectives

- Create a 3D character movement system
- Integrate state management with XState
- Implement robust input handling
- Develop flexible game character controls

## Technical Stack

- React
- React Three Fiber
- XState
- TypeScript
- Three.js

## Movement Architecture Principles

### State Management

- Use XState for movement state tracking
- Remove redundant flags (e.g., `isMoving`)
- Manage movement through state transitions
- Track position, direction, and movement state

### Input Handling Strategies

- Keyboard input detection
- Support multiple input methods
- Create abstraction layers for controls

### Movement Mathematics

- Use `Vector3` for precise positioning
- Normalize movement vectors
- Implement frame-independent movement
- Calculate direction and speed dynamically

## Recommended Libraries

### Input Handling

1. @react-three/drei

   - Keyboard controls
   - Simple input abstraction

2. @react-three/cannon

   - Physics-based movement
   - Collision detection

3. @react-three/rapier
   - Advanced physics simulation
   - Complex movement mechanics

## Development Checklist

### Movement Mechanics

- [ ] Implement basic directional movement
- [ ] Add acceleration/deceleration
- [ ] Support diagonal movement
- [ ] Integrate camera-relative movement

### State Management

- [ ] Create XState movement machine
- [ ] Handle state transitions
- [ ] Manage movement context
- [ ] Implement speed variations

### Input Systems

- [ ] Keyboard input detection
- [ ] Gamepad support
- [ ] Touch/gesture controls
- [ ] Multiple input method handling

### Performance Optimization

- [ ] Use `useFrame` for updates
- [ ] Implement delta time calculations
- [ ] Minimize state transitions
- [ ] Optimize vector calculations

## Advanced Features to Consider

- Collision detection
- Terrain interaction
- Character animations
- Stamina/energy systems
- Directional movement based on camera

## Potential Challenges

- Synchronizing state machine with rendering
- Managing complex movement scenarios
- Handling multiple input methods
- Maintaining performance with complex mechanics

## Learning Resources Needed

- XState documentation
- React Three Fiber tutorials
- 3D movement mathematics
- Game development input handling patterns

## Experimental Approaches

- Combine multiple input libraries
- Create custom input abstraction layers
- Implement adaptive movement systems
- Develop modular movement components

## Code Generation Guidelines

- Prioritize type safety
- Create reusable movement components
- Design for extensibility
- Implement clear separation of concerns

## Prompt Instructions for LLM

When providing implementation details:

1. Show complete, runnable code
2. Explain mathematical concepts
3. Provide multiple implementation approaches
4. Highlight performance considerations
5. Demonstrate integration techniques
6. Suggest best practices and patterns

Would you like me to elaborate on any specific aspect of this development guide?

# React Three Fiber ECS Game Development Prompt

## Project Overview

You are an AI assistant helping to develop a game using React Three Fiber with an Entity Component System (ECS) architecture. Focus on creating a flexible, performant game development approach.

## Core ECS Entity Management Principles

### Entity Lifecycle Management

- Implement methods for:
  - Spawning entities
  - Destroying individual entities
  - Resetting entire game world
- Use imperative world mutation
- Prefer libraries like Miniplex for ECS management

## Performance Optimization Strategies

### Rendering Techniques

- Use `InstancedMesh` for multiple similar objects
- Implement efficient rendering components
- Minimize array reallocations
- Use object pooling

## Key Development Considerations

### Component Design

- Create modular, reusable components
- Separate logic from rendering
- Use composition over inheritance
- Keep components lightweight and focused

### State Management

- Use React hooks for game state
- Implement useEffect for initialization and cleanup
- Create global game state management

## Advanced Techniques

### Alternative Entity Management

1. Visibility-based Management

   - Set `object.visible = false` instead of destroying
   - Reuse existing objects
   - Reduce memory allocation overhead

2. Performance Optimization
   - Implement object pooling
   - Use memoization
   - Minimize re-renders

## Recommended Libraries

- Miniplex (ECS management)
- React Three Fiber
- React Three Drei (utility components)
- Zustand (state management)

## Development Workflow

1. Design component architecture
2. Implement core ECS logic
3. Create modular, reusable entities
4. Optimize rendering performance
5. Implement game-specific mechanics
6. Continuously refactor and improve

## Debugging and Monitoring

- Use React DevTools
- Implement performance profiling
- Create debug overlays for entity states
- Log entity lifecycle events

## Potential Challenges to Address

- Performance with large number of entities
- Complex component interactions
- Efficient state updates
- Rendering optimization

## Next Steps

- Sketch out initial game concept
- Define core entity types
- Create basic ECS infrastructure
- Implement first playable prototype

Would you like me to elaborate on any specific aspect of this game development approach?

Here's a comprehensive prompt for an LLM to help create game engines:

```
You are an expert game engine architect tasked with designing a comprehensive game development framework. Your goal is to create a modular, extensible game engine with the following core components and design principles:

GAME ENGINE ARCHITECTURE SPECIFICATION

1. Core System Components:
- Rendering Engine
- Physics Simulation
- Audio Management
- Input/Control Systems
- Networking Framework
- Scene Management
- Resource Management
- Animation System
- Scripting Engine
- Artificial Intelligence Framework
- User Interface System
- Particle/Effects System
- Camera Management

2. Design Principles:
- Modularity: Each component must be independently configurable
- Performance Optimization
- Cross-Platform Compatibility
- Scalability
- Low Coupling Between Systems
- Efficient Memory Management

3. Rendering Capabilities:
- Support 2D and 3D rendering
- Advanced shader support
- Dynamic lighting
- Post-processing effects
- Texture management
- Multiple render pipeline options

4. Physics Simulation Requirements:
- Realistic collision detection
- Gravity and force simulations
- Rigid body dynamics
- Soft body physics
- Particle physics
- Configurable physical properties

5. Networking Specifications:
- Client-server architecture
- Real-time state synchronization
- Latency compensation
- Multiplayer support
- Secure connection protocols

6. AI and Behavior Systems:
- Behavior tree implementation
- Pathfinding algorithms
- Decision-making frameworks
- Adaptive NPC intelligence
- Scripted and emergent behaviors

7. Performance Considerations:
- Multi-threading support
- GPU acceleration
- Efficient memory allocation
- Asset streaming
- Level of Detail (LOD) management

8. Development Tools:
- Visual scene editor
- Asset pipeline
- Debugging utilities
- Performance profiling
- Remote configuration

9. Scripting and Extensibility:
- Support multiple scripting languages
- Hot-reloading capabilities
- Event-driven architecture
- Plugin system
- Reflection and introspection

10. Platform Targets:
- PC (Windows, macOS, Linux)
- Mobile (iOS, Android)
- Console (PlayStation, Xbox, Nintendo)
- Web platforms
- VR/AR environments

IMPLEMENTATION GUIDELINES:
- Prioritize clean, modular code architecture
- Use design patterns like Component, Observer, State
- Implement robust error handling
- Create comprehensive documentation
- Design with future expansion in mind

Develop a game engine framework that balances technical complexity with developer usability, enabling creators to focus on game design rather than low-level technical challenges.
```

This prompt provides a comprehensive, structured approach to game engine design, covering technical specifications, architectural principles, and implementation guidelines. It can be used to guide an LLM in generating detailed design documents, code structures, or architectural recommendations for game engine development.

Here's a comprehensive prompt for an LLM to help build a 2D game using React Three Fiber:

```
Game Development Prompt: 2D Game with React Three Fiber

Project Goal:
Create a 2D game using React Three Fiber, focusing on sprite-based character and game mechanics.

Technical Stack:
- React Three Fiber
- React Three Drei
- Rapier.js (physics)
- Zustand (state management)
- TypeScript (optional but recommended)

Key Development Requirements:
1. Sprite-Based Character System
- Implement multi-directional sprite animations
- Support movement and idle states
- Use sprite sheets for efficient rendering
- Handle keyboard/input events

2. Game Mechanics to Implement:
- Character movement
- Basic collision detection
- State management for game progress
- Simple game loop

3. Rendering Approach:
- Use orthographic camera
- Optimize for 2D rendering
- Minimize performance overhead

Specific Implementation Questions:
- How to create sprite animations?
- What's the best way to handle character movement?
- How to manage game state?
- Techniques for collision detection?

Constraints:
- Web-based game
- Performance-optimized
- Responsive design
- Cross-browser compatibility

Desired Outcome:
A fully functional 2D game prototype with:
- Animated sprite character
- Basic movement mechanics
- Simple game loop
- Clean, modular React component structure

Specific Areas Needing Guidance:
- Sprite sheet management
- Input handling
- Physics integration
- State management strategies

Additional Context:
- Prefer lightweight, performant solutions
- Minimize external dependencies
- Focus on clean, readable code
- Prioritize web standards and modern React practices

Potential Game Concepts:
- Top-down RPG
- Platformer
- Simple adventure game
- Puzzle game

Preferred Development Approach:
- Incremental development
- Component-based architecture
- Modular game systems

Technical Preferences:
- Hooks-based implementation
- Functional components
- TypeScript type safety
```

This prompt encapsulates our entire discussion, providing a comprehensive overview of building a 2D game with React Three Fiber. It includes technical requirements, implementation strategies, and specific areas needing development guidance.

Here's a comprehensive prompt capturing our discussion on modern game development architecture:

````markdown
# Game Development Architecture Prompt

## Core Architectural Principles

- Use composition over inheritance
- Implement functional programming techniques
- Utilize signals and state machines
- Focus on runtime behavior flexibility
- Prioritize modular, reusable component design

## Key Design Patterns

1. Behavior Composition

   - Define behaviors as pure functions
   - Use type-safe interfaces
   - Allow runtime behavior swapping
   - Minimize class-based complexity

2. Event-Driven Architecture

   - Create centralized event bus
   - Implement decoupled event handlers
   - Support dynamic event registration
   - Enable seamless state transitions

3. State Management
   - Use immutable state updates
   - Implement functional state reducers
   - Support dynamic behavior injection
   - Minimize side effects

## Technical Implementation Strategies

- Leverage TypeScript for type safety
- Use functional programming principles
- Create behavior factories
- Implement pure update functions
- Support runtime component swapping

## Performance Considerations

- Use lightweight, pure functions
- Minimize object creation
- Leverage functional composition
- Implement efficient state updates
- Use memoization where appropriate

## Advanced Techniques

- Implement finite state machines
- Create behavior middleware
- Support dynamic behavior graphs
- Enable complex state transitions
- Provide debug and replay capabilities

## Technology Stack Recommendations

- React Three Fiber
- TypeScript
- Zustand/Redux for state management
- Functional reactive programming libraries

## Development Workflow

1. Define clear behavior interfaces
2. Create pure behavior functions
3. Implement flexible state management
4. Support runtime behavior injection
5. Optimize for performance and flexibility

## Anti-Patterns to Avoid

- Deep inheritance hierarchies
- Stateful, side-effect-heavy components
- Tightly coupled game logic
- Imperative state mutations

## Key Principles

- Composition > Inheritance
- Immutability
- Pure Functions
- Dynamic Behavior Injection
- Type Safety

Would you like me to elaborate on any specific aspect of this game development architecture approach?

This prompt encapsulates our discussion, providing a comprehensive guide for implementing a modern, flexible game development architecture using functional programming and composition principles.

## React Three Fiber 3D Game Development Prompt

### Project Scope: 3D Game with Realistic Terrain and Atmospheric Effects

**Terrain Generation Objectives:**

- Create a realistic, detailed 3D map
- Implement advanced displacement mapping
- Add atmospheric fog for environmental depth

### Technical Implementation Guide

#### 1. Terrain Generation

```prompt
I'm building a 3D game in React Three Fiber and need a comprehensive terrain generation strategy. Provide a detailed approach that includes:

- Displacement map creation techniques
- Best practices for terrain texture generation
- Recommended data sources for elevation models
- Optimal geometry subdivision strategies
- Performance optimization for large-scale terrain rendering

Specific requirements:
- Use Digital Elevation Models (DEMs)
- Support 10-meter resolution terrain data
- Implement dynamic displacement mapping
- Ensure smooth rendering with 512-1024 vertex subdivisions
```
````

#### 2. Atmospheric Fog Implementation

```prompt
Design an advanced atmospheric fog system for a React Three Fiber 3D game environment that:

- Creates realistic depth and distance perception
- Supports dynamic fog color and density
- Implements depth-based fog rendering
- Optimizes performance for large outdoor scenes

Technical specifications:
- Use exponential fog falloff
- Match fog color to environment lighting
- Support custom shader-based fog effects
- Provide configurable near/far distance parameters
- Implement smooth color transitions

Recommended techniques:
- Post-processing fog effects
- Custom shader fog implementation
- Performance-optimized rendering strategies
```

#### 3. Map Integration Approach

```prompt
Develop a comprehensive map integration strategy for a React Three Fiber 3D game, focusing on:

- Terrain data sourcing and processing
- Map rendering techniques
- Integration with geospatial libraries
- Performance optimization for large-scale environments

Key components to address:
- Texture preparation workflow
- Coordinate system management
- Dynamic terrain loading
- Support for real-world geographical data
- Seamless rendering across different scale levels
```

### Development Toolkit

**Essential Libraries:**

- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/postprocessing`
- `three.js`

**Recommended Tools:**

- QGIS for terrain data processing
- Blender for texture refinement
- Online height map converters

### Performance Optimization Strategies

- Use lower resolution for distant terrain
- Implement level-of-detail (LOD) rendering
- Optimize shader complexity
- Manage vertex count dynamically

### Advanced Considerations

- Support procedural terrain generation
- Implement runtime texture modifications
- Create flexible, scalable map rendering system

### Deliverable Expectations

- Photorealistic terrain rendering
- Smooth atmospheric effects
- Performant map generation
- Flexible, modular implementation

## PROMPT INSTRUCTIONS FOR AI ASSISTANCE

When generating game development solutions:
Provide complete, runnable code snippets
Explain underlying technical and mathematical concepts
Offer multiple implementation approaches
Highlight performance optimization techniques
Demonstrate system integration strategies
Suggest best practices and design patterns
Consider cross-platform compatibility
Prioritize developer experience and code maintainability
