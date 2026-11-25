import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, FileText, ImagePlus, Info, Ruler, Star, Tag, X } from "lucide-react";
import {
  getAdminProperty,
  MAX_PROPERTY_PHOTOS,
  photoProblem,
  PROPERTY_FEATURES,
  PROPERTY_TYPES,
  replaceAdminPropertyImages,
  updateAdminProperty,
  type AdminProperty,
  type AdminPropertyStatus,
  type PropertyFeature,
  type PropertyInput,
  type PropertyType,
} from "@/data/admindashboard";
import { useConfirm, useToast } from "@/lib/feedback";
import AdminFooter from "@/components/adminfooter";
import { AdminLoading } from "@/components/adminstatus";
import { ApiError, errorFields, errorMessage } from "@/lib/api";

const DESCRIPTION_LIMIT = 2000;

const STATUS_OPTIONS: { label: string; value: AdminPropertyStatus }[] = [
  { label: "Active Listing", value: "Published" },
  { label: "Draft", value: "Draft" },
  { label: "Sold", value: "Sold" },
];

interface FormState {
  title: string;
  propertyType: PropertyType | "";
  price: string;
  status: AdminPropertyStatus;
  description: string;
  address: string;
  city: string;
  zip: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  features: PropertyFeature[];
}

interface Photo {
  id: string;
  url: string;
  file?: File;
}

type Errors = Partial<Record<keyof FormState | "photos" | "keep", string>>;

const numberText = (value: number | undefined) => (value === undefined ? "" : String(value));
const numberOrNull = (value: string) => (value.trim() === "" ? null : Number(value));

function toForm(p: AdminProperty): FormState {
  return {
    title: p.title,
    propertyType: p.propertyType ?? "",
    price: p.price ? String(p.price) : "",
    status: p.status,
    description: p.description,
    address: p.address,
    city: p.city ?? "",
    zip: p.zip ?? "",
    bedrooms: numberText(p.bedrooms),
    bathrooms: numberText(p.bathrooms),
    squareFeet: numberText(p.squareFeet),
    features: p.features,
  };
}

const toPhotos = (p: AdminProperty): Photo[] => p.images.map((url) => ({ id: url, url }));

function cleanPrice(value: string): string {
  const [whole = "", ...rest] = value.replace(/[^\d.]/g, "").split(".");
  const digits = whole.slice(0, 12);
  return rest.length > 0 ? `${digits}.${rest.join("").slice(0, 2)}` : digits;
}

function formatPrice(value: string): string {
  if (!value) return "";
  const [whole = "", decimals] = value.split(".");
  const grouped = whole ? Number(whole).toLocaleString("en-US") : "0";
  return decimals === undefined ? grouped : `${grouped}.${decimals}`;
}

function propertyChanges(form: FormState, saved: AdminProperty): PropertyInput {
  const before = toForm(saved);
  const changes: PropertyInput = {};
  if (form.title !== before.title) changes.title = form.title.trim();
  if (form.propertyType !== before.propertyType) changes.propertyType = form.propertyType || null;
  if (form.price !== before.price) changes.price = Number(form.price) || 0;
  if (form.status !== before.status) changes.status = form.status;
  if (form.description !== before.description) changes.description = form.description.trim();
  if (form.address !== before.address) changes.address = form.address.trim();
  if (form.city !== before.city) changes.city = form.city.trim() || null;
  if (form.zip !== before.zip) changes.zip = form.zip.trim() || null;
  if (form.bedrooms !== before.bedrooms) changes.bedrooms = numberOrNull(form.bedrooms);
  if (form.bathrooms !== before.bathrooms) changes.bathrooms = numberOrNull(form.bathrooms);
  if (form.squareFeet !== before.squareFeet) changes.squareFeet = numberOrNull(form.squareFeet);
  if ([...form.features].sort().join() !== [...before.features].sort().join()) changes.features = form.features;
  return changes;
}

const photosChanged = (photos: Photo[], saved: AdminProperty) =>
  photos.length !== saved.images.length || photos.some((p, i) => p.file || p.url !== saved.images[i]);

const inputClass =
  "w-full rounded-xl border border-neutral-700/10 bg-[#F5F1EA] px-3.5 py-2.5 font-body text-sm text-neutral-700 placeholder:text-neutral-700/45 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 aria-[invalid=true]:border-red-400";

