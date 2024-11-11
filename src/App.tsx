import './App.css';

import React, { PropsWithChildren, Suspense, useState } from 'react';
import GameScene from './game-scene';

import { Html, useProgress } from '@react-three/drei';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: PropsWithChildren<FallbackProps>) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        backgroundColor: 'red',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>⚠️Something went wrong</p>
        <p>{error.message}</p>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    </div>
  );
}

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const App: React.FC = () => {
  const [debugMode, setDebugMode] = useState<boolean>(false);
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        // position: 'absolute',
        // top: 0,
        // left: 0,
        overflow: 'hidden',
      }}
    >
      <form>
        <label htmlFor="debug">Debug Mode:</label>
        <input
          type="checkbox"
          id="debug"
          onChange={() => setDebugMode(!debugMode)}
        />
      </form>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={(details) => {
          // Reset the state of your app so the error doesn't happen again
        }}
      >
        <Suspense fallback={<Loader />}>
          <GameScene debug={debugMode} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;
