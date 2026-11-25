import { useEffect, useRef, useState, type ChangeEvent, type ComponentType, type ReactNode } from "react";
import {
  AlertCircle,
  Bell,
  Building2,
  CircleCheck,
  Lock,
  Save,
  UserRound,
} from "lucide-react";
import { useAdmin, useUpdateAdmin } from "@/components/adminlayout";
import {
  avatarProblem,
  changeAdminPassword,
  DEFAULT_ADMIN_SETTINGS,
  getAdminSettings,
  initials,
  MAX_PASSWORD_BYTES,
  MIN_PASSWORD_BYTES,
  removeAdminAvatar,
  saveAdminSettings,
  updateAdminProfile,
  uploadAdminAvatar,
  type AdminSettings,
  type ProfileChanges,
} from "@/lib/adminsession";
import { errorFields, errorMessage } from "@/lib/api";
import { describeError, useToast } from "@/lib/feedback";

const OFFICE_OPTIONS = ["Ledge Rock at Cricket Creek", "Remote / Home Office"];

type NotificationKey = keyof AdminSettings["notifications"];
const NOTIFICATIONS: { key: NotificationKey; label: string }[] = [
  { key: "newInquiryAlerts", label: "New Inquiry Alerts" },
  { key: "weeklyReports", label: "Weekly Reports" },
  { key: "systemUpdates", label: "System Updates" },
];

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
}

type AvatarDraft = { file: File; url: string } | "remove" | null;

interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

type Errors = Partial<Record<string, string>>;

const inputClass =
  "w-full rounded-xl border border-neutral-700/10 bg-[#F5F1EA] px-3.5 py-2.5 font-body text-sm text-neutral-700 placeholder:text-neutral-700/45 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 aria-[invalid=true]:border-red-400";

const cardClass =
  "rounded-2xl bg-white p-5 shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)] sm:p-6";

