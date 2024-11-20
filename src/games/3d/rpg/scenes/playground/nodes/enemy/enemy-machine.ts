import { createMachine } from 'xstate';

export const enemyMachine = createMachine({
  id: 'enemy',
  initial: 'asleep',
  states: {
    asleep: {
      // ...
    },
    awake: {
      // ...
    },
    //...
  },
});
