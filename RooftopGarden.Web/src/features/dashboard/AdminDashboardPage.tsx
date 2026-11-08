import { usePageTitle } from "../../hooks/usePageTitle";
import { useGetDashboardStatsQuery } from "./dashboardApi";
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  CalendarDays,
  Leaf,
  RefreshCw,
} from "lucide-react";

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground/60">{label}</p>
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-foreground/50">{description}</p>
      )}
    </div>
  );
}

function StatusBreakdown({
  title,
  byStatus,
}: {
  title: string;
  byStatus: Record<string, number>;
}) {
  const entries = Object.entries(byStatus);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  const colors = [
    "bg-primary",
    "bg-blue-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-rose-500",
  ];

  return (
    <div className="rounded-2xl border border-foreground/10 bg-surface p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-foreground/50">
            Distribution by status
          </p>
        </div>
        <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {total} Total
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="flex min-h-32 items-center justify-center">
          <p className="text-sm text-foreground/50">No data available yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {entries.map(([status, count], index) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={status}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${colors[index % colors.length]}`}
                    />
                    <span className="text-sm font-medium capitalize">
                      {status.replace(/[_-]/g, " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{count}</span>
                    <span className="w-12 text-right text-xs text-foreground/50">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-primary/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colors[index % colors.length]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-16 w-64 animate-pulse rounded-xl bg-foreground/10" />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl bg-foreground/10"
          />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl bg-foreground/10" />
        <div className="h-64 animate-pulse rounded-2xl bg-foreground/10" />
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  usePageTitle("Admin Dashboard");

  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useGetDashboardStatsQuery();

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !stats) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-500/20 bg-surface p-8 text-center">
          <h2 className="text-lg font-semibold">Unable to load dashboard</h2>
          <p className="mt-2 text-sm text-foreground/60">
            Something went wrong while retrieving dashboard statistics.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-7 p-5 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">ROOFTOP GARDEN ADMIN</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Overview of your rooftop garden business.
        </p>
      </div>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Business overview</h2>
          <p className="text-sm text-foreground/50">
            Your business statistics at a glance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Total Customers"
            value={stats.totalCustomers}
            description="Registered customers"
            icon={Users}
          />

          <StatCard
            label="Total Products"
            value={stats.totalProducts}
            description={`${stats.activeProducts} active products`}
            icon={Package}
          />

          <StatCard
            label="Total Orders"
            value={stats.totalOrders}
            description="Orders received"
            icon={ShoppingBag}
          />

          <StatCard
            label="Paid Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            description="Total successful payments"
            icon={DollarSign}
          />

          <StatCard
            label="Total Bookings"
            value={stats.totalBookings}
            description="Service bookings received"
            icon={CalendarDays}
          />

          <StatCard
            label="Total Services"
            value={stats.totalServices}
            description={`${stats.activeServices} active services`}
            icon={Leaf}
          />
        </div>
      </section>

      {/* Analytics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Status overview</h2>
          <p className="text-sm text-foreground/50">
            Monitor your orders and service bookings.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <StatusBreakdown
            title="Orders by status"
            byStatus={stats.ordersByStatus}
          />

          <StatusBreakdown
            title="Bookings by status"
            byStatus={stats.bookingsByStatus}
          />
        </div>
      </section>
    </div>
  );
}
