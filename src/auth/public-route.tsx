import type { JSX } from '@emotion/react/jsx-runtime';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth.context';

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { accessToken } = useAuth();

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}
