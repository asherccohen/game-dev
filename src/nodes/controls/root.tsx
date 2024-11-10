import { OrbitControls, OrbitControlsProps } from '@react-three/drei';

const CustomControls = ({
  debug = false,
  ...props
}: OrbitControlsProps & { debug?: boolean }) => {
  return (
    <OrbitControls
      enablePan={true}
      enableRotate={true}
      enableZoom={true}
      {...props}
    />
  );
};

export default CustomControls;
