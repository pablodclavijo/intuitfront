# Sistema CRUD de Clientes

Este documento describe la implementación completa del sistema CRUD para clientes usando TanStack Query.

## 📁 Estructura de Archivos

```
src/
├── types/
│   └── cliente.ts          # Interfaces y tipos TypeScript
├── lib/
│   └── api.ts             # Cliente HTTP configurado
├── services/
│   └── clienteService.ts  # Funciones de API para clientes
├── hooks/
│   └── useClientes.ts     # Custom hooks con TanStack Query
└── examples/
    └── clienteExample.tsx # Ejemplo completo de uso
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Endpoints de API Esperados

La implementación asume que tu API tiene los siguientes endpoints:

- `GET /clientes` - Obtiene todos los clientes
- `GET /clientes/{id}` - Obtiene un cliente por ID
- `GET /clientes/search?nombre={nombre}` - Búsqueda por nombre
- `POST /clientes` - Crea un nuevo cliente
- `PUT /clientes/{id}` - Actualiza un cliente existente
- `DELETE /clientes/{id}` - Elimina un cliente

## 📋 Campos de Cliente

```typescript
interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string; // formato ISO date string
  cuit: string;
  domicilio: string;
  telefonoCelular: string;
  email: string;
}
```

## 🎯 Hooks Disponibles

### 1. useGetAllClientes()
Obtiene todos los clientes.

```typescript
import { useGetAllClientes } from './hooks/useClientes';

function MiComponente() {
  const { data: clientes, isLoading, error } = useGetAllClientes();
  
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {clientes?.map(cliente => (
        <li key={cliente.id}>
          {cliente.nombres} {cliente.apellidos}
        </li>
      ))}
    </ul>
  );
}
```

### 2. useGetCliente(id)
Obtiene un cliente específico por ID.

```typescript
import { useGetCliente } from './hooks/useClientes';

function DetalleCliente({ clienteId }: { clienteId: number }) {
  const { data: cliente, isLoading } = useGetCliente(clienteId);
  
  if (isLoading) return <div>Cargando cliente...</div>;
  
  return (
    <div>
      <h2>{cliente?.nombres} {cliente?.apellidos}</h2>
      <p>Email: {cliente?.email}</p>
      <p>CUIT: {cliente?.cuit}</p>
    </div>
  );
}
```

### 3. useSearchClientes(nombre)
Busca clientes por nombre.

```typescript
import { useSearchClientes } from './hooks/useClientes';
import { useState } from 'react';

function BuscarClientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: resultados, isLoading } = useSearchClientes(searchTerm);
  
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar por nombre..."
      />
      {isLoading && <p>Buscando...</p>}
      {resultados?.map(cliente => (
        <div key={cliente.id}>
          {cliente.nombres} {cliente.apellidos}
        </div>
      ))}
    </div>
  );
}
```

### 4. useCreateCliente()
Crea un nuevo cliente.

```typescript
import { useCreateCliente } from './hooks/useClientes';
import type { CreateClienteRequest } from './types/cliente';

function CrearCliente() {
  const createMutation = useCreateCliente();
  
  const handleSubmit = async (formData: CreateClienteRequest) => {
    try {
      await createMutation.mutateAsync(formData);
      alert('Cliente creado exitosamente');
    } catch (error) {
      alert('Error al crear cliente');
    }
  };
  
  return (
    <button
      onClick={() => handleSubmit({
        nombres: 'Juan',
        apellidos: 'Pérez',
        fechaNacimiento: '1990-01-01',
        cuit: '20-12345678-9',
        domicilio: 'Calle Falsa 123',
        telefonoCelular: '+54 11 1234-5678',
        email: 'juan@email.com'
      })}
      disabled={createMutation.isPending}
    >
      {createMutation.isPending ? 'Creando...' : 'Crear Cliente'}
    </button>
  );
}
```

### 5. useUpdateCliente()
Actualiza un cliente existente.

```typescript
import { useUpdateCliente } from './hooks/useClientes';
import type { UpdateClienteRequest } from './types/cliente';

