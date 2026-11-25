import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight, ArrowUpRight, MapPin, Ruler, Waves, type LucideIcon } from "lucide-react";
import lotimg1 from "../assets/img2.webp";
import lotimg2 from "../assets/img3.webp";
import lotimg3 from "../assets/img4.webp";
import { usePublicListings } from "../hooks/use-public-listings";
import { useLenis } from "../lib/lenis";

type LotStatus = "Available" | "Reserved" | "Sold";

interface Slide {
  id: string;
  name: string;
  status: LotStatus;
  price: string;
  viewType?: "Lakefront" | "Lakeview";
  image: string;
  location: string;
  specs: { label: string; value: string; icon: LucideIcon }[];
}

const LOCATION = "Ledge Rock at Cricket Creek, Omaha, AR";

const FALLBACK_SLIDES: Slide[] = [
  {
    id: "lot-4",
    name: "Lot 4",
    status: "Available",
    price: "Price on Request",
    viewType: "Lakefront",
    image: lotimg1,
    location: LOCATION,
    specs: [
      { label: "Acreage", value: "1.1 acres", icon: Ruler },
      { label: "Shoreline", value: "210 ft shoreline", icon: Waves },
    ],
  },
  {
    id: "lot-7",
    name: "Lot 7",
    status: "Available",
    price: "Price on Request",
    viewType: "Lakeview",
    image: lotimg2,
    location: LOCATION,
    specs: [
      { label: "Acreage", value: "0.9 acres", icon: Ruler },
      { label: "Shoreline", value: "Lake access via Dock Road", icon: Waves },
    ],
  },
  {
    id: "lot-6",
    name: "Lot 6",
    status: "Available",
    price: "Price on Request",
    viewType: "Lakefront",
    image: lotimg3,
    location: LOCATION,
    specs: [
      { label: "Acreage", value: "1.3 acres", icon: Ruler },
      { label: "Shoreline", value: "180 ft shoreline", icon: Waves },
    ],
  },
];

const STATS = [
  { value: "7", label: "Lots ready to build" },
  { value: "14", label: "Lot gated community" },
  { value: "20", label: "Acres of hillside" },
  { value: "1,250", label: "Feet of shoreline" },
];

const STATUS_STYLES: Record<LotStatus, string> = {
  Available: "bg-primary text-white",
  Reserved: "bg-tertiary text-white",
  Sold: "bg-neutral text-white",
};

const STAGE_BG = "bg-[#1C2620]";

