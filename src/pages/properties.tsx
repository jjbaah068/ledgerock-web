import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { MapPin, Ruler, Waves, Search, ArrowRight, X } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { LOTS, STATUS_STYLES, type LotStatus } from "../data/lots";

const STATUS_FILTERS: Array<LotStatus | "All"> = [
  "All",
  "Available",
  "Reserved",
  "Sold",
];
const VIEW_TYPE_FILTERS: Array<"Lakefront" | "Lakeview" | "All"> = [
  "All",
  "Lakefront",
  "Lakeview",
];

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: CINEMATIC_EASE },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: 0.3, ease: CINEMATIC_EASE },
  },
};

export default function Properties() {
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]>("All");
  const [viewTypeFilter, setViewTypeFilter] =
    useState<(typeof VIEW_TYPE_FILTERS)[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLots = useMemo(() => {
    return LOTS.filter((lot) => {
      const matchesStatus = statusFilter === "All" || lot.status === statusFilter;
      const matchesViewType =
        viewTypeFilter === "All" || lot.viewType === viewTypeFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        lot.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesStatus && matchesViewType && matchesSearch;
    });
  }, [statusFilter, viewTypeFilter, searchQuery]);

  const hasActiveFilters =
    statusFilter !== "All" || viewTypeFilter !== "All" || searchQuery !== "";

  function clearFilters() {
    setStatusFilter("All");
    setViewTypeFilter("All");
    setSearchQuery("");
  }

  return (
    <>
      <Navbar />

      {/* Page header */}
      <section className="bg-[#FAF7F1] px-6 py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="font-headline text-4xl font-semibold text-neutral-700 sm:text-5xl">
            Our Properties
          </h1>
          <p className="mt-4 font-body text-base text-neutral-700/80">
            Lots are ready to build now, part of a fourteen-lot gated
            community set on twenty acres and 1,250 feet of Table Rock Lake
            shoreline.
          </p>
        </motion.div>
      </section>

      {/* Filter bar */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE, delay: 0.15 }}
        className="bg-[#FAF7F1] px-6 pb-12 lg:px-8"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left group */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="rounded-full border border-neutral-200 bg-white px-5 py-2.5 font-body text-sm text-neutral-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "Status" : status}
                </option>
              ))}
            </select>

            <select
              value={viewTypeFilter}
              onChange={(e) =>
                setViewTypeFilter(e.target.value as typeof viewTypeFilter)
              }
              className="rounded-full border border-neutral-200 bg-white px-5 py-2.5 font-body text-sm text-neutral-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {VIEW_TYPE_FILTERS.map((viewType) => (
                <option key={viewType} value={viewType}>
                  {viewType === "All" ? "View Type" : viewType}
                </option>
              ))}
            </select>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  type="button"
                  onClick={clearFilters}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1 font-body text-sm text-neutral-700/60 transition-colors hover:text-primary"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Right group */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by lot name..."
              className="rounded-full border border-neutral-200 bg-white px-5 py-2.5 font-body text-sm text-neutral-700 placeholder:text-neutral-700/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              aria-label="Search lots"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-6xl font-body text-sm text-neutral-700/60">
          Showing {filteredLots.length} of {LOTS.length} lots
        </p>
      </motion.section>

      {/* Lot grid - Refactored for Premium Layout */}
      <section className="bg-white px-6 py-20 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto flex max-w-6xl flex-col gap-24 lg:gap-32"
        >
          <AnimatePresence mode="popLayout">
            {filteredLots.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center font-body text-[15px] text-neutral-700/70"
              >
                No lots match your filters right now.
              </motion.p>
            ) : (
              filteredLots.map((lot, index) => (
                <motion.div
                  key={lot.id}
                  layout
                  variants={cardItem}
                  exit="exit"
                  className={`group flex flex-col items-center gap-10 lg:gap-16 ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                    }`}
                >
                  {/* Expansive Image Side */}
                  <div className="relative h-[350px] w-full overflow-hidden rounded-2xl md:h-[500px] md:w-3/5">
                    <img
                      src={lot.image}
                      alt={
                        lot.isPlaceholderImage
                          ? "Example home built at Ledge Rock"
                          : `${lot.name} at Ledge Rock at Cricket Creek`
                      }
                      className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                    <span
                      className={`absolute left-4 top-4 rounded-full px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-widest backdrop-blur-md ${STATUS_STYLES[lot.status]}`}
                    >
                      {lot.status}
                    </span>
                    {lot.isPlaceholderImage && (
                      <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-1.5 font-body text-xs text-white backdrop-blur-md">
                        Example home &mdash; lot photography coming soon
                      </span>
                    )}
                  </div>

                  {/* Refined Content Side */}
                  <div className="flex w-full flex-col md:w-2/5">
                    <div className="mb-4 flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-widest text-neutral-400">
                      <MapPin className="h-4 w-4" />
                      Ledge Rock at Cricket Creek
                    </div>

                    <h2 className="font-headline text-3xl font-semibold text-neutral-800 lg:text-4xl">
                      {lot.name}
                    </h2>

                    <p className="mt-3 font-body text-xl font-medium text-primary">
                      {lot.price} <span className="font-normal text-neutral-400">&mdash; {lot.viewType}</span>
                    </p>

                    <div className="my-8 grid grid-cols-2 gap-8 border-y border-neutral-100 py-6">
                      <div>
                        <p className="mb-1 font-body text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                          Acreage
                        </p>
                        <p className="flex items-center gap-2 font-body text-neutral-700">
                          <Ruler className="h-4 w-4 text-primary" />
                          {lot.acreage}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 font-body text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                          Shoreline
                        </p>
                        <p className="flex items-center gap-2 font-body text-neutral-700">
                          <Waves className="h-4 w-4 text-primary" />
                          {lot.shoreline}
                        </p>
                      </div>
                    </div>

                    {/* Bespoke Call to Action */}
                    <Link className="group/btn inline-flex w-fit items-center gap-4 font-body text-base font-medium text-neutral-800 transition-colors hover:text-primary" to={`/properties/${lot.id}`}>
                      <span className="border-b-2 border-transparent pb-0.5 transition-colors group-hover/btn:border-primary">
                        Explore Property
                      </span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 transition-all group-hover/btn:bg-primary group-hover/btn:text-white">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}