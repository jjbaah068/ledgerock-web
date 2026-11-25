import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminAuthLayout from "../components/adminauthlayout";
import { signInAdmin } from "../lib/adminsession";
import { ApiError, errorMessage } from "../lib/api";
import adminImage from "../assets/login-welcome.webp";
import logo from "../assets/logo.webp";

const ADMIN_LOGIN_IMAGE = adminImage;
const ADMIN_LOGIN_IMAGE_ALT = "Illustration of a host holding a door open and welcoming two people inside";

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
    try {
      await signInAdmin(email, password, formData.get("remember") === "on");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.code === "LOCKED" && err.unlockAt) {
        const time = new Date(err.unlockAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        setError(`Too many attempts. Try again after ${time}.`);
      } else {
        setError(errorMessage(err));
      }
      setIsSubmitting(false);
    }
  }

  return (
    <AdminAuthLayout
      image={ADMIN_LOGIN_IMAGE}
      imageAlt={ADMIN_LOGIN_IMAGE_ALT}
      caption={
        <>
          <p className="font-headline text-2xl font-semibold text-primary">
            Welcome back
          </p>
          {/* <p className="mt-2 font-body text-sm leading-relaxed text-neutral-700/75">
            Manage listings, review inquiries and keep LedgeRock at Cricket Creek
            up to date.
          </p> */}
        </>
      }
    >
      <h1 className="flex justify-center lg:justify-start">
        {/* mix-blend-multiply drops the logo's white background on the cream panel */}
        <img
          src={logo}
          alt="LedgeRock at Cricket Creek"
          className="h-14 w-auto mix-blend-multiply sm:h-20"
        />
      </h1>
      <p className="mt-3 text-center font-body text-sm text-neutral-700/70 lg:text-left">
        Admin Portal Access
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5 sm:mt-10">
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

        <label className="flex w-fit cursor-pointer items-center gap-2 font-body text-sm text-neutral-700/80">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded-full border-neutral-700/30 accent-primary"
          />
          Remember me
        </label>

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
    </AdminAuthLayout>
  );
}
