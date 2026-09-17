import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";

// PLACEHOLDER images — standing in until more real Ledge Rock photography arrives.
const kayakImage =
  "https://images.unsplash.com/photo-1740307068303-bd3255a08da9?w=1600&q=80&auto=format&fit=crop";
const dockImage =
  "https://images.unsplash.com/photo-1731667251901-60977d1be3fe?w=1600&q=80&auto=format&fit=crop";
const communityImage =
  "https://images.unsplash.com/photo-1656076495328-a11c1bd59afa?w=1600&q=80&auto=format&fit=crop";

const PANELS = [
  {
    label: "The Water",
    copy: "Quiet mornings, paddle in hand.",
    image: kayakImage,
  },
  {
    label: "The Quiet",
    copy: "Evenings that ask nothing of you.",
    image: dockImage,
  },
  {
    label: "The Community",
    copy: "Neighbors who feel like family.",
    image: communityImage,
  },
];

export default function LivingPreview() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // 1. Add Spring Physics: This removes the harsh 1:1 scroll mapping and gives 
  // the panning track a buttery, cinematic momentum that settles naturally.
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 24,
    stiffness: 100,
    mass: 0.5,
  });

  // Track panning calculation
  const trackShift = `-${((PANELS.length - 1) / PANELS.length) * 100}%`;
  const x = useTransform(smoothProgress, [0, 1], ["0%", trackShift]);

  // 2. Parallax & Scale: As the track pans left, we subtly shift the images right 
  // and scale them up. This creates a deep "window" effect rather than a flat slider.
  const imgX = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  const imgScale = useTransform(smoothProgress, [0, 1], [1, 1.15]);

  const hintOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);
  
  // Staggered CTA entrance
  const ctaOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);
  const ctaY = useTransform(smoothProgress, [0.85, 0.95], [20, 0]);

  if (prefersReducedMotion) {
    return (
      <section className="bg-neutral px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-semibold text-white sm:text-4xl">
            There&apos;s More to Home Than the House
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {PANELS.map((panel) => (
            <div key={panel.label} className="overflow-hidden rounded-2xl">
              <img src={panel.image} alt={panel.label} className="h-64 w-full object-cover" />
              <div className="bg-white/5 p-5">
                <p className="font-body text-sm font-medium text-white">{panel.label}</p>
                <p className="mt-1 font-body text-sm text-white/70">{panel.copy}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/table-rock-living"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-[15px] font-medium text-white hover:bg-primary-dark"
          >
            Explore Table Rock Living
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div ref={wrapperRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        
        {/* Fixed heading with a subtle text shadow for legibility over images */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 pt-14 text-center">
          <h2 className="font-headline text-3xl font-semibold text-white drop-shadow-md sm:text-4xl">
            There&apos;s More to Home Than the House
          </h2>
        </div>

        {/* Smoothed Progress dots */}
        <div className="pointer-events-none absolute inset-x-0 top-28 z-30 flex items-center justify-center gap-2.5 sm:top-32">
          {PANELS.map((panel, i) => {
            const start = Math.max(0, i / PANELS.length - 0.05);
            const end = Math.min(1, i / PANELS.length + 0.05);
            const dotOpacity = useTransform(smoothProgress, [start, end], [0.2, 1]);
            const dotScale = useTransform(smoothProgress, [start, end], [0.8, 1.2]);
            return (
              <motion.span
                key={panel.label}
                style={{ opacity: dotOpacity, scale: dotScale }}
                className="h-1.5 w-1.5 rounded-full bg-white shadow-sm"
              />
            );
          })}
        </div>

        {/* Horizontal-panning track */}
        <motion.div
          style={{ x, width: `${PANELS.length * 100}vw` }}
          className="flex h-full will-change-transform"
        >
          {PANELS.map((panel) => (
            <div key={panel.label} className="relative h-full w-screen shrink-0 overflow-hidden">
              
              {/* Parallax & Scaling Image */}
              <motion.img
                style={{ x: imgX, scale: imgScale }}
                src={panel.image}
                alt={panel.label}
                className="absolute inset-0 h-full w-full object-cover origin-center will-change-transform"
              />
              
              {/* 3. Cinematic Gradients: Instead of a flat black overlay, 
                  combining a radial vignette with a strong bottom gradient 
                  makes the center pop while keeping text readable. */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 px-6 pb-24 text-center sm:pb-32 z-20">
                <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                  {panel.label}
                </p>
                <p className="mt-4 font-body text-2xl font-light text-white sm:text-3xl tracking-wide">
                  {panel.copy}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-30 flex items-center justify-center gap-2 text-white/70"
        >
          <span className="font-body text-xs uppercase tracking-[0.15em]">
            Scroll to explore
          </span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </motion.div>

        {/* CTA */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute inset-x-0 bottom-10 z-30 flex justify-center sm:bottom-12 pointer-events-auto"
        >
          <Link
            to="/tablerockliving"
           className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[15px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            <span>Explore Table Rock Living</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}