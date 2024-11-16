import { useControls } from 'leva';
import { degToRad } from 'three/src/math/MathUtils.js';
import { maps } from './map';

export const useEditorControls = () => {
  const debugControls = useControls('Debug', {
    showLighting: false,
    showGrid: false,
    showCollisions: false,
    showPhysics: false,
    enableControls: true,
    showHelpers: false,
    showShadows: false,
    showStats: false,
    showCamera: false,
    // lighting: folder({
    // }),
  });
  const mapControls = useControls('Map', {
    map: {
      value: 'ground',
      options: Object.keys(maps),
    },
  });

  const mapConfig = maps[mapControls.map];
  const mapModel = `./resources/models/${mapControls.map}.glb`;

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

  return {
    debugControls,
    mapControls: {
      map: mapControls.map,
      config: mapConfig,
      model: mapModel,
    },
    characterControls,
    cameraControls,
  };
};
