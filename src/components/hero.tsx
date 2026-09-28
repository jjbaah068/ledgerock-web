import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import heroVideo from "../assets/video.mp4";

const HEADLINE = "Find a Place You'll Be Proud to Call Home";
const HEADLINE_WORDS = HEADLINE.split(" ");

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;
const OPENING_BEAT = 0.8;
const WORD_STAGGER = 0.09;
const HEADLINE_DURATION = OPENING_BEAT + HEADLINE_WORDS.length * WORD_STAGGER + 0.7;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setVideoReady(true);
    video.addEventListener("canplay", handleCanPlay);

    video.muted = true;
    video.play().catch(() => {});

    return () => video.removeEventListener("canplay", handleCanPlay);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -100]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen items-center justify-center overflow-hidden bg-[#4A4E4A]"
    >
      {/* ── VIDEO BACKGROUND ── */}
      <motion.div style={{ scale: scrollScale }} className="absolute inset-0">
        {/* Cinematic fade-in from black when video is ready */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="h-full w-full"
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </motion.div>
      </motion.div>

      {/* ── CINEMATIC OVERLAYS ── */}
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 z-[1]">
        {/* Primary vertical gradient — deep at bottom for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#4A4E4A]/90 via-black/40 to-transparent" />

        {/* Subtle top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

        {/* Side vignettes for cinematic widescreen feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />

        {/* Warm colour wash — barely visible, adds cinematic warmth */}
        <div className="absolute inset-0 bg-[#C4A66A]/[0.06] mix-blend-overlay" />
      </motion.div>

      {/* ── SUBTLE FILM GRAIN TEXTURE (CSS-only) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      {/* ── CINEMATIC LETTERBOX BARS ── */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.6, delay: 0.2, ease: CINEMATIC_EASE }}
        style={{ transformOrigin: "top" }}
        className="absolute inset-x-0 top-0 z-[3] h-[12vh] bg-[#4A4E4A]"
      />
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.6, delay: 0.2, ease: CINEMATIC_EASE }}
        style={{ transformOrigin: "bottom" }}
        className="absolute inset-x-0 bottom-0 z-[3] h-[12vh] bg-[#4A4E4A]"
      />

      {/* ── CONTENT ── */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white"
      >
        {/* Small label above headline */}
        <motion.p
          initial={{ opacity: 0, y: 12, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.18em" }}
          transition={{ duration: 1, delay: OPENING_BEAT - 0.3, ease: CINEMATIC_EASE }}
          className="mb-5 font-body text-xs font-medium uppercase tracking-[0.18em] text-white"
        >
          Ledge Rock at Cricket Creek
        </motion.p>

        {/* Headline — word-by-word reveal */}
        <h1 className="font-headline text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl xl:text-7xl">
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={i}
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

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: CINEMATIC_EASE, delay: HEADLINE_DURATION }}
          className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-white/85 sm:text-lg"
        >
          Gated lakefront living on Table Rock Lake, thoughtfully developed
          lots ready to build, in a community built to last.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: CINEMATIC_EASE, delay: HEADLINE_DURATION + 0.35 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="/properties"
            className="group inline-flex items-center gap-2 rounded-full bg-[#4A7C59] px-8 py-3.5 font-body text-[15px] font-medium text-white shadow-lg shadow-[#4A7C59]/25 transition-all duration-300 hover:bg-[#3d6a4b] hover:shadow-xl hover:shadow-[#4A7C59]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            Explore Properties
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
          <a
            href="/contact"
            className="rounded-full border border-white/40 bg-white/[0.08] px-8 py-3.5 font-body text-[15px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/[0.15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            Contact Us
          </a>
        </motion.div>
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: HEADLINE_DURATION + 1.2, duration: 1 }}
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
      >
        <motion.a
          href="#next-section"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-white/50 transition-colors hover:text-white/80"
          aria-label="Scroll down"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.2em]">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4" />
        </motion.a>
      </motion.div>
    </section>
  );
}