const sectionClass = "rounded-2xl bg-white p-5 shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)] sm:p-7";
const headingClass = "flex items-center gap-2.5 border-b border-neutral-100 pb-4 font-headline text-lg font-semibold text-primary";

type LoadState = { id: string; property?: AdminProperty; error?: string; missing?: boolean };

export default function AdminEditProperty() {
  const { propertyId = "" } = useParams();
  const [state, setState] = useState<LoadState | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getAdminProperty(propertyId)
      .then((property) => {
        if (active) setState({ id: propertyId, property });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const missing = error instanceof ApiError && error.status === 404;
        setState({ id: propertyId, missing, error: errorMessage(error) });
      });
    return () => {
      active = false;
    };
  }, [propertyId, attempt]);

  const current = state?.id === propertyId ? state : null;

  if (current?.property) {
    return <EditForm key={current.property.id} property={current.property} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 lg:py-10">
        <BackLink />
        <div className="mt-6 rounded-2xl bg-white px-6 py-14 text-center shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)]">
          {!current ? (
            <AdminLoading label="Loading property..." />
          ) : (
            <>
              <p className="font-headline text-lg font-semibold text-neutral-700">
                {current.missing ? "Property not found" : "Property could not be loaded"}
              </p>
              <p className="mt-1 font-body text-sm text-neutral-700/70">
                {current.missing ? "It may have been deleted." : current.error}
              </p>
              {current.missing ? (
                <Link
                  to="/admin/properties"
                  className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Go to Properties
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setState(null);
                    setAttempt((value) => value + 1);
                  }}
                  className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  Try again
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <AdminFooter />
    </div>
  );
}

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  propertyType: "Type",
  price: "Price",
  status: "Status",
  description: "Description",
  address: "Address",
  city: "City",
  zip: "ZIP",
  bedrooms: "Bedrooms",
  bathrooms: "Bathrooms",
  squareFeet: "Square feet",
  features: "Features",
};

