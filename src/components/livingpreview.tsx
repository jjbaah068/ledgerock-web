import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import kayakImage from "../assets/waterliving.webp";
import dockImage from "../assets/nightliving.webp";
import communityImage from "../assets/community.webp";

// PLACEHOLDER images: standing in until more real Ledge Rock photography arrives.
const PANELS = [
  {
    label: "The Water",
    copy: "Quiet mornings, paddle in hand.",
    detail: "Clear Ozark water at the edge of the community, made for slow paddles and early swims.",
    image: kayakImage,
    alt: "Looking out over a calm lake from the front of a kayak",
  },
  {
    label: "The Quiet",
    copy: "Evenings that ask nothing of you.",
    detail: "Wide skies, long sunsets and nothing on the schedule but the view from your own porch.",
    image: dockImage,
    alt: "A couple sitting on a lakeside dock at sunset",
  },
  {
    label: "The Community",
    copy: "Neighbors who feel like family.",
    detail: "A gated enclave of fourteen homesites, close enough to know the people next door.",
    image: communityImage,
    alt: "Friends gathered around a lakeside campfire at night",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

export default function LivingPreview() {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? <StaticLiving /> : <StackedLiving />;
}

/* ------------------------------------------------------------------ */
/* Stacked cards: each panel slides over the last, which recedes       */
/* ------------------------------------------------------------------ */

function StackedLiving() {
  const stackRef = useRef<HTMLDivElement>(null);
  // 0 when the first card pins, 1 when the last card has settled on top.
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  return (
    <section aria-labelledby="living-heading" className="bg-[#FAF7F1] pt-24 sm:pt-32 lg:pt-40">
      <Intro />

      <div ref={stackRef} className="relative mt-14 px-4 sm:mt-20 sm:px-6 lg:px-10">
        {PANELS.map((panel, index) => (
          <StackCard key={panel.label} panel={panel} index={index} progress={scrollYProgress} />
        ))}
      </div>

      <Outro />
    </section>
  );
}

function Intro() {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16 lg:px-10">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-primary"
        >
          Table Rock Living
        </motion.p>
        <motion.h2
          id="living-heading"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: EASE, delay: 0.08 }}
          className="mt-4 font-headline text-4xl font-semibold leading-[1.05] text-neutral-700 sm:text-5xl xl:text-6xl"
        >
          There&apos;s more to home
          <br className="hidden sm:block" /> than <span className="italic text-primary">the house.</span>
        </motion.h2>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        className="lg:pb-2"
      >
        <div className="mb-5 h-0.5 w-16 bg-tertiary" />
        <p className="max-w-md font-body text-base leading-relaxed text-neutral-700/75">
          Life at Ledge Rock is measured in mornings on the water, unhurried evenings and the people you share them
          with. Here&apos;s what waits beyond the front door.
        </p>
      </motion.div>
    </div>
  );
}

function StackCard({
  panel,
  index,
  progress,
}: {
  panel: (typeof PANELS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const total = PANELS.length;

  // Once the stack starts moving past this card, it shrinks and dims as later cards cover it.
  const start = index / total;
  const depth = total - 1 - index; // how many cards will end up on top of this one
  const scale = useTransform(progress, [start, 1], [1, 1 - depth * 0.05]);
  const dim = useTransform(progress, [start, 1], [0, depth * 0.22]);

  // As the card arrives, its photo zooms out from a close crop and the copy rises in.
  const { scrollYProgress: arrival } = useScroll({ target: cardRef, offset: ["start end", "start start"] });
  const imageScale = useTransform(arrival, [0, 1], [1.3, 1]);
  const copyY = useTransform(arrival, [0.45, 1], [60, 0]);
  const copyOpacity = useTransform(arrival, [0.45, 0.9], [0, 1]);

  return (
    <div
      ref={cardRef}
      className="sticky h-[calc(100svh-8rem)] min-h-[460px] pb-6"
      style={{ top: `calc(6.5rem + ${index * 1.75}rem)` }}
    >
      <motion.article
        style={{ scale }}
        className="relative mx-auto h-full max-w-7xl origin-top overflow-hidden rounded-[32px] bg-neutral-700 shadow-[0_-20px_60px_-30px_rgba(40,45,40,0.6)]"
      >
        <motion.img
          src={panel.image}
          alt={panel.alt}
          loading="lazy"
          decoding="async"
          style={{ scale: imageScale }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />
        {/* Darkens as later cards stack on top, so the stack reads as layers */}
        <motion.div aria-hidden="true" style={{ opacity: dim }} className="absolute inset-0 bg-black" />

        {/* Index + label along the top */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 text-white sm:p-8 lg:p-10">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-white/85">
            {panel.label}
          </span>
          <span className="font-body text-xs font-semibold tabular-nums tracking-[0.2em] text-white/70">
            {pad(index + 1)} <span className="text-white/40">/ {pad(total)}</span>
          </span>
        </div>

        <motion.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="absolute inset-x-0 bottom-0 grid gap-5 p-6 text-white sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-12 lg:p-12"
        >
          <h3 className="font-headline text-3xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">{panel.copy}</h3>
          <p className="max-w-sm font-body text-[15px] leading-relaxed text-white/80 lg:justify-self-end">
            {panel.detail}
          </p>
        </motion.div>
      </motion.article>
    </div>
  );
}

function Outro() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 pb-24 pt-10 sm:flex-row sm:items-center sm:pb-32 lg:px-10">
      <p className="max-w-lg font-headline text-2xl font-semibold leading-snug text-neutral-700 sm:text-3xl">
        See the lake, the trails and the towns that make up life here.
      </p>
      <Link
        to="/tablerockliving"
        className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-body text-[15px] font-medium text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Explore Table Rock Living
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reduced motion: same content, no scroll effects                     */
/* ------------------------------------------------------------------ */

function StaticLiving() {
  return (
    <section aria-labelledby="living-heading" className="bg-[#FAF7F1] pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-primary">Table Rock Living</p>
        <h2 id="living-heading" className="mt-4 font-headline text-4xl font-semibold text-neutral-700 sm:text-5xl">
          There&apos;s more to home than <span className="italic text-primary">the house.</span>
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PANELS.map((panel) => (
            <article key={panel.label} className="relative h-[60vh] min-h-[380px] overflow-hidden rounded-[28px]">
              <img src={panel.image} alt={panel.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-white/80">{panel.label}</p>
                <h3 className="mt-2 font-headline text-2xl font-semibold">{panel.copy}</h3>
                <p className="mt-2 font-body text-sm text-white/75">{panel.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Outro />
    </section>
  );
}
