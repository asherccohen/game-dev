import { Html, useProgress } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from '@react-three/rapier';
import { useMachine } from '@xstate/react';
import React, { Suspense, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Mesh, Vector3 } from 'three';
import { characterMachine } from './character-machine';
import { useCharacterLoader } from './use-character-loader';
import { useCharacterControls } from './use-character-controls';

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
        logTelemetry: ({ context }) => {
          // ...
        },
      },
    }),
  );

  // const handleMovement = () => {
  //   const body = rigidBodyRef.current;
  //   if (!body) return;

  //   // Example movement logic (placeholder)
  //   const impulse: Vector3 = new Vector3(
  //     moveSpeed * Math.random(),
  //     0,
  //     moveSpeed * Math.random(),
  //   );
  //   body.applyImpulse(impulse, true);
  // };

  // Typed attack method
  // const handleAttack = () => {
  //   console.log('Character attacks!');
  //   // Implement attack logic
  // };

  useCharacterControls({
    onMoveForward: () => {
      send({ type: 'character.walk', direction: 'up' });
    },
    onMoveBack: () => {
      send({ type: 'character.walk', direction: 'down' });
    },
    onMoveLeft: () => {
      send({ type: 'character.walk', direction: 'left' });
    },
    onMoveRight: () => {
      send({ type: 'character.walk', direction: 'right' });
    },
    onJump: () => {
      send({ type: 'character.jump' });
    },
    onSprint: () => {
      send({ type: 'character.sprint' });
    },
  });

  console.log('🚀 ~ snapshot.value:', snapshot.value);
  console.log('🚀 ~ snapshot.context:', snapshot.context);
  // Frame-based updates
  useFrame((state, delta: number) => {
    // Potential frame-based logic
    //  if (meshRef.current) {
    //    meshRef.current.rotation.x += delta;
    //  }
    // if (characterRef.current) {
    //   characterRef.current.position.x = snapshot.context.position.x;
    //   characterRef.current.position.z = snapshot.context.position.z;
    // }

    const body = rigidBodyRef.current;
    if (!body) return;

    // const { velocity } = snapshot.context;
    // console.log('🚀 ~ useFrame ~ velocity:', velocity);

    // const impulse: Vector3 = new Vector3(velocity.x, 0, velocity.z);

    // body.applyImpulse(impulse, true);

    // Smoothly interpolate movement
    // const smoothedMovement = Vector3.lerp(
    //   currentPosition,
    //   targetPosition,
    //   deltaTime * SMOOTHING_FACTOR,
    // );

    // Calculate movement vector
    // const moveVector = new Vector3();
    // const SPEED = 5;

    // if (forwardPressed) {
    //   moveVector.z -= SPEED;
    // }
    // if (backPressed) {
    //   moveVector.z += SPEED;
    // }
    // if (leftPressed) {
    //   moveVector.x -= SPEED;
    // }
    // if (rightPressed) {
    //   moveVector.x += SPEED;
    // }

    // Apply movement using physics engine
    // rigidBodyRef.current.applyImpulse(moveVector.multiplyScalar(0.1), true);

    const moveVector = new Vector3();

    switch (snapshot.value) {
      case 'idle':
        // moveVector.z = snapshot.context.velocity.z;
        break;
      case 'walking':
        switch (snapshot.context.direction) {
          case 'up':
            moveVector.z -= snapshot.context.velocity.z;
            break;
          case 'down':
            moveVector.z += snapshot.context.velocity.z;
            break;
          case 'left':
            moveVector.x -= snapshot.context.velocity.x;
            break;
          case 'right':
            moveVector.x += snapshot.context.velocity.x;
            break;
          default:
            break;
        }
        break;
      case 'sprinting':
        // Handle sprinting state
        moveVector.x -= snapshot.context.velocity.x * 2;
        break;
      // case 'jumping':
      //   // Handle jumping state
      //   break;
      default:
        break;
    }

    // Apply movement using physics engine
    rigidBodyRef.current.applyImpulse(moveVector, true);
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
        // onClick={handleAttack}
        // onPointerDown={handleMovement}
        // onKeyDown={handleKeyDown}
        // onKeyUp={handleKeyUp}
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
