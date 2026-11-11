/*
 * Admin dashboard data. Both lists start empty, so every stat is 0.
 * Once properties and inquiries are stored somewhere real, load them here
 * (or fetch them) and the stats and "Recent" panels update automatically.
 */

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

export interface AdminProperty {
  id: string;
  title: string;
  /** Street address or lot location. */
  address: string;
  city?: string;
  zip?: string;
  price: number;
  status: AdminPropertyStatus;
  /** Cover photo. Empty string when no photo has been added. */
  image: string;
  /** All photos, cover first. */
  images?: string[];
  propertyType?: PropertyType;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  features?: PropertyFeature[];
  /** ISO date the property was created. */
  createdAt: string;
  /** ISO date the property was marked sold, if it has been. */
  soldAt?: string;
}

export type InquiryStatus = "New" | "Contacted" | "Closed";

export interface AdminInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  /** ISO date the inquiry was received. */
  receivedAt: string;
  status: InquiryStatus;
  /** What they're looking for, from the contact form (e.g. "Design services"). */
  topic?: string;
  /** The listing the person asked about, if any. */
  property?: {
    title: string;
    image?: string;
    /** Public lot id (from src/data/lots.ts); its photo is looked up when shown. */
    lotId?: string;
    /** Where "View Listing" goes, e.g. "/properties/lot-1". */
    href?: string;
  };
}

export const ADMIN_PROPERTIES: AdminProperty[] = [];
/*
 * Inquiries are kept in this browser's localStorage so a message sent from the
 * public contact form shows up in the admin inbox, even in another tab.
 * This only works on the same computer and browser: a real backend (or a
 * form service) is needed before customers' messages can reach the admin.
 */
const INQUIRIES_KEY = "ledgerock_inquiries";

function loadInquiries(): AdminInquiry[] {
  try {
    const raw = window.localStorage.getItem(INQUIRIES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as AdminInquiry[]) : [];
  } catch {
    return [];
  }
}

function saveInquiries(): void {
  try {
    window.localStorage.setItem(INQUIRIES_KEY, JSON.stringify(ADMIN_INQUIRIES));
  } catch {
    // Storage unavailable (private mode, full): keep changes in memory only.
  }
}

export const ADMIN_INQUIRIES: AdminInquiry[] = loadInquiries();

/*
 * Change notifications, so the sidebar badge and dashboard update as soon as
 * something is edited on another admin page.
 */
let version = 0;
const listeners = new Set<() => void>();

function notify() {
  version += 1;
  listeners.forEach((l) => l());
}

// Pick up inquiries saved by another tab (e.g. the contact page).
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== INQUIRIES_KEY) return;
    ADMIN_INQUIRIES.splice(0, ADMIN_INQUIRIES.length, ...loadInquiries());
    notify();
  });
}

export function subscribeAdminData(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAdminDataVersion(): number {
  return version;
}

/*
 * In-memory edits. These keep the admin pages in sync while you click around,
 * but everything resets on a page reload. Replace with API calls once
 * properties are stored on a server.
 */
export function addAdminProperty(
  property: Omit<AdminProperty, "id" | "createdAt">,
): AdminProperty {
  const saved: AdminProperty = {
    ...property,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    soldAt: property.status === "Sold" ? new Date().toISOString() : undefined,
  };
  ADMIN_PROPERTIES.push(saved);
  notify();
  return saved;
}

export function getAdminProperty(id: string): AdminProperty | undefined {
  return ADMIN_PROPERTIES.find((p) => p.id === id);
}

export function updateAdminProperty(id: string, changes: Partial<AdminProperty>): void {
  const index = ADMIN_PROPERTIES.findIndex((p) => p.id === id);
  if (index !== -1) ADMIN_PROPERTIES[index] = { ...ADMIN_PROPERTIES[index], ...changes };
  notify();
}

export function deleteAdminProperty(id: string): void {
  const index = ADMIN_PROPERTIES.findIndex((p) => p.id === id);
  if (index !== -1) ADMIN_PROPERTIES.splice(index, 1);
  notify();
}

export function addAdminInquiry(
  inquiry: Omit<AdminInquiry, "id" | "receivedAt" | "status">,
): AdminInquiry {
  const saved: AdminInquiry = {
    ...inquiry,
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    status: "New",
  };
  ADMIN_INQUIRIES.push(saved);
  saveInquiries();
  notify();
  return saved;
}

export function updateAdminInquiry(id: string, changes: Partial<AdminInquiry>): void {
  const index = ADMIN_INQUIRIES.findIndex((i) => i.id === id);
  if (index !== -1) ADMIN_INQUIRIES[index] = { ...ADMIN_INQUIRIES[index], ...changes };
  saveInquiries();
  notify();
}

export function deleteAdminInquiry(id: string): void {
  const index = ADMIN_INQUIRIES.findIndex((i) => i.id === id);
  if (index !== -1) ADMIN_INQUIRIES.splice(index, 1);
  saveInquiries();
  notify();
}

export interface DashboardStats {
  total: number;
  published: number;
  drafts: number;
  soldYtd: number;
  newInquiries: number;
}

export function getDashboardStats(
  properties: AdminProperty[] = ADMIN_PROPERTIES,
  inquiries: AdminInquiry[] = ADMIN_INQUIRIES,
  now: Date = new Date(),
): DashboardStats {
  const year = now.getFullYear();
  return {
    total: properties.length,
    published: properties.filter((p) => p.status === "Published").length,
    drafts: properties.filter((p) => p.status === "Draft").length,
    soldYtd: properties.filter(
      (p) =>
        p.status === "Sold" &&
        p.soldAt !== undefined &&
        new Date(p.soldAt).getFullYear() === year,
    ).length,
    newInquiries: inquiries.filter((i) => i.status === "New").length,
  };
}

export function getRecentProperties(limit = 4): AdminProperty[] {
  return [...ADMIN_PROPERTIES]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function getRecentInquiries(limit = 3): AdminInquiry[] {
  return [...ADMIN_INQUIRIES]
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
    .slice(0, limit);
}
