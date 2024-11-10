import { RigidBody } from '@react-three/rapier';

const Ground: React.FC = () => (
  <RigidBody type="fixed">
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="green" />
    </mesh>
  </RigidBody>
);

export default Ground;
