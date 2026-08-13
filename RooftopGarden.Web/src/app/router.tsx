/* eslint-disable react-refresh/only-export-components -- route config, not a component module */
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense, type ReactNode } from 'react'
import { RootLayout } from './RootLayout'
import { ProtectedRoute } from '../routes/ProtectedRoute'
import { AdminRoute } from '../routes/AdminRoute'

const LoginPage = lazy(() => import('../features/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('../features/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const ProfilePage = lazy(() => import('../features/auth/ProfilePage').then((m) => ({ default: m.ProfilePage })))

const ProductListPage = lazy(() =>
  import('../features/catalog/ProductListPage').then((m) => ({ default: m.ProductListPage })),
)
const ProductDetailPage = lazy(() =>
  import('../features/catalog/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })),
)
const AdminProductListPage = lazy(() =>
  import('../features/catalog/admin/AdminProductListPage').then((m) => ({ default: m.AdminProductListPage })),
)
const AdminProductForm = lazy(() =>
  import('../features/catalog/admin/AdminProductForm').then((m) => ({ default: m.AdminProductForm })),
)
const AdminCategoryList = lazy(() =>
  import('../features/catalog/admin/AdminCategoryList').then((m) => ({ default: m.AdminCategoryList })),
)

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
      { path: '/products', element: withSuspense(<ProductListPage />) },
      { path: '/products/:id', element: withSuspense(<ProductDetailPage />) },
      {
        element: <ProtectedRoute />,
        children: [{ path: '/profile', element: withSuspense(<ProfilePage />) }],
      },
      {
        element: <AdminRoute />,
        children: [
          { path: '/admin/products', element: withSuspense(<AdminProductListPage />) },
          { path: '/admin/products/new', element: withSuspense(<AdminProductForm />) },
          { path: '/admin/products/:id/edit', element: withSuspense(<AdminProductForm />) },
          { path: '/admin/categories', element: withSuspense(<AdminCategoryList />) },
        ],
      },
    ],
  },
])
