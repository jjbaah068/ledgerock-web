import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminAuthLayout from "../components/adminauthlayout";
import { signInAdmin } from "../lib/adminsession";
import adminImage from "../assets/ldgeA1.jpg";
import logo from "../assets/logo.webp";

const ADMIN_LOGIN_IMAGE = adminImage;
const ADMIN_LOGIN_IMAGE_ALT = "Lakefront home at dusk on Table Rock Lake";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const previous = document.title;
    document.title = "Admin Login | LedgeRock";
    return () => {
      document.title = previous;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setIsSubmitting(true);
    // TODO: Replace with a real authentication request once a backend
    // exists. Credentials must be verified server-side, never in the browser.
    // Until then, any email/password is accepted and the email sets the name.
    signInAdmin(email, formData.get("remember") === "on");
    navigate("/admin/dashboard", { replace: true });
  }

  return (
    <AdminAuthLayout
      image={ADMIN_LOGIN_IMAGE}
      imageAlt={ADMIN_LOGIN_IMAGE_ALT}
    >
      <h1>
        {/* mix-blend-multiply drops the logo's white background on the cream panel */}
        <img
          src={logo}
          alt="LedgeRock at Cricket Creek"
          className="h-20 w-auto mix-blend-multiply"
        />
      </h1>
      <p className="mt-3 font-body text-sm text-neutral-700/70">
        Admin Portal Access
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
        <div>
          <label
            htmlFor="admin-email"
            className="mb-1.5 block font-body text-sm font-medium text-neutral-700"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
            />
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="you@lakeshore.com"
              className="w-full rounded-full border border-neutral-700/15 bg-white py-2.5 pl-10 pr-4 font-body text-sm text-neutral-700 placeholder:text-neutral-700/40 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-1.5 block font-body text-sm font-medium text-neutral-700"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary"
            />
            <input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full rounded-full border border-neutral-700/15 bg-white py-2.5 pl-10 pr-11 font-body text-sm text-neutral-700 placeholder:text-neutral-700/40 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-neutral-700/50 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 font-body text-sm text-neutral-700/80">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded-full border-neutral-700/30 accent-primary"
            />
            Remember me
          </label>
          <a
            href="mailto:danb@lakeshorepropgrp.com?subject=Admin%20password%20reset"
            className="rounded-sm font-body text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Forgot password?
          </a>
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 font-body text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-primary py-3 font-body text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-12 text-center font-body text-xs text-neutral-700/70">
        Need assistance?{" "}
        <a
          href="mailto:danb@lakeshorepropgrp.com?subject=Admin%20portal%20support"
          className="text-primary underline-offset-4 hover:underline"
        >
          Contact IT Support
        </a>
      </p>
    </AdminAuthLayout>
  );
}
