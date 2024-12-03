import { NuqsAdapter } from 'nuqs/adapters/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import ErrorPage from 'scenes/error';
import Layout from 'scenes/layout';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <Layout>
          <NuqsAdapter>
            <Outlet />
          </NuqsAdapter>
        </Layout>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/3D/playground',
          lazy: () => import('./scenes/rpg/3d/playground/root'),
        },
        // {
        //   path: '/edit',
        //   lazy: () => import('./scenes/rpg/3d/playground/root'),
        // },
        {
          path: '/2D/playground',
          lazy: () => import('./scenes/rpg/2D/playground/root'),
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: false,
      v7_skipActionErrorRevalidation: true,
      // v7_startTransition: true,
    },
  },
);

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
