import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateDisplay(dateString: string | null | undefined): string {
  if (!dateString) return ""
  
  try {
    const date = new Date(dateString)
    
    if (isNaN(date.getTime())) return dateString
    
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  } catch {
    return dateString
  }
}
