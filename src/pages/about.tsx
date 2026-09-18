import { motion } from "motion/react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import masterPlan from "../assets/img6.png";
import aboutCover from "../assets/img8.png";
import entrance from "../assets/img7.png";

const shorelineImage =
  "https://images.unsplash.com/photo-1721069662098-f2031c2319b8?w=900&q=80&auto=format&fit=crop";
const dockImage =
  "https://images.unsplash.com/photo-1731667251901-60977d1be3fe?w=900&q=80&auto=format&fit=crop";

const STATS = [
  { label: "Founded", value: "2014" },
  { label: "Acres Acquired", value: "20" },
  { label: "Shoreline", value: "1,250 ft" },
  { label: "Lots at Ledge Rock", value: "14" },
];

const SETTING_GRID = [
  { label: "Shoreline", image: shorelineImage },
  { label: "The Entrance", image: entrance },
  { label: "Dock Access", image: dockImage },
];

const CINEMATIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Staggered animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: CINEMATIC_EASE } },
};

function InitialsAvatar({ initials, name, tone }: { initials: string; name: string; tone: "primary" | "secondary" }) {
  return (
    <div
      className={`flex aspect-square w-full items-center justify-center rounded-2xl md:aspect-[4/5] ${
        tone === "primary" ? "bg-primary/5 ring-1 ring-primary/10" : "bg-secondary/5 ring-1 ring-secondary/10"
      }`}
    >
      <div className="text-center">
        <span
          className={`font-headline text-5xl font-semibold tracking-tight lg:text-7xl ${
            tone === "primary" ? "text-primary" : "text-secondary"
          }`}
        >
          {initials}
        </span>
        <p className="mt-4 font-body text-xs uppercase tracking-widest text-neutral-500">
          {name}
        </p>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="bg-neutral-50">
      <Navbar transparent />

      {/* Hero Section */}
      <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={aboutCover}
          alt="Table Rock Lake at Ledge Rock at Cricket Creek"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white"
        >
          <motion.h1 variants={fadeUp} className="font-headline text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            An Architect&apos;s Return to Table Rock Lake
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl font-body text-lg text-white/80 md:text-xl">
            Lakeshore Properties Group, LLC was formed in 2014 to bring one
            architect&apos;s vision for lakeside living back to the water he grew up on.
          </motion.p>
        </motion.div>
      </section>

      {/* Overlapping Stats Strip */}
      <div className="relative z-20 mx-auto -mt-16 max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: CINEMATIC_EASE, delay: 0.4 }}
          className="grid grid-cols-2 divide-x divide-neutral-100 rounded-2xl bg-white p-8 shadow-xl shadow-black/5 ring-1 ring-neutral-200/50 sm:grid-cols-4 lg:p-10"
        >
          {STATS.map((stat, idx) => (
            <div key={stat.label} className={`px-4 text-center ${idx === 0 ? "pl-0" : ""} ${idx === STATS.length - 1 ? "pr-0" : ""}`}>
              <p className="font-headline text-3xl font-bold text-primary lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 font-body text-xs font-medium uppercase tracking-wider text-neutral-500">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Unified Team Section */}
      <section className="px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.h2 variants={fadeUp} className="font-headline text-3xl font-semibold text-neutral-800 lg:text-4xl">
              The People Behind the Vision
            </motion.h2>
            <motion.div variants={fadeUp} className="mx-auto mt-4 h-0.5 w-16 bg-tertiary" />
          </motion.div>

          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:gap-24">
            {/* Daniel */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col gap-8"
            >
              <motion.div variants={fadeUp} className="w-2/3 md:w-full">
                <InitialsAvatar initials="DB" name="Daniel Butler" tone="primary" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <h3 className="font-headline text-2xl font-semibold text-neutral-800">Daniel Butler</h3>
                <p className="text-sm font-medium text-primary">Owner & Architect</p>
                <div className="mt-4 space-y-4 font-body text-[15px] leading-relaxed text-neutral-600">
                  <p>
                    Lakeshore Properties Group is owned and managed by Daniel Butler, a Springfield, Missouri native and graduate of the University of Kansas School of Architecture.
                  </p>
                  <p>
                    After building a successful architecture firm in the Pacific Northwest, Daniel returned to the Ozarks and the lake he grew up on, to be closer to family and pursue land development on Table Rock Lake.
                  </p>
                </div>
                <a href="/properties" className="group mt-6 inline-flex items-center gap-2 font-body text-[15px] font-medium text-primary transition-colors hover:text-primary-dark">
                  See how Daniel can help design your home
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Becky */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col gap-8"
            >
              <motion.div variants={fadeUp} className="w-2/3 md:w-full">
                <InitialsAvatar initials="B" name="Becky" tone="secondary" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <h3 className="font-headline text-2xl font-semibold text-neutral-800">Becky</h3>
                <p className="text-sm font-medium text-secondary">Lead Agent</p>
                <div className="mt-4 space-y-4 font-body text-[15px] leading-relaxed text-neutral-600">
                  <p>
                    Becky is the on-the-ground agent for Ledge Rock at Cricket Creek &mdash; touring lots with buyers and representing them through the transaction, start to close.
                  </p>
                  <p className="italic text-neutral-500">
                    Full bio, credentials, and brokerage affiliation coming soon.
                  </p>
                </div>
                <a href="/contact" className="group mt-6 inline-flex items-center gap-2 font-body text-[15px] font-medium text-secondary transition-colors hover:text-secondary-dark">
                  Get in touch with Becky
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Land & Setting (Bento-style Grid) */}
      <section className="bg-white px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
            className="mb-12 max-w-2xl"
          >
            <h2 className="font-headline text-3xl font-semibold text-neutral-800 lg:text-4xl">The Land & Setting</h2>
            <div className="mt-4 h-0.5 w-16 bg-tertiary" />
            <p className="mt-6 font-body text-lg leading-relaxed text-neutral-600">
              In 2014, Lakeshore Properties Group acquired 20 acres of land with 1,250 feet of shoreline fronting Table Rock Lake. It has since been developed into a gated, tree-lined community with 14 residential lots.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Master Plan Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
              className="flex flex-col justify-between overflow-hidden rounded-3xl bg-neutral-50 p-8 ring-1 ring-neutral-200/50 lg:col-span-1"
            >
              <div>
                <h3 className="font-headline text-xl font-semibold text-neutral-800">Master Site Plan</h3>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-neutral-600">
                  All underground utilities and roadway already in place. Located at 13500&ndash;13800 Ledge Rock Lane, Omaha, Arkansas 72662.
                </p>
                <a href="/properties" className="mt-6 inline-block font-body text-[14px] font-medium text-primary underline decoration-tertiary decoration-2 underline-offset-4 hover:text-primary-dark">
                  Explore available lots
                </a>
              </div>
              <img
                src={masterPlan}
                alt="Master site plan"
                className="mt-8 w-full rounded-xl object-contain shadow-sm ring-1 ring-neutral-900/5"
              />
            </motion.div>

            {/* Gallery Layout */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
              {SETTING_GRID.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.1, ease: CINEMATIC_EASE }}
                  className={`group relative overflow-hidden rounded-3xl ${idx === 0 ? "sm:col-span-2 sm:h-80" : "h-64 sm:h-auto"}`}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute bottom-6 left-6 font-body text-sm font-medium uppercase tracking-widest text-white">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Next & CTA */}
      <section className="relative overflow-hidden bg-neutral-900 px-6 py-24 text-center lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-black opacity-50" />
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative z-10 mx-auto max-w-2xl"
        >
          <motion.h2 variants={fadeUp} className="font-headline text-3xl font-semibold text-white lg:text-4xl">
            Looking to the Horizon
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 font-body text-[16px] leading-relaxed text-neutral-300">
            Lakeshore Properties Group has acquired adjacent parcels for future development, and will be releasing exclusive mountaintop lakeview properties in the near future.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10">
            <a
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-body text-[15px] font-medium text-white transition-all hover:scale-105 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              Get in Touch Today
            </a>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}