/*
 * Front-end-only admin session.
 *
 * There is no backend yet, so "signing in" just records who the admin is in
 * browser storage so the dashboard can greet them by name. This is NOT real
 * security: anyone can open the browser console and set this value. Replace
 * signInAdmin() with a call to a real auth service (which returns the admin's
 * name) before the admin section holds anything private.
 */

export interface AdminSession {
  name: string;
  email: string;
  role: string;
  /** Profile photo as a small data URL, if the admin has set one. */
  avatarUrl?: string;
}

const STORAGE_KEY = "ledgerock_admin_session";

function safeStorage(kind: "local" | "session"): Storage | null {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

/** Turns "becky.smith@lakeshore.com" into "Becky Smith". */
export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const words = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return words.join(" ") || "Admin";
}

export function signInAdmin(email: string, remember: boolean): AdminSession {
  // TODO: replace with a real request, e.g. POST /api/admin/login, and use
  // the name the server returns instead of deriving it from the email.
  const session: AdminSession = {
    name: nameFromEmail(email),
    email,
    role: "Admin",
  };
  signOutAdmin();
  safeStorage(remember ? "local" : "session")?.setItem(
    STORAGE_KEY,
    JSON.stringify(session),
  );
  return session;
}

export function getAdminSession(): AdminSession | null {
  for (const kind of ["session", "local"] as const) {
    const raw = safeStorage(kind)?.getItem(STORAGE_KEY);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as Partial<AdminSession>;
      if (parsed.name && parsed.email) {
        return {
          name: parsed.name,
          email: parsed.email,
          role: parsed.role ?? "Admin",
          avatarUrl: typeof parsed.avatarUrl === "string" ? parsed.avatarUrl : undefined,
        };
      }
    } catch {
      // ignore malformed values
    }
  }
  return null;
}

/**
 * Saves changes to the signed-in admin (e.g. a new profile photo) in the same
 * storage the session already lives in. Returns the updated session.
 */
export function updateAdminSession(changes: Partial<AdminSession>): AdminSession | null {
  for (const kind of ["session", "local"] as const) {
    const storage = safeStorage(kind);
    if (!storage?.getItem(STORAGE_KEY)) continue;
    const current = getAdminSession();
    if (!current) return null;
    const next = { ...current, ...changes };
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage full: keep the change for this page view only.
    }
    return next;
  }
  return null;
}

/**
 * Shrinks a chosen image to a small square JPEG data URL so it fits
 * comfortably in browser storage. TODO: upload to a server instead.
 */
export function resizeAvatar(file: File, size = 160): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas not supported"));
        return;
      }
      // Centre-crop to a square.
      const side = Math.min(img.width, img.height);
      ctx.drawImage(
        img,
        (img.width - side) / 2,
        (img.height - side) / 2,
        side,
        side,
        0,
        0,
        size,
        size,
      );
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image"));
    };
    img.src = url;
  });
}

export function signOutAdmin(): void {
  safeStorage("local")?.removeItem(STORAGE_KEY);
  safeStorage("session")?.removeItem(STORAGE_KEY);
}

export function firstName(name: string): string {
  return name.split(" ")[0] ?? name;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

/* ------------------------------------------------------------------ */
/* Admin settings (business info + notification choices)               */
/* ------------------------------------------------------------------ */

export interface AdminSettings {
  officePhone: string;
  mobilePhone: string;
  primaryOffice: string;
  notifications: {
    newInquiryAlerts: boolean;
    weeklyReports: boolean;
    systemUpdates: boolean;
  };
}

const SETTINGS_KEY = "ledgerock_admin_settings";

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  officePhone: "",
  mobilePhone: "",
  primaryOffice: "",
  notifications: { newInquiryAlerts: true, weeklyReports: true, systemUpdates: false },
};

/**
 * Saved in this browser only. TODO: store on a server, and actually send the
 * alert/report emails from there; the toggles only record the choice today.
 */
export function getAdminSettings(): AdminSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_ADMIN_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AdminSettings>;
    return {
      ...DEFAULT_ADMIN_SETTINGS,
      ...parsed,
      notifications: { ...DEFAULT_ADMIN_SETTINGS.notifications, ...parsed.notifications },
    };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}

export function saveAdminSettings(settings: AdminSettings): void {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage unavailable: settings last for this page view only.
  }
}
