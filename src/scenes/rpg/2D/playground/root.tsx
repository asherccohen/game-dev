import { Html, KeyboardControls, useProgress } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import CustomControls from 'libs/controls/root';
import { Editor, useDebug, useEditorControls } from 'libs/editor';
import { StatsDebug } from 'libs/performance';
import { Suspense } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import Character from './nodes/character/character-controller';
import { keyboardMap } from './nodes/character/use-character-keyboard';
import Ground from './nodes/ground/root';
import SceneLighting from './nodes/light/root';

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

export const Component = () => {
  const [debug] = useDebug();
  const { debugControls } = useEditorControls();
  return (
    <KeyboardControls map={keyboardMap}>
      <Editor debug={debug} />

      <Canvas
        // shadows
        camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
        style={{
          touchAction: 'none',
        }}
      >
        <SceneLighting debug={debugControls.showLighting}></SceneLighting>
        <Physics>
          <Suspense fallback={<SceneLoader />}>
            <Character />
            {/* Other game elements */}

            <Ground
            // scale={mapControls.config.scale}
            // position={mapControls.config.position}
            />
          </Suspense>
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
