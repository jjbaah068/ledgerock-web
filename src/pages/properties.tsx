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
  show: { transition: { staggerChildren: 0.08 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: CINEMATIC_EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.25, ease: CINEMATIC_EASE },
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
        className="bg-[#FAF7F1] px-6 pb-8 lg:px-8"
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

          {/* Right group —  */}
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

        {/* Result count — quiet feedback on what the filters are showing */}
        <p className="mx-auto mt-4 max-w-6xl font-body text-sm text-neutral-700/60">
          Showing {filteredLots.length} of {LOTS.length} lots
        </p>
      </motion.section>

      {/* Lot grid */}
      <section className="bg-white px-6 py-16 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredLots.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center font-body text-[15px] text-neutral-700/70"
              >
                No lots match your filters right now.
              </motion.p>
            ) : (
              filteredLots.map((lot) => (
                <motion.div
                  key={lot.id}
                  layout
                  variants={cardItem}
                  exit="exit"
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-200/60"
                >
                  {/* Image + status badge */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={lot.image}
                      alt={
                        lot.isPlaceholderImage
                          ? "Example home built at Ledge Rock"
                          : `${lot.name} at Ledge Rock at Cricket Creek`
                      }
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 font-body text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[lot.status]}`}
                    >
                      {lot.status}
                    </span>
                    {lot.isPlaceholderImage && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 font-body text-xs text-white">
                        Example home &mdash; lot photography coming soon
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <h2 className="font-headline text-lg font-semibold text-neutral-700">
                      {lot.name} &mdash; {lot.viewType}
                    </h2>
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

                    {/* View Property —  */}
                    <Link
                      to={`/properties/${lot.id}`}
                      className="mt-5 flex items-center justify-center gap-2 rounded-full border border-primary px-5 py-2.5 font-body text-[15px] font-medium text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      View Property
                      <ArrowRight className="h-4 w-4" />
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