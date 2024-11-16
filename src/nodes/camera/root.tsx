import { useHelper } from '@react-three/drei';

import { useRef } from 'react';
import { CameraHelper, OrthographicCamera, PerspectiveCamera } from 'three';
import {
  OrthographicCameraProps,
  PerspectiveCameraProps,
  //  PerspectiveCamera as PrimitivePerspectiveCamera,
  OrthographicCamera as PrimitiveOrthographicCamera,
} from '../../libs/camera';

const CustomCamera = ({
  debug = false,
  ...props
}: PerspectiveCameraProps & OrthographicCameraProps & { debug?: boolean }) => {
  const cameraRef = useRef<PerspectiveCamera & OrthographicCamera>(null!);

  // Visualize camera frustum
  useHelper(debug && cameraRef, CameraHelper);

  // return <PrimitivePerspectiveCamera makeDefault ref={cameraRef} {...props} />;
  return (
    <PrimitiveOrthographicCamera
      left={-22}
      right={15}
      top={10}
      bottom={-20}
      ref={cameraRef}
      attach={'shadow-camera'}
      {...props}
    />
  );
};

export default CustomCamera;
