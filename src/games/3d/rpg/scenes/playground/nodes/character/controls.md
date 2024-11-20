## Character Movement Mechanics

### Core Movement Principles

Character movement in React Three Fiber typically involves several key components:

1. **Input Handling**
2. **Physics Integration**
3. **Vector Calculations**
4. **State Management**

### Mathematical Foundation

The core of character movement is based on **vector mathematics**:

```typescript
// Basic movement vector calculation
const frontVector = new Vector3(0, 0, backward - forward);
const sideVector = new Vector3(left - right, 0, 0);
const direction = new Vector3()
  .subVectors(frontVector, sideVector)
  .normalize()
  .multiplyScalar(MOVEMENT_SPEED);
```

### Geometric Considerations

**Movement Transformation**

- **Local vs World Coordinates**: Translate input to character's local coordinate system
- **Camera Orientation**: Adjust movement relative to camera view

### Advanced Techniques

1. **Smooth Interpolation**

```typescript
// Smoothly interpolate movement
const smoothedMovement = Vector3.lerp(
  currentPosition,
  targetPosition,
  deltaTime * SMOOTHING_FACTOR,
);
```

2. **Collision Detection**

- Use raycasting to prevent movement through obstacles
- Implement ground checking for jumping mechanics

### Performance Optimization

- Use `useCallback` for input handlers
- Minimize vector allocations
- Leverage physics engine's built-in methods

### Mathematical Formulas

Movement can be represented by the vector equation:

$$ \vec{v} = \vec{d} \cdot \text{speed} $$

Where:

$$ \vec{v} $$
is velocity vector

$$ \vec{d} $$
is direction vector

$$ \text{speed} $$
is movement scalar

## Key Considerations

- **Precision**: Physics-based vs. direct transformation
- **Performance**: Minimize computational overhead
- **Flexibility**: Support multiple input methods
- **Responsiveness**: Low-latency input handling

The implementation combines:

- Reactive state management
- Vector mathematics
- Physics engine integration
- Frame-based updates

# Prompt: 3D Character Movement in React Three Fiber with XState State Machine

## Core Objective

Design a comprehensive character movement system using:

- React Three Fiber
- Rapier Physics
- XState for State Management

## XState State Machine: Character Movement Workflow

### State Machine Design

```typescript
const characterMovementMachine = createMachine({
  id: 'characterMovement',
  initial: 'idle',
  states: {
    idle: {
      on: {
        MOVE_FORWARD: 'walking',
        SPRINT: 'sprinting',
        JUMP: 'jumping',
      },
    },
    walking: {
      on: {
        STOP: 'idle',
        SPRINT: 'sprinting',
        JUMP: 'jumping',
      },
    },
    sprinting: {
      on: {
        STOP: 'idle',
        FATIGUE: 'walking',
      },
    },
    jumping: {
      on: {
        LAND: 'idle',
        FALL: 'falling',
      },
    },
    falling: {
      on: {
        LAND: 'idle',
      },
    },
  },
});
```

## Detailed Implementation Requirements

### State Machine Responsibilities

1. Track character movement state
2. Manage state transitions
3. Control movement physics
4. Handle complex movement scenarios

### Input Handling Integration

- Map keyboard inputs to state machine events
- Translate physical inputs to state transitions
- Support complex movement combinations

## Mathematical Movement Calculations

### Vector-Based Movement

- Calculate movement direction
- Apply speed based on current state
- Implement smooth transitions

### Movement Formulas

- Velocity calculation:
  $$ \vec{v} = \text{direction} \cdot \text{speed} \cdot \Delta t $$
- Acceleration interpolation:
  $$ a = \frac{\text{target velocity} - \text{current velocity}}{\text{transition time}} $$

## Advanced State Machine Features

### Complex State Transitions

- Implement guards for state changes
- Add context for additional movement metadata
- Support conditional state transitions

### Performance Optimization

- Minimize state update frequency
- Use memoization for state calculations
- Implement efficient event handling

## Debugging and Development Tools

### State Visualization

- Integrate XState inspector
- Create movement state debug overlay
- Log state transition events

## Implementation Constraints

- Maintain 60 FPS performance
- Support multiple input methods
- Handle edge cases in movement
- Provide smooth, responsive controls

## Deliverable Requirements

- Fully typed XState state machine
- Flexible movement configuration
- Realistic physics interaction
- Easy integration into game systems

## Additional Considerations

- Support multiple character types
- Allow runtime state machine modification
- Create extensible movement framework

### Example State Machine Context

```typescript
interface CharacterContext {
  speed: number;
  stamina: number;
  position: Vector3;
  movementMultiplier: number;
}
```
