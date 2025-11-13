export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string; 
  cuit: string;
  domicilio: string;
  telefonoCelular: string;
  email: string;
}

export interface ClienteDetalle {
  id: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string; 
  cuit: string;
  domicilio: string;
  telefonoCelular: string;
  email: string;
  fechaCreacion: Date;
  eliminado: boolean;
  fechaModificacion?: Date | null; 
}

export interface CreateClienteDto {
  id: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  cuit: string;
  domicilio: string;
  telefonoCelular: string;
  email: string;
}

export interface UpdateClienteDto {
  id: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  cuit: string;
  domicilio: string;
  telefonoCelular: string;
  email: string;
}


export interface SearchClientesParams {
  nombre: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}
