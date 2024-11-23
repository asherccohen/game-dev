import { SpriteAnimator } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import characterModel from 'libs/assets/2D/Endesca/Valkyrie.png';
import React, { useCallback, useRef, useState } from 'react';
import { Group, Object3DEventMap, Vector3 } from 'three';

// Enum for Animation States
enum AnimationState {
  IDLE = 'idle',
  WALK = 'walk',
  JUMP = 'jump',
  ATTACK = 'attack',
}

// Character Configuration Type
interface CharacterConfig {
  moveSpeed: number;
  jumpForce: number;
}

// Input State Type
interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  attack: boolean;
}

const Character: React.FC = () => {
  // Refs
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const spriteRef = useRef<Group<Object3DEventMap>>(null!);

  // State Management
  const [animationState, setAnimationState] = useState<AnimationState>(
    AnimationState.IDLE,
  );
  const [inputState, setInputState] = useState<InputState>({
    left: false,
    right: false,
    jump: false,
    attack: false,
  });

  // Character Configuration
  const config: CharacterConfig = {
    moveSpeed: 5,
    jumpForce: 10,
  };

  // Input Handling
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        setInputState((prev) => ({ ...prev, left: true }));
        break;
      case 'ArrowRight':
        setInputState((prev) => ({ ...prev, right: true }));
        break;
      case ' ':
        setInputState((prev) => ({ ...prev, jump: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        setInputState((prev) => ({ ...prev, left: false }));
        break;
      case 'ArrowRight':
        setInputState((prev) => ({ ...prev, right: false }));
        break;
      case ' ':
        setInputState((prev) => ({ ...prev, jump: false }));
        break;
    }
  }, []);

  // Physics and Movement Logic
  useFrame(() => {
    const rigidBody = rigidBodyRef.current;
    if (!rigidBody) return;

    const velocity = rigidBody.linvel();
    const movement: Vector3 = new Vector3(0, velocity.y, 0);

    // Horizontal Movement
    if (inputState.left) {
      movement.x = -config.moveSpeed;
      setAnimationState(AnimationState.WALK);
    } else if (inputState.right) {
      movement.x = config.moveSpeed;
      setAnimationState(AnimationState.WALK);
    } else {
      movement.x = 0;
      setAnimationState(AnimationState.IDLE);
    }

    // Jumping
    if (inputState.jump) {
      rigidBody.applyImpulse(new Vector3(0, config.jumpForce, 0), true);
      setAnimationState(AnimationState.JUMP);
    }

    rigidBody.setLinvel(movement, true);
  });

  // Lifecycle Setup
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Render Character
  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      // lockRotationX
      // lockRotationZ
      // lockTranslationY
      lockRotations={true}
    >
      <SpriteAnimator
        ref={spriteRef}
        position={[0, 0, 0]}
        frameName={animationState}
        animationNames={Object.values(AnimationState)}
        autoPlay={true}
        loop={true}
        textureImageURL={characterModel}
        // textureDataURL="/character-animations.json"
        onLoopEnd={() => setAnimationState(AnimationState.IDLE)}
      />
    </RigidBody>
  );
};

export default Character;
