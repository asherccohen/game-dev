import { NavLink } from 'react-router-dom';
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
        <NavLink to="play" style={{ color: 'white', textDecoration: 'none' }}>
          Play
        </NavLink>
        <NavLink to="edit" style={{ color: 'white', textDecoration: 'none' }}>
          Edit
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
