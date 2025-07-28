import React, { useEffect, useRef, useState } from 'react';
import { parseCommand } from '../core/parser';
import { Order } from '../core/types';

type Messages = string[];

export const Terminal = ({
  onCommand,
  messages = [],
}: {
  onCommand: (command: Order) => void;
  messages?: Messages;
}) => {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<string[] | null>(null);
  const [history, setHistory] = useState<Messages>(messages);

  const terminalRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add command to history
    setHistory((prev) => [...prev, `> ${input}`]);

    //Reset input & errors
    setInput('');
    setErrors(null);

    // Process command
    // TODO: Implement command processing
    const order = parseCommand(input.trim());

    if (!order) {
      // setErrors('Invalid command');
      setErrors(['Invalid command']);
      return;
    }

    onCommand(order);
  };

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="bg-black text-green-500 p-4 font-mono h-full w-full flex flex-col">
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto flex flex-col-reverse"
      >
        <div className="flex flex-col space-y-2">
          {errors?.map((error, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap max-w-[80%] p-2 rounded bg-gray-900 text-green-500`}
            >
              {error}
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-2">
          {history.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap max-w-[80%] p-2 rounded ${
                line.startsWith('> ')
                  ? 'ml-auto bg-green-900 text-green-300'
                  : 'bg-gray-900 text-green-500'
              }`}
            >
              {line.startsWith('> ') ? line.substring(2) : line}
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex mt-4 border-t border-green-800 pt-4"
      >
        <span className="mr-2">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none focus:border-green-500"
          autoFocus
        />
      </form>
    </div>
  );
};
