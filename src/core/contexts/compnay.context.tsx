import { createContext, useContext, useState } from 'react';
import { getJwtData } from '../auth/jwt-decode';
import type { Company } from '../models/company.interface';

interface CompanyContextData {
  company: Company | null;
}

const CompanyContext = createContext({} as CompanyContextData);

export function CompanyProvider({ children }) {
  const decoded = getJwtData();
  const [company] = useState<Company | null>(decoded?.company);

  return (
    <CompanyContext.Provider value={{ company }}>
      {children}
    </CompanyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCompany = () => useContext(CompanyContext);
