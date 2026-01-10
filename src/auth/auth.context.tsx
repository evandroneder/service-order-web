import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import type { User } from '../models/user.interface';

type AuthContextData = {
  accessToken: string | null;
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  handleRefreshToken: () => void;
};

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('accessToken'),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  async function loadUser() {
    if (!accessToken) {
      return;
    }

    try {
      const response = await api.get<User>('/me', {});
      setUser(response.data);
    } catch (e) {
      console.error(e);
      setUser(null);
      setAccessToken(null);
    }
  }

  async function login(username: string, password: string) {
    const response = await api.post<AuthResponse>('/login', {
      username,
      password,
    });

    localStorage.setItem('accessToken', response.data.accessToken);
    setRefreshToken(response.data.refreshToken);
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
  }

  async function handleRefreshToken() {
    if (!refreshToken) return;

    // futuramente:
    // const response = await api.post("/refresh", { refreshToken })
    // setAccessToken(response.data.accessToken)
  }

  function logout() {
    localStorage.removeItem('accessToken');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, handleRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
