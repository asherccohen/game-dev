# Character Movement Development Guide

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
