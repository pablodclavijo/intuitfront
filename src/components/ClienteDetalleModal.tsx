import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import type { ClienteDetalle } from "../types/cliente"
import { formatDateDisplay } from "../lib/utils"

interface ClienteDetalleModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  cliente: ClienteDetalle | null | undefined
  isLoading?: boolean
}

export default function ClienteDetalleModal({ 
  isOpen, 
  onOpenChange, 
  cliente,
  isLoading = false
}: ClienteDetalleModalProps) {

    console.log("cliente", cliente);

  const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return "No disponible"
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      return dateObj.toLocaleString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
    } catch {
      return "Fecha inválida"
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Cliente</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Cargando...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!cliente) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Cliente</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">No se encontró información del cliente.</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle del Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombres:</label>
                <p className="text-gray-900 mt-1">{cliente?.nombres || "No especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Apellidos:</label>
                <p className="text-gray-900 mt-1">{cliente?.apellidos || "No especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Nacimiento:</label>
                <p className="text-gray-900 mt-1">
                  {cliente?.fechaNacimiento ? formatDateDisplay(cliente.fechaNacimiento) : "No especificado"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">CUIT:</label>
                <p className="text-gray-900 mt-1">{cliente?.cuit || "No especificado"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email:</label>
                <p className="text-gray-900 mt-1">{cliente?.email || "No especificado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Teléfono Celular:</label>
                <p className="text-gray-900 mt-1">{cliente?.telefonoCelular || "No especificado"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Domicilio:</label>
                <p className="text-gray-900 mt-1">{cliente?.domicilio || "No especificado"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">
              Información del Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">ID del Cliente:</label>
                <p className="text-gray-900 mt-1">{cliente?.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado:</label>
                <p className={`mt-1 font-medium ${cliente?.eliminado ? 'text-red-600' : 'text-green-600'}`}>
                  {cliente?.eliminado ? "Eliminado" : "Activo"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Creación:</label>
                <p className="text-gray-900 mt-1">{formatDateTime(cliente?.fechaCreacion)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Última Modificación:</label>
                <p className="text-gray-900 mt-1">{formatDateTime(cliente?.fechaModificacion)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
