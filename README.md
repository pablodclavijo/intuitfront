# Challenge Intuit FRONT

  

SPA en react y vite usando npx create-vite-app@latest para coding challenge de la empresa Intuit Salud / Yappa. Por Pablo Clavijo

  

---

  

## Tecnologías

  

- .React

- Vite

- Shadcn para componentes

- Tailwind CSS
- Tanstack Query para fetching y mutaciones

- React-hook-form para formularios
- -Toastify para toasts

  

---

  

## Estructura del proyecto

  

IntuitFront/src

├──Hooks/ hook useClient para manejar la interacción con servicios

├── lib/ inicialización del cliente para interactuar con la api y utils

├── services/ interacción propiamente dicha

├── types/ todos los tipos

├── components/ elementos de la ui de shadcn y modales propios

App.tsx 


  
  

---

  

## Configuración mínima

  

### 1. .ENV

  

crear archivo .env y pasarle la dirección del backend

    VITE_API_BASE_URL=https://localhost:7277/api


## Funcionalidades

 - Grilla con todos los clientes
 - Creación de clientes
 - Modificación
 - Eliminado
 - Búsqueda por nombre, apellido, nombre y apellido o substring de éstos desde el backend

  

## Cómo correr

 

    cd intuitfront
    npm install
    npm run dev
