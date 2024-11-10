import { CameraControlsProps } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { RefObject, useEffect, useRef } from 'react';
import { Mesh, Vector3 } from 'three';

import { PerspectiveCamera as OriginalPerspectiveCamera } from '@react-three/drei';

interface CameraSetupProps {
  position?: [number, number, number];
  lookAt?: [number, number, number];
  fov?: number;
}

/**
 * Programmatic Camera Setup
 *
 * Sets up a camera that can be positioned, targeted, and configured using props.
 *
 * @param {Object} props
 * @param {number[]} props.position The camera's position as an array of [x, y, z].
 * @param {number[]} props.lookAt The point in space for the camera to look at as an array of [x, y, z].
 * @param {number} props.fov The camera's field of view in degrees.
 *
 * @returns {null}
 *
 * @example
 * <Canvas>
 *   <CameraSetup position={[0, 5, 10]} lookAt={[0, 0, 0]} fov={45} />
 * </Canvas>
 */
export function CameraSetup({
  position = [0, 5, 10],
  lookAt = [0, 0, 0],
  fov = 45,
}: CameraSetupProps & CameraControlsProps) {
  const { camera } = useThree();

  useEffect(() => {
    // Programmatic Camera Positioning
    camera.position.set(...position);
    camera.lookAt(...lookAt);
    // camera.fov = fov; //TODO: how to set fov
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

/**
 * Sets up a camera that smoothly follows a target Mesh.
 *
 * @param {Object} props
 * @param {RefObject<Mesh>} props.target The target Mesh to follow.
 *
 * @returns {null}
 *
 * @example
 *
 * <FollowCamera target={characterRef} />
 * <Character ref={characterRef} />
 */
export function useFollowCamera({ target }: { target: RefObject<Mesh> }) {
  const { camera } = useThree();
  const cameraRef = useRef();

  useFrame(() => {
    // Smooth camera follow
    if (target.current) {
      camera.position.lerp(
        new Vector3(
          target.current.position.x,
          target.current.position.y + 5,
          target.current.position.z + 10,
        ),
        0.1, // Smoothing factor
      );
      camera.lookAt(target.current.position);
    }
  });

  return null;
}

/**
 * Sets up a camera with an isometric view.
 *
 * @example
 *
 * <Canvas>
 *   <IsometricCameraSetup />
 *   <ambientLight />
 *   <pointLight position={[10, 10, 10]} />
 *   <OrbitControls ref={controls} enableDamping={false} />
 *   <mesh ref={mesh} />
 * </Canvas>
 */
export function IsometricCameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    // Isometric view configuration
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    // Optional: Adjust projection
    camera.near = 0.1;
    camera.far = 1000;
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

export const PerspectiveCamera = OriginalPerspectiveCamera;
