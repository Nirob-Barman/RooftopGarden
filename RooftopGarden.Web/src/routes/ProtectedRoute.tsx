import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.accessToken))
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
