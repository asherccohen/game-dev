import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from '@react-three/rapier';
import { useMachine } from '@xstate/react';
import React, { useEffect, useRef, useState } from 'react';
import { Group, MathUtils, Mesh, Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import { characterMachine } from './character-machine';
import { CharacterModel } from './character-model';
import { keyboardMap, useCharacterKeyboard } from './use-character-keyboard';
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

const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start: number, end: number, t: number) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export interface CharacterProps extends RigidBodyProps {
  moveSpeed?: number;
  scale?: number;
  runSpeed?: number;
  rotationSpeed?: number;
}

export const CharacterController = ({
  runSpeed = 1.6,
  rotationSpeed = degToRad(0.5),
  moveSpeed = 0.8,
  scale = 0.18,
}: CharacterProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const container = useRef<Group>(null!);
  const character = useRef<Group>(null!);

  const [animation, setAnimation] = useState('idle');

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<Group>(null!);
  const cameraPosition = useRef<Group>(null!);
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();
  const isClicking = useRef(false);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      isClicking.current = true;
    };
    const onMouseUp = (e: MouseEvent | TouchEvent) => {
      isClicking.current = false;
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    // touch
    document.addEventListener('touchstart', onMouseDown);
    document.addEventListener('touchend', onMouseUp);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchstart', onMouseDown);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, []);

  useFrame(({ camera, mouse }) => {
    if (rigidBodyRef.current) {
      const vel = rigidBodyRef.current.linvel();

      const movement = {
        x: 0,
        z: 0,
      };

      if (get().forward) {
        movement.z = 1;
      }
      if (get().backward) {
        movement.z = -1;
      }

      let speed = get().run ? runSpeed : moveSpeed;

      if (isClicking.current) {
        if (Math.abs(mouse.x) > 0.1) {
          movement.x = -mouse.x;
        }
        movement.z = mouse.y + 0.4;
        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = runSpeed;
        }
      }

      if (get().left) {
        movement.x = 1;
      }
      if (get().right) {
        movement.x = -1;
      }

      if (movement.x !== 0) {
        rotationTarget.current += rotationSpeed * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
        if (speed === runSpeed) {
          setAnimation('run');
        } else {
          setAnimation('walk');
        }
      } else {
        setAnimation('idle');
      }
      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1,
      );

      rigidBodyRef.current.setLinvel(vel, true);
    }

    // CAMERA
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1,
    );

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <RigidBody colliders={false} lockRotations ref={rigidBodyRef}>
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={4} position-z={-4} />
        <group ref={character}>
          <CharacterModel
            scale={scale}
            position-y={-0.25}
            animation={animation}
          />
        </group>
      </group>
      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  );
};

export const CharacterPrimitive: React.FC<CharacterProps> = ({
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

  useCharacterKeyboard({
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
