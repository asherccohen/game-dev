import './App.css';

import React, { PropsWithChildren, Suspense } from 'react';
import GameScene from './game-scene';

import { useProgress } from '@react-three/drei';
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
  // return <Html center>{progress} % loaded</Html>;
  return <div>{progress} % loaded</div>;
}

const App: React.FC = () => {
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
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={(details) => {
          // Reset the state of your app so the error doesn't happen again
        }}
      >
        <Suspense fallback={<Loader />}>
          <GameScene />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;
