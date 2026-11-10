import { useEffect, useRef, type CSSProperties } from "react";
import { MotionConfig, motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useScrollVideo } from "../hooks/useScrollVideo";

const HEADLINE = "Find a Place You'll Be Proud to Call Home";
const HEADLINE_WORDS = HEADLINE.split(" ");

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;
const OPENING_BEAT = 0.8;
const WORD_STAGGER = 0.09;
const HEADLINE_DURATION = OPENING_BEAT + HEADLINE_WORDS.length * WORD_STAGGER + 0.7;

const SCROLL_LENGTH = "300vh";
const SCRUB_SMOOTHING = 0.12;
const INDICATOR_OUT = 0.05;
const TEXT_OUT = [0.15, 0.35] as const;
const TAGLINE_IN = [0.7, 0.95] as const;
const MILESTONES = [TEXT_OUT[1]] as const;

const VIDEO = {
  scrub: "/videos/ledge-rock-hero-scrub.mp4",
  loop: "/videos/ledge-rock-hero-web.mp4",
  poster: "/videos/ledge-rock-hero-poster.jpg",
};

const PROGRESS_VAR = "--hero-progress";
const P = `var(${PROGRESS_VAR}, 0)`;

/** 1 → 0 as progress moves through [start, end]. */
const fadeOut = ([start, end]: readonly [number, number]) =>
  `clamp(0, (${end} - ${P}) / ${+(end - start).toFixed(4)}, 1)`;
/** 0 → 1 as progress moves through [start, end]. */
const fadeIn = ([start, end]: readonly [number, number]) =>
  `clamp(0, (${P} - ${start}) / ${+(end - start).toFixed(4)}, 1)`;

const textStyle: CSSProperties = {
  opacity: fadeOut(TEXT_OUT),
  transform: `translateY(calc((1 - ${fadeOut(TEXT_OUT)}) * -40px))`,
};
const taglineStyle: CSSProperties = {
  opacity: fadeIn(TAGLINE_IN),
  transform: `translateY(calc((1 - ${fadeIn(TAGLINE_IN)}) * 16px))`,
};
const indicatorStyle: CSSProperties = {
  opacity: fadeOut([0, INDICATOR_OUT]),
};
const progressBarStyle: CSSProperties = {
  transform: `scaleY(${P})`,
};

type HeroMode = "scrub" | "loop" | "static";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mode: HeroMode = prefersReducedMotion ? "static" : isDesktop ? "scrub" : "loop";
  const isScrub = mode === "scrub";

  const { milestone } = useScrollVideo(sectionRef, videoRef, {
    enabled: isScrub,
    smoothing: SCRUB_SMOOTHING,
    milestones: MILESTONES,
    progressVar: PROGRESS_VAR,
  });

  const ctasInert = isScrub && milestone >= 1;

  useEffect(() => {
    const video = videoRef.current;
    if (mode !== "loop" || !video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [mode]);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className={`relative bg-neutral ${isScrub ? "" : "h-svh"}`}
        style={isScrub ? { height: SCROLL_LENGTH } : undefined}
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          {/* ── MEDIA ── */}
          {mode === "static" ? (
            <img
              src={VIDEO.poster}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <video
              key={mode}
              ref={videoRef}
              src={isScrub ? VIDEO.scrub : VIDEO.loop}
              poster={VIDEO.poster}
              muted
              playsInline
              preload="auto"
              autoPlay={!isScrub}
              loop={!isScrub}
              aria-hidden="true"
              tabIndex={-1}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* ── OVERLAYS ── */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"
          />

          {/* ── HERO TEXT (bottom-left, keeps the centre of the video clear) ── */}
          <div
            style={textStyle}
            className="absolute bottom-12 left-6 right-6 z-10 max-w-xl text-left text-white will-change-[opacity,transform] sm:left-10 lg:bottom-16 lg:left-16"
          >
            {/* Headline — word-by-word reveal */}
            <h1
              aria-label={HEADLINE}
              className="font-headline text-3xl font-semibold leading-[1.1] sm:text-4xl xl:text-5xl"
            >
              {HEADLINE_WORDS.map((word, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="mr-[0.28em] inline-block overflow-hidden align-bottom last:mr-0"
                >
                  <motion.span
                    className="inline-block"
                    initial={{ y: "115%", rotateX: 40 }}
                    animate={{ y: "0%", rotateX: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: OPENING_BEAT + i * WORD_STAGGER,
                      ease: CINEMATIC_EASE,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: CINEMATIC_EASE, delay: HEADLINE_DURATION }}
              className="mt-4 font-body text-base leading-relaxed text-white/85"
            >
              Gated lakefront lots on Table Rock Lake, ready to build.
            </motion.p>

            <motion.div
              inert={ctasInert}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: CINEMATIC_EASE, delay: HEADLINE_DURATION + 0.35 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <a
                href="/properties"
                className="group inline-flex items-center gap-2 rounded-full bg-[#4A7C59] px-6 py-3 font-body text-[15px] font-medium text-white shadow-lg shadow-[#4A7C59]/25 transition-all duration-300 hover:bg-[#3d6a4b] hover:shadow-xl hover:shadow-[#4A7C59]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
              >
                Explore Properties
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <a
                href="/contact"
                className="rounded-full border border-white/40 bg-white/[0.08] px-6 py-3 font-body text-[15px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/[0.15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
              >
                Contact Us
              </a>
            </motion.div>
          </div>

          {isScrub && (
            <>
              {/* ── CLOSING LINE (fades in as the house finishes) ── */}
              <p
                style={taglineStyle}
                className="pointer-events-none absolute bottom-16 left-16 z-10 max-w-md font-headline text-3xl font-semibold leading-tight text-white xl:text-4xl"
              >
                14 lots. 20 acres. One lake.
              </p>

              {/* ── BUILD PROGRESS ── */}
              <div
                aria-hidden="true"
                className="absolute left-4 top-1/2 z-10 h-[30vh] w-px -translate-y-1/2 bg-white/20 xl:left-6"
              >
                <div
                  style={progressBarStyle}
                  className="h-full w-full origin-top bg-tertiary"
                />
              </div>
            </>
          )}

          {/* ── SCROLL INDICATOR ── */}
          <div
            aria-hidden="true"
            style={indicatorStyle}
            className="pointer-events-none absolute bottom-8 right-8 z-10 hidden lg:block xl:right-12"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: HEADLINE_DURATION + 1.2, duration: 1 }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-1 text-white/60"
              >
                <span className="font-body text-[11px] uppercase tracking-[0.2em]">
                  Scroll to explore
                </span>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
