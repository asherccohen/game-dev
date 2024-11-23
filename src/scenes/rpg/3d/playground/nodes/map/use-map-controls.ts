import { useControls } from 'leva';
import { maps } from 'libs/terrain/map';
import { useEffect, useState } from 'react';

// useGLTF.preload(characterModel);

// Preload models if known in advance
// const preloadGLTFModels = async (mapNames: string[]) => {
//   for (const name of mapNames) {
//     useGLTF.preload(name);
//   }
// };

// await preloadGLTFModels(Object.keys(maps));

// const preloadModels = async (mapNames: string[]) => {
//   return Promise.all(
//     mapNames.map((name) => import(`libs/assets/3D/models/${name}.glb`)),
//   );
// };

// Dynamically import model based on map name
const loadModel = async (mapName: string) => {
  try {
    const model = await import(`libs/assets/3D/models/${mapName}.glb`);
    return model.default; // Return the imported asset
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
};

export const useMapControls = () => {
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
      loadModel(mapControls.map)
        .then((res) => {
          setMapModel(res);
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [mapControls.map]);

  return {
    map: mapControls.map,
    config: mapConfig,
    model: mapModel,
  };
};
