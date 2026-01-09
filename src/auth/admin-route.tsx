import type { JSX } from "@emotion/react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth.context";

export function AdminRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "ADMIN") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
