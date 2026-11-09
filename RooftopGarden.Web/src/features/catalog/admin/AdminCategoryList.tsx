import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../categoriesApi";
import { useConfirmDialog } from "../../../components/useConfirmDialog";
import {
  Container,
  Card,
  Button,
  LinkButton,
  Spinner,
} from "../../../components/ui";
import { usePageTitle } from "../../../hooks/usePageTitle";

export function AdminCategoryList() {
  usePageTitle("Manage Categories");

  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery();

  const [deleteCategory] = useDeleteCategoryMutation();

  const { confirm, dialog } = useConfirmDialog();

  const handleDelete = async (id: number, name: string) => {
    if (
      await confirm({
        title: "Delete category",
        message: `Delete category "${name}"?`,
        destructive: true,
      })
    ) {
      await deleteCategory(id);
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
              Manage Categories
            </h1>

            <p className="mt-2 text-sm text-foreground/60">
              Organize your products into categories and keep your catalog
              structured.
            </p>
          </div>

          <LinkButton to="/admin/categories/new">+ Create Category</LinkButton>
        </div>

        {/* Category List */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">All Categories</h2>

            <p className="mt-1 text-sm text-foreground/50">
              {categories?.length ?? 0} categories available
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center rounded-2xl border border-foreground/10 py-16">
              <Spinner />
            </div>
          ) : isError ? (
            <Card className="p-8 text-center">
              <h3 className="font-semibold">Unable to load categories</h3>

              <p className="mt-2 text-sm text-foreground/50">
                Please try again.
              </p>

              <Button size="sm" className="mt-4" onClick={() => refetch()}>
                Try Again
              </Button>
            </Card>
          ) : !categories?.length ? (
            <Card className="p-10 text-center">
              <div className="text-3xl">🌿</div>

              <h3 className="mt-3 font-semibold">No categories yet</h3>

              <p className="mt-2 text-sm text-foreground/50">
                Start organizing your catalog by creating your first category.
              </p>

              <div className="mt-5">
                <LinkButton to="/admin/categories/new">
                  Create your first category
                </LinkButton>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  padding="sm"
                  className="flex flex-col gap-4 p-4 transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        🌱
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold">{category.name}</p>

                        <p className="text-xs text-foreground/40">
                          Category #{category.id}
                        </p>
                      </div>
                    </div>

                    {category.description && (
                      <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <LinkButton
                      to={`/admin/categories/${category.id}/edit`}
                      variant="ghost"
                      size="sm"
                    >
                      Edit
                    </LinkButton>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(category.id, category.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {dialog}
    </Container>
  );
}
