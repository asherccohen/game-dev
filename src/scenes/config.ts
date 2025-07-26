export const navLinks = [
  {
    href: '/3D/playground',
    label: '3D Playground',
    imageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    gradientClass: 'bg-gradient-to-br from-purple-500 to-pink-500',
    height: 'h-[500px]',
    description: 'Explore a 3D world of creativity and technology',
  },
  {
    href: '/2D/playground',
    label: '2D Playground',
    imageUrl:
      'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80',
    gradientClass: 'bg-gradient-to-br from-blue-500 to-teal-500',
    height: 'h-[400px]',
    description: 'Explore a 2D world of creativity and technology',
  },
  {
    href: '/2D/war-tactics',
    label: 'War Tactics',
    imageUrl:
      'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&q=80',
    gradientClass: 'bg-gradient-to-br from-orange-500 to-red-500',
    height: 'h-[600px]',
    description: 'Explore a 2D War Tactics world',
  },
];

export type NavLinkType = {
  href: string;
  label: string;
  description: string;
  imageUrl: string;
  gradientClass: string;
  height: string;
};
