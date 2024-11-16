import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';
import { Group, MathUtils, Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import { Character } from './character';

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

interface CharacterProps extends RigidBodyProps {
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
          <Character scale={scale} position-y={-0.25} animation={animation} />
        </group>
      </group>
      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  );
};
