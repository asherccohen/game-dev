import { useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import { Mesh, MeshStandardMaterial, Object3D, TextureLoader } from 'three';
import { FBXLoader } from 'three/examples/jsm/Addons.js';
//TODO: add an asset loader to load with an import instead of keeping the files in the public folder
// import barbarianSrc from "./resources/Characters/fbx/Barbarian.fbx"

export const useEnemyLoader = () => {
  // Option 1: Using useLoader
  const fbxModel = useLoader(
    FBXLoader,
    './resources/Characters/fbx/Barbarian.fbx',
  );
  // const fbxModel = useFBX(modelPath);
  // const fbxModel = useLoader(FBXLoader, modelPath, (loader) => {
  //   // Customize loader behavior
  //   loader.setResourcePath('/resources/monsters/FBX/');
  // });

  // Option 2: Using useFBX from drei (recommended)
  // const fbxModel = useFBX(modelPath)

  // Load Textures
  const colorTexture = useLoader(
    TextureLoader,
    './resources/Characters/fbx/barbarian_texture.png',
  );
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
