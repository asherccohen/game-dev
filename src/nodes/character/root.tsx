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
import { keyboardMap, useCharacterControls } from './use-character-controls';
import { useCharacterLoader } from './use-character-loader';

const MOVEMENT_CONFIG = {
  moveSpeed: 5,
  accelerationFactor: 0.1,
  maxVelocity: 10,
  friction: 0.9,
};

/**
 * Interpolation Mechanics
Alpha value ranges from 0 to 1
0: No movement (stay at current position)
1: Instant jump to target position
0.1: Slow, smooth movement (recommended)
 */
function improvedMovementLogic(
  body: RapierRigidBody,
  moveVector: Vector3,
  delta: number,
) {
  const desiredVelocity = new Vector3(
    moveVector.x,
    0,
    moveVector.z,
  ).multiplyScalar(MOVEMENT_CONFIG.moveSpeed);

  const currentVelocity = body.linvel();

  const smoothedVelocity = new Vector3().lerpVectors(
    currentVelocity,
    desiredVelocity,
    delta * MOVEMENT_CONFIG.accelerationFactor,
  );

  const impulse = smoothedVelocity.clone().multiplyScalar(body.mass());
  body.applyImpulse(impulse, true);
}

function applyCustomFriction(body: RapierRigidBody, moveVector: Vector3) {
  const frictionFactor = 0.9; // Adjust based on surface

  const currentVelocity = body.linvel();

  const friction = new Vector3(
    moveVector.x * currentVelocity.x,
    0,
    moveVector.z * currentVelocity.z,
  ).multiplyScalar(frictionFactor);

  body.setLinvel(friction, true);
}

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

  const [snapshot, send] = useMachine(
    characterMachine.provide({
      actions: {
        logTelemetry: ({ context }) => {
          // ...
        },
      },
    }),
  );

  useCharacterControls({
    keyboardMap,
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
    onKeyUp: () => {
      send({ type: 'character.stop' });
    },
  });

  console.log('🚀 ~ snapshot.value:', snapshot.value);
  console.log('🚀 ~ snapshot.context:', snapshot.context);
  // Frame-based updates
  /*
   * delta is a common variable in game development
   * that represents the time elapsed since the last frame.
   * It's usually calculated by the game engine or the rendering loop.
   */

  useFrame((state, delta) => {
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

    // const moveVector = new Vector3();

    switch (snapshot.value) {
      case 'idle':
        {
          const moveVector = new Vector3(0, 0, 0);
          // Reset velocity when not grounded or not moving
          body.setLinvel(moveVector, true);
        }

        break;
      case 'walking':
        switch (snapshot.context.direction) {
          case 'up':
            {
              const moveVector = new Vector3(0, 0, snapshot.context.velocity.z);
              // moveVector.z -= snapshot.context.velocity.z;
              // moveVector.z = snapshot.context.velocity.z;
              improvedMovementLogic(body, moveVector, delta);

              // Reduce velocity if no input
              // if (moveVector.length() === 0) {
              //   applyCustomFriction(body, moveVector);
              // }
            }
            break;
          case 'down':
            {
              const moveVector = new Vector3(0, 0, snapshot.context.velocity.z);
              // moveVector.z += snapshot.context.velocity.z;
              // moveVector.z = snapshot.context.velocity.z;
              improvedMovementLogic(body, moveVector, delta);

              // Reduce velocity if no input
              // if (moveVector.length() === 0) {
              //   applyCustomFriction(body, moveVector);
              // }
            }

            break;
          case 'left':
            {
              const moveVector = new Vector3(snapshot.context.velocity.x, 0, 0);
              // moveVector.x -= snapshot.context.velocity.x;
              // moveVector.x = snapshot.context.velocity.x;
              improvedMovementLogic(body, moveVector, delta);

              // Reduce velocity if no input
              // if (moveVector.length() === 0) {
              //   applyCustomFriction(body, moveVector);
              // }
            }
            break;
          case 'right':
            {
              const moveVector = new Vector3(snapshot.context.velocity.x, 0, 0);
              // moveVector.x += snapshot.context.velocity.x;
              // moveVector.x = snapshot.context.velocity.x;
              improvedMovementLogic(body, moveVector, delta);

              // Reduce velocity if no input
              // if (moveVector.length() === 0) {
              //   applyCustomFriction(body, moveVector);
              // }
            }
            break;
          default:
            break;
        }
        break;
      case 'sprinting':
        // moveVector.x -= snapshot.context.velocity.x * 2;
        improvedMovementLogic(
          body,
          new Vector3(snapshot.context.velocity.x * 2, 0, 0),
          delta,
        );

        // Reduce velocity if no input
        // if (moveVector.length() === 0) {
        //   applyCustomFriction(body, moveVector);
        // }
        break;
      case 'jumping':
        // Handle jumping state
        break;
      default:
        break;
    }

    /**
     * To avoid the character flying off the screen because the velocity
     * is being applied continuously when a key is held down,
     * causing the character to accelerate rapidly.
     * We're checking if the character is grounded and
     * if the move vector has a length greater than 0
     * before applying the velocity.
     * If the character is not grounded or the move vector is zero,
     * we're resetting the velocity to zero.
     */
    // if (snapshot.matches('walking') && moveVector.length() > 0) {
    //   improvedMovementLogic(body, moveVector, delta);
    // }

    // // Reduce velocity if no input
    // if (snapshot.matches('walking') && moveVector.length() === 0) {
    //   applyCustomFriction(body, moveVector);
    // }
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
