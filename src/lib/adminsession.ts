import { api, ApiError } from "@/lib/api";

export interface AdminSession {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

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

export interface ProfileChanges {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  officePhone: "",
  mobilePhone: "",
  primaryOffice: "",
  notifications: { newInquiryAlerts: true, weeklyReports: true, systemUpdates: false },
};

export const MIN_PASSWORD_BYTES = 12;
export const MAX_PASSWORD_BYTES = 72;
export const MAX_AVATAR_BYTES = 800 * 1024;
export const AVATAR_TYPES = ["image/jpeg", "image/gif", "image/png"];

export async function signInAdmin(email: string, password: string, remember: boolean): Promise<AdminSession> {
  const { admin } = await api<{ admin: AdminSession }>("/api/admin/login", {
    method: "POST",
    json: { email, password, remember },
  });
  return admin;
}

export async function fetchAdminSession(): Promise<AdminSession | null> {
  try {
    const { admin } = await api<{ admin: AdminSession }>("/api/admin/me");
    return admin;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function signOutAdmin(): Promise<void> {
  await api<void>("/api/admin/logout", { method: "POST" });
}

export async function updateAdminProfile(changes: ProfileChanges): Promise<AdminSession> {
  const { admin } = await api<{ admin: AdminSession }>("/api/admin/me", { method: "PATCH", json: changes });
  return admin;
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<void> {
  await api<void>("/api/admin/me/password", {
    method: "POST",
    json: { currentPassword, newPassword, confirmPassword },
  });
}

export async function uploadAdminAvatar(file: File): Promise<AdminSession> {
  const form = new FormData();
  form.append("avatar", file);
  const { admin } = await api<{ admin: AdminSession }>("/api/admin/me/avatar", { method: "PUT", form });
  return admin;
}

export async function removeAdminAvatar(): Promise<AdminSession> {
  const { admin } = await api<{ admin: AdminSession }>("/api/admin/me/avatar", { method: "DELETE" });
  return admin;
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const { settings } = await api<{ settings: AdminSettings }>("/api/admin/settings");
  return settings;
}

export async function saveAdminSettings(input: AdminSettings): Promise<AdminSettings> {
  const { settings } = await api<{ settings: AdminSettings }>("/api/admin/settings", {
    method: "PUT",
    json: input,
  });
  return settings;
}

export function avatarProblem(file: File): string | null {
  if (!AVATAR_TYPES.includes(file.type)) return "Please choose a JPG, GIF or PNG image.";
  if (file.size > MAX_AVATAR_BYTES) return "That image is larger than 800K. Please choose a smaller one.";
  return null;
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
