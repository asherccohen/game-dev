import { useActor } from '@xstate/react';
import React, { useEffect, useRef, useState } from 'react';
import { gameMachine } from '../core/machine';

export const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [actor] = useActor(gameMachine);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add command to history
    setHistory((prev) => [...prev, `> ${input}`]);

    // Process command
    // TODO: Implement command processing

    setInput('');
  };

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="h-screen bg-black text-green-500 p-4 font-mono">
      <div ref={terminalRef} className="h-[calc(100vh-100px)] overflow-y-auto">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex mt-4">
        <span className="mr-2">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none"
          autoFocus
        />
      </form>
    </div>
  );
};
