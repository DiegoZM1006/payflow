import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'

// Heavy pages (charts, tables) are loaded on demand to keep the landing bundle small
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
