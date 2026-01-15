import { jwtDecode } from 'jwt-decode';
import { StorageEnum } from '../enums/storage.enum';

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  exp: number;
}

export function getJwtData(): JwtPayload | null {
  const token = localStorage.getItem(StorageEnum.ACCESS_TOKEN);
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}
