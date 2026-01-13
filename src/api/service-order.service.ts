import type { ServiceOrder } from '../models/service-order.interface';
import api from './axios';

export const serviceOrderService = {
  async create<T>(payload) {
    return await api.post<T>('/service-order', payload);
  },
  async update(id, payload) {
    return await api.patch(`/service-order/${id}`, payload);
  },
  async find(id) {
    return await api.get<ServiceOrder>(`/service-order/${id}`);
  },

  async findAll() {
    return await api.get('/service-orders');
  },
};
