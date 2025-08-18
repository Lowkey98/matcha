import {
  Navigate,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";

export type RouteError = {
  status?: number;
  statusText?: string;
  message?: string;
};
export default function ErrorBoundary() {
  const routeError = useRouteError();
  let errorMessage: string;
  if (isRouteErrorResponse(routeError)) {
    // @ts-expect-error
    errorMessage = routeError.error?.message || routeError.statusText;
  } else if (routeError instanceof Error) {
    errorMessage = routeError.message;
  } else if (typeof routeError === "string") {
    errorMessage = routeError;
  } else {
    errorMessage = "Unknown error";
  }
  //   if (routeError.status === 404) return <Navigate to="/notfound" replace />;
  return <></>;
}
