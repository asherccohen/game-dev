import useSound from 'use-sound';

import boopSfx from '../assets/sounds/bubble-sound-43207.mp3';

export const BoopButton = () => {
  const [play] = useSound(boopSfx);

  return <button onClick={() => play()}>Boop!</button>;
};
