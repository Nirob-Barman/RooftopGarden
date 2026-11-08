import { useState } from "react";
import {
  useGetCustomersQuery,
  useLockCustomerMutation,
  useUnlockCustomerMutation,
} from "./customersApi";
import { useConfirmDialog } from "../../components/useConfirmDialog";
import { usePageTitle } from "../../hooks/usePageTitle";

const PAGE_SIZE = 20;

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function CustomerStatus({ locked }: { locked: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        locked
          ? "bg-red-500/10 text-red-600"
          : "bg-emerald-500/10 text-emerald-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          locked ? "bg-red-500" : "bg-emerald-500"
        }`}
      />
      {locked ? "Locked" : "Active"}
    </span>
  );
}

function CustomerSkeleton() {
  return (
    <div className="space-y-4 p-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex animate-pulse items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-foreground/10" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-foreground/10" />
            <div className="h-3 w-48 rounded bg-foreground/10" />
          </div>

          <div className="h-6 w-16 rounded-full bg-foreground/10" />
        </div>
      ))}
    </div>
  );
}

export function AdminCustomerListPage() {
  usePageTitle("Manage Customers");

  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isError, refetch } = useGetCustomersQuery({
    search: search.trim() || undefined,
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  const [lockCustomer, { isLoading: isLocking }] = useLockCustomerMutation();

  const [unlockCustomer, { isLoading: isUnlocking }] =
    useUnlockCustomerMutation();

  const { confirm, dialog } = useConfirmDialog();

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  const handleLock = async (id: string, name: string) => {
    if (
      await confirm({
        title: "Lock customer",
        message: `Lock "${name}"'s account? They won't be able to log in until unlocked.`,
        confirmLabel: "Lock Account",
        destructive: true,
      })
    ) {
      lockCustomer(id);
    }
  };

  return (
    <div className="min-h-full space-y-6 p-5 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">CUSTOMER MANAGEMENT</p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Manage Customers
        </h1>

        <p className="mt-2 text-sm text-foreground/60">
          View customer information and manage account access.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm">
        <p className="text-sm text-foreground/60">Total matching customers</p>

        <p className="mt-2 text-3xl font-bold">{data?.totalCount ?? 0}</p>

        <p className="mt-1 text-xs text-foreground/50">
          {search.trim()
            ? `Results matching "${search.trim()}"`
            : "Customers registered in your store"}
        </p>
      </div>

      {/* Customer Directory */}
      <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-foreground/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Customer Directory</h2>

            <p className="mt-1 text-xs text-foreground/50">
              Search and manage customer accounts.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPageNumber(1);
              }}
              className="w-full rounded-xl border border-foreground/15 bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-primary"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <CustomerSkeleton />
        ) : isError ? (
          <div className="px-5 py-16 text-center">
            <h3 className="font-semibold">Unable to load customers</h3>

            <p className="mt-2 text-sm text-foreground/50">
              Something went wrong while retrieving customer information.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : !data?.items.length ? (
          <div className="px-5 py-16 text-center">
            <div className="text-4xl">👥</div>

            <h3 className="mt-4 font-semibold">No customers found</h3>

            <p className="mt-2 text-sm text-foreground/50">
              {search.trim()
                ? "Try another name or email address."
                : "Registered customers will appear here."}
            </p>
          </div>
        ) : (
          <>
            {/* Customer Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Customer
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Email Address
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Phone Number
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Account Status
                    </th>

                    <th className="px-5 py-4 text-right font-medium text-foreground/50">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.items.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-foreground/5 transition-colors last:border-0 hover:bg-primary/[0.02]"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {getInitials(customer.fullName)}
                          </div>

                          <span className="font-semibold">
                            {customer.fullName}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-foreground/70">
                        {customer.email}
                      </td>

                      {/* Phone */}
                      <td className="whitespace-nowrap px-5 py-4 text-foreground/60">
                        {customer.phoneNumber || "—"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <CustomerStatus locked={customer.isLockedOut} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        {customer.isLockedOut ? (
                          <button
                            type="button"
                            disabled={isUnlocking}
                            onClick={() => unlockCustomer(customer.id)}
                            className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Unlock Account
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isLocking}
                            onClick={() =>
                              handleLock(customer.id, customer.fullName)
                            }
                            className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Lock Account
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-foreground/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground/50">
                Page {pageNumber} of {totalPages}
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber((p) => p - 1)}
                    className="rounded-xl border border-foreground/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={pageNumber >= totalPages}
                    onClick={() => setPageNumber((p) => p + 1)}
                    className="rounded-xl border border-foreground/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {dialog}
    </div>
  );
}
