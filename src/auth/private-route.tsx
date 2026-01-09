import { Navigate } from "react-router-dom";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useAuth } from "./auth.context";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace/>;
  }

  return children;
}
