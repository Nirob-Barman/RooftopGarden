import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoriesQuery,
} from "../categoriesApi";
import {
  Container,
  Input,
  Textarea,
  Button,
  Spinner,
} from "../../../components/ui";
import { usePageTitle } from "../../../hooks/usePageTitle";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function AdminCategoryForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const navigate = useNavigate();

  usePageTitle(isEditing ? "Edit Category" : "Create Category");

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isCategoryError,
    refetch,
  } = useGetCategoriesQuery();

  const existingCategory = categories?.find(
    (category) => category.id === Number(id),
  );

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

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

  useEffect(() => {
    if (existingCategory && isEditing) {
      reset({
        name: existingCategory.name,
        description: existingCategory.description ?? "",
      });
    }
  }, [existingCategory, isEditing, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    const body = {
      name: values.name,
      description: values.description || null,
    };

    try {
      if (isEditing && id) {
        await updateCategory({
          id: Number(id),
          ...body,
        }).unwrap();
      } else {
        await createCategory(body).unwrap();
      }

      navigate("/admin/categories");
    } catch {
      // Keep form values so the user can retry.
    }
  };

  if (isEditing && isLoadingCategories) {
    return (
      <Container size="md">
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </Container>
    );
  }

  if (isEditing && isCategoryError) {
    return (
      <Container size="md">
        <div className="rounded-2xl border border-foreground/10 bg-surface p-8 text-center">
          <h2 className="font-semibold">Unable to load category</h2>

          <p className="mt-2 text-sm text-foreground/60">Please try again.</p>

          <Button size="sm" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  if (isEditing && !existingCategory) {
    return (
      <Container size="md">
        <div className="rounded-2xl border border-foreground/10 bg-surface p-8 text-center">
          <h2 className="font-semibold">Category not found</h2>

          <p className="mt-2 text-sm text-foreground/60">
            The category you're looking for doesn't exist.
          </p>

          <Button
            className="mt-4"
            onClick={() => navigate("/admin/categories")}
          >
            Back to Categories
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container size="md">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <p className="text-sm font-medium text-primary">CATALOG MANAGEMENT</p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {isEditing ? "Edit Category" : "Create Category"}
          </h1>

          <p className="mt-2 text-sm text-foreground/60">
            {isEditing
              ? "Update your category information."
              : "Create a category for your garden products."}
          </p>
        </div>

        {/* Category Form */}
        <div className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
              🌱
            </div>

            <h2 className="mt-4 text-lg font-semibold">Category Information</h2>

            <p className="mt-1 text-sm text-foreground/50">
              Enter the details for your product category.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Category Name"
              placeholder="e.g. Indoor Plants"
              {...register("name")}
              error={errors.name?.message}
            />

            <Textarea
              label="Description"
              placeholder="Describe this category..."
              {...register("description")}
              error={errors.description?.message}
            />

            {/* Form Actions */}
            <div className="flex flex-wrap gap-3 border-t border-foreground/10 pt-5">
              <Button type="submit" isLoading={isCreating || isUpdating}>
                {isCreating || isUpdating
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Category"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/categories")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
