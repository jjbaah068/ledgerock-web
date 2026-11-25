import { Bath, BedDouble, Home, Ruler, Waves, type LucideIcon } from "lucide-react";
import placeholderPhoto from "../assets/img3.webp";
import { api } from "../lib/api";
import { formatUsd } from "./admindashboard";
import { LOTS, type Lot, type LotStatus } from "./lots";

export interface ListingSpec {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface Listing {
  id: string;
  name: string;
  status: LotStatus;
  price: string;
  viewType?: "Lakefront" | "Lakeview";
  image: string;
  gallery: string[];
  isPlaceholderImage?: boolean;
  description: string;
  location: string;
  specs: ListingSpec[];
  features: string[];
  lotId?: string;
  propertyId?: string;
}

interface PublicProperty {
  id: string;
  title: string;
  address: string;
  city?: string;
  zip?: string;
  price: number;
  status: "Available" | "Sold";
  image: string;
  images: string[];
  propertyType?: string;
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  features: string[];
}

interface PublicPropertyPage {
  items: PublicProperty[];
  total: number;
}

const DEFAULT_LOCATION = "Ledge Rock at Cricket Creek, Omaha, AR";

function fromLot(lot: Lot): Listing {
  return {
    id: lot.id,
    name: lot.name,
    status: lot.status,
    price: lot.price,
    viewType: lot.viewType,
    image: lot.image,
    gallery: lot.gallery,
    isPlaceholderImage: lot.isPlaceholderImage,
    description: lot.description,
    location: DEFAULT_LOCATION,
    specs: [
      { label: "Acreage", value: lot.acreage, icon: Ruler },
      { label: "Shoreline", value: lot.shoreline, icon: Waves },
    ],
    features: [],
    lotId: lot.id,
  };
}

function viewTypeOf(property: PublicProperty): Listing["viewType"] {
  if (property.propertyType === "Lakefront Lot" || property.features.includes("Waterfront")) return "Lakefront";
  if (property.propertyType === "Lakeview Lot") return "Lakeview";
  return undefined;
}

function fromProperty(property: PublicProperty): Listing {
  const specs: ListingSpec[] = [];
  if (property.propertyType) specs.push({ label: "Property Type", value: property.propertyType, icon: Home });
  if (property.squareFeet !== undefined) {
    specs.push({ label: "Square Feet", value: `${property.squareFeet.toLocaleString("en-US")} sq ft`, icon: Ruler });
  }
  if (property.bedrooms !== undefined) specs.push({ label: "Bedrooms", value: String(property.bedrooms), icon: BedDouble });
  if (property.bathrooms !== undefined) specs.push({ label: "Bathrooms", value: String(property.bathrooms), icon: Bath });

  const hasPhotos = property.images.length > 0;
  return {
    id: property.id,
    name: property.title,
    status: property.status,
    price: property.price > 0 ? formatUsd(property.price) : "Price on Request",
    viewType: viewTypeOf(property),
    image: hasPhotos ? property.images[0] : placeholderPhoto,
    gallery: hasPhotos ? property.images : [placeholderPhoto],
    isPlaceholderImage: !hasPhotos,
    description: property.description,
    location: [property.address, property.city, property.zip].filter(Boolean).join(", ") || DEFAULT_LOCATION,
    specs,
    features: property.features,
    propertyId: property.id,
  };
}

export const STATIC_LISTINGS: Listing[] = LOTS.map(fromLot);

export const getStaticListing = (id: string) => STATIC_LISTINGS.find((listing) => listing.id === id);

export const isPropertyId = (id: string) => /^[a-f\d]{24}$/i.test(id);

export async function fetchPublishedListings(): Promise<Listing[]> {
  const listings: Listing[] = [];
  for (let page = 1; ; page += 1) {
    const result = await api<PublicPropertyPage>(`/api/properties?page=${page}&limit=100`);
    listings.push(...result.items.map(fromProperty));
    if (result.items.length === 0 || listings.length >= result.total) return listings;
  }
}

export async function fetchPublishedListing(id: string): Promise<Listing> {
  const { property } = await api<{ property: PublicProperty }>(`/api/properties/${encodeURIComponent(id)}`);
  return fromProperty(property);
}
