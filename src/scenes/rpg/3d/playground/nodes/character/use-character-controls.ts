import { useControls } from 'leva';
import { degToRad } from 'three/src/math/MathUtils.js';

export const useCharacterControls = () => {
  const characterControls = useControls('Character Control', {
    WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
    RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
    ROTATION_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
  });

  return characterControls;
};