interface Layout {
  /** How far the track travels sideways, in px. */
  distance: number;
  /** Visible stage width, in px. */
  viewport: number;
  /** Each lot card's left edge and width inside the track. */
  cards: { left: number; width: number }[];
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function FeaturedLotsPinned() {
  const { published } = usePublicListings();
  const slides: Slide[] = [
    ...published.filter((listing) => listing.status === "Available"),
    ...FALLBACK_SLIDES,
  ].slice(0, 4);

  const reduceMotion = useReducedMotion();
  return reduceMotion ? <StaticLots slides={slides} /> : <ScrollGallery slides={slides} />;
}

/* ------------------------------------------------------------------ */
/* Scroll-driven horizontal gallery                                    */
/* ------------------------------------------------------------------ */

function ScrollGallery({ slides }: { slides: Slide[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [layout, setLayout] = useState<Layout>({ distance: 0, viewport: 1, cards: [] });
  const lenis = useLenis();
  const slideKey = slides.map((slide) => slide.id).join();

  // Measure the track so vertical scroll distance matches horizontal travel 1:1.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    const measure = () => {
      setLayout({
        distance: Math.max(0, track.scrollWidth - stage.clientWidth),
        viewport: stage.clientWidth || 1,
        cards: cardRefs.current
          .filter((el): el is HTMLElement => el !== null)
          .map((el) => ({ left: el.offsetLeft, width: el.offsetWidth })),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(track);
    return () => observer.disconnect();
  }, [slideKey]);

  // Entry: the stage zooms up from a rounded card to full bleed as it arrives.
  const { scrollYProgress: entry } = useScroll({ target: sectionRef, offset: ["start end", "start start"] });
  const stageScale = useTransform(entry, [0, 1], [0.86, 1]);
  const stageRadius = useTransform(entry, [0, 1], [40, 0]);

  // Pinned: vertical scroll drives the track sideways.
  const { scrollYProgress: progress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(progress, [0, 1], [0, -layout.distance]);
  const watermarkX = useTransform(progress, [0, 1], ["0%", "-35%"]);
  const barScale = useTransform(progress, [0, 1], [0, 1]);

  const [current, setCurrent] = useState(1);
  useMotionChange(x, (value) => {
    const centre = -value + layout.viewport / 2;
    let nearest = 0;
    let best = Infinity;
    layout.cards.forEach((card, i) => {
      const d = Math.abs(card.left + card.width / 2 - centre);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setCurrent(nearest + 1);
  });

  // Keyboard users: tabbing into an off-screen card scrolls the page so that card slides into view.
  function revealCard(index: number) {
    const section = sectionRef.current;
    const card = layout.cards[index];
    if (!section || !card || layout.distance === 0) return;
    const wanted = Math.min(layout.distance, Math.max(0, card.left + card.width / 2 - layout.viewport / 2));
    const top = section.getBoundingClientRect().top + window.scrollY + wanted;
    if (lenis) lenis.scrollTo(top, { duration: 0.9 });
    else window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="available-heading"
      className="relative bg-[#FAF7F1]"
      style={{ height: `calc(100svh + ${layout.distance}px)` }}
    >
      <motion.div
        ref={stageRef}
        style={{ scale: stageScale, borderRadius: stageRadius }}
        className={`sticky top-0 h-svh origin-top overflow-hidden ${STAGE_BG} text-white`}
      >
        {/* Ambient light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-1/4 top-1/4 h-[70vh] w-[70vw] rounded-full bg-primary/25 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-1/4 -top-1/4 h-[60vh] w-[50vw] rounded-full bg-tertiary/10 blur-[120px]"
        />

        {/* Oversized outline type drifting slower than the cards, for depth */}
        <motion.p
          aria-hidden="true"
          style={{ x: watermarkX, WebkitTextStroke: "1px rgba(255,255,255,0.09)" }}
          className="pointer-events-none absolute bottom-[6vh] left-0 whitespace-nowrap font-headline text-[22vh] font-semibold leading-none text-transparent"
        >
          Table Rock Lake · Ledge Rock · Cricket Creek
        </motion.p>

        {/* The track */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative flex h-full w-max items-center gap-6 pl-6 pr-[12vw] sm:gap-8 lg:gap-10 lg:pl-16"
        >
          <IntroPanel total={slides.length} />

          {slides.map((lot, index) => (
            <LotCard
              key={lot.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              lot={lot}
              index={index}
              x={x}
              metrics={layout.cards[index]}
              viewport={layout.viewport}
              onFocus={() => revealCard(index)}
            />
          ))}

          <EndCard />
        </motion.div>

        {/* Progress */}
        <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-center gap-4 lg:inset-x-16 lg:bottom-8">
          <span className="font-body text-xs font-semibold tabular-nums tracking-[0.2em] text-white/80">
            {pad(current)} <span className="text-white/35">/ {pad(slides.length)}</span>
          </span>
          <div className="h-px flex-1 bg-white/15">
            <motion.div style={{ scaleX: barScale }} className="h-px origin-left bg-tertiary" />
          </div>
          <span className="hidden font-body text-[11px] uppercase tracking-[0.2em] text-white/45 sm:block">
            Scroll to explore
          </span>
        </div>
      </motion.div>
    </section>
  );
}

/** Calls `onChange` whenever a motion value changes (without re-rendering on every frame). */
function useMotionChange(value: MotionValue<number>, onChange: (v: number) => void) {
  const handler = useRef(onChange);
  useLayoutEffect(() => {
    handler.current = onChange;
  });
  useLayoutEffect(() => value.on("change", (v) => handler.current(v)), [value]);
}

function IntroPanel({ total }: { total: number }) {
  return (
    <div className="flex w-[86vw] shrink-0 flex-col justify-center sm:w-[62vw] lg:w-[38vw] lg:pr-6">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-tertiary"
      >
        Now selling · {total} featured
      </motion.p>
      <motion.h2
        id="available-heading"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className="mt-4 font-headline text-4xl font-semibold leading-[1.05] sm:text-5xl xl:text-6xl"
      >
        Available at
        <br />
        <span className="italic text-tertiary">Ledge Rock</span>
      </motion.h2>
      <p className="mt-5 max-w-md font-body text-base leading-relaxed text-white/70">
        Seven lots are ready to build now, part of a fourteen-lot gated community set on twenty acres and
        1,250 feet of Table Rock Lake shoreline.
      </p>

      <dl className="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6">
        {STATS.map(({ value, label }) => (
          <div key={label} className="flex flex-col-reverse">
            <dt className="mt-1 font-body text-xs uppercase tracking-wider text-white/50">{label}</dt>
            <dd className="font-headline text-3xl font-semibold text-white sm:text-4xl">{value}</dd>
          </div>
        ))}
      </dl>

      <p aria-hidden="true" className="mt-8 flex items-center gap-2 font-body text-sm text-white/55">
        Keep scrolling
        <ArrowRight className="h-4 w-4 animate-pulse" />
      </p>
    </div>
  );
}

interface LotCardProps {
  ref: (el: HTMLElement | null) => void;
  lot: Slide;
  index: number;
  x: MotionValue<number>;
  metrics?: { left: number; width: number };
  viewport: number;
  onFocus: () => void;
}

function LotCard({ ref, lot, index, x, metrics, viewport, onFocus }: LotCardProps) {
  // -1 (left of centre) … 0 (centred) … 1 (right of centre), based on where the card sits on screen.
  const offset = useTransform(x, (value) => {
    if (!metrics) return 1;
    const centre = metrics.left + metrics.width / 2 + value;
    return Math.max(-1.4, Math.min(1.4, (centre - viewport / 2) / viewport));
  });
  const scale = useTransform(offset, (d) => 1 - Math.min(Math.abs(d), 1) * 0.14);
  const rotateY = useTransform(offset, (d) => Math.max(-1, Math.min(1, d)) * -16);
  const imageX = useTransform(offset, (d) => `${d * -12}%`);
  const contentOpacity = useTransform(offset, (d) => 1 - Math.min(Math.abs(d) * 0.9, 0.65));

  return (
    <motion.article
      ref={ref}
      onFocus={onFocus}
      style={{ scale, rotateY, transformPerspective: 1400 }}
      className="group relative h-[68svh] max-h-[680px] w-[78vw] shrink-0 overflow-hidden rounded-[28px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10 sm:w-[54vw] lg:w-[32vw]"
    >
      {/* Photo drifts against the card for a window-like parallax */}
      <motion.div style={{ x: imageX }} className="absolute -inset-x-[14%] inset-y-0">
        <img
          src={lot.image}
          alt={`${lot.name} at Ledge Rock at Cricket Creek`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

      {/* Index number */}
      <span
        aria-hidden="true"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.55)" }}
        className="absolute left-6 top-4 font-headline text-7xl font-semibold leading-none text-transparent sm:text-8xl"
      >
        {pad(index + 1)}
      </span>
      <span
        className={`absolute right-5 top-5 rounded-full px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-wider ${STATUS_STYLES[lot.status]}`}
      >
        {lot.status}
      </span>

      <motion.div style={{ opacity: contentOpacity }} className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">
          {lot.viewType ?? "Ledge Rock"}
        </p>
        <h3 className="mt-2 font-headline text-3xl font-semibold sm:text-4xl">{lot.name}</h3>
        <p className="mt-1 font-body text-lg font-semibold text-white/90">{lot.price}</p>

        <p className="mt-3 flex items-center gap-1.5 font-body text-sm text-white/70">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{lot.location}</span>
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {lot.specs.slice(0, 2).map(({ label, value, icon: Icon }) => (
            <li
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-body text-xs text-white/90 backdrop-blur-sm"
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {value}
            </li>
          ))}
        </ul>

        <a
          href={`/properties/${lot.id}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-body text-sm font-semibold text-neutral-700 transition-colors hover:bg-tertiary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          View {lot.name}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.article>
  );
}

function EndCard() {
  return (
    <a
      href="/properties"
      className="group flex h-[68svh] max-h-[680px] w-[70vw] shrink-0 flex-col items-start justify-end rounded-[28px] border border-white/15 p-8 transition-colors hover:border-tertiary/60 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary sm:w-[40vw] lg:w-[24vw]"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-tertiary text-white transition-transform duration-500 group-hover:rotate-[-45deg] group-hover:scale-110">
        <ArrowRight className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="mt-6 block w-full font-headline text-3xl font-semibold leading-tight">
        See every lot
        <br />
        <span className="text-white/50">at Ledge Rock</span>
      </span>
      <span className="mt-3 block w-full font-body text-sm text-white/55">Prices, acreage and shoreline for all seven.</span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Reduced motion: a calm, swipeable row with no scroll effects        */
/* ------------------------------------------------------------------ */

function StaticLots({ slides }: { slides: Slide[] }) {
  return (
    <section aria-labelledby="available-heading" className={`${STAGE_BG} px-6 py-20 text-white lg:px-16`}>
      <p className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-tertiary">Now selling</p>
      <h2 id="available-heading" className="mt-3 font-headline text-4xl font-semibold sm:text-5xl">
        Available at <span className="italic text-tertiary">Ledge Rock</span>
      </h2>
      <p className="mt-4 max-w-2xl font-body text-base text-white/70">
        Seven lots are ready to build now, part of a fourteen-lot gated community set on twenty acres and 1,250
        feet of Table Rock Lake shoreline.
      </p>
      <ul className="-mx-6 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 lg:-mx-16 lg:px-16">
        {slides.map((lot) => (
          <li key={lot.id} className="relative h-[60vh] w-[80vw] shrink-0 snap-start overflow-hidden rounded-[28px] sm:w-[45vw] lg:w-[30vw]">
            <img src={lot.image} alt={`${lot.name} at Ledge Rock at Cricket Creek`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="font-headline text-3xl font-semibold">{lot.name}</h3>
              <p className="mt-1 font-body text-white/85">{lot.price}</p>
              <a href={`/properties/${lot.id}`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-body text-sm font-semibold text-neutral-700">
                View {lot.name}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </li>
        ))}
      </ul>
      <a href="/properties" className="mt-8 inline-block font-body text-[15px] font-medium text-tertiary underline underline-offset-4">
        See every lot at Ledge Rock
      </a>
    </section>
  );
}
