import { Html, useProgress } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import React, { Suspense } from 'react';

import CustomCamera from './nodes/camera/root';
import Character from './nodes/character/root';
import CustomControls from './nodes/controls/root';
import Barbarian from './nodes/enemy/root';
import Ground from './nodes/ground/root';
import SceneLighting from './nodes/light/root';
import Sky from './nodes/sky/root';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const GameScene: React.FC = () => {
  return (
    <Canvas>
      <Suspense fallback={<Loader />}>
        <SceneLighting debug />

        <Physics>
          <Character position={[5, 0, 5]} moveSpeed={5} />
          <Barbarian position={[-5, 0, -5]} moveSpeed={5} />
          <Ground />
        </Physics>

        <Sky />

        <CustomCamera
          position={[0, 15, 45]}
          fov={35}
          near={0.1}
          far={1000}
          debug
        />
        <CustomControls debug />
      </Suspense>
    </Canvas>
  );
};

export default GameScene;
