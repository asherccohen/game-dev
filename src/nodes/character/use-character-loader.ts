import { useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import { Mesh, MeshStandardMaterial, Object3D, TextureLoader } from 'three';
import { FBXLoader } from 'three/examples/jsm/Addons.js';
import knightModel from '../../libs/assets/characters/fbx/Knight.fbx';
import knightTexture from '../../libs/assets/characters/fbx/knight_texture.png';

export const useCharacterLoader = () => {
  const fbxModel = useLoader(FBXLoader, knightModel);
  // const fbxModel = useFBX(modelPath);
  // const fbxModel = useLoader(FBXLoader, modelPath, (loader) => {
  //   // Customize loader behavior
  //   loader.setResourcePath('/resources/monsters/FBX/');
  // });

  // Option 2: Using useFBX from drei (recommended)
  // const fbxModel = useFBX(modelPath)

  // Load Textures
  const colorTexture = useLoader(TextureLoader, knightTexture);
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
