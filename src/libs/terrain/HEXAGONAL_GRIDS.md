## Hexagonal Grid Coordinate Systems

https://www.redblobgames.com/grids/hexagons/

### Coordinate Systems Overview

There are several coordinate systems for hexagonal grids, but the most recommended are:

1. **Cube Coordinates**
2. **Axial Coordinates**
3. **Offset Coordinates**
4. **Doubled Coordinates**

#### Cube Coordinates (Recommended for Algorithms)

Cube coordinates use three axes (q, r, s) with the constraint $$ q + r + s = 0 $$. This system provides the most flexibility for calculations.

```javascript
function Cube(q, r, s) {
  // Ensure q + r + s = 0
  if (Math.abs(q + r + s) > Number.EPSILON) {
    throw new Error('Invalid cube coordinates');
  }
  return { q, r, s };
}
```

#### Axial Coordinates

A simplified version of cube coordinates that omits the third coordinate:

```javascript
function Axial(q, r) {
  const s = -q - r;
  return { q, r, s };
}
```

### Neighbor Calculations

For cube coordinates, finding neighbors is straightforward:

```javascript
const CUBE_DIRECTIONS = [
  { q: 1, r: -1, s: 0 }, // Northeast
  { q: 1, r: 0, s: -1 }, // East
  { q: 0, r: 1, s: -1 }, // Southeast
  { q: -1, r: 1, s: 0 }, // Southwest
  { q: -1, r: 0, s: 1 }, // West
  { q: 0, r: -1, s: 1 }, // Northwest
];

function cubeNeighbor(hex, direction) {
  const dir = CUBE_DIRECTIONS[direction];
  return {
    q: hex.q + dir.q,
    r: hex.r + dir.r,
    s: hex.s + dir.s,
  };
}
```

## Distance and Movement

### Distance Calculation

```javascript
function cubeDistance(a, b) {
  return Math.max(
    Math.abs(a.q - b.q),
    Math.abs(a.r - b.r),
    Math.abs(a.s - b.s),
  );
}
```

### Movement Range

To find all hexes within a certain range:

```javascript
function cubeRange(center, range) {
  const results = [];
  for (let q = -range; q <= range; q++) {
    for (
      let r = Math.max(-range, -q - range);
      r <= Math.min(range, -q + range);
      r++
    ) {
      const s = -q - r;
      results.push(cubAdd(center, { q, r, s }));
    }
  }
  return results;
}
```

## React Three Fiber Hexagonal Grid Implementation

### Hex Tile Component

```typescript
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface HexTileProps {
  q: number;
  r: number;
  size?: number;
  height?: number;
  color?: string;
}

const HexTile: React.FC<HexTileProps> = ({
  q,
  r,
  size = 1,
  height = 0.1,
  color = '#3f51b5'
}) => {
  // Calculate hex vertices
  const vertices = useMemo(() => {
    const hexVertices = [];
    for (let i = 0; i < 6; i++) {
      const angleDeg = 60 * i;
      const angleRad = Math.PI / 180 * angleDeg;
      hexVertices.push(
        new THREE.Vector3(
          q + size * Math.cos(angleRad),
          height,
          r + size * Math.sin(angleRad)
        )
      );
    }
    return hexVertices;
  }, [q, r, size, height]);

  // Create geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(
      vertices.flatMap(v => v.toArray())
    );

    // Triangulate the hexagon
    const indices = [];
    for (let i = 1; i < vertices.length - 1; i++) {
      indices.push(0, i, i + 1);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    return geo;
  }, [vertices]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Hexagonal Grid Component
const HexGrid: React.FC = () => {
  const gridSize = 5;

  const hexTiles = useMemo(() => {
    const tiles = [];
    for (let q = -gridSize; q <= gridSize; q++) {
      for (let r = Math.max(-gridSize, -q-gridSize);
           r <= Math.min(gridSize, -q+gridSize); r++) {
        tiles.push(
          <HexTile
            key={`${q},${r}`}
            q={q}
            r={r}
          />
        );
      }
    }
    return tiles;
  }, [gridSize]);

  return (
    <group>
      {hexTiles}
    </group>
  );
};

export default HexGrid;
```

## Advanced Techniques

### Rotation

