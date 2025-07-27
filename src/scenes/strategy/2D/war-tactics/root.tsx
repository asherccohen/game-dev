import './global.css';
import { HUD } from './ui/HUD';
import { Terminal } from './ui/Terminal';

export const Component = () => {
  return (
    <div className="w-full h-screen bg-black">
      <HUD>
        <Terminal />
      </HUD>
    </div>
  );
};
