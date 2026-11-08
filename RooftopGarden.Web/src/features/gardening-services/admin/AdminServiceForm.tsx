import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useGetServiceByIdQuery,
} from "../gardeningServicesApi";
import { usePageTitle } from "../../../hooks/usePageTitle";

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) >= 0,
      "Price must be 0 or more",
    ),
  duration: z
    .string()
    .regex(/^\d{1,2}:\d{2}:\d{2}$/, "Use HH:MM:SS, e.g. 02:00:00"),
  imageUrl: z.string().max(500).optional().or(z.literal("")),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      {children}

      {hint && !error && (
        <p className="mt-1.5 text-xs text-foreground/50">{hint}</p>
      )}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-foreground/35 focus:border-primary focus:ring-2 focus:ring-primary/10";

export function AdminServiceForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  usePageTitle(isEditing ? "Edit Service" : "Add Service");

  const {
    data: existingService,
    isLoading: isLoadingService,
    isError,
  } = useGetServiceByIdQuery(Number(id), {
    skip: !isEditing,
  });

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();

  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      duration: "02:00:00",
      imageUrl: "",
    },
  });

  const imageUrl = watch("imageUrl");
  const name = watch("name");

  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (existingService) {
      reset({
        name: existingService.name,
        description: existingService.description ?? "",
        price: String(existingService.price),
        duration: existingService.duration,
        imageUrl: existingService.imageUrl ?? "",
      });
    }
  }, [existingService, reset]);

  const onSubmit = async (values: ServiceFormValues) => {
    const body = {
      name: values.name,
      description: values.description || null,
      price: Number(values.price),
      duration: values.duration,
      imageUrl: values.imageUrl || null,
    };

    if (isEditing) {
      await updateService({
        id: Number(id),
        ...body,
      }).unwrap();
    } else {
      await createService(body).unwrap();
    }

    navigate("/services");
  };

  if (isEditing && isLoadingService) {
    return (
      <div className="p-8 text-center text-sm text-foreground/60">
        Loading service information...
      </div>
    );
  }

  if (isEditing && (isError || !existingService)) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <h2 className="text-lg font-semibold">Unable to load service</h2>
        <p className="mt-2 text-sm text-foreground/60">
          The requested service could not be found.
        </p>
        <button
          type="button"
          onClick={() => navigate("/services")}
          className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Header */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/services")}
            className="mb-4 flex items-center gap-2 text-sm text-foreground/55 transition-colors hover:text-primary"
          >
            <span aria-hidden="true">←</span>
            Back to Services
          </button>

          <p className="text-sm font-semibold text-primary">
            SERVICE MANAGEMENT
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {isEditing ? "Edit Service" : "Create New Service"}
          </h1>

          <p className="mt-2 text-sm text-foreground/60">
            {isEditing
              ? "Update your gardening service information and pricing."
              : "Add a new gardening service to your RooftopGarden catalog."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic Information */}
              <section className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold">Basic Information</h2>
                  <p className="mt-1 text-sm text-foreground/50">
                    Enter the essential details of your service.
                  </p>
                </div>

                <div className="space-y-5">
                  <FormField
                    label="Service Name"
                    htmlFor="name"
                    error={errors.name?.message}
                  >
                    <input
                      id="name"
                      placeholder="e.g. Rooftop Garden Maintenance"
                      className={inputClass}
                      {...register("name")}
                    />
                  </FormField>

                  <FormField
                    label="Description"
                    htmlFor="description"
                    error={errors.description?.message}
                    hint="Describe what's included in this gardening service."
                  >
                    <textarea
                      id="description"
                      rows={5}
                      placeholder="Describe your service, what customers can expect, and the benefits..."
                      className={`${inputClass} resize-y`}
                      {...register("description")}
                    />
                  </FormField>
                </div>
              </section>

              {/* Pricing and Duration */}
              <section className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold">Pricing & Duration</h2>
                  <p className="mt-1 text-sm text-foreground/50">
                    Configure your service price and estimated time.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Service Price"
                    htmlFor="price"
                    error={errors.price?.message}
                    hint="Enter the price in your configured currency."
                  >
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground/50">
                        $
                      </span>

                      <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={`${inputClass} pl-8`}
                        {...register("price")}
                      />
                    </div>
                  </FormField>

                  <FormField
                    label="Estimated Duration"
                    htmlFor="duration"
                    error={errors.duration?.message}
                    hint="Format: HH:MM:SS"
                  >
                    <input
                      id="duration"
                      placeholder="02:00:00"
                      className={inputClass}
                      {...register("duration")}
                    />
                  </FormField>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Image */}
              <section className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm">
                <div className="mb-5">
                  <h2 className="font-semibold">Service Image</h2>
                  <p className="mt-1 text-xs text-foreground/50">
                    Add a visual representation of your service.
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.03]">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Service preview"
                      className="aspect-[4/3] w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 text-foreground/35">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-12 w-12"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>

                      <span className="text-xs">Image preview</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <FormField
                    label="Image URL"
                    htmlFor="imageUrl"
                    error={errors.imageUrl?.message}
                    hint="Paste an image URL to preview it."
                  >
                    <input
                      id="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className={inputClass}
                      {...register("imageUrl")}
                    />
                  </FormField>
                </div>
              </section>

              {/* Preview */}
              <section className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <h2 className="text-sm font-semibold">Service Preview</h2>
                </div>

                <h3 className="mt-4 text-base font-semibold">
                  {name || "Your service name"}
                </h3>

                <p className="mt-2 text-xs leading-5 text-foreground/55">
                  The service will be saved with the information entered in this
                  form.
                </p>

                <p className="mt-4 text-xs text-foreground/45">
                  {isEditing ? "Editing existing service" : "New service"}
                </p>
              </section>
            </aside>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-foreground/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/services")}
              disabled={isSaving}
              className="rounded-xl border border-foreground/15 px-6 py-3 text-sm font-semibold transition-colors hover:bg-foreground/5 disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
