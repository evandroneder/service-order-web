import type { Client } from '../models/client.interface';
import api from './axios';

export const ClientService = {
  get(document) {
    return api.get<Client>(`/client/by-document?document=${document}`);
  },
  create(payload) {
    return api.post<Client>('/client', payload);
  },
};
