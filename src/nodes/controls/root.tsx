import { OrbitControls, OrbitControlsProps } from '@react-three/drei';

const CustomControls = ({
  enablePan = true,
  enableRotate = true,
  enableZoom = true,
  ...props
}: OrbitControlsProps) => {
  return (
    <OrbitControls
      enablePan={enablePan}
      enableRotate={enableRotate}
      enableZoom={enableZoom}
      {...props}
    />
  );
};

export default CustomControls;
