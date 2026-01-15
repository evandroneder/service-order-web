import type { Company } from './company.interface';
import type { User } from './user.interface';

export interface Jwt {
  accessToken: string;
  refreshToken: string;
  user: User;
  company: Company;
}
