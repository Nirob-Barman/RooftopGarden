import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  type CategoryDto,
} from "../categoriesApi";
import { useConfirmDialog } from "../../../components/useConfirmDialog";
import {
  Container,
  Card,
  Input,
  Button,
  Spinner,
} from "../../../components/ui";
import { usePageTitle } from "../../../hooks/usePageTitle";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function AdminCategoryList() {
  usePageTitle("Manage Categories");

  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [deleteCategory] = useDeleteCategoryMutation();

  const [editingId, setEditingId] = useState<number | null>(null);

  const { confirm, dialog } = useConfirmDialog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const startEditing = (category: CategoryDto) => {
    setEditingId(category.id);

    reset({
      name: category.name,
      description: category.description ?? "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    reset({
      name: "",
      description: "",
    });
  };

  const onSubmit = async (values: CategoryFormValues) => {
    const body = {
      name: values.name,
      description: values.description || null,
    };

    try {
      if (editingId !== null) {
        await updateCategory({
          id: editingId,
          ...body,
        }).unwrap();

        setEditingId(null);
      } else {
        await createCategory(body).unwrap();
      }

      reset({
        name: "",
        description: "",
      });
    } catch {
      // Keep the form values so the user can correct or retry.
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      await confirm({
        title: "Delete category",
        message: `Delete category "${name}"?`,
        destructive: true,
      })
    ) {
      deleteCategory(id);
    }
  };

  return (
    <Container size="lg">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <p className="text-sm font-medium text-primary">CATALOG MANAGEMENT</p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Manage Categories
          </h1>

          <p className="mt-2 text-sm text-foreground/60">
            Organize your products into categories and keep your catalog
            structured.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Create / Edit Form */}
          <Card className="p-5 sm:p-6">
            <div className="mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
                🌱
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                {editingId !== null ? "Edit Category" : "New Category"}
              </h2>

              <p className="mt-1 text-sm text-foreground/50">
                {editingId !== null
                  ? "Update the category details below."
                  : "Create a category for your garden products."}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category Name
                </label>

                <Input
                  placeholder="e.g. Indoor Plants"
                  {...register("name")}
                  error={errors.name?.message}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <Input
                  placeholder="Describe this category..."
                  {...register("description")}
                  error={errors.description?.message}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isCreating || isUpdating}
                >
                  {editingId !== null ? "Save Changes" : "Create Category"}
                </Button>

                {editingId !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Category List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">All Categories</h2>

                <p className="mt-1 text-sm text-foreground/50">
                  {categories?.length ?? 0} categories available
                </p>
              </div>
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
                  Create your first category using the form.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    padding="sm"
                    className={`flex flex-col gap-4 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                      editingId === category.id
                        ? "border-primary/40 bg-primary/5"
                        : "hover:border-primary/30"
                    }`}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(category)}
                      >
                        Edit
                      </Button>

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
      </div>

      {dialog}
    </Container>
  );
}
