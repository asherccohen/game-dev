import { Html, KeyboardControls, useProgress } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import React, { Suspense } from 'react';

import { StatsDebug } from './libs/performance';
import CustomCamera from './nodes/camera/root';
import Character from './nodes/character/root';
import { keyboardMap } from './nodes/character/use-character-controls';
import CustomControls from './nodes/controls/root';
import Barbarian from './nodes/enemy/root';
import Ground from './nodes/ground/root';
import SceneLighting from './nodes/light/root';
import Sky from './nodes/sky/root';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const GameScene: React.FC<{ debug?: boolean }> = ({ debug = false }) => {
  return (
    <Canvas>
      <Suspense fallback={<Loader />}>
        <SceneLighting debug={debug} />

        <Physics debug={debug}>
          <KeyboardControls map={keyboardMap}>
            <Character position={[5, 0, 5]} moveSpeed={5} />
          </KeyboardControls>
          <Barbarian position={[-5, 0, -5]} moveSpeed={5} />
          <Ground debug={debug} />
        </Physics>

        {/* Add environment to the scene */}
        {/* <Environment preset="studio" background /> */}

        <Sky />

        <CustomCamera
          position={[0, 15, 45]}
          fov={35}
          near={0.1}
          far={1000}
          debug={debug}
        />
        <CustomControls debug={debug} />
      </Suspense>

      {debug ? (
        <>
          {/* <PerfDebug  /> */}
          <StatsDebug />
        </>
      ) : null}
    </Canvas>
  );
};

export default GameScene;
