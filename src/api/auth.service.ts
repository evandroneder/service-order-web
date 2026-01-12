let accessToken: string | null = localStorage.getItem('accessToken');
let refreshToken: string | null = null;

export const AuthTokenService = {
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
};
