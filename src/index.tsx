import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import ErrorPage from 'routes/error';
import Layout from 'routes/layout';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <Layout>
          <Outlet />
        </Layout>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          lazy: () => import('./games/3d/rpg/scenes/playground/root'),
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
