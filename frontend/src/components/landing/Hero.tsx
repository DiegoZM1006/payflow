import { Link } from 'react-router'

export default function Hero() {
  return (
    <section className="py-12 text-center sm:py-20">
      <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
        Herramienta interna · Equipo comercial
      </p>
      <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Entiende el volumen transaccional de PayFlow
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
        Cuánto se mueve, en qué categorías, por qué canales y con qué tasa de aprobación: todo en un
        solo lugar, con datos de pagos con tarjeta, transferencia y billetera digital en Colombia.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/dashboard"
          className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Ir al dashboard
        </Link>
        <Link
          to="/transactions"
          className="rounded-lg px-6 py-3 font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-white"
        >
          Explorar transacciones
        </Link>
      </div>
    </section>
  )
}
