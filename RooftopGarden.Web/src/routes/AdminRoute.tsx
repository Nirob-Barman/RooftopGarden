import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

export function AdminRoute() {
  const role = useAppSelector((state) => state.auth.user?.role)
  return role === 'Admin' ? <Outlet /> : <Navigate to="/" replace />
}
