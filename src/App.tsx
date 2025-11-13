import { useState, useEffect } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ClienteModal from "./components/ClienteModal"
import DeleteClienteModal from "./components/DeleteClienteModal"
import ClienteDetalleModal from "./components/ClienteDetalleModal"
import { useGetAllClientes, useSearchClientes, useCreateCliente, useDeleteCliente, useUpdateCliente, useGetCliente } from "./hooks/useClientes"
import type { Cliente, CreateClienteDto, UpdateClienteDto } from "./types/cliente"
import { formatDateDisplay } from "./lib/utils"

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingClienteId, setDeletingClienteId] = useState<number | null>(null)
  const [deletingClienteNombre, setDeletingClienteNombre] = useState<string>("")
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [viewingClienteId, setViewingClienteId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data: allClientes, isLoading: isLoadingAll } = useGetAllClientes()
  const { data: searchResults, isLoading: isSearching } = useSearchClientes(debouncedSearchTerm)
  
  const clientes = debouncedSearchTerm.trim() ? searchResults : allClientes
  const isLoading = debouncedSearchTerm.trim() ? isSearching : isLoadingAll
  const createClienteMutation = useCreateCliente()
  const updateClienteMutation = useUpdateCliente()
  const deleteClienteMutation = useDeleteCliente()

 const { data: clienteDetalle, isLoading: isLoadingDetalle } = useGetCliente(viewingClienteId);

  const handleCreateCliente = (formData: CreateClienteDto) => {
    createClienteMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Cliente creado exitosamente!")
        setModalOpen(false)
      },
      onError: (error) => {
        toast.error(`Error al crear cliente: ${error.message}`)
      }
    })
  }

  const handleUpdateCliente = (formData: UpdateClienteDto) => {
    if (editingCliente) {
      updateClienteMutation.mutate(
        {
          id: editingCliente.id, 
          data: formData
        }, {
        onSuccess: () => {
          toast.success("Cliente actualizado exitosamente!")
          setModalOpen(false)
          setIsEditing(false)
          setEditingCliente(null)
        },
        onError: (error) => {
          toast.error(`Error al actualizar cliente: ${error.message}`)
        }
      })
    }
  }

  const handleDeleteCliente = (id: number) => {
    deleteClienteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Cliente eliminado exitosamente!")
      },
      onError: (error) => {
        toast.error(`Error al eliminar cliente: ${error.message}`)
      }
    })
  }

  const openDeleteModal = (cliente: Cliente) => {
    setDeletingClienteId(cliente.id)
    setDeletingClienteNombre(`${cliente.nombres} ${cliente.apellidos}`)
    setDeleteModalOpen(true)
  }

  const handleDeleteSuccess = () => {
    setDeleteModalOpen(false)
    setDeletingClienteId(null)
    setDeletingClienteNombre("")
  }

  const openCreateModal = () => {
    setIsEditing(false)
    setEditingCliente(null)
    setModalOpen(true)
  }

  const openEditModal = (cliente: Cliente) => {
    setIsEditing(true)
    setEditingCliente(cliente)
    setModalOpen(true)
  }

  const openDetailModal = (cliente: Cliente) => {
    setViewingClienteId(cliente.id)
    setDetailModalOpen(true)
  }

  const handleDetailModalClose = () => {
    setDetailModalOpen(false)
    setViewingClienteId(null)
  }

  const handleSuccess = () => {
    setModalOpen(false)
    setIsEditing(false)
    setEditingCliente(null)
  }

  const handleSubmit = (formData: CreateClienteDto | UpdateClienteDto) => {
    if (isEditing) {
      handleUpdateCliente(formData as UpdateClienteDto)
    } else {
      handleCreateCliente(formData as CreateClienteDto)
    }
  }

  const handleResetSearch = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
  }


  return (
    <div className="p-10 space-y-3 md:space-y-6 flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={openCreateModal} className="text-white hover:cursor-pointer">
          Cargar Cliente
        </Button>
      </div>

      <div className="flex gap-4 items-center ">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full shadow-none"
          />
        </div>
        {searchTerm && (
          <Button 
            variant="outline" 
            onClick={handleResetSearch}
            className="shrink-0 shadow-none hover:cursor-pointer"
          >
            Limpiar
          </Button>
        )}
      </div>

      <ClienteModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        isEditing={isEditing}
        cliente={editingCliente}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
      />

      <DeleteClienteModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        clienteId={deletingClienteId}
        clienteNombre={deletingClienteNombre}
        onSubmit={handleDeleteCliente}
        onSuccess={handleDeleteSuccess}
      />

     <ClienteDetalleModal
      isOpen={detailModalOpen}
      onOpenChange={handleDetailModalClose}
      cliente={clienteDetalle}
      isLoading={isLoadingDetalle}
    />

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Nombre y Apellido</th>
              <th className="p-2 text-left">Fecha de Nacimiento</th>
              <th className="p-2 text-left">Cuit</th>
              <th className="p-2 text-left">Domicilio</th>
              <th className="p-2 text-left">TelefonoCelular</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="p-4" colSpan={7}>Loading...</td></tr>
            ) : (
              clientes?.length === 0 ? (
                <tr><td className="p-4" colSpan={7}>
                  {debouncedSearchTerm.trim() 
                    ? `No se encontraron clientes con el nombre "${debouncedSearchTerm}"` 
                    : "No hay clientes cargados"
                  }
                </td></tr>
              ) : (
              clientes?.map((cliente: Cliente, idx: number) => (
                <tr key={cliente.id || idx} className="border-t">
                  <td className="p-2 text-left">{cliente.nombres + ' ' + cliente.apellidos}</td>
                  <td className="p-2 text-left">{formatDateDisplay(cliente.fechaNacimiento)}</td>
                  <td className="p-2 text-left">{cliente.cuit}</td>
                  <td className="p-2 text-left">{cliente.domicilio}</td>
                  <td className="p-2 text-left">{cliente.telefonoCelular}</td>
                  <td className="p-2 text-left">{cliente.email}</td>
                  <td className="p-2 text-left space-x-2">
                    <Button 
                      size="sm"
                      className="text-black hover:cursor-pointer"
                      variant="outline"
                      onClick={() => openDetailModal(cliente)}
                    >
                      Ver Detalle
                    </Button>
                    <Button 
                      size="sm"
                     className="text-white hover:cursor-pointer"
                      onClick={() => openEditModal(cliente)}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm"
                      className="text-white hover:cursor-pointer"
                      variant="destructive"
                      onClick={() => openDeleteModal(cliente)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              )))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
