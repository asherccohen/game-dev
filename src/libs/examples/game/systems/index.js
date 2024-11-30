import Camera from "./camera";
import GamepadController from "./gamepad-controller";
import HUD from "./hud";
import KeyboardController from "./keyboard-controller";
import MouseController from "./mouse-controller";
import Particles from "./particles";
import Physics from "./physics";
import Removal from "./removal";
import Rotation from "./rotation";
import Spawn from "./spawn";
import Timeline from "./timeline";

export default [
  GamepadController(),
  KeyboardController(),
  MouseController(),
  Camera({ pitchSpeed: -0.02, yawSpeed: 0.02 }),
  Particles,
  Removal,
  Rotation,
  Timeline,
  Spawn,
  Physics,
  HUD,
];
