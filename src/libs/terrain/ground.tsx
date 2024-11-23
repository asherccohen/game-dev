import { GridHelper } from 'three';

export function GroundDebug({ debug = false }: { debug?: boolean }) {
  if (!debug) {
    return null;
  }
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
