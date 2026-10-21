import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-3xl font-bold">Página no encontrada</h1>
      <Link to="/" className="mt-4 inline-block text-accent hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}
