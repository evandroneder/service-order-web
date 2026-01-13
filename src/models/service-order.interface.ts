import type { Client } from './client.interface';
import type { Company } from './company.interface';

export type ServiceOrderItem = {
  id: string;
  quantity: number;
  description: string;
  value: number;
  // discount: number;
  total: number;
};

export interface ServiceOrder {
  products: ServiceOrderItem[];
  client: Client;
  company: Company;
  description: string;
  code: string;
  id_service_irder: number;
}
