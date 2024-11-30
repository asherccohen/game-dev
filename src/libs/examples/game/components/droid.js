// import { promisifyLoader } from "../utils/three";
// import FBXLoader from "../utils/three/fbx-loader";
// import DroidFile from "../../assets/models/droid.fbx";
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import AnimatedModel from "./animated-model";

// const loader = promisifyLoader(new FBXLoader());
// const mesh = loader.load(DroidFile);

export default async ({ parent, x = 0, y = 0, z = 0 }) => {
  const fbx = useLoader(FBXLoader, "../../assets/models/droid.fbx");
  //  return <primitive object={fbx} />;

  const animated = await AnimatedModel({
    parent,
    x,
    y,
    z,
    mesh: fbx,
    scale: 0.0035,
  });

  return animated;
};