```javascript
function cubeRotate(hex, rotationDirection) {
  switch (rotationDirection) {
    case 'right': // 60° clockwise
      return {
        q: -hex.r,
        r: -hex.s,
        s: -hex.q,
      };
    case 'left': // 60° counter-clockwise
      return {
        q: -hex.s,
        r: -hex.q,
        s: -hex.r,
      };
    default:
      return hex;
  }
}
```

### Line Drawing

```javascript
function cubeLerp(a, b, t) {
  return {
    q: a.q + (b.q - a.q) * t,
    r: a.r + (b.r - a.r) * t,
    s: a.s + (b.s - a.s) * t,
  };
}

function cubeLine(start, end) {
  const N = cubeDistance(start, end);
  const results = [];
  for (let i = 0; i <= N; i++) {
    results.push(cubeRound(cubeLerp(start, end, (1.0 / N) * i)));
  }
  return results;
}
```

## Key Considerations

1. **Coordinate Constraint**: Always maintain $$ q + r + s = 0 $$
2. **Performance**: Use `useMemo` for complex calculations
3. **Flexibility**: Create utility functions for coordinate conversions
4. **Rendering**: Adjust hex size and positioning as needed

This implementation provides a solid foundation for building hexagonal grid-based games or simulations using React Three Fiber, with a focus on the coordinate system and movement mechanics from the Red Blob Games guide.

Citations:
[1] https://www.redblobgames.com/grids/hexagons/
[2] Red Blob Games: Hexagonal Grids https://www.redblobgames.com/grids/hexagons/
[3] Recreating a Dave Whyte Animation in React-Three-Fiber - Codrops https://tympanus.net/codrops/2020/12/17/recreating-a-dave-whyte-animation-in-react-three-fiber/
[4] 7. Moving on hexagonal grid using canvas, javascript and react js ... https://www.youtube.com/watch?v=e8ix4mQD1JM
[5] Configure 3D models with react-three-fiber - LogRocket Blog https://blog.logrocket.com/configure-3d-models-react-three-fiber/
[6] Regular Hexagon Plane using BufferGeometry in React Three Fiber https://www.answeroverflow.com/m/1141449680354545754
[7] Advent of Code Day 11-Don't Reinvent the Hexagon - Mark Heath https://markheath.net/post/advent-of-code-2017-day-11
[8] Multiplayer Game Tutorial with R3F & Socket.io: Grid System https://www.youtube.com/watch?v=ALlk9cNRA1s

# Hexagonal Grid Game Development Prompt for React Three Fiber

## Project Objective

Create a game with a hexagonal grid system using React Three Fiber, focusing on robust coordinate management and flexible game mechanics.

## Core Requirements

- Implement a hexagonal grid coordinate system
- Create reusable hex tile components
- Support grid-based movement and interaction
- Optimize performance for large grids

## Coordinate System Specifications

1. Use **Cube Coordinates** as the primary coordinate system

   - Maintain the constraint: q + r + s = 0
   - Implement conversion methods between:
     - Cube coordinates
     - Axial coordinates
     - Offset coordinates

2. Develop utility functions for:
   - Neighbor calculation
   - Distance measurement
   - Path finding
   - Rotation

## React Three Fiber Implementation Details

- Create a `HexTile` component with:

  - Dynamic sizing
  - Hover and selection states
  - Customizable appearance
  - Performance optimization using `useMemo`

- Implement a `HexGrid` component that:
  - Generates hexagonal grids dynamically
  - Supports variable grid sizes
  - Handles large-scale grid rendering efficiently

## Movement and Interaction Mechanics

- Develop movement algorithms for:
  - Pathfinding between hexes
  - Movement range calculation
  - Line-of-sight detection

## Performance Considerations

- Use `useMemo` and `useCallback` for complex calculations
- Implement lazy loading for grid tiles
- Create instanced rendering for large grids

## Advanced Features to Consider

- Terrain types
- Elevation support
- Dynamic grid generation
- Procedural map creation

## Technical Stack

- React Three Fiber
- Three.js
- TypeScript
- Optional: Zustand for state management

## Specific Challenges to Address

1. Efficient hex coordinate transformations
2. Rendering performance for large grids
3. Intuitive movement and interaction systems
4. Flexible game mechanics implementation

## Deliverables

- Fully functional hexagonal grid system
- Reusable React components
- Comprehensive coordinate utility library
- Performance-optimized rendering

Would you like me to elaborate on any specific aspect of hexagonal grid game development?
