import {
  ErrorResponse,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';
import invariant from 'tiny-invariant';

type RouteError = {
  statusText: string;
  message: string;
};

function ErrorPage() {
  const error = useRouteError() as (RouteError | ErrorResponse) | null;

  invariant(error, 'error should be of type RouteError | ErrorResponse');

  return (
    <div
      id="error-page"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        backgroundColor: 'red',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          {isRouteErrorResponse(error) ? (
            <i>
              {error.status} {error.statusText}
            </i>
          ) : (
            <i>{error.statusText || error.message}</i>
          )}
        </p>

        {/* <button
        // onClick={resetErrorBoundary}
        >
          Try again
        </button> */}
      </div>
    </div>
  );
}

export default ErrorPage;
