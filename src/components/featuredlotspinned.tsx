import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Ruler, Waves, ArrowRight } from "lucide-react";
import lotimg1 from "../assets/img2.png";
import lotimg2 from "../assets/img3.png";
import lotimg3 from "../assets/img4.png";

type LotStatus = "Available" | "Reserved" | "Sold";

interface Lot {
  id: string;
  name: string;
  status: LotStatus;
  price: string;
  acreage: string;
  shoreline: string;
  viewType: "Lakefront" | "Lakeview";
  image: string;
}

const FEATURED_LOTS: Lot[] = [
  {
    id: "lot-4",
    name: "Lot 4",
    status: "Available",
    price: "Price on Request",
    acreage: "1.1 acres",
    shoreline: "210 ft shoreline",
    viewType: "Lakefront",
    image: lotimg1,
  },
  {
    id: "lot-7",
    name: "Lot 7",
    status: "Available",
    price: "Price on Request",
    acreage: "0.9 acres",
    shoreline: "Lake access via Dock Road",
    viewType: "Lakeview",
    image: lotimg2,
  },
  {
    id: "lot-9",
    name: "Lot 9",
    status: "Available",
    price: "Price on Request",
    acreage: "1.3 acres",
    shoreline: "180 ft shoreline",
    viewType: "Lakefront",
    image: lotimg3,
  },
];

const STATUS_STYLES: Record<LotStatus, string> = {
  Available: "bg-primary text-white",
  Reserved: "bg-tertiary text-white",
  Sold: "bg-neutral text-white",
};

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

export default function FeaturedLotsPinned() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Tracks which slide is currently filling the viewport, so the side
  // progress dots can reflect it — plain IntersectionObserver, no extra
  // scroll library needed for this part.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = slideRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative">
      {/* Section heading sits above the snap container, not inside it */}
      <div className="bg-[#FAF7F1] px-6 py-16 text-center lg:px-8">
        <h2 className="font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
          Available at Ledge Rock
        </h2>
        <div className="mx-auto mt-3 h-0.5 w-16 bg-tertiary" />
        <p className="mx-auto mt-5 max-w-2xl font-body text-base text-neutral-700/80">
          Seven lots are ready to build now, part of a fourteen-lot gated
          community set on twenty acres and 1,250 feet of Table Rock Lake
          shoreline.
        </p>
      </div>

      {/* Fixed-height scroll-snap container — scrolling inside this area
          locks to each lot in turn; once you pass the last one, normal
          page scroll continues below as usual. */}
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
        {FEATURED_LOTS.map((lot, index) => (
          <div
            key={lot.id}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className="relative flex h-screen w-full snap-start items-end overflow-hidden"
          >
            <img
              src={lot.image}
              alt={`${lot.name} at Ledge Rock at Cricket Creek`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />

            {/* Progress dots — right edge, shows which lot is active */}
            <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
              {FEATURED_LOTS.map((_, dotIndex) => (
                <span
                  key={dotIndex}
                  className={`h-2 w-2 rounded-full transition-all ${
                    dotIndex === activeIndex ? "h-6 bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Slide content — animates in each time this slide becomes active */}
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={
                index === activeIndex
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 30, filter: "blur(8px)" }
              }
              transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
              className="relative z-10 w-full px-6 pb-16 text-white lg:px-16"
            >
              <span
                className={`inline-block rounded-full px-3 py-1 font-body text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[lot.status]}`}
              >
                {lot.status}
              </span>

              <h3 className="mt-4 font-headline text-4xl font-semibold sm:text-5xl">
                {lot.name} &mdash; {lot.viewType}
              </h3>
              <p className="mt-2 font-body text-xl font-semibold text-tertiary">
                {lot.price}
              </p>

              <p className="mt-3 flex items-center gap-1.5 font-body text-sm text-white/80">
                <MapPin className="h-4 w-4 shrink-0" />
                Ledge Rock at Cricket Creek, Omaha, AR
              </p>

              <div className="mt-5 flex items-center gap-6 font-body text-sm text-white/85">
                <span className="flex items-center gap-1.5">
                  <Ruler className="h-4 w-4 shrink-0" />
                  {lot.acreage}
                </span>
                <span className="flex items-center gap-1.5">
                  <Waves className="h-4 w-4 shrink-0" />
                  {lot.shoreline}
                </span>
              </div>

              <a
                href={`/properties/${lot.id}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-[15px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
              >
                View Property
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        ))}
      </div>

      {/* View all CTA — after the snap container, part of normal page flow */}
      <div className="bg-[#FAF7F1] px-6 py-12 text-center lg:px-8">
        <a
          href="/properties"
          className="font-body text-[15px] font-medium text-primary underline decoration-tertiary decoration-2 underline-offset-4 transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
        >
          View All Available Lots
        </a>
      </div>
    </section>
  );
}