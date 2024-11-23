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
