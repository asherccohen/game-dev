import { useHelper } from '@react-three/drei';
import { PropsWithChildren, useRef } from 'react';
import {
  DirectionalLight,
  DirectionalLightHelper,
  PointLight,
  PointLightHelper,
} from 'three';

function SceneLighting({
  debug = false,
  children,
}: PropsWithChildren<{ debug?: boolean }>) {
  const pointLightRef = useRef<PointLight>(null!);
  const directionalLightRef = useRef<DirectionalLight>(null!);

  // Adds visual helpers to understand light positioning
  useHelper(debug && pointLightRef, PointLightHelper);
  useHelper(debug && directionalLightRef, DirectionalLightHelper);

  // return (
  //   <>
  //     <ambientLight intensity={0.5} />
  //     <pointLight
  //       ref={pointLightRef}
  //       position={[10, 10, 10]}
  //       intensity={10}
  //       color="white"
  //     />
  //     <directionalLight
  //       ref={directionalLightRef}
  //       position={[10, 10, 10]}
  //       intensity={0.5}
  //     />
  //   </>
  // );

  return (
    <directionalLight
      intensity={0.65}
      castShadow
      position={[-15, 10, 15]}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-bias={-0.00005}
    >
      {children}
    </directionalLight>
  );
}

export default SceneLighting;
