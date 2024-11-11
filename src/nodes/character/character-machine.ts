import { createMachine } from 'xstate';

export const characterMachine = createMachine({
  id: 'character',
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
