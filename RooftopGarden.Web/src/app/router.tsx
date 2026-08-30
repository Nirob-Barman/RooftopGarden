/* eslint-disable react-refresh/only-export-components -- route config, not a component module */
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense, type ReactNode } from 'react'
import { RootLayout } from './RootLayout'
import { AdminLayout } from './AdminLayout'
import { ProtectedRoute } from '../routes/ProtectedRoute'
import { AdminRoute } from '../routes/AdminRoute'
import { NotFoundPage } from '../features/not-found/NotFoundPage'

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

const CartPage = lazy(() => import('../features/cart/CartPage').then((m) => ({ default: m.CartPage })))

const CheckoutPage = lazy(() => import('../features/orders/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const OrderListPage = lazy(() => import('../features/orders/OrderListPage').then((m) => ({ default: m.OrderListPage })))
const OrderDetailPage = lazy(() =>
  import('../features/orders/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage })),
)
const AdminOrderListPage = lazy(() =>
  import('../features/orders/admin/AdminOrderListPage').then((m) => ({ default: m.AdminOrderListPage })),
)
const AdminOrderDetailPage = lazy(() =>
  import('../features/orders/admin/AdminOrderDetailPage').then((m) => ({ default: m.AdminOrderDetailPage })),
)

const PaymentHistoryPage = lazy(() =>
  import('../features/payments/PaymentHistoryPage').then((m) => ({ default: m.PaymentHistoryPage })),
)
const AdminPaymentListPage = lazy(() =>
  import('../features/payments/admin/AdminPaymentListPage').then((m) => ({ default: m.AdminPaymentListPage })),
)

const AdminReviewListPage = lazy(() =>
  import('../features/reviews/admin/AdminReviewListPage').then((m) => ({ default: m.AdminReviewListPage })),
)

const WishlistPage = lazy(() => import('../features/wishlist/WishlistPage').then((m) => ({ default: m.WishlistPage })))

const ServiceListPage = lazy(() =>
  import('../features/gardening-services/ServiceListPage').then((m) => ({ default: m.ServiceListPage })),
)
const ServiceDetailPage = lazy(() =>
  import('../features/gardening-services/ServiceDetailPage').then((m) => ({ default: m.ServiceDetailPage })),
)
const AdminServiceForm = lazy(() =>
  import('../features/gardening-services/admin/AdminServiceForm').then((m) => ({ default: m.AdminServiceForm })),
)

const BookingForm = lazy(() => import('../features/bookings/BookingForm').then((m) => ({ default: m.BookingForm })))
const BookingListPage = lazy(() =>
  import('../features/bookings/BookingListPage').then((m) => ({ default: m.BookingListPage })),
)
const AdminBookingListPage = lazy(() =>
  import('../features/bookings/admin/AdminBookingListPage').then((m) => ({ default: m.AdminBookingListPage })),
)

const BlogListPage = lazy(() => import('../features/blog/BlogListPage').then((m) => ({ default: m.BlogListPage })))
const BlogPostPage = lazy(() => import('../features/blog/BlogPostPage').then((m) => ({ default: m.BlogPostPage })))
const AdminBlogForm = lazy(() =>
  import('../features/blog/admin/AdminBlogForm').then((m) => ({ default: m.AdminBlogForm })),
)

const AdminDashboardPage = lazy(() =>
  import('../features/dashboard/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
)

const HomePage = lazy(() => import('../features/home/HomePage').then((m) => ({ default: m.HomePage })))

const AdminCustomerListPage = lazy(() =>
  import('../features/customers/AdminCustomerListPage').then((m) => ({ default: m.AdminCustomerListPage })),
)

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<div className="p-6">Loading...</div>}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: withSuspense(<HomePage />) },
      { path: "/login", element: withSuspense(<LoginPage />) },
      { path: "/register", element: withSuspense(<RegisterPage />) },
      { path: "/products", element: withSuspense(<ProductListPage />) },
      { path: "/products/:id", element: withSuspense(<ProductDetailPage />) },
      { path: "/services", element: withSuspense(<ServiceListPage />) },
      { path: "/services/:id", element: withSuspense(<ServiceDetailPage />) },
      { path: "/blog", element: withSuspense(<BlogListPage />) },
      { path: "/blog/:id", element: withSuspense(<BlogPostPage />) },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profile", element: withSuspense(<ProfilePage />) },
          { path: "/cart", element: withSuspense(<CartPage />) },
          { path: "/checkout", element: withSuspense(<CheckoutPage />) },
          { path: "/orders", element: withSuspense(<OrderListPage />) },
          { path: "/orders/:id", element: withSuspense(<OrderDetailPage />) },
          { path: "/payments", element: withSuspense(<PaymentHistoryPage />) },
          { path: "/wishlist", element: withSuspense(<WishlistPage />) },
          { path: "/bookings", element: withSuspense(<BookingListPage />) },
          { path: "/bookings/new", element: withSuspense(<BookingForm />) },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: "/admin/dashboard",
                element: withSuspense(<AdminDashboardPage />),
              },
              {
                path: "/admin/customers",
                element: withSuspense(<AdminCustomerListPage />),
              },
              {
                path: "/admin/products",
                element: withSuspense(<AdminProductListPage />),
              },
              {
                path: "/admin/products/new",
                element: withSuspense(<AdminProductForm />),
              },
              {
                path: "/admin/products/:id/edit",
                element: withSuspense(<AdminProductForm />),
              },
              {
                path: "/admin/categories",
                element: withSuspense(<AdminCategoryList />),
              },
              {
                path: "/admin/orders",
                element: withSuspense(<AdminOrderListPage />),
              },
              {
                path: "/admin/orders/:id",
                element: withSuspense(<AdminOrderDetailPage />),
              },
              {
                path: "/admin/payments",
                element: withSuspense(<AdminPaymentListPage />),
              },
              {
                path: "/admin/reviews",
                element: withSuspense(<AdminReviewListPage />),
              },
              {
                path: "/admin/bookings",
                element: withSuspense(<AdminBookingListPage />),
              },
            ],
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: "/services/new",
                element: withSuspense(<AdminServiceForm />),
              },
              {
                path: "/services/:id/edit",
                element: withSuspense(<AdminServiceForm />),
              },
              { path: "/blog/new", element: withSuspense(<AdminBlogForm />) },
              {
                path: "/blog/:id/edit",
                element: withSuspense(<AdminBlogForm />),
              },
            ],
          },
        ],
      },
      { path: "*", element: withSuspense(<NotFoundPage />) },
    ],
  },
]);
