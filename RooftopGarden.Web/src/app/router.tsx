/* eslint-disable react-refresh/only-export-components -- route config, not a component module */
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense, type ReactNode } from 'react'
import { RootLayout } from './RootLayout'
import { ProtectedRoute } from '../routes/ProtectedRoute'

const LoginPage = lazy(() => import('../features/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('../features/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const ProfilePage = lazy(() => import('../features/auth/ProfilePage').then((m) => ({ default: m.ProfilePage })))

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<div className="p-6">Loading...</div>}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <div className="p-6">Home</div> },
      { path: '/login', element: withSuspense(<LoginPage />) },
      { path: '/register', element: withSuspense(<RegisterPage />) },
      {
        element: <ProtectedRoute />,
        children: [{ path: '/profile', element: withSuspense(<ProfilePage />) }],
      },
    ],
  },
])
