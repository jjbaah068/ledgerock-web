import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Bath,
  BedDouble,
  CircleCheck,
  FileText,
  ImagePlus,
  Info,
  MapPin,
  Ruler,
  Send,
  Star,
  X,
} from "lucide-react";
import {
  addAdminProperty,
  MAX_PROPERTY_PHOTOS as MAX_PHOTOS,
  photoProblem,
  PROPERTY_FEATURES,
  PROPERTY_TYPES,
  type AdminPropertyStatus,
  type PropertyFeature,
  type PropertyType,
  formatUsd,
} from "@/data/admindashboard";
import { errorFields, errorMessage } from "@/lib/api";
import { useToast } from "@/lib/feedback";

const DESCRIPTION_LIMIT = 2000;

/** Status options shown in the form. "Save Draft" always saves as Draft. */
const STATUS_OPTIONS: { label: string; value: Exclude<AdminPropertyStatus, "Draft"> }[] = [
  { label: "Active Listing", value: "Published" },
  { label: "Sold", value: "Sold" },
];

interface Photo {
  id: string;
  url: string;
  name: string;
  file: File;
}

interface FormState {
  title: string;
  propertyType: PropertyType | "";
  status: Exclude<AdminPropertyStatus, "Draft">;
  price: string;
  description: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  features: PropertyFeature[];
}

const EMPTY_FORM: FormState = {
  title: "",
  propertyType: "",
  status: "Published",
  price: "",
  description: "",
  address: "",
  bedrooms: "",
  bathrooms: "",
  squareFeet: "",
  features: [],
};

type Errors = Partial<Record<keyof FormState, string>>;

const inputClass =
  "w-full rounded-xl border border-neutral-700/10 bg-[#F5F1EA] px-3.5 py-2.5 font-body text-sm text-neutral-700 placeholder:text-neutral-700/45 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 aria-[invalid=true]:border-red-400";

const labelClass = "mb-1.5 block font-body text-xs font-semibold text-neutral-700";

