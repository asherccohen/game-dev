import { NavLink } from 'react-router';
import './layout.css';

import { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <nav
        style={{
          display: 'flex',
          gap: '3em',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <NavLink
          to="3D/playground"
          style={{ color: 'white', textDecoration: 'none' }}
        >
          3D RPG
        </NavLink>
        {/* <NavLink to="3D/playground" style={{ color: 'white', textDecoration: 'none' }}>
          Edit
        </NavLink> */}
        <NavLink
          to="2D/playground"
          style={{ color: 'white', textDecoration: 'none' }}
        >
          2D RPG
        </NavLink>
      </nav>
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
