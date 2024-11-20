import { useLoader } from '@react-three/fiber';
import barbarianModel from 'libs/assets/characters/fbx/Barbarian.fbx';
import barbarianTexture from 'libs/assets/characters/fbx/barbarian_texture.png';
import { useEffect } from 'react';
import { Mesh, MeshStandardMaterial, Object3D, TextureLoader } from 'three';
import { FBXLoader } from 'three/examples/jsm/Addons.js';

export const useEnemyLoader = () => {
  // Option 1: Using useLoader
  const fbxModel = useLoader(FBXLoader, barbarianModel);
  // const fbxModel = useFBX(modelPath);
  // const fbxModel = useLoader(FBXLoader, modelPath, (loader) => {
  //   // Customize loader behavior
  //   loader.setResourcePath('/resources/monsters/FBX/');
  // });

  // Option 2: Using useFBX from drei (recommended)
  // const fbxModel = useFBX(modelPath)

  // Load Textures
  const colorTexture = useLoader(TextureLoader, barbarianTexture);
  // const normalTexture = useLoader(TextureLoader, '/path/to/normal_texture.png');

  useEffect(() => {
    // Traverse meshes and apply textures
    fbxModel.traverse((child) => {
      function isMesh(child: Object3D): child is Mesh {
        return (child as Mesh).isMesh !== undefined;
      }

      if (isMesh(child)) {
        // Apply color map
        // child.material.map = colorTexture;

        // // Apply normal map if needed
        // // child.material.normalMap = normalTexture;

        // // Update material
        // child.material.needsUpdate = true;

        const material = new MeshStandardMaterial({
          map: colorTexture,
          //  normalMap: normalTexture,
          //  roughnessMap: roughnessTexture,
          //  metalnessMap: metalnessTexture,
        });

        // Replace existing material
        child.material = material;
      }
    });
  }, [fbxModel, colorTexture]);

  return fbxModel;
};
