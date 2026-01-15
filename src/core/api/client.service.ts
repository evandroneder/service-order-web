import type { Client } from '../models/client.interface';
import api from './axios';

export const ClientService = {
  get(document) {
    return api.get<Client>(`/client/by-document`, {
      params: {
        document,
      },
    });
  },
  getAll({ document, name }: { document?: string; name?: string }) {
    return api.get<Client[]>(`/clients`, {
      params: {
        document,
        name,
      },
    });
  },
  create(payload) {
    return api.post<Client>('/client', payload);
  },
};
