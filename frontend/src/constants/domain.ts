// Values match the backend choices (and the CSV dataset)
export const STATUSES = ['Aprobada', 'Rechazada', 'Pendiente', 'Reversada'] as const
export const CHANNELS = [
  'Tarjeta crédito',
  'Tarjeta débito',
  'Transferencia',
  'Billetera digital',
] as const
export const CATEGORIES = [
  'Supermercados',
  'Restaurantes',
  'Transporte',
  'Tecnología',
  'Salud',
  'Entretenimiento',
  'Servicios públicos',
  'Viajes',
  'Educación',
  'Ropa',
] as const
export const CITIES = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Pereira',
  'Manizales',
  'Santa Marta',
  'Cúcuta',
] as const

export type Status = (typeof STATUSES)[number]
export type Channel = (typeof CHANNELS)[number]
export type Category = (typeof CATEGORIES)[number]
export type City = (typeof CITIES)[number]
export type AmountRange = 'Bajo' | 'Medio' | 'Alto'
