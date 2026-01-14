import type { AuthResponse } from '../models/auth.interface';
import type { User } from '../models/user.interface';
import api from './axios';

let accessToken: string | null = localStorage.getItem('accessToken');
let refreshToken: string | null = null;

export const AuthService = {
  setTokens(tokens: { accessToken: string; refreshToken?: string }) {
    accessToken = tokens.accessToken;
    if (tokens.refreshToken) {
      refreshToken = tokens.refreshToken;
    }
  },

  clearTokens() {
    accessToken = null;
    refreshToken = null;
  },

  getAccessToken() {
    return accessToken;
  },

  getRefreshToken() {
    return refreshToken;
  },
  login(username, password) {
    return api.post<AuthResponse>('/login', {
      username,
      password,
    });
  },
  me() {
    return api.get<User>('/me');
  },
};
