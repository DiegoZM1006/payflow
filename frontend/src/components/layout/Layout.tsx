import { Suspense } from 'react'
import { Outlet } from 'react-router'
import Skeleton from '../ui/Skeleton'
import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
