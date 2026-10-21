import { Link, NavLink } from 'react-router'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transactions', label: 'Transacciones' },
]

export default function Navbar() {
  return (
    <header className="border-b border-line bg-surface">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-bold text-accent">
          PayFlow
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <ul className="flex gap-4 text-sm font-medium sm:gap-6">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? 'text-accent' : 'text-fg-muted hover:text-fg'
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
