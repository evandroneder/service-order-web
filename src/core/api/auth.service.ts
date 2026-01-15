import { StorageEnum } from '../enums/storage.enum';
import type { AuthResponse } from '../models/auth.interface';
import type { User } from '../models/user.interface';
import api from './axios';

let accessToken: string | null = localStorage.getItem(StorageEnum.ACCESS_TOKEN);

export const AuthService = {
  setTokens(tokens: { accessToken: string }) {
    accessToken = tokens.accessToken;
  },

  clearTokens() {
    accessToken = null;
    localStorage.clear();
  },

  getAccessToken() {
    return accessToken;
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
