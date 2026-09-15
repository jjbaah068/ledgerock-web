import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import {
  Fish,
  ShoppingCart,
  Anchor,
  MapPin,
  Home,
  Users,
  Palmtree,
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import aboutCover from "../assets/img1.png";
import entrance from "../assets/img7.png";

// PLACEHOLDER —
const shorelineImage =
  "https://images.unsplash.com/photo-1721069662098-f2031c2319b8?w=1200&q=80&auto=format&fit=crop";
const dockImage =
  "https://images.unsplash.com/photo-1731667251901-60977d1be3fe?w=1200&q=80&auto=format&fit=crop";
const golfImage =
  "https://images.unsplash.com/photo-1785843530152-b4b69040aa10?w=1200&q=80&auto=format&fit=crop";
const concertImage =
  "https://images.unsplash.com/photo-1768053921689-1bc09db904c9?w=1200&q=80&auto=format&fit=crop";
const canyonImage =
  "https://images.unsplash.com/photo-1658779987032-1f04a2960b2e?w=1200&q=80&auto=format&fit=crop";

const IMAGE_POOL = [
  entrance,
  aboutCover,
  shorelineImage,
  dockImage,
  golfImage,
  concertImage,
  canyonImage,
];


const HERO_GRID_CELLS = Array.from({ length: 8 }, (_, i) => ({
  images: [IMAGE_POOL[i % IMAGE_POOL.length], IMAGE_POOL[(i + 3) % IMAGE_POOL.length]],
  delay: i * 700,
}));

const BIG_CEDAR_HIGHLIGHTS = [
  { image: aboutCover, label: "Top of the Rock", time: "~15 min", isPlaceholder: false },
  { image: golfImage, label: "Big Cedar Nature Golf", time: "~15 min", isPlaceholder: true },
  { image: concertImage, label: "Thunder Ridge Amphitheatre", time: "~15 min", isPlaceholder: true },
  { image: canyonImage, label: "Dogwood Canyon", time: "~45 min", isPlaceholder: true },
];

const EVERYDAY_ESSENTIALS = [
  "Lowes",
  "Menards",
  "Harter House",
  "Country Mart",
  "Harrison, AR",
];

const DRIVE_TIMES = [
  { label: "Top of the Rock / Big Cedar", time: "~15 min" },
  { label: "Thunder Ridge Amphitheatre", time: "~15 min" },
  { label: "Downtown Branson", time: "~20 min" },
  { label: "Harrison, AR", time: "~28 min" },
  { label: "Dogwood Canyon", time: "~45 min" },
  { label: "Cricket Creek Marina", time: "On-site" },
];

const PILLARS = [
  {
    icon: Home,
    title: "A Home, Not Just Land",
    body: "Land ownership is just the start. From custom design to move-in day, there's a real path to building a home here, not just holding a lot.",
  },
  {
    icon: Users,
    title: "A Community, Not Just a Gate",
    body: "The value isn't the gate at the entrance. It's the peace, permanence, neighbourliness, and stewardship of the people living behind it.",
  },
  {
    icon: Palmtree,
    title: "A Retreat, Not Just a Getaway",
    body: "Quiet mornings on the water, evenings at Top of the Rock. Life here can feel like the vacation you'd usually have to leave home for.",
  },
];

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: CINEMATIC_EASE },
  },
};

function GridCell({ images, delay }: { images: string[]; delay: number }) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || images.length < 2) return;
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 6000);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [prefersReducedMotion, images.length, delay]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.img
          key={prefersReducedMotion ? "static" : index}
          src={images[prefersReducedMotion ? 0 : index]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: CINEMATIC_EASE }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
}

