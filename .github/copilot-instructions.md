# Game Development Framework - AI Coding Agent Instructions

## Architecture Overview

This is a **multi-genre game development framework** built with React Three Fiber, supporting both 2D and 3D games through a modular architecture:

- **3D Games**: React Three Fiber + Rapier Physics + Drei utilities
- **2D Strategy**: Text-based tactical wargames with ECS architecture
- **State Management**: XState v5 for game logic, Miniplex for ECS
- **Build System**: Rsbuild with React Compiler + Babel optimizations

## Key Directories & Patterns

### `/src/scenes/` - Game Route Structure

- Each game type lives in genre-specific folders (`strategy/2D/war-tactics/`, `rpg/3d/playground/`)
- Routes are lazy-loaded in `src/index.tsx` using React Router v7
- All scenes use `root.tsx` as entry point with XState actors

### `/src/libs/` - Shared Game Systems

- **`ecs/`**: Miniplex-based Entity Component System with pure data components
- **`ui/`**: Reusable game UI components (Terminal, HUD, MasonryCard)
- **Game-specific libs**: `camera/`, `controls/`, `physics/`, `terrain/`

### ECS Component Pattern (Miniplex)

```typescript
// Components are pure data - no behavior
export interface Position {
  zone: string;
  isMoving: boolean;
  destination?: string;
}

// Systems operate on component queries
const world = new World<Unit>();
const movementSystem = (deltaTime: number) => {
  world.with('position', 'status').forEach((entity) => {
    // Time-based logic using deltaTime
  });
};
```

## Critical Development Workflows

### Game State Management with XState v5

- All games use XState v5 machines for game loop control
- State machines handle turn management, order processing, and victory conditions
- Example: `war-tactics/core/machine-two.ts` - 100ms tick processing for tactical games
- Test extensively with `vitest` - see `machine-two.test.ts` for comprehensive patterns

### Testing Commands

```bash
pnpm test                 # Run all tests
pnpm test:ui             # Vitest UI for debugging
pnpm test:coverage       # Coverage reports
```

### Build & Dev Commands

```bash
pnpm dev                 # Development server
pnpm dev:open           # Auto-open browser
pnpm build              # Production build with React Compiler
```

### Memory Management Patterns

- Completed orders limited to last 100 entries (`.slice(-100)`)
- Game logs limited to 50 entries (`.slice(-50)`)
- SITREPs limited to 10 entries (`.slice(-10)`)
- All cleanup happens in assign actions to prevent memory leaks

## 3D Game Development Patterns

### React Three Fiber Integration

- Use `@react-three/drei` for common 3D utilities
- `@react-three/rapier` for physics simulation
- Performance monitoring with `r3f-perf`
- Asset handling: `.fbx`, `.gltf`, `.glb` files configured in `rsbuild.config.ts`

## Project-Specific Conventions

### File Naming & Structure

- Game scenes use `root.tsx` as entry point
- Core game logic in `core/` subdirectories
- UI components in `ui/` subdirectories
- All games must have `DESIGN_DOC.md` for architecture decisions, we must use it to contextualize the changes for each game

### TypeScript Patterns

- Strict typing for ECS components (see `war-tactics/core/types.ts`)
- State machine events strongly typed with XState v5
- Use `tiny-invariant` for runtime assertions

### Database Integration

- Drizzle ORM with SQLite (`better-sqlite3`)
- PGLite for browser-based persistence
- Electric SQL for real-time sync

## Key External Dependencies

- **XState v5**: State machines with proper TypeScript support
- **Miniplex**: Performant ECS with type-safe component queries
- **React Router v7**: File-based routing with lazy loading
- **Nuqs**: URL state management adapter
- **Tailwind**: Utility-first CSS with custom game styling

## Testing Philosophy

- Comprehensive state machine testing (see 500+ line test suites)
- ECS system testing with delta time validation
- UI testing with React Testing Library
- Performance testing for 3D scenes

## Performance Considerations

- React Compiler enabled for automatic optimizations
- Instance rendering for 3D objects
- Time-based ECS systems (always use deltaTime parameter)
- Memory management through array slicing patterns
- Asset bundling optimized for game files (audio, 3D models)
