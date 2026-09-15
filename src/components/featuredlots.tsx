import { motion, type Variants } from "motion/react";
import { MapPin, Ruler, Waves } from "lucide-react";
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

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: CINEMATIC_EASE },
  },
};

export default function FeaturedLots() {
  return (
    <section className="bg-[#FAF7F1] px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
            Available at Ledge Rock
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-16 bg-tertiary" />
          <p className="mt-5 font-body text-base text-neutral-700/80">
            Seven lots are ready to build now, part of a fourteen-lot gated
            community set on twenty acres and 1,250 feet of Table Rock Lake
            shoreline.
          </p>
        </motion.div>

        {/* Lot cards —  */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURED_LOTS.map((lot) => (
            <motion.article
              key={lot.id}
              variants={cardItem}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-100"
            >
              {/* Image + status badge — slow zoom on hover, like a photo
                  that's gently alive rather than static. */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={lot.image}
                  alt={`${lot.name} at Ledge Rock at Cricket Creek`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 font-body text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[lot.status]}`}
                >
                  {lot.status}
                </span>
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="font-headline text-lg font-semibold text-neutral-700">
                  {lot.name} &mdash; {lot.viewType}
                </h3>
                <p className="mt-1 font-body text-lg font-semibold text-primary">
                  {lot.price}
                </p>

                <p className="mt-2 flex items-center gap-1.5 font-body text-sm text-neutral-700/70">
                  <MapPin className="h-4 w-4 shrink-0" />
                  Ledge Rock at Cricket Creek, Omaha, AR
                </p>

                <div className="mt-4 flex items-center gap-5 border-t border-neutral-100 pt-4 font-body text-sm text-neutral-700/80">
                  <span className="flex items-center gap-1.5">
                    <Ruler className="h-4 w-4 shrink-0" />
                    {lot.acreage}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Waves className="h-4 w-4 shrink-0" />
                    {lot.shoreline}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View all CTA */}
        <div className="mt-12 text-center">
          <a
            href="/properties"
            className="font-body text-[15px] font-medium text-primary underline decoration-tertiary decoration-2 underline-offset-4 transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            View All Available Lots
          </a>
        </div>
      </div>
    </section>
  );
}