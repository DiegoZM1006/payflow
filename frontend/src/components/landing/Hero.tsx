import { Link } from 'react-router'

export default function Hero() {
  return (
    <section className="py-12 text-center sm:py-20">
      <p className="text-sm font-semibold tracking-wide text-accent uppercase">
        Herramienta interna · Equipo comercial
      </p>
      <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-fg sm:text-5xl">
        Entiende el volumen transaccional de PayFlow
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-fg-muted sm:text-lg">
        Cuánto se mueve, en qué categorías, por qué canales y con qué tasa de aprobación: todo en un
        solo lugar, con datos de pagos con tarjeta, transferencia y billetera digital en Colombia.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/dashboard"
          className="hover:bg-accent-soft0 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm"
        >
          Ir al dashboard
        </Link>
        <Link
          to="/transactions"
          className="rounded-lg px-6 py-3 font-semibold text-fg-muted ring-1 ring-line-strong hover:bg-surface"
        >
          Explorar transacciones
        </Link>
      </div>
    </section>
  )
}
