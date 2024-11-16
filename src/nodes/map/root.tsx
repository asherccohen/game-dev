import { useAnimations, useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import { Mesh, Object3D, Vector3 } from 'three';

export type CustomMapProps = {
  scale: number;
  position: Vector3;
  model: string;
};

const CustomMap = ({ model, position, scale, ...props }: CustomMapProps) => {
  const { scene, animations } = useGLTF(model);
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    function isMesh(child: Object3D): child is Mesh {
      return (child as Mesh).isMesh !== undefined;
    }

    scene.traverse((child) => {
      if (isMesh(child)) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play();
    }
  }, [actions]);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive
          ref={group}
          object={scene}
          scale={scale}
          position={position}
          {...props}
        />
      </RigidBody>
    </group>
  );
};

export default CustomMap;
