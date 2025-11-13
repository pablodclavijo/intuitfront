import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"

interface DeleteClienteModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  clienteId: number | null
  clienteNombre?: string
  onSubmit: (id: number) => void
  onSuccess: () => void
}

export default function DeleteClienteModal({
  isOpen,
  onOpenChange,
  clienteId,
  clienteNombre = "este cliente",
  onSubmit,
  onSuccess,
}: DeleteClienteModalProps) {
  const handleConfirmDelete = () => {
    if (clienteId !== null) {
      onSubmit(clienteId)
      onSuccess()
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-base text-gray-600">
            ¿Estás seguro de que quieres eliminar a <strong>{clienteNombre}</strong>?
          </p>
          <p className="text-sm">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              className="hover:cursor-pointer"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              className="text-white hover:cursor-pointer"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
