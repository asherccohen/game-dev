import { PropsWithChildren } from 'react';

const Card = ({
  children,
  title,
  content,
}: PropsWithChildren<{ title: string; content: string }>) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
      <img
        className="w-full h-auto rounded-t-xl"
        src="https://images.unsplash.com/photo-1680868543815-b8666dba60f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80"
        alt="Card Image"
      />
      <div className="p-4 md:p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-gray-500 dark:text-neutral-400">{content}</p>
        {children}
      </div>
    </div>
  );
};

export default Card;
