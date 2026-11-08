import { useState } from "react";
import {
  useGetAdminProductsQuery,
  useDeleteProductMutation,
  useActivateProductMutation,
} from "../productsApi";
import { useConfirmDialog } from "../../../components/useConfirmDialog";
import {
  Container,
  LinkButton,
  Button,
  Table,
  StatusPill,
  Pagination
} from "../../../components/ui";
import { usePageTitle } from "../../../hooks/usePageTitle";

const PAGE_SIZE = 20;

function ProductLoadingState() {
  return (
    <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface">
      <div className="space-y-4 p-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex animate-pulse items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-foreground/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded bg-foreground/10" />
              <div className="h-3 w-1/5 rounded bg-foreground/10" />
            </div>
            <div className="h-6 w-16 rounded bg-foreground/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminProductListPage() {
  usePageTitle("Manage Products");

  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isError, refetch } = useGetAdminProductsQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  const [deleteProduct] = useDeleteProductMutation();
  const [activateProduct] = useActivateProductMutation();

  const { confirm, dialog } = useConfirmDialog();

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  const handleDeactivate = async (id: number, name: string) => {
    if (
      await confirm({
        title: "Deactivate product",
        message: `Deactivate "${name}"? It will no longer be visible to customers.`,
        confirmLabel: "Deactivate",
        destructive: true,
      })
    ) {
      deleteProduct(id);
    }
  };

  const handleActivate = async (id: number, name: string) => {
    if (
      await confirm({
        title: "Activate product",
        message: `Activate "${name}"? It will become visible and orderable by customers again.`,
        confirmLabel: "Activate",
      })
    ) {
      activateProduct(id);
    }
  };

  return (
    <Container size="lg">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              CATALOG MANAGEMENT
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Manage Products
            </h1>

            <p className="mt-2 text-sm text-foreground/60">
              Manage your garden products, prices, inventory and availability.
            </p>
          </div>

          <LinkButton to="/admin/products/new">+ Create Product</LinkButton>
        </div>

        {/* Product List */}
        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
          <div className="flex flex-col gap-2 border-b border-foreground/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Product Inventory</h2>
              <p className="mt-1 text-xs text-foreground/50">
                {data?.totalCount ?? 0} products in your catalog
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-5">
              <ProductLoadingState />
            </div>
          ) : isError ? (
            <div className="px-5 py-12 text-center">
              <h3 className="font-semibold">Unable to load products</h3>
              <p className="mt-2 text-sm text-foreground/60">
                Please try again.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => refetch()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : !data?.items.length ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                🌱
              </div>

              <h3 className="mt-4 font-semibold">No products yet</h3>

              <p className="mt-2 text-sm text-foreground/60">
                Start building your catalog by adding your first product.
              </p>

              <div className="mt-5">
                <LinkButton to="/admin/products/new">
                  Create your first product
                </LinkButton>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <Table.Head>
                    <tr>
                      <Table.HeaderCell>Product</Table.HeaderCell>
                      <Table.HeaderCell>Category</Table.HeaderCell>
                      <Table.HeaderCell>Price</Table.HeaderCell>
                      <Table.HeaderCell>Stock</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                      <Table.HeaderCell>
                        <span className="sr-only">Actions</span>
                      </Table.HeaderCell>
                    </tr>
                  </Table.Head>

                  <Table.Body>
                    {data.items.map((product) => {
                      const lowStock =
                        product.stockQuantity > 0 && product.stockQuantity <= 5;

                      const outOfStock = product.stockQuantity <= 0;

                      return (
                        <Table.Row key={product.id}>
                          <Table.Cell>
                            <div className="min-w-32">
                              <p className="font-medium text-foreground">
                                {product.name}
                              </p>
                              <p className="mt-1 text-xs text-foreground/40">
                                ID: #{product.id}
                              </p>
                            </div>
                          </Table.Cell>

                          <Table.Cell>
                            <span className="text-sm text-foreground/60">
                              {product.categoryName || "Uncategorized"}
                            </span>
                          </Table.Cell>

                          <Table.Cell>
                            <span className="font-semibold text-foreground">
                              ${product.price.toFixed(2)}
                            </span>
                          </Table.Cell>

                          <Table.Cell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {product.stockQuantity}
                              </span>

                              {outOfStock ? (
                                <span className="text-xs font-medium text-red-500">
                                  Out of stock
                                </span>
                              ) : lowStock ? (
                                <span className="text-xs font-medium text-amber-600">
                                  Low stock
                                </span>
                              ) : null}
                            </div>
                          </Table.Cell>

                          <Table.Cell>
                            <StatusPill
                              status={product.isActive ? "Active" : "Inactive"}
                            />
                          </Table.Cell>

                          <Table.Cell>
                            <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                              <LinkButton
                                to={`/admin/products/${product.id}/edit`}
                                variant="ghost"
                                size="sm"
                              >
                                Edit
                              </LinkButton>

                              {product.isActive ? (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() =>
                                    handleDeactivate(product.id, product.name)
                                  }
                                >
                                  Deactivate
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() =>
                                    handleActivate(product.id, product.name)
                                  }
                                >
                                  Activate
                                </Button>
                              )}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>

              {/* Pagination */}
              <div className="border-t border-foreground/10 px-5 py-4">
                <Pagination
                  page={pageNumber}
                  totalPages={totalPages}
                  onPageChange={setPageNumber}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {dialog}
    </Container>
  );
}
