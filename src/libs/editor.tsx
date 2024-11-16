import { Leva, useControls } from 'leva';
import { useEffect, useState } from 'react';
import { degToRad } from 'three/src/math/MathUtils.js';
import { maps } from './map';
// import { bezier } from '@leva-ui/plugin-bezier';
// import groundModel from `./assets/models/${mapControls.map}.glb`

// useGLTF.preload(characterModel);

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
    // refMonitor: monitor(ref, { graph: true, interval: 30 }),
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
  const [mapModel, setMapModel] = useState('');

  useEffect(() => {
    if (mapControls.map === 'ground') {
      setMapModel('');
    }

    if (mapControls.map !== 'ground') {
      import(`./assets/models/${mapControls.map}.glb`).then((res) => {
        setMapModel(res);
      });
    }
  }, [mapControls.map]);

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

  // const { curve } = useControls({ curve: bezier() });

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

export const Editor = () => {
  return (
    <Leva
      // theme={myTheme} // you can pass a custom theme (see the styling section)
      // fill // default = false,  true makes the pane fill the parent dom node it's rendered in
      // flat // default = false,  true removes border radius and shadow
      // oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
      // hideTitleBar // default = false, hides the GUI header
      collapsed // default = false, when true the GUI is collpased
      // hidden // default = false, when true the GUI is hidden
    />
  );
};
