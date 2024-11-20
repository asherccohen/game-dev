import { Vector3 } from 'three';
import { assertEvent, assign, setup } from 'xstate';

type Direction = 'up' | 'down' | 'left' | 'right' | null;

export const characterMachine = setup({
  types: {
    context: {} as {
      position: { x: number; z: number };
      direction: Direction;
      // velocity: { x: number; y: number; z: number };
      velocity: Vector3;
      user: { name: string };
      stamina: number;
    },
    events: {} as
      | { type: 'character.sleep' }
      | { type: 'character.awake' }
      | { type: 'character.walk'; direction: Direction }
      | { type: 'character.greet' }
      | { type: 'character.sprint' }
      | { type: 'character.jump' }
      | { type: 'character.land' }
      | { type: 'character.stop' },
  },
  actions: {
    logTelemetry: () => {
      // TODO: implement
    },
    greet: (_, params: { name: string }) => {
      console.log(`Hello, ${params.name}!`);
    },
    updateDirection: assign(({ context, event }) => {
      assertEvent(event, 'character.walk');

      switch (event.direction) {
        case 'up':
          return {
            direction: 'up' as Direction,
          };
        case 'down':
          return {
            direction: 'down' as Direction,
          };
        case 'left':
          return {
            direction: 'left' as Direction,
          };

        case 'right':
          return {
            direction: 'right' as Direction,
          };

        default:
          return {
            direction: context.direction,
          };
      }
    }),
    updatePosition: assign(({ context, event }) => {
      assertEvent(event, 'character.walk');

      switch (event.direction) {
        case 'up':
          return {
            position: { z: context.position.z + 1, x: context.position.x },
          };
        case 'down':
          // context.position.z -= 1;
          return {
            position: { z: context.position.z - 1, x: context.position.x },
          };
        case 'left':
          // context.position.x += 1;
          return {
            position: { x: context.position.x + 1, z: context.position.z },
          };

        case 'right':
          // context.position.x -= 1;
          return {
            position: { x: context.position.x - 1, z: context.position.z },
          };

        default:
          return {
            position: { x: context.position.x, z: context.position.z },
          };
      }
    }),
    updateVelocity: assign(({ context, event }) => {
      assertEvent(event, 'character.walk');

      switch (event.direction) {
        case 'up': {
          // context.velocity.z = 1;

          // return {
          //   velocity: { z: 1, x: context.velocity.x, y: context.velocity.y },
          // };
          const moveVector = new Vector3(context.velocity.x, 0, 1);

          return {
            velocity: moveVector,
          };
        }
        case 'down': {
          // context.velocity.z = -1;
          // return {
          //   velocity: { z: -1, x: context.velocity.x, y: context.velocity.y },
          // };
          const moveVector = new Vector3(
            context.velocity.x,
            context.velocity.y,
            -1,
          );

          return {
            velocity: moveVector,
          };
        }
        case 'left': {
          // context.velocity.x = 1;
          // return {
          //   velocity: { x: -1, z: context.velocity.z, y: context.velocity.y },
          // };

          const moveVector = new Vector3(
            -1,
            context.velocity.y,
            context.velocity.z,
          );

          return {
            velocity: moveVector,
          };
        }
        case 'right': {
          // context.velocity.x = -1;
          // return {
          //   velocity: { x: 1, z: context.velocity.z, y: context.velocity.y },
          // };
          const moveVector = new Vector3(
            1,
            context.velocity.y,
            context.velocity.z,
          );

          return {
            velocity: moveVector,
          };
        }

        default:
          return {
            velocity: context.velocity,
          };
      }
    }),
  },
}).createMachine({
  id: 'character',
  initial: 'idle',
  context: {
    position: { x: 0, z: 0 },
    direction: 'up',
    // velocity: { x: 0, y: 0, z: 0 },
    velocity: new Vector3(),
    user: { name: 'Player' },
    stamina: 10,
  },
  entry: {
    type: 'greet',
    params: ({ context }) => ({
      name: context.user.name,
    }),
  },
  states: {
    asleep: {
      // ...
    },
    awake: {
      // ...
    },
    idle: {
      on: {
        'character.walk': {
          target: 'walking',
          actions: ['updateDirection', 'updatePosition', 'updateVelocity'],
        },
        'character.jump': {
          target: 'jumping',
        },
      },
    },
    walking: {
      on: {
        'character.walk': {
          target: 'walking',
          actions: ['updateDirection', 'updatePosition', 'updateVelocity'],
        },
        'character.stop': {
          target: 'idle',
        },
        'character.sprint': {
          target: 'sprinting',
        },
        'character.jump': {
          target: 'jumping',
        },
      },
    },
    sprinting: {
      on: {
        'character.walk': {
          target: 'walking',
          actions: ['updateDirection', 'updatePosition', 'updateVelocity'],
        },
        'character.stop': {
          target: 'idle',
        },
        'character.jump': {
          target: 'jumping',
        },
      },
    },
    jumping: {
      on: {
        'character.land': {
          target: 'idle',
        },
      },
    },
  },
});
