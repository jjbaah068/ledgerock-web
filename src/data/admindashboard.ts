import { api } from "@/lib/api";

export type AdminPropertyStatus = "Published" | "Draft" | "Sold";

export const PROPERTY_TYPES = [
  "Lakefront Lot",
  "Lakeview Lot",
  "Single-Family Home",
  "Cabin",
  "Cottage",
  "Condo / Townhome",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_FEATURES = [
  "Waterfront",
  "Dock Included",
  "Fireplace",
  "Renovated Kitchen",
  "Wood Floors",
] as const;
export type PropertyFeature = (typeof PROPERTY_FEATURES)[number];

export const MAX_PROPERTY_PHOTOS = 12;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export interface AdminProperty {
  id: string;
  title: string;
  address: string;
  city?: string;
  zip?: string;
  price: number;
  status: AdminPropertyStatus;
  image: string;
  images: string[];
  propertyType?: PropertyType;
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  features: PropertyFeature[];
  createdAt: string;
  soldAt?: string;
}

export interface PropertyInput {
  title?: string;
  address?: string;
  city?: string | null;
  zip?: string | null;
  price?: number;
  status?: AdminPropertyStatus;
  propertyType?: PropertyType | null;
  description?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  squareFeet?: number | null;
  features?: PropertyFeature[];
}

export type InquiryStatus = "New" | "Contacted" | "Closed";

export interface AdminInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  receivedAt: string;
  status: InquiryStatus;
  topic?: string;
  property?: {
    title: string;
    image?: string;
    lotId?: string;
    href?: string;
  };
}

export interface InquiryInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  topic?: string;
  lotId?: string;
  propertyId?: string;
  company?: string;
}

export interface DashboardStats {
  total: number;
  published: number;
  drafts: number;
  soldYtd: number;
  newInquiries: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentProperties: AdminProperty[];
  recentInquiries: AdminInquiry[];
}

interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

let version = 0;
const listeners = new Set<() => void>();

export function refreshAdminData(): void {
  version += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeAdminData(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAdminDataVersion(): number {
  return version;
}

async function listAll<T>(path: string, params: Record<string, string> = {}): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page += 1) {
    const query = new URLSearchParams({ ...params, page: String(page), limit: "100" });
    const result = await api<ListResponse<T>>(`${path}?${query}`);
    items.push(...result.items);
    if (result.items.length === 0 || items.length >= result.total) return items;
  }
}

export function listAdminProperties(): Promise<AdminProperty[]> {
  return listAll<AdminProperty>("/api/admin/properties");
}

export function listAdminPropertiesByTitle(): Promise<AdminProperty[]> {
  return listAll<AdminProperty>("/api/admin/properties", { sort: "title" });
}

export async function getAdminProperty(id: string): Promise<AdminProperty> {
  const { property } = await api<{ property: AdminProperty }>(`/api/admin/properties/${encodeURIComponent(id)}`);
  return property;
}

export async function addAdminProperty(input: PropertyInput, photos: File[]): Promise<AdminProperty> {
  const form = new FormData();
  form.append("data", JSON.stringify(input));
  photos.forEach((photo) => form.append("photos", photo));
  const { property } = await api<{ property: AdminProperty }>("/api/admin/properties", { method: "POST", form });
  refreshAdminData();
  return property;
}

export async function updateAdminProperty(id: string, changes: PropertyInput): Promise<AdminProperty> {
  const { property } = await api<{ property: AdminProperty }>(`/api/admin/properties/${encodeURIComponent(id)}`, {
    method: "PATCH",
    json: changes,
  });
  refreshAdminData();
  return property;
}

export async function replaceAdminPropertyImages(id: string, keep: string[], photos: File[]): Promise<AdminProperty> {
  const form = new FormData();
  form.append("keep", JSON.stringify(keep));
  photos.forEach((photo) => form.append("photos", photo));
  const { property } = await api<{ property: AdminProperty }>(
    `/api/admin/properties/${encodeURIComponent(id)}/images`,
    { method: "PUT", form },
  );
  refreshAdminData();
  return property;
}

export async function deleteAdminProperty(id: string): Promise<void> {
  await api<void>(`/api/admin/properties/${encodeURIComponent(id)}`, { method: "DELETE" });
  refreshAdminData();
}

export function listAdminInquiries(): Promise<AdminInquiry[]> {
  return listAll<AdminInquiry>("/api/admin/inquiries");
}

export async function updateAdminInquiry(id: string, status: InquiryStatus): Promise<AdminInquiry> {
  const { inquiry } = await api<{ inquiry: AdminInquiry }>(`/api/admin/inquiries/${encodeURIComponent(id)}`, {
    method: "PATCH",
    json: { status },
  });
  refreshAdminData();
  return inquiry;
}

export async function deleteAdminInquiry(id: string): Promise<void> {
  await api<void>(`/api/admin/inquiries/${encodeURIComponent(id)}`, { method: "DELETE" });
  refreshAdminData();
}

export async function submitInquiry(input: InquiryInput): Promise<void> {
  await api<{ id: string }>("/api/inquiries", { method: "POST", json: input });
}

export function getDashboard(): Promise<DashboardData> {
  return api<DashboardData>("/api/admin/dashboard");
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { stats } = await api<{ stats: DashboardStats }>("/api/admin/dashboard/stats");
  return stats;
}

export function formatUsd(value: number): string {
  const digits = Number.isInteger(value) ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function photoProblem(file: File): string | null {
  const looksLikeImage = file.type.startsWith("image/") || /\.(heic|heif|avif)$/i.test(file.name);
  if (!looksLikeImage) return `${file.name} is not an image.`;
  if (file.size > MAX_PHOTO_BYTES) return `${file.name} is larger than 10 MB.`;
  return null;
}
