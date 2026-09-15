// PLACEHOLDER DATA — replace once Dan confirms exact lot numbers, pricing,
// acreage, and shoreline footage per lot (open item from the SRS, OI-1).


import exampleHome1 from "../assets/img3.png";
import exampleHome2 from "../assets/img4.png";
import exampleHome3 from "../assets/img5.png";

export type LotStatus = "Available" | "Reserved" | "Sold";

export interface Lot {
  gallery: any[];
  id: string;
  name: string;
  status: LotStatus;
  price: string;
  acreage: string;
  shoreline: string;
  viewType: "Lakefront" | "Lakeview";
  image: string;
  isPlaceholderImage?: boolean;
  description: string;
}


const INFRASTRUCTURE_NOTE =
  "This lot is accessible by a paved road with power, water, and high-speed fiber internet already run to the property corner. Department of Health-approved lateral field layouts are in place for straightforward septic permitting, and no additional permits or inspections are required to build in Boone County, Arkansas — construction can begin as soon as closing is complete.";

export const LOTS: Lot[] = [
  {
      id: "lot-1",
      name: "Lot 1",
      status: "Available",
      price: "Price on Request",
      acreage: "1.0 acres",
      shoreline: "210 ft shoreline",
      viewType: "Lakefront",
      image: exampleHome1,
      isPlaceholderImage: true,
      description: INFRASTRUCTURE_NOTE,
      gallery: [exampleHome1, exampleHome2, exampleHome3]
  },
  {
      id: "lot-2",
      name: "Lot 2",
      status: "Available",
      price: "Price on Request",
      acreage: "0.9 acres",
      shoreline: "Lake access via Dock Road",
      viewType: "Lakeview",
      image: exampleHome2,
      isPlaceholderImage: true,
      description: INFRASTRUCTURE_NOTE,
      gallery: [exampleHome1, exampleHome2, exampleHome3]
  },
  {
      id: "lot-3",
      name: "Lot 3",
      status: "Available",
      price: "Price on Request",
      acreage: "1.2 acres",
      shoreline: "185 ft shoreline",
      viewType: "Lakefront",
      image: exampleHome1,
      isPlaceholderImage: true,
      description: INFRASTRUCTURE_NOTE,
      gallery: [exampleHome1, exampleHome2, exampleHome3]
  },
  {
      id: "lot-4",
      name: "Lot 4",
      status: "Available",
      price: "Price on Request",
      acreage: "1.1 acres",
      shoreline: "210 ft shoreline",
      viewType: "Lakefront",
      image: exampleHome2,
      isPlaceholderImage: true,
      description: INFRASTRUCTURE_NOTE,
      gallery: [exampleHome1, exampleHome2, exampleHome3]
  },
  {
      id: "lot-5",
      name: "Lot 5",
      status: "Available",
      price: "Price on Request",
      acreage: "0.95 acres",
      shoreline: "Lake access via Dock Road",
      viewType: "Lakeview",
      image: exampleHome1,
      isPlaceholderImage: true,
      description: INFRASTRUCTURE_NOTE,
      gallery: [exampleHome1, exampleHome2, exampleHome3]
  },
  {
      id: "lot-6",
      name: "Lot 6",
      status: "Available",
      price: "Price on Request",
      acreage: "1.3 acres",
      shoreline: "180 ft shoreline",
      viewType: "Lakefront",
      image: exampleHome2,
      isPlaceholderImage: true,
      description: INFRASTRUCTURE_NOTE,
      gallery: [exampleHome1, exampleHome2, exampleHome3]
  },
  {
      id: "lot-7",
      name: "Lot 7",
      status: "Available",
      price: "Price on Request",
      acreage: "1.0 acres",
      shoreline: "Lake access via Dock Road",
      viewType: "Lakeview",
      image: exampleHome1,
      isPlaceholderImage: true,
      description: INFRASTRUCTURE_NOTE,
      gallery: [exampleHome1, exampleHome2, exampleHome3]
  },
];

export const STATUS_STYLES: Record<LotStatus, string> = {
  Available: "bg-primary text-white",
  Reserved: "bg-tertiary text-white",
  Sold: "bg-neutral text-white",
};

export function getLotById(id: string): Lot | undefined {
  return LOTS.find((lot) => lot.id === id);
}