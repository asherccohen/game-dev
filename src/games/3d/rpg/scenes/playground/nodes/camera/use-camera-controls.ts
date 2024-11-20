import { useControls } from 'leva';
import { degToRad } from 'three/src/math/MathUtils.js';

export const useCameraControls = () => {
  const cameraControls = useControls('Camera Control', {
    position: [0, 15, 45],
    target: [0, 0, 0],
    fov: 35,
    near: 0.1,
    far: 1000,
    ROTATION_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
    PITCH_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
    YAW_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
    ZOOM_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
    ZOOM_SENSITIVITY: {
      value: 0.5,
      min: 0.1,
      max: 1,
      step: 0.1,
    },
    ZOOM_MIN: {
      value: 0.5,
      min: 0.1,
      max: 1,
      step: 0.1,
    },
    ZOOM_MAX: {
      value: 0.5,
      min: 0.1,
      max: 1,
      step: 0.1,
    },
  });

  return cameraControls;
};
