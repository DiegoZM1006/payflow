export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-fg-subtle sm:px-6">
        © {new Date().getFullYear()} PayFlow · Herramienta interna del equipo comercial
      </div>
    </footer>
  )
}
