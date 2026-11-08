import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation, useGoogleLoginMutation } from "./authApi";
import { usePageTitle } from "../../hooks/usePageTitle";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(200),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterApiResponse = {
  success?: boolean;
  message?: string;
  errors?: string[];
};

export function RegisterPage() {
  usePageTitle("Register");

  const [showPassword, setShowPassword] = useState(false);

  const [registerUser, { isLoading }] = useRegisterMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        ...values,
        phoneNumber: values.phoneNumber || undefined,
      }).unwrap();

      navigate("/");
    } catch (err: unknown) {
      const data = (err as { data?: RegisterApiResponse }).data;
      const apiErrors = data?.errors;

      if (!Array.isArray(apiErrors) || apiErrors.length === 0) {
        setError("root", {
          type: "server",
          message:
            data?.message || "Could not create the account. Please try again.",
        });
        return;
      }

      const passwordErrors = apiErrors.filter((message) =>
        message.toLowerCase().includes("password"),
      );

      if (passwordErrors.length > 0) {
        setError("password", {
          type: "server",
          message: passwordErrors.join(" "),
        });
      }

      const emailErrors = apiErrors.filter((message) =>
        message.toLowerCase().includes("email"),
      );

      if (emailErrors.length > 0) {
        setError("email", {
          type: "server",
          message: emailErrors.join(" "),
        });
      }

      if (passwordErrors.length === 0 && emailErrors.length === 0) {
        setError("root", {
          type: "server",
          message: apiErrors.join(" "),
        });
      }
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      await googleLogin({ credential }).unwrap();
      navigate("/");
    } catch {
      // Google login errors are handled by the mutation.
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200";

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f5f8f3] px-4 py-8 dark:bg-gray-950 sm:px-6 lg:flex lg:items-center lg:justify-center lg:py-12">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-green-100 bg-white shadow-xl shadow-green-950/5 dark:border-gray-800 dark:bg-gray-900 lg:grid-cols-2">
        {/* Left Branding Panel */}
        <div className="relative hidden min-h-[760px] overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-green-700 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200"
              alt="Beautiful green garden"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-green-900/75 to-green-800/60" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                🌿
              </div>

              <span className="text-xl font-bold text-white">
                RooftopGarden
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-300">
              Join Our Community
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-tight text-white xl:text-5xl">
              Grow Something Beautiful.
            </h2>

            <p className="mt-6 text-base leading-8 text-green-50/80">
              Create your account and discover a world of plants, gardening
              inspiration, and professional services. Your rooftop garden
              journey starts here.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                  🌱
                </div>
                <div>
                  <p className="font-semibold text-white">Discover Plants</p>
                  <p className="text-sm text-green-100/70">
                    Find the perfect plants for your space.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                  🪴
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Expert Gardening Services
                  </p>
                  <p className="text-sm text-green-100/70">
                    Get professional help for your garden.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                  🌍
                </div>
                <div>
                  <p className="font-semibold text-white">Grow Greener</p>
                  <p className="text-sm text-green-100/70">
                    Make your surroundings more beautiful.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-green-100/60">
            © {new Date().getFullYear()} RooftopGarden. All rights reserved.
          </p>
        </div>

        {/* Registration Form */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-14">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <Link to="/" className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-2xl dark:bg-green-900/30">
                🌿
              </div>

              <span className="text-xl font-bold text-green-800 dark:text-green-400">
                RooftopGarden
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl dark:bg-green-900/30">
                🌱
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Create Account
              </h1>

              <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                Join RooftopGarden and start growing your own green paradise.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  {...register("fullName")}
                  className={inputClass}
                />

                {errors.fullName && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={inputClass}
                />

                {errors.email && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    {...register("password")}
                    className={`${inputClass} pr-16`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-green-700 hover:text-green-900 dark:text-green-400"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.password.message}
                  </p>
                )}

                <p className="mt-2 text-xs text-gray-400">
                  Password must contain at least 8 characters.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phoneNumber" className={labelClass}>
                  Phone Number
                  <span className="ml-2 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+8801XXXXXXXXX"
                  {...register("phoneNumber")}
                  className={inputClass}
                />

                {errors.phoneNumber && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* API Error */}
              {errors.root?.message && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
                  {errors.root.message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-700/20 transition hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                {!isLoading && <span>→</span>}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs font-semibold text-gray-400">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Google Registration */}
            <GoogleLoginButton
              disabled={isGoogleLoading || isLoading}
              onSuccess={handleGoogleLogin}
            />

            {isGoogleLoading && (
              <p className="mt-2 text-center text-xs text-gray-500">
                Signing in with Google...
              </p>
            )}

            {/* Login Link */}
            <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-green-700 hover:text-green-900 dark:text-green-400"
              >
                Sign In
              </Link>
            </p>

            {/* Footer */}
            <div className="mt-8 text-center">
              <Link
                to="/"
                className="text-xs font-medium text-gray-400 transition hover:text-green-700 dark:hover:text-green-400"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
