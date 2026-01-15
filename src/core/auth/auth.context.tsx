import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useState } from 'react';
import { AuthService } from '../api/auth.service';
import { useSnackbar } from '../contexts/snackbar.context';
import { StorageEnum } from '../enums/storage.enum';
import type { Jwt } from '../models/jwt.interface';
import type { User } from '../models/user.interface';

type AuthContextData = {
  accessToken: string | null;
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const snackbar = useSnackbar();

  const storagedToken = localStorage.getItem(StorageEnum.ACCESS_TOKEN);
  const [accessToken, setAccessToken] = useState<string | null>(storagedToken);

  const decoded: Jwt | null = storagedToken
    ? (jwtDecode(storagedToken) as Jwt)
    : null;
  const [user, setUser] = useState<User | null>(decoded?.user);

  async function login(username: string, password: string) {
    try {
      const response = await AuthService.login(username, password);

      localStorage.setItem('accessToken', response.data.accessToken);
      AuthService.setTokens(response.data);
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
    } catch (e) {
      snackbar.error(e);
    }
  }

  function logout() {
    localStorage.removeItem(StorageEnum.ACCESS_TOKEN);
    setUser(null);
    setAccessToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
