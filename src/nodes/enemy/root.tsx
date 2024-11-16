import { Html, useProgress } from '@react-three/drei';
import { RigidBody, RigidBodyProps } from '@react-three/rapier';
import { useMachine } from '@xstate/react';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { enemyMachine } from './enemy-machine';
import { useEnemyLoader } from './use-enemy-loader';

interface BarbarianProps extends RigidBodyProps {
  moveSpeed?: number;
  scale?: number;
}

const BarbarianPrimitive: React.FC<BarbarianProps> = ({
  scale = 0.01,
  position = [0, 0, 0],
  moveSpeed,
  rotation = [0, 0, 0],
  ...props
}) => {
  const fbxModel = useEnemyLoader();

  // Machine with provided implementations
  // Will keep provided implementations up-to-date
  const [snapshot, send] = useMachine(
    enemyMachine.provide({
      actions: {
        doSomething: ({ context }) => {
          // ...
        },
      },
    }),
  );

  return (
    <RigidBody type="dynamic" position={position} {...props}>
      <primitive
        object={fbxModel}
        // scale={scale}
        rotation={rotation}
      />
    </RigidBody>
  );
};

const ErrorFallback: React.FC<BarbarianProps> = ({
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

const Barbarian: React.FC<BarbarianProps> = (props) => {
  return (
    <ErrorBoundary fallback={<ErrorFallback position={props.position} />}>
      <Suspense fallback={<Loader />}>
        <BarbarianPrimitive {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Barbarian;