export default function TableRockLiving() {
  return (
    <>
      <Navbar transparent />

      {/* Hero — grid mosaic of images, each cell cycling independently */}
      <section className="relative flex min-h-[75vh] items-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-2">
          {HERO_GRID_CELLS.map((cell, i) => (
            <GridCell key={i} images={cell.images} delay={cell.delay} />
          ))}
        </div>
        <div className="absolute inset-0 z-[1] bg-black/55" />

        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: CINEMATIC_EASE, delay: 0.3 }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white"
        >
          <h1 className="font-headline text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Table Rock Living
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-body text-lg text-white/90">
            Quiet coves, easy highway access, and twenty minutes from
            everything Branson has to offer.
          </p>
        </motion.div>
      </section>

      {/* The location, in Dan's own framing */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="bg-white px-6 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2.5 font-body text-sm font-medium uppercase tracking-wide text-primary">
            <Fish className="h-4 w-4" />
            The Long Creek Arm
          </div>
          <p className="mt-4 font-body text-[15px] leading-relaxed text-neutral-700/85">
            The Long Creek arm of Table Rock Lake is a fisherman&apos;s
            dream &mdash; quiet coves, winding creek arms, and access to a
            full-service marina. The location is easily reached from Highway
            65, close to everything Big Cedar Resort has built in the area,
            and about twenty minutes from downtown Branson.
          </p>
        </div>
      </motion.section>

      {/* Three pillars — */}
      <section className="bg-[#FAF7F1] px-6 py-20 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3"
        >
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                variants={item}
                className="rounded-2xl bg-white p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-5 font-headline text-lg font-semibold text-neutral-700">
                  {pillar.title}
                </h3>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-neutral-700/80">
                  {pillar.body}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* What's Nearby — */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="bg-white px-6 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
            What&apos;s Nearby
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-16 bg-tertiary" />
          <p className="mt-5 font-body text-base text-neutral-700/80">
            A look at the map, and how close everything really is.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="overflow-hidden rounded-2xl border border-neutral-100 lg:col-span-3">
            <iframe
              src="https://www.google.com/maps?q=Omaha,+AR&z=10&output=embed"
              className="h-[420px] w-full border-0 lg:h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map of Ledge Rock and the surrounding Table Rock Lake area"
            />
          </div>

          <div className="rounded-2xl bg-[#FAF7F1] p-7 lg:col-span-2">
            <h3 className="font-headline text-lg font-semibold text-neutral-700">
              Approximate Drive Times
            </h3>
            <ul className="mt-5 space-y-3.5">
              {DRIVE_TIMES.map((place) => (
                <li
                  key={place.label}
                  className="flex items-center justify-between gap-3 border-b border-neutral-200/60 pb-3.5 font-body text-sm last:border-0 last:pb-0"
                >
                  <span className="text-neutral-700">{place.label}</span>
                  <span className="font-medium text-primary">{place.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-body text-xs text-neutral-700/50">
              Approximate, based on standard routes from Omaha, AR. May
              vary with traffic and conditions.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Big Cedar & Branson — now photo tiles, not icon tiles */}
      <section className="bg-[#FAF7F1] px-6 py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
            Things To Do
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-16 bg-tertiary" />
          <p className="mt-5 font-body text-base text-neutral-700/80">
            Golf, live music, and outdoor recreation, all within a short
            drive.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-5 sm:grid-cols-4"
        >
          {BIG_CEDAR_HIGHLIGHTS.map((highlight) => (
            <motion.div
              key={highlight.label}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
              className="group relative h-64 overflow-hidden rounded-2xl"
            >
              <img
                src={highlight.image}
                alt={highlight.label}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-body text-sm font-medium text-white">
                  {highlight.label}
                </p>
                <p className="font-body text-xs text-white/75">{highlight.time}</p>
                {highlight.isPlaceholder && (
                  <p className="mt-1 font-body text-[10px] uppercase tracking-wide text-white/50">
                    Photography coming soon
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* The Marina — careful to frame the dock as planned, not confirmed */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="bg-white px-6 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2.5 font-body text-sm font-medium uppercase tracking-wide text-primary">
            <Anchor className="h-4 w-4" />
            The Marina
          </div>
          <p className="mt-4 font-body text-[15px] leading-relaxed text-neutral-700/85">
            Ledge Rock has access to a full-service marina, with a
            professionally managed dock and parking planned nearby through
            Cricket Creek Marina under the Remote Service Dock provisions of
            the Corps of Engineers Shoreline Management Plan.
          </p>
          <p className="mt-3 font-body text-sm italic text-neutral-700/60">
            The proposed dock location is pending approval by the Corps of
            Engineers.
          </p>
        </div>
      </motion.section>

      {/* Everyday Essentials — practical, low-key list rather than showcase tiles */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="bg-[#FAF7F1] px-6 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex w-fit items-center gap-2.5 font-body text-sm font-medium uppercase tracking-wide text-primary">
            <ShoppingCart className="h-4 w-4" />
            Everyday Essentials
          </div>
          <p className="mt-4 font-body text-[15px] text-neutral-700/85">
            Groceries, hardware, and everyday errands, about 28 minutes
            away near Harrison, AR.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {EVERYDAY_ESSENTIALS.map((place) => (
              <span
                key={place}
                className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-body text-sm text-neutral-700 ring-1 ring-neutral-100"
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {place}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Closing CTA */}
      <section className="bg-neutral px-6 py-16 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-headline text-2xl font-semibold text-white sm:text-3xl">
            See What&apos;s Available at Ledge Rock
          </h2>
          <a
            href="/properties"
            className="mt-6 inline-block rounded-full bg-primary px-7 py-3 font-body text-[15px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral"
          >
            Explore Available Lots
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}