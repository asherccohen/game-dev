import './layout.css';

import { PropsWithChildren } from 'react';
import { NavLinkType } from './config';

const Layout = ({
  children,
  navLinks,
}: PropsWithChildren<{
  navLinks: NavLinkType[];
}>) => {
  return (
    <div>
      {/* <nav
        style={{
          display: 'flex',
          gap: '3em',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            style={({ isActive }) => ({
              color: isActive ? 'yellow' : 'white',
              textDecoration: 'none',
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav> */}
      <main
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
