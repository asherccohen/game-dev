import { RigidBody } from '@react-three/rapier';
import { Euler, Vector3 } from 'three';

const Ground = ({
  position = new Vector3(0, 0, 0),
  rotation = new Euler(-Math.PI / 2, 0, 0),
  scale = 1,
}: {
  position?: Vector3;
  rotation?: Euler;
  scale?: number;
}) => (
  <RigidBody type="fixed">
    <mesh rotation={rotation} position={position} scale={scale}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="green" />
    </mesh>
  </RigidBody>
);

export default Ground;
