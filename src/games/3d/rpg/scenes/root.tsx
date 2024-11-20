import {
  Environment,
  Html,
  KeyboardControls,
  useProgress,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Editor, useEditorControls } from 'libs/editor';
import { GroundDebug } from 'libs/ground';
import { StatsDebug } from 'libs/performance';
import CustomCamera from 'nodes/camera/root';
import { CharacterController } from 'nodes/character/character-controller';
import { keyboardMap } from 'nodes/character/use-character-controls';
import CustomControls from 'nodes/controls/root';
import Ground from 'nodes/ground/root';
import SceneLighting from 'nodes/light/root';
import CustomMap from 'nodes/map/root';
import Sky from 'nodes/sky/root';
import React, { Suspense } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export function Loader() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      Loading...
    </div>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();
  return isRouteErrorResponse(error) ? (
    <h1>
      {error.status} {error.statusText}
    </h1>
  ) : (
    <h1>There was an error</h1>
  );
}

function SceneLoader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

export const Component: React.FC = () => {
  const { characterControls, debugControls, mapControls, cameraControls } =
    useEditorControls();

  return (
    <KeyboardControls map={keyboardMap}>
      <Editor />

      <Canvas
        shadows
        camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
        style={{
          touchAction: 'none',
        }}
      >
        <Sky />
        <Environment preset="sunset" />

        <SceneLighting debug={debugControls.showLighting}>
          <CustomCamera
            position={cameraControls.position}
            fov={cameraControls.fov}
            near={cameraControls.near}
            far={cameraControls.far}
            debug={debugControls.showCamera}
          />
        </SceneLighting>

        <Physics
          debug={debugControls.showPhysics}
          key={mapControls.map} //used to reset the physics world
        >
          <Suspense fallback={<SceneLoader />}>
            {mapControls.map === 'ground' ? (
              <Ground
                scale={mapControls.config.scale}
                position={mapControls.config.position}
              />
            ) : (
              <CustomMap
                scale={mapControls.config.scale}
                position={mapControls.config.position}
                model={mapControls.model}
              />
            )}
            <CharacterController
              runSpeed={characterControls.RUN_SPEED}
              moveSpeed={characterControls.WALK_SPEED}
              rotationSpeed={characterControls.ROTATION_SPEED}
            />

            {/* <Character position={[5, 0, 5]} moveSpeed={5} /> */}
            {/* <Barbarian position={[-5, 0, -5]} moveSpeed={5} /> */}
          </Suspense>
          <GroundDebug debug={debugControls.showGrid} />
        </Physics>

        <color attach="background" args={['#ececec']} />

        {/* <PerfDebug  debug={debug.showStats}/> */}
        <StatsDebug debug={debugControls.showStats} />

        <CustomControls
          enablePan={debugControls.enableControls}
          enableRotate={debugControls.enableControls}
          enableZoom={debugControls.enableControls}
        />
      </Canvas>
    </KeyboardControls>
  );
};

Component.displayName = 'GameScene';
