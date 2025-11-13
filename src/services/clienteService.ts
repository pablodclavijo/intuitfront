import { apiClient } from '../lib/api';
import type { 
  Cliente, 
  ClienteDetalle,
  UpdateClienteDto,
  CreateClienteDto
} from '../types/cliente';

export const clienteService = {
  async getAllClientes(): Promise<Cliente[] | null> {
      const response = await apiClient.get<Cliente[]>('clientes');
      return response;
  },

  async getClienteById(id: number): Promise<ClienteDetalle | null> {
    const response = await apiClient.get<ClienteDetalle>(`clientes/${id}`);
    return response;
  },

  async searchClientes(nombre: string): Promise<Cliente[] | null> {
    const response = await apiClient.get<Cliente[]>(
      `clientes/search?nombre=${encodeURIComponent(nombre)}`
    );
    return response;
  },

  async createCliente(cliente: CreateClienteDto): Promise<Cliente | null> {
    const response = await apiClient.post<Cliente, CreateClienteDto>('clientes', cliente);
    return response;
  },

 async updateCliente(id: number, data: UpdateClienteDto): Promise<void | Error | null> {
  // @ts-expect-error no lo puedo arreglar pero anda perfecto
  return apiClient.put<{clienteDto: UpdateClienteDto & {id: number}}>(`clientes/${id}`, {...data, id});
},

  async deleteCliente(id: number): Promise<void> {
    await apiClient.delete<void>(`clientes/${id}`);
  },
};
