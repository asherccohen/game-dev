import { useHelper } from '@react-three/drei';
import { useRef } from 'react';
import {
  DirectionalLight,
  DirectionalLightHelper,
  PointLight,
  PointLightHelper,
} from 'three';

function SceneLighting({ debug = false }: { debug?: boolean }) {
  const pointLightRef = useRef<PointLight>(null!);
  const directionalLightRef = useRef<DirectionalLight>(null!);

  // Adds visual helpers to understand light positioning
  useHelper(debug && pointLightRef, PointLightHelper);
  useHelper(debug && directionalLightRef, DirectionalLightHelper);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight
        ref={pointLightRef}
        position={[10, 10, 10]}
        intensity={10}
        color="white"
      />
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 10]}
        intensity={0.5}
      />
    </>
  );
}

export default SceneLighting;
