import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clienteService } from '../services/clienteService';
import type { 
  Cliente, 
  ClienteDetalle,
  CreateClienteDto, 
  UpdateClienteDto,
  ApiError 
} from '../types/cliente';
import { useState } from 'react';

export const CLIENTE_QUERY_KEYS = {
  all: ['clientes'] as const,
  lists: () => [...CLIENTE_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...CLIENTE_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...CLIENTE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...CLIENTE_QUERY_KEYS.details(), id] as const,
  search: (nombre: string) => [...CLIENTE_QUERY_KEYS.all, 'search', nombre] as const,
};

export function useGetAllClientes() {
  return useQuery({
    queryKey: CLIENTE_QUERY_KEYS.lists(),
    queryFn: clienteService.getAllClientes,
    staleTime: 5 * 60 * 1000, 
  });
}

export function useGetCliente(id: number | null) {
  return useQuery<ClienteDetalle | null>({
    queryKey: CLIENTE_QUERY_KEYS.detail(id ?? -1),
    queryFn: () => clienteService.getClienteById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, 
  });
}

export function useSearchClientes(nombre: string) {
  return useQuery({
    queryKey: CLIENTE_QUERY_KEYS.search(nombre),
    queryFn: () => clienteService.searchClientes(nombre),
    enabled: !!nombre && nombre.trim().length > 0,
    staleTime: 2 * 60 * 1000, 
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();

  return useMutation<Cliente, ApiError, CreateClienteDto>({
    mutationFn: async (cliente: CreateClienteDto) => {
      const result = await clienteService.createCliente(cliente);
      if (!result) {
        throw new Error('Failed to create cliente');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTE_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();
  const [_id, setId] = useState<number | null>(null);
  return useMutation<void, ApiError, { id: number; data: UpdateClienteDto }>({
    mutationFn: async ({ id, data }) => {
      setId(id);
      const result = await clienteService.updateCliente(id, data);
      if (typeof result === 'object' && result?.message) {
        throw new Error('Failed to update cliente');
      }
      return;
    },
    onSuccess: (updatedCliente) => {
      queryClient.invalidateQueries({ queryKey: CLIENTE_QUERY_KEYS.lists() });
      
      queryClient.setQueryData(
        CLIENTE_QUERY_KEYS.detail(_id!),
        updatedCliente
      );
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: clienteService.deleteCliente,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: CLIENTE_QUERY_KEYS.lists() });
      
      queryClient.removeQueries({ queryKey: CLIENTE_QUERY_KEYS.detail(deletedId) });
    },
  });
}

export function useClienteOperations() {
  const getAllClientes = useGetAllClientes();
  const createCliente = useCreateCliente();
  const updateCliente = useUpdateCliente();
  const deleteCliente = useDeleteCliente();

  return {
    getAllClientes,
    createCliente,
    updateCliente,
    deleteCliente,
  };
}
