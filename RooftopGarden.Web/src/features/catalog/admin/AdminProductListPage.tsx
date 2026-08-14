import { useState } from 'react'
import { useGetAdminProductsQuery, useDeleteProductMutation, useActivateProductMutation } from '../productsApi'
import { useConfirmDialog } from '../../../components/useConfirmDialog'
import { Container, LinkButton, Button, Table, StatusPill, Pagination, Spinner } from '../../../components/ui'

const PAGE_SIZE = 20

export function AdminProductListPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const { data, isLoading } = useGetAdminProductsQuery({ pageNumber, pageSize: PAGE_SIZE })
  const [deleteProduct] = useDeleteProductMutation()
  const [activateProduct] = useActivateProductMutation()
  const { confirm, dialog } = useConfirmDialog()

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  const handleDeactivate = async (id: number, name: string) => {
    if (
      await confirm({
        title: 'Deactivate product',
        message: `Deactivate "${name}"? It will no longer be visible to customers.`,
        confirmLabel: 'Deactivate',
        destructive: true,
      })
    ) {
      deleteProduct(id)
    }
  }

  const handleActivate = async (id: number, name: string) => {
    if (
      await confirm({
        title: 'Activate product',
        message: `Activate "${name}"? It will become visible and orderable by customers again.`,
        confirmLabel: 'Activate',
      })
    ) {
      activateProduct(id)
    }
  }

  return (
    <Container size="lg">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage products</h1>
        <LinkButton to="/admin/products/new">Create product</LinkButton>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          <Table>
            <Table.Head>
              <tr>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Stock</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </tr>
            </Table.Head>
            <Table.Body>
              {data?.items.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>{product.categoryName}</Table.Cell>
                  <Table.Cell>${product.price.toFixed(2)}</Table.Cell>
                  <Table.Cell>{product.stockQuantity}</Table.Cell>
                  <Table.Cell>
                    <StatusPill status={product.isActive ? 'Active' : 'Inactive'} />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end gap-2">
                      <LinkButton to={`/admin/products/${product.id}/edit`} variant="ghost" size="sm">
                        Edit
                      </LinkButton>
                      {product.isActive ? (
                        <Button variant="danger" size="sm" onClick={() => handleDeactivate(product.id, product.name)}>
                          Deactivate
                        </Button>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => handleActivate(product.id, product.name)}>
                          Activate
                        </Button>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <Pagination page={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
        </div>
      )}
      {dialog}
    </Container>
  )
}
