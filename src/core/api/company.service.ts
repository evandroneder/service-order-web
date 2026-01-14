import type { Company } from '../models/company.interface';
import api from './axios';

export const CompanyService = {
  async create<T>(payload) {
    return await api.post<T>('/company', payload);
  },
  async update(id, payload) {
    return await api.patch(`/company/${id}`, payload);
  },
  async find(id) {
    return await api.get<Company[]>(`/companies/${id}`);
  },

  async findAll() {
    return await api.get('/companiess');
  },
};
