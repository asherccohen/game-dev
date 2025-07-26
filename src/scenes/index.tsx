import MasonryCard from 'libs/ui/masonry-card';
import { NavLink } from 'react-router';
import { navLinks } from './config';

export const Component = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Game Dev</h1>
        <p className="text-gray-400 mb-8">
          Welcome to the Game Development Studio!
        </p>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {navLinks.map((link) => (
            <MasonryCard
              key={link.href}
              title={link.label}
              description={link.description}
              imageUrl={link.imageUrl}
              gradientClass={link.gradientClass}
              height={link.height}
            >
              <NavLink
                key={link.href}
                to={link.href}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2 text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30"
                style={({ isActive }) => ({
                  color: isActive ? 'yellow' : 'white',
                  textDecoration: 'none',
                })}
              >
                {link.label}
              </NavLink>
            </MasonryCard>
          ))}
        </div>
      </div>
    </div>
  );
};