function ActualizarCliente({ clienteId }: { clienteId: number }) {
  const updateMutation = useUpdateCliente();
  
  const handleUpdate = async () => {
    const updatedData: UpdateClienteRequest = {
      nombres: 'Juan Carlos',
      apellidos: 'Pérez González',
      fechaNacimiento: '1990-01-01',
      cuit: '20-12345678-9',
      domicilio: 'Nueva Dirección 456',
      telefonoCelular: '+54 11 9876-5432',
      email: 'juan.nuevo@email.com'
    };
    
    try {
      await updateMutation.mutateAsync({ id: clienteId, data: updatedData });
      alert('Cliente actualizado exitosamente');
    } catch (error) {
      alert('Error al actualizar cliente');
    }
  };
  
  return (
    <button
      onClick={handleUpdate}
      disabled={updateMutation.isPending}
    >
      {updateMutation.isPending ? 'Actualizando...' : 'Actualizar Cliente'}
    </button>
  );
}
```

### 6. useDeleteCliente()
Elimina un cliente.

```typescript
import { useDeleteCliente } from './hooks/useClientes';

function EliminarCliente({ clienteId }: { clienteId: number }) {
  const deleteMutation = useDeleteCliente();
  
  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await deleteMutation.mutateAsync(clienteId);
        alert('Cliente eliminado exitosamente');
      } catch (error) {
        alert('Error al eliminar cliente');
      }
    }
  };
  
  return (
    <button
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
    >
      {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar Cliente'}
    </button>
  );
}
```

### 7. useClienteOperations()
Hook combinado para todas las operaciones.

```typescript
import { useClienteOperations } from './hooks/useClientes';

function ClienteManager() {
  const {
    getAllClientes,
    createCliente,
    updateCliente,
    deleteCliente
  } = useClienteOperations();
  
  // Usar las queries y mutations según necesites
  const { data: clientes } = getAllClientes;
  
  return (
    <div>
      {/* Tu componente aquí */}
    </div>
  );
}
```

## ⚡ Características Implementadas

### Cache Automático
- TanStack Query maneja automáticamente el cache
- Los datos se mantienen frescos por 5 minutos (queries)
- Las búsquedas se cachean por 2 minutos

### Invalidación de Cache
- Después de crear un cliente, se invalida la lista
- Después de actualizar, se invalida la lista y se actualiza el detalle
- Después de eliminar, se invalida la lista y se remueve del cache

### Manejo de Errores
- Errores HTTP se manejan automáticamente
- Errores de red se capturan y formatean
- Tipos específicos para errores de API

### Optimización
- Queries deshabilitadas cuando no hay parámetros necesarios
- Configuración de `staleTime` para evitar re-fetch innecesarios
- Tipos TypeScript completos para seguridad de tipos

## 🧪 Ejemplo Completo

Ve el archivo `src/examples/clienteExample.tsx` para un ejemplo completo que demuestra todas las funcionalidades implementadas.

## 🔒 Formato de Respuesta de API Esperado

```typescript
// Para operaciones exitosas
{
  "data": Cliente | Cliente[],
  "success": true,
  "message": "Operación exitosa" // opcional
}

// Para errores
{
  "message": "Descripción del error",
  "success": false
}
```

## 🚀 Próximos Pasos

Para usar esta funcionalidad en tu aplicación:

1. Asegúrate de que tu API siga el formato esperado
2. Configura la variable de entorno `VITE_API_BASE_URL`
3. Importa y usa los hooks según tus necesidades
4. Personaliza los componentes de UI según tu diseño

## 📝 Notas Técnicas

- Se utiliza `fetch` nativo en lugar de axios para reducir dependencias
- Todos los tipos están completamente tipados con TypeScript
- Los hooks siguen las mejores prácticas de TanStack Query
- La configuración es extensible y personalizable
