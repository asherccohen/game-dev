import { GridHelper } from 'three';

export function GroundDebug() {
  return (
    <primitive
      object={
        new GridHelper(
          1000, // Large total size
          100, // Number of divisions
          'red', // Center line color
          'gray', // Grid line color
        )
      }
    />
  );
}