function EditForm({ property }: { property: AdminProperty }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(property);
  const [form, setForm] = useState<FormState>(() => toForm(property));
  const [photos, setPhotos] = useState<Photo[]>(() => toPhotos(property));
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(
    () => () => {
      photosRef.current.forEach((p) => {
        if (p.file) URL.revokeObjectURL(p.url);
      });
    },
    [],
  );

  const isDirty = Object.keys(propertyChanges(form, saved)).length > 0 || photosChanged(photos, saved);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    setFormError(null);
  }

  function toggleFeature(feature: PropertyFeature) {
    update(
      "features",
      form.features.includes(feature) ? form.features.filter((f) => f !== feature) : [...form.features, feature],
    );
  }

  function resetPhotos(next: Photo[]) {
    photos.forEach((p) => {
      if (p.file && !next.some((n) => n.id === p.id)) URL.revokeObjectURL(p.url);
    });
    setPhotos(next);
  }

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(event.target.files ?? []);
    const problems = chosen.map(photoProblem).filter((p): p is string => p !== null);
    const files = chosen.filter((file) => !photoProblem(file));
    const room = MAX_PROPERTY_PHOTOS - photos.length;
    if (files.length > room) problems.push(`Only ${MAX_PROPERTY_PHOTOS} photos can be added.`);
    const added = files.slice(0, room).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));
    setPhotos((list) => [...list, ...added]);
    setErrors((e) => ({ ...e, photos: problems.length > 0 ? problems.join(" ") : undefined }));
    event.target.value = "";
  }

  function removePhoto(id: string) {
    resetPhotos(photos.filter((p) => p.id !== id));
  }

  function makeCover(id: string) {
    const photo = photos.find((p) => p.id === id);
    if (photo) setPhotos([photo, ...photos.filter((p) => p.id !== id)]);
  }

  async function discard() {
    const confirmed = await confirm({
      tone: "warning",
      title: "Discard your changes?",
      description: "Everything you've changed since the last save, including added or reordered photos, will be lost.",
      subject: { label: saved.title, detail: "Last saved version will be restored" },
      confirmLabel: "Discard changes",
      cancelLabel: "Keep editing",
    });
    if (!confirmed) return;
    setForm(toForm(saved));
    resetPhotos(toPhotos(saved));
    setErrors({});
    setFormError(null);
  }

  function showError(error: unknown, source: string, title: string) {
    toast.fromError(error, { source, title });
    const fields = errorFields(error);
    setErrors(fields as Errors);
    setFormError(fields.photos ?? fields.keep ?? errorMessage(error));
    const first = Object.keys(fields)[0];
    if (first) document.getElementById(`edit-${first}`)?.focus();
  }

  async function markAsSold() {
    setSaving(true);
    setFormError(null);
    try {
      const result: { property?: AdminProperty } = {};
      const confirmed = await confirm({
        tone: "warning",
        title: "Mark this property as sold?",
        description: isDirty
          ? "Only the status changes now. Your other unsaved edits stay in the form until you click Update Property."
          : "It will show as Sold on the public site and count toward Sold (YTD). You can change the status later.",
        subject: { label: saved.title, detail: [saved.address, saved.city].filter(Boolean).join(", ") || undefined },
        confirmLabel: "Mark as Sold",
        busyLabel: "Saving…",
        action: async () => {
          result.property = await updateAdminProperty(saved.id, { status: "Sold" });
        },
      });
      const updated = result.property;
      if (confirmed && updated) {
        setSaved(updated);
        setForm((f) => ({ ...f, status: "Sold" }));
        toast.success({ source: "Edit Property · Status", title: "Marked as sold", description: `"${updated.title}" is now marked as Sold.` });
      }
    } catch (error) {
      showError(error, "Edit Property · Status", "Couldn't mark this property as sold");
    } finally {
      setSaving(false);
    }
  }

  async function savePhotos(id: string) {
    const keep = photos.filter((p) => !p.file).map((p) => p.url);
    const files = photos.flatMap((p) => (p.file ? [p.file] : []));
    const result = await replaceAdminPropertyImages(id, keep, files);
    const uploaded = result.images.slice(keep.length);
    let next = 0;
    const order = photos.map((p) => (p.file ? uploaded[next++] : p.url));
    if (order.every((url, i) => url === result.images[i])) return result;
    try {
      return await replaceAdminPropertyImages(id, order, []);
    } catch {
      setSaved(result);
      resetPhotos(toPhotos(result));
      throw new ApiError(500, "COVER_NOT_SAVED", "Your photos were saved, but the cover order was not. Choose the cover again.");
    }
  }

  async function save() {
    const found: Errors = {};
    if (!form.title.trim()) found.title = "Add a property title.";
    if (form.status !== "Draft") {
      if (!form.propertyType) found.propertyType = "Choose a property type.";
      if (!(Number(form.price) > 0)) found.price = "Enter a listing price.";
      if (!form.address.trim()) found.address = "Add the property location.";
    }
    if (form.zip && !/^\d{5}(-\d{4})?$/.test(form.zip.trim())) {
      found.zip = "Use a 5-digit ZIP code.";
    }
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError("Fix the highlighted fields before saving.");
      document.getElementById(`edit-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const changes = propertyChanges(form, saved);
      if (Object.keys(changes).length > 0) setSaved(await updateAdminProperty(saved.id, changes));
      const photosUpdated = photosChanged(photos, saved);
      if (photosUpdated) await savePhotos(saved.id);
      const changed = [
        ...Object.keys(changes).map((key) => FIELD_LABELS[key] ?? key),
        ...(photosUpdated ? ["Photos"] : []),
      ];
      toast.success({
        source: "Edit Property · Save",
        title: "Property updated",
        description: changed.length ? `Saved changes to "${form.title.trim()}".` : `No changes to save for "${form.title.trim()}".`,
        details: changed.length ? [`Updated: ${changed.join(", ")}`] : undefined,
      });
      navigate("/admin/properties");
    } catch (error) {
      showError(error, "Edit Property · Save", "Your changes weren't saved");
      setSaving(false);
    }
  }

  const headerAddress = saved.address || saved.title;

  return (
    <div className="flex flex-1 flex-col">
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 lg:py-10">
      <BackLink />

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
            disabled={!isDirty || saving}
            className="rounded-full border border-neutral-700/20 bg-white px-5 py-2.5 font-body text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-700/20 disabled:hover:text-neutral-700"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={markAsSold}
            disabled={saved.status === "Sold" || saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#6B5530] px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-[#574524] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B5530] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Tag className="h-4 w-4" aria-hidden="true" />
            {saved.status === "Sold" ? "Sold" : "Mark as Sold"}
          </button>
        </div>
      </div>

      {formError && (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {formError}
        </p>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="mt-8 space-y-6"
      >
        <section className={sectionClass}>
          <h2 className={headingClass}>
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

            <Field label="Property Type" id="edit-propertyType" error={errors.propertyType}>
              {(p) => (
                <select
                  {...p}
                  value={form.propertyType}
                  onChange={(e) => update("propertyType", e.target.value as PropertyType | "")}
                  className={inputClass}
                >
                  <option value="">Select Type</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Price ($)" id="edit-price" error={errors.price}>
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    inputMode="decimal"
                    value={formatPrice(form.price)}
                    onChange={(e) => update("price", cleanPrice(e.target.value))}
                    placeholder="0"
                    className={inputClass}
                  />
                )}
              </Field>
              <Field label="Status" id="edit-status" error={errors.status}>
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
              <Field label="City" id="edit-city" error={errors.city}>
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

        <section className={sectionClass}>
          <h2 className={headingClass}>
            <FileText className="h-4 w-4" aria-hidden="true" />
            Description
          </h2>
          <div className="mt-5">
            <Field label="Detailed Property Description" id="edit-description" error={errors.description}>
              {(p) => (
                <>
                  <textarea
                    {...p}
                    rows={6}
                    maxLength={DESCRIPTION_LIMIT}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className={`${inputClass} resize-y`}
                  />
                  <p className="mt-1.5 text-right font-body text-xs text-neutral-700/60">
                    {form.description.length} / {DESCRIPTION_LIMIT} characters
                  </p>
                </>
              )}
            </Field>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>
            <Ruler className="h-4 w-4" aria-hidden="true" />
            Dimensions and Features
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Bedrooms" id="edit-bedrooms" error={errors.bedrooms}>
              {(p) => (
                <input {...p} type="number" min={0} step={1} inputMode="numeric" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputClass} />
              )}
            </Field>
            <Field label="Bathrooms" id="edit-bathrooms" error={errors.bathrooms}>
              {(p) => (
                <input {...p} type="number" min={0} step={0.5} inputMode="decimal" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputClass} />
              )}
            </Field>
            <Field label="Square Feet" id="edit-squareFeet" error={errors.squareFeet}>
              {(p) => (
                <input {...p} type="number" min={0} step={1} inputMode="numeric" value={form.squareFeet} onChange={(e) => update("squareFeet", e.target.value)} className={inputClass} />
              )}
            </Field>
          </div>
          <fieldset className="mt-5">
            <legend className="mb-3 font-body text-xs font-semibold text-neutral-700">Features</legend>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PROPERTY_FEATURES.map((feature) => (
                <li key={feature}>
                  <label className="flex cursor-pointer items-center gap-3 font-body text-sm text-neutral-700/85">
                    <input
                      type="checkbox"
                      checked={form.features.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="h-4 w-4 rounded-full border-neutral-700/30 accent-primary"
                    />
                    {feature}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            Photos
          </h2>
          <p className="mt-4 font-body text-xs text-neutral-700/70">
            The first photo is used as the cover. Up to {MAX_PROPERTY_PHOTOS} images.
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <li key={photo.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F5F1EA]">
                <img src={photo.url} alt={`Property photo ${index + 1}`} className="h-full w-full object-cover" />
                {index === 0 ? (
                  <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 font-body text-[10px] font-semibold text-white">
                    Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeCover(photo.id)}
                    className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 font-body text-[10px] font-semibold text-neutral-700 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Star className="h-3 w-3" aria-hidden="true" />
                    Make cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-neutral-700 transition hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
            {photos.length < MAX_PROPERTY_PHOTOS && (
              <li>
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-700/20 bg-[#F5F1EA]/60 font-body text-xs font-medium text-neutral-700/70 transition hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ImagePlus className="h-5 w-5" aria-hidden="true" />
                  Add photos
                </button>
              </li>
            )}
          </ul>
          <input
            ref={fileInput}
            type="file"
            accept="image/*,.heic,.heif,.avif"
            multiple
            onChange={addPhotos}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
          {errors.photos && (
            <p role="alert" className="mt-3 font-body text-xs text-red-600">
              {errors.photos}
            </p>
          )}
        </section>

        <div className="flex items-center justify-end gap-3 rounded-2xl bg-[#E9E4DA] px-5 py-4 shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)]">
          <button
            type="button"
            onClick={() => navigate("/admin/properties")}
            className="rounded-full border border-neutral-700/15 bg-white px-5 py-2 font-body text-sm font-medium text-neutral-700 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary px-6 py-2.5 font-headline text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Update Property"}
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
