import { jwtDecode } from 'jwt-decode';
import { StorageEnum } from '../enums/storage.enum';
import type { Jwt } from '../models/jwt.interface';

export function getJwtData(): Jwt | null {
  const token = localStorage.getItem(StorageEnum.ACCESS_TOKEN);
  if (!token) return null;

  try {
    return jwtDecode<Jwt>(token);
  } catch {
    return null;
  }
}
