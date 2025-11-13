import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import type { Cliente, CreateClienteDto, UpdateClienteDto } from "../types/cliente"
import { formatDateDisplay } from "../lib/utils"

interface ClienteModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  cliente?: Cliente | null
  onSubmit: (data: CreateClienteDto | UpdateClienteDto) => void
  onSuccess: () => void
}

interface FormData {
  nombres: string
  apellidos: string
  fechaNacimiento: string
  cuit: string
  domicilio: string
  telefonoCelular: string
  email: string
}

const formatCUIT = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  
  const limited = numbers.slice(0, 11)
  
  if (limited.length <= 2) {
    return limited
  } else if (limited.length <= 10) {
    return `${limited.slice(0, 2)}-${limited.slice(2)}`
  } else {
    return `${limited.slice(0, 2)}-${limited.slice(2, 10)}-${limited.slice(10)}`
  }
}

const formatDate = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  
  const limited = numbers.slice(0, 8)
  
  if (limited.length <= 2) {
    return limited
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`
  }
}

const validateCUIT = (cuit: string): boolean => {
  const numbers = cuit.replace(/\D/g, '')
  if (numbers.length !== 11) return false
  
  const digitos = numbers.split('').map(Number)
  const multiplos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  
  let sum = 0
  for (let i = 0; i < 10; i++) {
    sum += digitos[i] * multiplos[i]
  }
  
  const resto = sum % 11
  const checkDigito = resto < 2 ? resto : 11 - resto
  
  return checkDigito === digitos[10]
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateDate = (date: string): boolean => {
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
  if (!dateRegex.test(date)) return false
  
  const [, day, month, year] = date.match(dateRegex) || []
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  
  return dateObj.getDate() === parseInt(day) &&
         dateObj.getMonth() === parseInt(month) - 1 &&
         dateObj.getFullYear() === parseInt(year) &&
         dateObj <= new Date() 
}

export default function ClienteModal({ 
  isOpen, 
  onOpenChange, 
  isEditing, 
  cliente = null, 
  onSubmit, 
  onSuccess 
}: ClienteModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<FormData>()




  const cuitValue = watch("cuit")
  const fechaValue = watch("fechaNacimiento", "")

  useEffect(() => {
    if (isEditing && cliente) {
      const formData = {
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        fechaNacimiento: formatDateDisplay(cliente.fechaNacimiento),
        cuit: cliente.cuit,
        domicilio: cliente.domicilio,
        telefonoCelular: cliente.telefonoCelular,
        email: cliente.email
      }
      reset(formData)
    } else if (!isEditing) {
      const emptyFormData = {
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        cuit: "",
        domicilio: "",
        telefonoCelular: "",
        email: ""
      }
      reset(emptyFormData)
    }
  }, [isEditing, cliente, reset])

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const handleCuitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCUIT(e.target.value)
    setValue("cuit", formatted)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDate(e.target.value)
    setValue("fechaNacimiento", formatted)
  }

  const onFormSubmit = (data: FormData) => {
    const validationErrors: string[] = []

    if (!data.nombres.trim()) validationErrors.push("El nombre es obligatorio")
    if (!data.apellidos.trim()) validationErrors.push("El apellido es obligatorio")
    if (!data.cuit.trim()) validationErrors.push("El CUIT es obligatorio")
    if (!data.telefonoCelular.trim()) validationErrors.push("El teléfono celular es obligatorio")
    if (!data.email.trim()) validationErrors.push("El email es obligatorio")

    if (data.fechaNacimiento && !validateDate(data.fechaNacimiento)) {
      validationErrors.push("La fecha de nacimiento debe tener formato DD/MM/YYYY válido")
    }

    if (data.email && !validateEmail(data.email)) {
      validationErrors.push("El email debe tener un formato válido")
    }

    if (data.cuit && !validateCUIT(data.cuit)) {
      validationErrors.push("El CUIT debe ser válido")
    }

    if (validationErrors.length > 0) {
      return
    }
    console.log("Fecha de nacimiento válida:", data.fechaNacimiento)
    const fecha_partes = data.fechaNacimiento?.split("/");

    const clienteData = {
      ...data,
      fechaNacimiento: new Date(Number(fecha_partes[2]), Number(fecha_partes[1]) - 1, Number(fecha_partes[0]))
    }

    if (isEditing && cliente) {
      onSubmit({ ...clienteData, id: cliente.id })
    } else {
      onSubmit(clienteData as CreateClienteDto)
    }
    onSuccess()
  }


  useEffect(() => {
    console.log(errors.cuit, errors.fechaNacimiento)
  }, [errors])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("nombres", { required: "El nombre es obligatorio" })}
              placeholder="Nombres *"
              className={errors.nombres ? "border-red-500" : ""}
            />
            {errors.nombres && (
              <span className="text-red-500 text-sm">{errors.nombres.message}</span>
            )}
          </div>

          <div>
            <Input
              {...register("apellidos", { required: "El apellido es obligatorio" })}
              placeholder="Apellidos *"
              className={errors.apellidos ? "border-red-500" : ""}
            />
            {errors.apellidos && (
              <span className="text-red-500 text-sm">{errors.apellidos.message}</span>
            )}
          </div>

          <div>
            <Input
              {...register("fechaNacimiento", { 
                required: "La fecha de nacimiento es obligatoria",
                validate: (value) => validateDate(value) || "Fecha inválida"
              })}
              value={fechaValue}
              onChange={handleDateChange}
              placeholder="Fecha de Nacimiento (DD/MM/YYYY) *"
              className={errors.fechaNacimiento ? "border-red-500" : ""}
            />
            {errors.fechaNacimiento && (
              <span className="text-red-500 text-sm">{errors.fechaNacimiento.message}</span>
            )}
          </div>

          <div>
            <Input
                {...register("cuit", { 
                  required: "El CUIT es obligatorio",
                  validate: (value) => validateCUIT(value) || "CUIT inválido"
                })}
              value={cuitValue}
              onChange={handleCuitChange}
              placeholder="CUIT (XX-XXXXXXXX-X) *"
              className={errors.cuit ? "border-red-500" : ""}
            />
            {errors.cuit && (
              <span className="text-red-500 text-sm">{errors.cuit.message}</span>
            )}
          </div>

          <div>
            <Input
              {...register("domicilio")}
              placeholder="Domicilio"
            />
          </div>

          <div>
            <Input
              {...register("telefonoCelular", { required: "El teléfono celular es obligatorio" })}
              placeholder="Teléfono Celular *"
              className={errors.telefonoCelular ? "border-red-500" : ""}
            />
            {errors.telefonoCelular && (
              <span className="text-red-500 text-sm">{errors.telefonoCelular.message}</span>
            )}
          </div>

          <div>
            <Input
              {...register("email", { 
                required: "El email es obligatorio",
                validate: validateEmail || "Email inválido"
              })}
              placeholder="Email *"
              type="email"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>

          <Button type="submit" className="w-full">
            {isEditing ? "Actualizar Cliente" : "Crear Cliente"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
