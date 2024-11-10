import { useHelper } from '@react-three/drei';
import { PerspectiveCameraProps } from '@react-three/fiber';
import { useRef } from 'react';
import { CameraHelper, PerspectiveCamera } from 'three';
import { PerspectiveCamera as PrimitivePerspectiveCamera } from '../../libs/camera';

const CustomCamera = ({
  debug = false,
  ...props
}: PerspectiveCameraProps & { debug?: boolean }) => {
  const cameraRef = useRef<PerspectiveCamera>(null!);

  // Visualize camera frustum
  useHelper(debug && cameraRef, CameraHelper);

  return <PrimitivePerspectiveCamera makeDefault ref={cameraRef} {...props} />;
};

export default CustomCamera;
