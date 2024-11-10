import * as RAPIER from '@dimforge/rapier3d';

export async function initPhysics() {
  // Wait for WASM module to load
  await RAPIER.init();

  // Create physics world
  const gravity = { x: 0.0, y: -9.81, z: 0.0 };
  const world = new RAPIER.World(gravity);

  // Create ground
  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
  world.createCollider(groundColliderDesc);

  // Create dynamic rigid body
  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
    0.0,
    5.0,
    0.0,
  );
  const rigidBody = world.createRigidBody(rigidBodyDesc);

  // Create collider for rigid body
  const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
  world.createCollider(colliderDesc, rigidBody);

  // Physics simulation step
  world.step();
}