export default function AdminSettings() {
  const admin = useAdmin();
  const updateAdmin = useUpdateAdmin();
  const toast = useToast();
  const photoInput = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileForm>({
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
  });
  const [avatarDraft, setAvatarDraft] = useState<AvatarDraft>(null);
  const [passwords, setPasswords] = useState<PasswordForm>({ current: "", next: "", confirm: "" });
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [settingsReady, setSettingsReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "saved" | "error" | "info"; text: string } | null>(
    null,
  );
  const avatarUrl = avatarDraft === "remove" ? undefined : (avatarDraft?.url ?? admin.avatarUrl);

  useEffect(() => {
    let active = true;
    getAdminSettings()
      .then((loaded) => {
        if (!active) return;
        setSettings(loaded);
        setSettingsReady(true);
      })
      .catch((error: unknown) => {
        if (active) setStatus({ kind: "error", text: `Settings could not be loaded. ${errorMessage(error)}` });
      });
    return () => {
      active = false;
    };
  }, []);

  const draftUrl = avatarDraft && avatarDraft !== "remove" ? avatarDraft.url : null;
  useEffect(
    () => () => {
      if (draftUrl) URL.revokeObjectURL(draftUrl);
    },
    [draftUrl],
  );

  function editProfile<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setStatus(null);
  }

  function editPassword(key: keyof PasswordForm, value: string) {
    setPasswords((p) => ({ ...p, [key]: value }));
    setErrors((e) => ({ ...e, current: undefined, next: undefined, confirm: undefined }));
    setStatus(null);
  }

  function editSettings(changes: Partial<AdminSettings>) {
    setSettings((s) => ({ ...s, ...changes }));
    setStatus(null);
  }

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const problem = avatarProblem(file);
    if (problem) {
      setPhotoError(problem);
      return;
    }
    setAvatarDraft({ file, url: URL.createObjectURL(file) });
    setPhotoError(null);
    setStatus(null);
  }

  async function save() {
    if (saving || !settingsReady) return;
    const found: Errors = {};
    const email = profile.email.trim().toLowerCase();
    const emailChanged = email !== admin.email;
    if (!profile.firstName.trim()) found.firstName = "Enter a first name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) found.email = "Enter a valid email address.";

    const { current, next, confirm } = passwords;
    const wantsPasswordChange = Boolean(next || confirm);
    if (wantsPasswordChange) {
      const bytes = new TextEncoder().encode(next).length;
      if (!current) found.current = "Enter your current password.";
      if (bytes < MIN_PASSWORD_BYTES) found.next = `Use at least ${MIN_PASSWORD_BYTES} characters.`;
      else if (bytes > MAX_PASSWORD_BYTES) found.next = `Use at most ${MAX_PASSWORD_BYTES} bytes.`;
      if (confirm !== next) found.confirm = "Passwords don't match.";
    }
    if (emailChanged && !current) found.current = "Enter your current password to change your email.";

    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(`settings-${firstError}`)?.focus();
      setStatus({ kind: "error", text: "Fix the highlighted fields before saving." });
      return;
    }

    setSaving(true);
    setStatus(null);
    let passwordChanged = false;
    const saved: string[] = [];
    try {
      if (wantsPasswordChange) {
        await changeAdminPassword(current, next, confirm);
        passwordChanged = true;
        saved.push("Password (other devices were signed out)");
        setPasswords({ current: "", next: "", confirm: "" });
      }

      const changes: ProfileChanges = {};
      if (profile.firstName.trim() !== admin.firstName) changes.firstName = profile.firstName.trim();
      if (profile.lastName.trim() !== admin.lastName) changes.lastName = profile.lastName.trim();
      if (emailChanged) {
        changes.email = email;
        changes.currentPassword = passwordChanged ? next : current;
      }
      if (Object.keys(changes).length > 0) {
        updateAdmin(await updateAdminProfile(changes));
        setProfile((p) => ({ ...p, email }));
        if (changes.firstName !== undefined || changes.lastName !== undefined) saved.push("Name");
        if (changes.email) saved.push(`Email (now ${email})`);
      }

      if (avatarDraft === "remove") {
        updateAdmin(await removeAdminAvatar());
        setAvatarDraft(null);
        saved.push("Profile photo removed");
      } else if (avatarDraft) {
        updateAdmin(await uploadAdminAvatar(avatarDraft.file));
        setAvatarDraft(null);
        saved.push("Profile photo");
      }

      setSettings(await saveAdminSettings(settings));
      saved.push("Business info and notification preferences");
      setPasswords({ current: "", next: "", confirm: "" });
      toast.success({
        source: "Settings · Save",
        title: "Settings saved",
        description: "Your account and business details are up to date.",
        details: saved,
      });
    } catch (error) {
      const fields = errorFields(error);
      setErrors(fields);
      if (fields.avatar) setPhotoError(fields.avatar);
      const first = Object.keys(fields)[0];
      if (first) document.getElementById(`settings-${first}`)?.focus();
      if (saved.length > 0) {
        toast.warning({
          source: "Settings · Save",
          title: "Some changes were saved, but not all",
          description: errorMessage(error),
          details: saved.map((item) => `Saved: ${item}`),
          reference: describeError(error).reference,
        });
      } else {
        toast.fromError(error, { source: "Settings · Save", title: "Your changes weren't saved" });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
            Settings
          </h1>
          <p className="mt-1.5 font-body text-sm text-neutral-700/75">
            Manage your personal profile and business contact details.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving || !settingsReady}
          className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {status && (
        <p
          role={status.kind === "error" ? "alert" : "status"}
          className={`mt-6 flex items-start gap-2 rounded-xl px-4 py-3 font-body text-sm ${
            status.kind === "error"
              ? "bg-red-50 text-red-700"
              : status.kind === "info"
                ? "bg-tertiary/15 text-[#6B5530]"
                : "bg-primary/10 text-primary-dark"
          }`}
        >
          {status.kind === "error" ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          {status.text}
        </p>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card icon={UserRound} title="Personal Profile">
            <div className="flex items-center gap-5">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Your profile photo"
                  className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-[#F5F1EA]"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary font-headline text-2xl font-semibold text-white ring-4 ring-[#F5F1EA]"
                >
                  {initials([profile.firstName, profile.lastName].join(" ")) || "?"}
                </span>
              )}
              <div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => photoInput.current?.click()}
                    className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-body text-xs font-semibold text-primary-dark transition hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Change Photo
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarDraft(admin.avatarUrl ? "remove" : null);
                        setStatus(null);
                      }}
                      className="rounded-full px-3 py-1.5 font-body text-xs text-neutral-700/70 transition hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="mt-1.5 font-body text-[11px] text-neutral-700/60">
                  JPG, GIF or PNG. Max size of 800K
                </p>
                {photoError && (
                  <p role="alert" className="mt-1 font-body text-xs text-red-600">
                    {photoError}
                  </p>
                )}
              </div>
              <input
                ref={photoInput}
                type="file"
                accept=".jpg,.jpeg,.gif,.png,image/jpeg,image/gif,image/png"
                onChange={choosePhoto}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field id="settings-firstName" label="First Name" error={errors.firstName}>
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    autoComplete="given-name"
                    value={profile.firstName}
                    onChange={(e) => editProfile("firstName", e.target.value)}
                    className={inputClass}
                  />
                )}
              </Field>
              <Field id="settings-lastName" label="Last Name" error={errors.lastName}>
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    autoComplete="family-name"
                    value={profile.lastName}
                    onChange={(e) => editProfile("lastName", e.target.value)}
                    className={inputClass}
                  />
                )}
              </Field>
            </div>

            <Field id="settings-email" label="Email Address" error={errors.email}>
              {(p) => (
                <input
                  {...p}
                  type="email"
                  autoComplete="email"
                  value={profile.email}
                  onChange={(e) => editProfile("email", e.target.value)}
                  className={inputClass}
                />
              )}
            </Field>
          </Card>

          <Card icon={Lock} title="Security">
            <Field id="settings-current" label="Current Password" error={errors.current}>
              {(p) => (
                <input
                  {...p}
                  type="password"
                  autoComplete="current-password"
                  value={passwords.current}
                  onChange={(e) => editPassword("current", e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              )}
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field id="settings-next" label="New Password" error={errors.next}>
                {(p) => (
                  <input
                    {...p}
                    type="password"
                    autoComplete="new-password"
                    value={passwords.next}
                    onChange={(e) => editPassword("next", e.target.value)}
                    placeholder="New password"
                    className={inputClass}
                  />
                )}
              </Field>
              <Field id="settings-confirm" label="Confirm New Password" error={errors.confirm}>
                {(p) => (
                  <input
                    {...p}
                    type="password"
                    autoComplete="new-password"
                    value={passwords.confirm}
                    onChange={(e) => editPassword("confirm", e.target.value)}
                    placeholder="Confirm password"
                    className={inputClass}
                  />
                )}
              </Field>
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Card icon={Building2} title="Business Info">
            <Field id="settings-officePhone" label="Office Phone" error={errors.officePhone}>
              {(p) => (
                <input
                  {...p}
                  type="tel"
                  autoComplete="work tel"
                  value={settings.officePhone}
                  onChange={(e) => editSettings({ officePhone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className={inputClass}
                />
              )}
            </Field>
            <Field id="settings-mobilePhone" label="Mobile Phone" error={errors.mobilePhone}>
              {(p) => (
                <input
                  {...p}
                  type="tel"
                  autoComplete="mobile tel"
                  value={settings.mobilePhone}
                  onChange={(e) => editSettings({ mobilePhone: e.target.value })}
                  placeholder="(555) 987-6543"
                  className={inputClass}
                />
              )}
            </Field>
            <Field id="settings-primaryOffice" label="Primary Office" error={errors.primaryOffice}>
              {(p) => (
                <select
                  {...p}
                  value={settings.primaryOffice}
                  onChange={(e) => editSettings({ primaryOffice: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select office</option>
                  {OFFICE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </Card>

          <section className="rounded-2xl bg-[#EFEBE3] p-5 sm:p-6">
            <h2 className="flex items-center gap-2.5 border-b border-neutral-700/10 pb-4 font-headline text-lg font-semibold text-neutral-700">
              <Bell className="h-4 w-4" aria-hidden="true" />
              Notifications
            </h2>
            <ul className="mt-4 space-y-4">
              {NOTIFICATIONS.map(({ key, label }) => (
                <li key={key} className="flex items-center justify-between gap-4">
                  <span id={`notify-${key}`} className="font-body text-sm text-neutral-700/85">
                    {label}
                  </span>
                  <Switch
                    labelledBy={`notify-${key}`}
                    checked={settings.notifications[key]}
                    onChange={(checked) =>
                      editSettings({
                        notifications: { ...settings.notifications, [key]: checked },
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </form>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={cardClass}>
      <h2 className="flex items-center gap-2.5 border-b border-neutral-100 pb-4 font-headline text-lg font-semibold text-neutral-700">
        <Icon className="h-4 w-4 text-tertiary" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
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

function Switch({
  checked,
  onChange,
  labelledBy,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelledBy: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        checked ? "bg-primary" : "bg-neutral-700/20"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
