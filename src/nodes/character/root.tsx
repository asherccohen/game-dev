import { Html, useProgress } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from '@react-three/rapier';
import { useMachine } from '@xstate/react';
import React, { Suspense, useCallback, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Mesh, Vector3 } from 'three';
import { characterMachine } from './character-machine';
import { useCharacterLoader } from './use-character-loader';

interface CharacterProps extends RigidBodyProps {
  moveSpeed?: number;
  scale?: number;
}

const CharacterPrimitive: React.FC<CharacterProps> = ({
  moveSpeed = 5,
  scale = 0.01,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ...props
}) => {
  const fbxModel = useCharacterLoader();

  const characterRef = useRef<Mesh>(null!);
  const rigidBodyRef = useRef<RapierRigidBody>(null!);

  // Machine with provided implementations
  // Will keep provided implementations up-to-date
  const [snapshot, send] = useMachine(
    characterMachine.provide({
      actions: {
        doSomething: ({ context }) => {
          // ...
        },
      },
    }),
  );

  const [isJumping, setIsJumping] = useState<boolean>(false);

  const handleMovement = useCallback(() => {
    const body = rigidBodyRef.current;
    if (!body) return;

    // Example movement logic (placeholder)
    const impulse: Vector3 = new Vector3(
      moveSpeed * Math.random(),
      0,
      moveSpeed * Math.random(),
    );
    body.applyImpulse(impulse, true);
  }, [moveSpeed]);

  // Typed attack method
  const handleAttack = useCallback(() => {
    console.log('Character attacks!');
    // Implement attack logic
  }, []);

  // Frame-based updates
  useFrame((state, delta: number) => {
    // Potential frame-based logic
    //  if (meshRef.current) {
    //    meshRef.current.rotation.x += delta;
    //  }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      colliders="cuboid"
      position={position}
      {...props}
    >
      <primitive
        ref={characterRef}
        onClick={handleAttack}
        onPointerDown={handleMovement}
        object={fbxModel}
        // scale={scale}
        rotation={rotation}
      />
    </RigidBody>
  );
};

const ErrorFallback: React.FC<CharacterProps> = ({
  position = [0, 0, 0],
  ...props
}) => (
  <RigidBody type="fixed" position={position} {...props}>
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={'red'} />
    </mesh>
  </RigidBody>
);

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const Character: React.FC<CharacterProps> = (props) => {
  return (
    <ErrorBoundary fallback={<ErrorFallback position={props.position} />}>
      <Suspense fallback={<Loader />}>
        <CharacterPrimitive {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Character;
