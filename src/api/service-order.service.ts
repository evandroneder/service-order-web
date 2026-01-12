import api from './axios';

export const serviceOrderService = {
  async create(payload) {
    return await api.post('/service-order', payload);
  },
  async find(id) {
    return await api.get(`/service/order/${id}`);
  },
};
