import { RigidBody } from '@react-three/rapier';
import { GroundDebug } from '../../libs/ground';

const Ground = ({ debug = false }: { debug: boolean }) => (
  <RigidBody type="fixed">
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="green" />
    </mesh>
    {debug ? <GroundDebug /> : null}
  </RigidBody>
);

export default Ground;
