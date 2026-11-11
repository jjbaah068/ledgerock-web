import { useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, CircleCheck, Info, Tag } from "lucide-react";
import {
  getAdminProperty,
  updateAdminProperty,
  type AdminProperty,
  type AdminPropertyStatus,
} from "@/data/admindashboard";
import AdminTopNav from "@/components/admintopnav";
import AdminFooter from "@/components/adminfooter";

const STATUS_OPTIONS: { label: string; value: AdminPropertyStatus }[] = [
  { label: "Active Listing", value: "Published" },
  { label: "Draft", value: "Draft" },
  { label: "Sold", value: "Sold" },
];

interface FormState {
  title: string;
  price: string; // digits only, e.g. "1250000"
  status: AdminPropertyStatus;
  address: string;
  city: string;
  zip: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

function toForm(p: AdminProperty): FormState {
  return {
    title: p.title,
    price: p.price ? String(Math.round(p.price)) : "",
    status: p.status,
    address: p.address,
    city: p.city ?? "",
    zip: p.zip ?? "",
  };
}

/** "1250000" -> "1,250,000" */
function formatDigits(digits: string): string {
  return digits ? Number(digits).toLocaleString("en-US") : "";
}

const inputClass =
  "w-full rounded-xl border border-neutral-700/10 bg-[#F5F1EA] px-3.5 py-2.5 font-body text-sm text-neutral-700 placeholder:text-neutral-700/45 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 aria-[invalid=true]:border-red-400";

export default function AdminEditProperty() {
  const { propertyId = "" } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => getAdminProperty(propertyId));
  const [form, setForm] = useState<FormState | null>(() => (saved ? toForm(saved) : null));
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<string | null>(null);

  if (!saved || !form) {
    return (
      <div className="flex min-h-svh flex-col">
      <AdminTopNav />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 lg:py-10">
        <BackLink />
        <div className="mt-6 rounded-2xl bg-white px-6 py-14 text-center shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)]">
          <p className="font-headline text-lg font-semibold text-neutral-700">
            Property not found
          </p>
          <p className="mt-1 font-body text-sm text-neutral-700/70">
            It may have been deleted, or the page was reloaded. Properties aren&apos;t
            stored permanently yet.
          </p>
          <Link
            to="/admin/properties"
            className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Go to Properties
          </Link>
        </div>
      </div>
      <AdminFooter />
      </div>
    );
  }

  const original = toForm(saved);
  const isDirty = (Object.keys(original) as (keyof FormState)[]).some(
    (k) => original[k] !== form[k],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    setNotice(null);
  }

  function discard() {
    setForm(original);
    setErrors({});
    setNotice(null);
  }

  function markAsSold() {
    if (!saved) return;
    const soldAt = new Date().toISOString();
    updateAdminProperty(saved.id, { status: "Sold", soldAt });
    setSaved({ ...saved, status: "Sold", soldAt });
    setForm((f) => (f ? { ...f, status: "Sold" } : f));
    setNotice("Marked as sold.");
  }

  function save() {
    if (!form || !saved) return;
    const found: Errors = {};
    if (!form.title.trim()) found.title = "Add a property title.";
    if (form.status !== "Draft") {
      if (!(Number(form.price) > 0)) found.price = "Enter a price.";
      if (!form.address.trim()) found.address = "Add the street address.";
    }
    if (form.zip && !/^\d{5}(-\d{4})?$/.test(form.zip.trim())) {
      found.zip = "Use a 5-digit ZIP code.";
    }
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`edit-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    updateAdminProperty(saved.id, {
      title: form.title.trim(),
      price: Number(form.price) || 0,
      status: form.status,
      soldAt:
        form.status === "Sold" ? (saved.soldAt ?? new Date().toISOString()) : saved.soldAt,
      address: form.address.trim(),
      city: form.city.trim() || undefined,
      zip: form.zip.trim() || undefined,
    });
    navigate("/admin/properties");
  }

  const headerAddress = saved.address || saved.title;
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="flex min-h-svh flex-col">
    <AdminTopNav />
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 lg:py-10">
      <BackLink />

      {/* Header */}
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
            Edit Property
          </h1>
          <p className="mt-1.5 font-body text-sm text-neutral-700/75">
            Update details for {headerAddress}
          </p>
        </div>
        <div className="flex gap-3 self-start">
          <button
            type="button"
            onClick={discard}
            disabled={!isDirty}
            className="rounded-full border border-neutral-700/20 bg-white px-5 py-2.5 font-body text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-700/20 disabled:hover:text-neutral-700"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={markAsSold}
            disabled={saved.status === "Sold"}
            className="inline-flex items-center gap-2 rounded-full bg-[#6B5530] px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-[#574524] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B5530] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Tag className="h-4 w-4" aria-hidden="true" />
            {saved.status === "Sold" ? "Sold" : "Mark as Sold"}
          </button>
        </div>
      </div>

      {notice && (
        <p
          role="status"
          className="mt-6 flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 font-body text-sm text-primary-dark"
        >
          <CircleCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
          {notice}
        </p>
      )}
      {hasErrors && (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Fix the highlighted fields before saving.
        </p>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="mt-8"
      >
        <section className="rounded-2xl bg-white p-5 shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)] sm:p-7">
          <h2 className="flex items-center gap-2.5 border-b border-neutral-100 pb-4 font-headline text-lg font-semibold text-primary">
            <Info className="h-4 w-4" aria-hidden="true" />
            Basic Information
          </h2>

          <div className="mt-5 space-y-5">
            <Field label="Property Title" id="edit-title" error={errors.title}>
              {(p) => (
                <input
                  {...p}
                  type="text"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  className={inputClass}
                />
              )}
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Price ($)" id="edit-price" error={errors.price}>
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    inputMode="numeric"
                    value={formatDigits(form.price)}
                    onChange={(e) => update("price", e.target.value.replace(/\D/g, "").slice(0, 12))}
                    placeholder="0"
                    className={inputClass}
                  />
                )}
              </Field>
              <Field label="Status" id="edit-status">
                {(p) => (
                  <select
                    {...p}
                    value={form.status}
                    onChange={(e) => update("status", e.target.value as AdminPropertyStatus)}
                    className={inputClass}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>

            <Field label="Street Address" id="edit-address" error={errors.address}>
              {(p) => (
                <input
                  {...p}
                  type="text"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className={inputClass}
                />
              )}
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="City" id="edit-city">
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={inputClass}
                  />
                )}
              </Field>
              <Field label="ZIP" id="edit-zip" error={errors.zip}>
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={10}
                    value={form.zip}
                    onChange={(e) => update("zip", e.target.value)}
                    className={inputClass}
                  />
                )}
              </Field>
            </div>
          </div>
        </section>

        {/* Action bar */}
        <div className="mt-6 flex items-center justify-end gap-3 rounded-2xl bg-[#E9E4DA] px-5 py-4 shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)]">
          <button
            type="button"
            onClick={() => navigate("/admin/properties")}
            className="rounded-full border border-neutral-700/15 bg-white px-5 py-2 font-body text-sm font-medium text-neutral-700 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-2.5 font-headline text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Update Property
          </button>
        </div>
      </form>
    </div>
    <AdminFooter />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/admin/properties"
      className="inline-flex items-center gap-1.5 rounded-sm font-body text-xs font-medium text-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
      Back to Properties
    </Link>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: (props: {
    id: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-body text-xs font-semibold text-neutral-700">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="mt-1.5 font-body text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
