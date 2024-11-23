# ECS Game Development Prompt

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
