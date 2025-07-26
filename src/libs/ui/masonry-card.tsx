'use client';

import { PropsWithChildren } from 'react';

interface MasonryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  gradientClass: string;
  height: string;
}

export const MasonryCard = ({
  title,
  description,
  imageUrl,
  gradientClass,
  height,
  children,
}: PropsWithChildren<MasonryCardProps>) => {
  return (
    <div
      className={`rounded-xl overflow-hidden ${height} transition-all duration-300 hover:scale-[1.02] group`}
    >
      <div className={`h-full w-full relative ${gradientClass}`}>
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <div className="relative h-full p-6 flex flex-col justify-end">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-200 text-sm mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MasonryCard;
