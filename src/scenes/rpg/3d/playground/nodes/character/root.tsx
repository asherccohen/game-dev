import { Html, useProgress } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { CharacterController, CharacterProps } from './character-controller';

const ErrorFallback: React.FC<CharacterProps> = ({
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

const Character: React.FC<CharacterProps> = (props) => {
  return (
    <ErrorBoundary fallback={<ErrorFallback position={props.position} />}>
      <Suspense fallback={<Loader />}>
        {/* <CharacterPrimitive {...props} /> */}
        <CharacterController {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Character;
