import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { navLinks } from 'scenes/config';
import ErrorPage from 'scenes/error';
import Layout from 'scenes/layout';
import './App.css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <Layout navLinks={navLinks}>
          <Outlet />
        </Layout>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          lazy: () => import('./scenes/index'),
        },
        {
          path: '/3D/playground',
          lazy: () => import('./scenes/rpg/3d/playground/root'),
        },
        {
          path: '/2D/playground',
          lazy: () => import('./scenes/rpg/2D/playground/root'),
        },
        {
          path: '/2D/war-tactics',
          lazy: () => import('./scenes/strategy/2D/war-tactics/root'),
        },
      ],
    },
  ],
  {
    future: {
      // v7_relativeSplatPath: true,
      // v7_fetcherPersist: true,
      // v7_normalizeFormMethod: true,
      // v7_partialHydration: false,
      // v7_skipActionErrorRevalidation: true,
      // v7_startTransition: true,
      unstable_middleware: false,
    },
  },
);

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <NuqsAdapter>
        <RouterProvider router={router} />
      </NuqsAdapter>
    </React.StrictMode>,
  );
}
