const TIME_ZONE = 'America/Bogota'

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})
const numberFormatter = new Intl.NumberFormat('es-CO')
const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeZone: TIME_ZONE,
})
const dateTimeFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: TIME_ZONE,
})
const monthFormatter = new Intl.DateTimeFormat('es-CO', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export const formatCOP = (value: number) => currencyFormatter.format(value)

export const formatNumber = (value: number) => numberFormatter.format(value)

export const formatPercent = (value: number) => `${value.toLocaleString('es-CO')} %`

export const formatDate = (isoDate: string) => dateFormatter.format(new Date(isoDate))

export const formatDateTime = (isoDate: string) =>
  dateTimeFormatter.format(new Date(isoDate))

export function formatMonth(month: string) {
  const [year, monthNumber] = month.split('-').map(Number)
  return monthFormatter.format(new Date(Date.UTC(year, monthNumber - 1, 1)))
}
