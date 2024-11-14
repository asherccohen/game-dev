import { useKeyboardControls } from '@react-three/drei';
import { useEffect } from 'react';

export enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  jump = 'jump',
  sprint = 'sprint',
}

export const keyboardMap = [
  { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
  { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
  { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
  { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
  { name: Controls.sprint, keys: ['s'] },
  { name: Controls.jump, keys: ['Space'] },
];

interface ControlsProps {
  onMoveForward: () => void;
  onMoveBack: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
  onSprint: () => void;
}

export const useCharacterControls = ({
  onMoveForward,
  onMoveBack,
  onMoveLeft,
  onMoveRight,
  onJump,
  onSprint,
}: ControlsProps) => {
  const forwardPressed = useKeyboardControls<Controls>(
    (state) => state.forward,
  );
  const backPressed = useKeyboardControls<Controls>((state) => state.back);
  const leftPressed = useKeyboardControls<Controls>((state) => state.left);
  const rightPressed = useKeyboardControls<Controls>((state) => state.right);
  const jumpPressed = useKeyboardControls<Controls>((state) => state.jump);
  const sprintPressed = useKeyboardControls<Controls>((state) => state.jump);

  useEffect(() => {
    if (forwardPressed) {
      onMoveForward();
    }
    if (backPressed) {
      onMoveBack();
    }
    if (leftPressed) {
      onMoveLeft();
    }
    if (rightPressed) {
      onMoveRight();
    }
    if (jumpPressed) {
      onJump();
    }
    if (sprintPressed) {
      onSprint();
    }
  }, [forwardPressed, backPressed, leftPressed, rightPressed]);
};

//TODO: Remove if not needed
export function useKeyboardMovement(send: any) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Character moving!');
      switch (e.key) {
        case 'ArrowUp':
          send({ type: 'character.walk', direction: 'up' });
          break;
        case 'ArrowDown':
          send({ type: 'character.walk', direction: 'down' });
          break;
        case 'ArrowLeft':
          send({ type: 'character.walk', direction: 'left' });
          break;
        case 'ArrowRight':
          send({ type: 'character.walk', direction: 'right' });
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      console.log('Character stopping!');
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        send({ type: 'character.stop' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [send]);
}
