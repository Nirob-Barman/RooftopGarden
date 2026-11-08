import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation, useGoogleLoginMutation } from "./authApi";
import { usePageTitle } from "../../hooks/usePageTitle";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  usePageTitle("Login");

  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap();
      navigate("/");
    } catch {
      // API error is displayed below.
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

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f5f8f3] px-4 py-8 dark:bg-gray-950 sm:px-6 lg:flex lg:items-center lg:justify-center lg:py-12">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-green-100 bg-white shadow-xl shadow-green-950/5 dark:border-gray-800 dark:bg-gray-900 lg:grid-cols-2">
        {/* Left Branding Panel */}
        <div className="relative hidden min-h-[650px] overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-green-700 p-10 lg:flex lg:flex-col lg:justify-between">
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
              Welcome Back
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-tight text-white xl:text-5xl">
              Your Green Journey Starts Here.
            </h2>

            <p className="mt-6 text-base leading-8 text-green-50/80">
              Discover beautiful plants, professional gardening services, and
              everything you need to transform your rooftop into a green
              paradise.
            </p>

            <div className="mt-10 flex items-center gap-3 text-sm text-green-100">
              <span className="text-xl">🌱</span>
              <span>Growing greener spaces, one rooftop at a time.</span>
            </div>
          </div>

          <p className="relative z-10 text-xs text-green-100/60">
            © {new Date().getFullYear()} RooftopGarden. All rights reserved.
          </p>
        </div>

        {/* Login Form Panel */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <Link to="/" className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-2xl dark:bg-green-900/30">
                🌿
              </div>

              <span className="text-xl font-bold text-green-800 dark:text-green-400">
                RooftopGarden
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl dark:bg-green-900/30">
                👋
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome Back!
              </h1>

              <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                Sign in to your account and continue your gardening journey.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800"
                />

                {errors.email && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800"
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
              </div>

              {/* API Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
                  Invalid email or password. Please try again.
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-700/20 transition hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <span>→</span>}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs font-semibold text-gray-400">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Google Login */}
            <GoogleLoginButton
              disabled={isGoogleLoading || isLoading}
              onSuccess={handleGoogleLogin}
            />

            {/* Register */}
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-green-700 hover:text-green-900 dark:text-green-400"
              >
                Create Account
              </Link>
            </p>

            {/* Footer */}
            <div className="mt-10 text-center">
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
