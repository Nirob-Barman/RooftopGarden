import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetProfileQuery, useUpdateProfileMutation } from "./authApi";
import { usePageTitle } from "../../hooks/usePageTitle";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(200),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  profileImageUrl: z.string().max(500).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfilePage() {
  usePageTitle("My Profile");

  const { data: profile, isLoading, isError } = useGetProfileQuery();

  const [
    updateProfile,
    { isLoading: isSaving, isSuccess, isError: isSaveError },
  ] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  
  const profileImageUrl = useWatch({
    control,
    name: "profileImageUrl",
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber ?? "",
        address: profile.address ?? "",
        profileImageUrl: profile.profileImageUrl ?? "",
      });
    }
  }, [profile, reset]);

  if (isLoading) {
    return (
      <div className="min-h-full space-y-6 p-5 sm:p-8 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-foreground/10" />
        <div className="h-36 rounded-2xl bg-foreground/10" />
        <div className="h-80 rounded-2xl bg-foreground/10" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="p-8 text-center">
        <h2 className="font-semibold">Unable to load profile</h2>
        <p className="mt-2 text-sm text-foreground/60">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile({
      fullName: values.fullName,
      phoneNumber: values.phoneNumber || null,
      address: values.address || null,
      profileImageUrl: values.profileImageUrl || null,
    });
  };

  const initials = (profile.fullName || "User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  const inputClass =
    "w-full rounded-xl border border-foreground/15 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-foreground/35 focus:border-primary focus:ring-4 focus:ring-primary/10";

  const labelClass = "mb-2 block text-sm font-semibold text-foreground/80";

  return (
    <div className="min-h-full space-y-6 p-5 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-primary">ACCOUNT SETTINGS</p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-foreground/60">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Profile Overview */}
      <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
        <div className="h-28 bg-gradient-to-r from-green-950 via-green-800 to-green-600 sm:h-36" />

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-surface bg-primary/10 text-2xl font-bold text-primary sm:h-28 sm:w-28">
              {profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={profile.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            {/* Profile Information */}
            <div className="min-w-0 flex-1 sm:pb-1">
              <h2 className="text-xl font-bold">{profile.fullName}</h2>

              <p className="mt-1 text-sm text-foreground/50">{profile.email}</p>
            </div>

            {/* Role */}
            <div className="sm:pb-1">
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile */}
      <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
        <div className="border-b border-foreground/10 p-5 sm:p-6">
          <h2 className="font-semibold">Personal Information</h2>

          <p className="mt-1 text-sm text-foreground/50">
            Update your profile details and contact information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-5 sm:p-6"
        >
          {/* Personal Details */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-primary">
              BASIC INFORMATION
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  Full Name
                </label>

                <input
                  id="fullName"
                  placeholder="Enter your full name"
                  {...register("fullName")}
                  className={inputClass}
                />

                {errors.fullName && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  readOnly
                  className={`${inputClass} cursor-not-allowed bg-foreground/[0.03] text-foreground/50`}
                />

                <p className="mt-1 text-xs text-foreground/40">
                  Email address cannot be changed here.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-foreground/10" />

          {/* Contact Details */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-primary">
              CONTACT INFORMATION
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phoneNumber" className={labelClass}>
                  Phone Number
                </label>

                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+8801XXXXXXXXX"
                  {...register("phoneNumber")}
                  className={inputClass}
                />

                {errors.phoneNumber && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="address" className={labelClass}>
                  Address
                </label>

                <input
                  id="address"
                  placeholder="Enter your address"
                  {...register("address")}
                  className={inputClass}
                />

                {errors.address && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-foreground/10" />

          {/* Profile Image */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-primary">
              PROFILE PHOTO
            </h3>

            <label htmlFor="profileImageUrl" className={labelClass}>
              Profile Image URL
            </label>

            <input
              id="profileImageUrl"
              placeholder="https://example.com/profile.jpg"
              {...register("profileImageUrl")}
              className={inputClass}
            />

            {errors.profileImageUrl && (
              <p className="mt-2 text-xs text-red-600">
                {errors.profileImageUrl.message}
              </p>
            )}

            {profileImageUrl && (
              <div className="mt-4 flex items-center gap-4 rounded-xl border border-foreground/10 p-4">
                <img
                  src={profileImageUrl}
                  alt="Profile preview"
                  className="h-16 w-16 rounded-xl bg-foreground/5 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <div>
                  <p className="text-sm font-semibold">Profile Preview</p>
                  <p className="mt-1 text-xs text-foreground/50">
                    Your profile image will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Save Feedback */}
          {isSuccess && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600">
              Profile updated successfully!
            </div>
          )}

          {isSaveError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              Unable to save your profile. Please try again.
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-foreground/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                reset({
                  fullName: profile.fullName,
                  phoneNumber: profile.phoneNumber ?? "",
                  address: profile.address ?? "",
                  profileImageUrl: profile.profileImageUrl ?? "",
                })
              }
              disabled={!isDirty || isSaving}
              className="rounded-xl border border-foreground/15 px-6 py-3 text-sm font-semibold transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset Changes
            </button>

            <button
              type="submit"
              disabled={isSaving || !isDirty}
              className="rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
