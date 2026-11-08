import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useGetBlogByIdQuery,
} from "../blogApi";
import { usePageTitle } from "../../../hooks/usePageTitle";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().max(500).optional().or(z.literal("")),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export function AdminBlogForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  usePageTitle(isEditing ? "Edit Blog Post" : "Create Blog Post");

  const navigate = useNavigate();

  const {
    data: existingPost,
    isLoading: isLoadingPost,
    isError: isPostError,
  } = useGetBlogByIdQuery(Number(id), { skip: !isEditing });

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
    },
  });

  const imageUrl = watch("imageUrl");
  const title = watch("title");
  const content = watch("content");

  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (existingPost) {
      reset({
        title: existingPost.title,
        content: existingPost.content,
        imageUrl: existingPost.imageUrl ?? "",
      });
    }
  }, [existingPost, reset]);

  const onSubmit = async (values: BlogFormValues) => {
    const body = {
      title: values.title,
      content: values.content,
      imageUrl: values.imageUrl || null,
    };

    try {
      if (isEditing) {
        await updateBlog({
          id: Number(id),
          ...body,
        }).unwrap();
      } else {
        await createBlog(body).unwrap();
      }

      navigate("/blog");
    } catch {
      // Keep form values so the user can retry.
    }
  };

  if (isEditing && isLoadingPost) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-80 rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (isEditing && (isPostError || !existingPost)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 p-6 dark:bg-gray-950">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Article Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            The article could not be loaded. It may have been deleted or is
            unavailable.
          </p>

          <Link
            to="/blog"
            className="mt-6 inline-flex rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Page Header */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link
              to="/blog"
              className="transition hover:text-green-700 dark:hover:text-green-400"
            >
              Blog
            </Link>
            <span>/</span>
            <span className="text-green-700 dark:text-green-400">
              {isEditing ? "Edit Article" : "Create Article"}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {isEditing ? "Edit Article" : "Write New Article"}
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isEditing
              ? "Update your gardening article and keep your community informed."
              : "Create and publish helpful gardening content for your community."}
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
            {/* Article Editor */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Article Information
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Add your article title and gardening content.
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Article Title
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="title"
                    placeholder="e.g. 10 Tips for a Beautiful Rooftop Garden"
                    {...register("title")}
                    className={`w-full rounded-xl border bg-transparent px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-500/10 dark:text-white ${
                      errors.title
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  />

                  <div className="mt-1 flex justify-between gap-2">
                    {errors.title ? (
                      <p className="text-xs text-red-500">
                        {errors.title.message}
                      </p>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Write a clear and engaging title.
                      </span>
                    )}

                    <span className="shrink-0 text-xs text-gray-400">
                      {title?.length ?? 0}/300
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label
                    htmlFor="content"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Article Content
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <textarea
                    id="content"
                    rows={16}
                    placeholder="Start writing your gardening article here..."
                    {...register("content")}
                    className={`w-full resize-y rounded-xl border bg-transparent px-4 py-3 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-500/10 dark:text-white ${
                      errors.content
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  />

                  <div className="mt-1 flex justify-between gap-2">
                    {errors.content ? (
                      <p className="text-xs text-red-500">
                        {errors.content.message}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">
                        Share useful information and gardening tips.
                      </p>
                    )}

                    <span className="shrink-0 text-xs text-gray-400">
                      {content?.length ?? 0} characters
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cover Image */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Cover Image
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Add an image to represent your article.
                  </p>
                </div>

                <div className="space-y-4 p-5">
                  {/* Image Preview */}
                  <div className="overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                    {imageUrl?.trim() ? (
                      <img
                        src={imageUrl.trim()}
                        alt="Article cover preview"
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-44 flex-col items-center justify-center text-center">
                        <span className="text-4xl text-green-700 dark:text-green-400">
                          🌿
                        </span>

                        <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                          No cover image
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Image preview will appear here.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="imageUrl"
                      className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Image URL
                    </label>

                    <input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      {...register("imageUrl")}
                      className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-500/10 dark:text-white ${
                        errors.imageUrl
                          ? "border-red-500"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    />

                    {errors.imageUrl && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.imageUrl.message}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      Provide a publicly accessible image URL.
                    </p>
                  </div>
                </div>
              </div>

              {/* Publishing Information */}
              <div className="rounded-2xl border border-green-100 bg-green-50 p-5 dark:border-green-900/40 dark:bg-green-900/10">
                <div className="flex items-center gap-2">
                  <span className="text-xl text-green-700 dark:text-green-400">
                    ✎
                  </span>

                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Publishing Tips
                  </h3>
                </div>

                <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex gap-2">
                    <span className="text-green-700">✓</span>
                    Use a descriptive article title.
                  </li>

                  <li className="flex gap-2">
                    <span className="text-green-700">✓</span>
                    Provide useful and relevant information.
                  </li>

                  <li className="flex gap-2">
                    <span className="text-green-700">✓</span>
                    Choose a relevant cover image.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center">
            <Link
              to="/blog"
              className="rounded-xl border border-gray-200 px-5 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <span>✓</span>
                  {isEditing ? "Save Changes" : "Create Article"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