export default function AdminAddProperty() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(
    () => () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    },
    [],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    setFormMessage(null);
  }

  function toggleFeature(feature: PropertyFeature) {
    update(
      "features",
      form.features.includes(feature)
        ? form.features.filter((f) => f !== feature)
        : [...form.features, feature],
    );
  }

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(event.target.files ?? []);
    const problems = chosen.map(photoProblem).filter((p): p is string => p !== null);
    const files = chosen.filter((file) => !photoProblem(file));
    const room = MAX_PHOTOS - photos.length;
    if (files.length > room) problems.push(`Only ${MAX_PHOTOS} photos can be added.`);
    const added = files.slice(0, room).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));
    setPhotos((list) => [...list, ...added]);
    setPhotoError(problems.length > 0 ? problems.join(" ") : null);
    event.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((list) => {
      const photo = list.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.url);
      return list.filter((p) => p.id !== id);
    });
  }

  function makeCover(id: string) {
    setPhotos((list) => {
      const photo = list.find((p) => p.id === id);
      return photo ? [photo, ...list.filter((p) => p.id !== id)] : list;
    });
  }

  function validate(asDraft: boolean): Errors {
    const next: Errors = {};
    if (!form.title.trim()) next.title = "Add a property title.";
    if (!asDraft) {
      if (!form.propertyType) next.propertyType = "Choose a property type.";
      if (!(Number(form.price) > 0)) next.price = "Enter a listing price.";
      if (!form.address.trim()) next.address = "Add the property location.";
    }
    return next;
  }

  async function save(asDraft: boolean) {
    if (saving) return;
    const found = validate(asDraft);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormMessage(
        asDraft
          ? "A draft needs at least a title."
          : "Fill in the highlighted fields before publishing.",
      );
      // Move focus to the first problem so keyboard and screen-reader users land on it.
      const first = Object.keys(found)[0];
      document.getElementById(`field-${first}`)?.focus();
      return;
    }

    const toNumber = (v: string) => (v.trim() === "" ? undefined : Number(v));
    setSaving(true);
    setFormMessage(null);
    try {
      const created = await addAdminProperty(
        {
          title: form.title.trim(),
          address: form.address.trim(),
          price: Number(form.price) || 0,
          status: asDraft ? "Draft" : form.status,
          propertyType: form.propertyType || undefined,
          description: form.description.trim(),
          bedrooms: toNumber(form.bedrooms),
          bathrooms: toNumber(form.bathrooms),
          squareFeet: toNumber(form.squareFeet),
          features: form.features,
        },
        photos.map((p) => p.file),
      );
      const photoCount = created.images.length;
      toast.success({
        source: asDraft ? "Add Property · Draft" : "Add Property · Publish",
        title: asDraft ? "Draft saved" : created.status === "Sold" ? "Sold listing added" : "Listing published",
        description: asDraft
          ? `"${created.title}" was saved as a draft. It isn't visible on the public site yet.`
          : `"${created.title}" is now on the public site.`,
        details: [`${photoCount} photo${photoCount === 1 ? "" : "s"} uploaded`, `Price: ${formatUsd(created.price)}`],
      });
      navigate("/admin/properties");
    } catch (error) {
      toast.fromError(error, {
        source: asDraft ? "Add Property · Draft" : "Add Property · Publish",
        title: asDraft ? "The draft wasn't saved" : "The listing wasn't published",
      });
      const fields = errorFields(error);
      setErrors(fields as Errors);
      setFormMessage(fields.photos ?? errorMessage(error));
      const first = Object.keys(fields)[0];
      if (first) document.getElementById(`field-${first}`)?.focus();
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
            Add New Property
          </h1>
          <p className="mt-1.5 font-body text-sm text-neutral-700/75">
            Enter the details for the new listing.
          </p>
        </div>
        <div className="flex gap-3 self-start">
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className="rounded-full border border-neutral-700/20 bg-white px-5 py-2.5 font-body text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#64836E] px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-[#55705E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64836E] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      {formMessage && (
        <p
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {formMessage}
        </p>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          save(false);
        }}
        className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Section icon={Info} title="Basic Information">
            <Field label="Property Title" name="title" error={errors.title}>
              {(props) => (
                <input
                  {...props}
                  type="text"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g., Lakefront Cottage Retreat"
                  className={inputClass}
                />
              )}
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Property Type" name="propertyType" error={errors.propertyType}>
                {(props) => (
                  <select
                    {...props}
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

              <Field label="Status" name="status">
                {(props) => (
                  <select
                    {...props}
                    value={form.status}
                    onChange={(e) => update("status", e.target.value as FormState["status"])}
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

            <Field label="Listing Price" name="price" error={errors.price}>
              {(props) => (
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-body text-sm text-neutral-700/60"
                  >
                    $
                  </span>
                  <input
                    {...props}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="0.00"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              )}
            </Field>
          </Section>

          <Section icon={FileText} title="Description">
            <Field label="Detailed Property Description" name="description">
              {(props) => (
                <>
                  <textarea
                    {...props}
                    rows={6}
                    maxLength={DESCRIPTION_LIMIT}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe the atmosphere, surroundings, and key selling points..."
                    className={`${inputClass} resize-y`}
                  />
                  <p className="mt-1.5 text-right font-body text-xs text-neutral-700/60">
                    {form.description.length} / {DESCRIPTION_LIMIT} characters
                  </p>
                </>
              )}
            </Field>
          </Section>

          <Section icon={MapPin} title="Location">
            <Field label="Address or Lot Location" name="address" error={errors.address}>
              {(props) => (
                <input
                  {...props}
                  type="text"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="e.g., Lot 7, Ledge Rock at Cricket Creek, Omaha, AR"
                  className={inputClass}
                />
              )}
            </Field>
          </Section>

          <Section icon={ImagePlus} title="Photos">
            <p className="-mt-1 mb-4 font-body text-xs text-neutral-700/70">
              The first photo is used as the cover. Up to {MAX_PHOTOS} images.
            </p>

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((photo, index) => (
                <li
                  key={photo.id}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F5F1EA]"
                >
                  <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
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
                    aria-label={`Remove ${photo.name}`}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-neutral-700 transition hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}

              {photos.length < MAX_PHOTOS && (
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
            {photoError && (
              <p role="alert" className="mt-3 font-body text-xs text-red-600">
                {photoError}
              </p>
            )}
          </Section>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Section icon={Ruler} title="Dimensions">
            <Field label="Bedrooms" name="bedrooms" icon={BedDouble}>
              {(props) => (
                <input
                  {...props}
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  value={form.bedrooms}
                  onChange={(e) => update("bedrooms", e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              )}
            </Field>
            <Field label="Bathrooms" name="bathrooms" icon={Bath}>
              {(props) => (
                <input
                  {...props}
                  type="number"
                  min={0}
                  step={0.5}
                  inputMode="decimal"
                  value={form.bathrooms}
                  onChange={(e) => update("bathrooms", e.target.value)}
                  placeholder="0.0"
                  className={inputClass}
                />
              )}
            </Field>
            <Field label="Square Feet" name="squareFeet" icon={Ruler}>
              {(props) => (
                <input
                  {...props}
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  value={form.squareFeet}
                  onChange={(e) => update("squareFeet", e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              )}
            </Field>
          </Section>

          <Section icon={CircleCheck} title="Features">
            <fieldset>
              <legend className="sr-only">Property features</legend>
              <ul className="space-y-3">
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
          </Section>
        </div>
      </form>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)] sm:p-6">
      <h2 className="flex items-center gap-2.5 border-b border-neutral-100 pb-4 font-headline text-lg font-semibold text-neutral-700">
        <Icon className="h-4 w-4 text-neutral-700" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

interface FieldControlProps {
  id: string;
  name: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

function Field({
  label,
  name,
  error,
  icon: Icon,
  children,
}: {
  label: string;
  name: keyof FormState;
  error?: string;
  icon?: ComponentType<{ className?: string }>;
  children: (props: FieldControlProps) => ReactNode;
}) {
  const errorId = useId();
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className={`${labelClass} flex items-center gap-1.5`}>
        {Icon && <Icon className="h-3.5 w-3.5 text-neutral-700/70" aria-hidden="true" />}
        {label}
      </label>
      {children({
        id,
        name,
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
