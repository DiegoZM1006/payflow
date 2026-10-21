import { BarChart3, Gauge, ListFilter, Users } from 'lucide-react'

const features = [
  {
    icon: Gauge,
    title: 'Indicadores clave',
    description: 'Monto aprobado, número de transacciones, ticket promedio y tasa de aprobación.',
  },
  {
    icon: BarChart3,
    title: 'Tendencias y distribución',
    description: 'Evolución mensual, monto por categoría y transacciones por canal y estado.',
  },
  {
    icon: Users,
    title: 'Top clientes',
    description: 'Ranking de clientes por monto aprobado, con búsqueda y ordenamiento.',
  },
  {
    icon: ListFilter,
    title: 'Explorador de transacciones',
    description: 'Filtra, busca, ordena y exporta a CSV el detalle de cada transacción.',
  },
]

export default function Features() {
  return (
    <section className="py-16">
      <h2 className="text-center text-2xl font-bold text-fg sm:text-3xl">
        ¿Qué puedes ver en el dashboard?
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <article key={title} className="rounded-xl bg-surface p-6 shadow-sm ring-1 ring-line">
            <Icon aria-hidden="true" className="size-8 text-accent" />
            <h3 className="mt-4 font-semibold text-fg">{title}</h3>
            <p className="mt-2 text-sm text-fg-muted">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
