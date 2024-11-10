import { Html, useProgress } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from '@react-three/rapier';
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Mesh,
  MeshStandardMaterial,
  Object3D,
  TextureLoader,
  Vector3,
} from 'three';
import { FBXLoader } from 'three/examples/jsm/Addons.js';
//TODO: add an asset loader to load with an import instead of keeping the files in the public folder
// import barbarianSrc from "./resources/Characters/fbx/Barbarian.fbx"

interface CharacterProps extends RigidBodyProps {
  moveSpeed?: number;
  scale?: number;
}

const CharacterPrimitive: React.FC<CharacterProps> = ({
  moveSpeed = 5,
  scale = 0.01,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ...props
}) => {
  const fbxModel = useLoader(
    FBXLoader,
    './resources/Characters/fbx/Knight.fbx',
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
    './resources/Characters/fbx/knight_texture.png',
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

  const characterRef = useRef<Mesh>(null!);
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const [isJumping, setIsJumping] = useState<boolean>(false);

  const handleMovement = useCallback(() => {
    const body = rigidBodyRef.current;
    if (!body) return;

    // Example movement logic (placeholder)
    const impulse: Vector3 = new Vector3(
      moveSpeed * Math.random(),
      0,
      moveSpeed * Math.random(),
    );
    body.applyImpulse(impulse, true);
  }, [moveSpeed]);

  // Typed attack method
  const handleAttack = useCallback(() => {
    console.log('Character attacks!');
    // Implement attack logic
  }, []);

  // Frame-based updates
  useFrame((state, delta: number) => {
    // Potential frame-based logic
    //  if (meshRef.current) {
    //    meshRef.current.rotation.x += delta;
    //  }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      colliders="cuboid"
      position={position}
      {...props}
    >
      <primitive
        ref={characterRef}
        onClick={handleAttack}
        onPointerDown={handleMovement}
        object={fbxModel}
        // scale={scale}
        rotation={rotation}
      />
    </RigidBody>
  );
};

const ErrorFallback: React.FC<CharacterProps> = ({
  position = [0, 0, 0],
  ...props
}) => (
  <RigidBody type="fixed" position={position} {...props}>
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={'red'} />
    </mesh>
  </RigidBody>
);

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const Character: React.FC<CharacterProps> = (props) => {
  return (
    <ErrorBoundary fallback={<ErrorFallback position={props.position} />}>
      <Suspense fallback={<Loader />}>
        <CharacterPrimitive {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Character;
