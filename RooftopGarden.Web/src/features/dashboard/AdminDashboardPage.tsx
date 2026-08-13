import { useGetDashboardStatsQuery } from './dashboardApi'

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-surface p-4">
      <p className="text-sm text-foreground/60">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-primary">{value}</p>
    </div>
  )
}

function StatusBreakdown({ title, byStatus }: { title: string; byStatus: Record<string, number> }) {
  const entries = Object.entries(byStatus)
  const total = entries.reduce((sum, [, count]) => sum + count, 0)

  return (
    <div className="rounded-xl border border-foreground/10 bg-surface p-4">
      <h2 className="mb-3 font-medium">{title}</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-foreground/60">No data yet.</p>
      ) : (
        <div className="space-y-2">
          {entries.map(([status, count]) => (
            <div key={status}>
              <div className="flex justify-between text-sm">
                <span>{status}</span>
                <span>{count}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-primary/10">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery()

  if (isLoading) return <div className="p-6">Loading...</div>
  if (!stats) return null

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard label="Customers" value={stats.totalCustomers} />
        <StatCard label="Products" value={`${stats.activeProducts} / ${stats.totalProducts} active`} />
        <StatCard label="Orders" value={stats.totalOrders} />
        <StatCard label="Revenue (paid)" value={`$${stats.totalRevenue.toFixed(2)}`} />
        <StatCard label="Bookings" value={stats.totalBookings} />
        <StatCard label="Services" value={`${stats.activeServices} / ${stats.totalServices} active`} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatusBreakdown title="Orders by status" byStatus={stats.ordersByStatus} />
        <StatusBreakdown title="Bookings by status" byStatus={stats.bookingsByStatus} />
      </div>
    </div>
  )
}
