import { useActor } from '@xstate/react';
import { gameMachine } from './core/machine';
import './global.css';
import { HUD } from './ui/HUD';
import { Terminal } from './ui/Terminal';

export const Component = () => {
  const [state, send] = useActor(gameMachine, {
    input: {
      tickInterval: 1000,
      victoryCondition: 'elimination',
      logs: [],
      turnCount: 0,
    },
  });
  console.log('🚀 ~ game state:', state.value);

  return (
    <div className="w-full h-screen bg-black">
      <HUD>
        <Terminal
          onCommand={(command) =>
            send({
              type: 'SUBMIT_ORDER',
              order: {
                unit: command.unit,
                action: command.action,
                modifiers: command.modifiers,
                destination: command.destination,
                target: command.target,
                time_constraint: command.time_constraint,
              },
            })
          }
        />
      </HUD>
    </div>
  );
};
