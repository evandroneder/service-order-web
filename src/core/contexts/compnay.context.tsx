import { createContext, useContext, useState } from 'react';
import { useAuth } from '../auth/auth.context';
import type { Company } from '../models/company.interface';
import { jwtDecode } from 'jwt-decode';
import type { Jwt } from '../models/jwt.interface';

interface CompanyContextData {
  company: Company | null;
}

const CompanyContext = createContext({} as CompanyContextData);

export function CompanyProvider({ children }) {
  const { accessToken } = useAuth();
  const decoded: Jwt | null = accessToken
    ? (jwtDecode(accessToken) as Jwt)
    : null;
  const [company] = useState<Company | null>(decoded?.company);

  return (
    <CompanyContext.Provider value={{ company }}>
      {children}
    </CompanyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCompany = () => useContext(CompanyContext);
