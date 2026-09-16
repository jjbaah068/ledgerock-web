import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import heroPoster from "../assets/img1.png";
import heroVideo from "../assets/video.mp4";

const HEADLINE = "Find a Place You'll Be Proud to Call Home";
const HEADLINE_WORDS = HEADLINE.split(" ");

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;
const OPENING_BEAT = 0.6;
const HEADLINE_DURATION = OPENING_BEAT + HEADLINE_WORDS.length * 0.09 + 0.7;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[85vh] items-center overflow-hidden"
    >
      {/* Background video —  */}
      <motion.div style={{ scale: scrollScale }} className="absolute inset-0">
         <motion.video
          ref={videoRef}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: CINEMATIC_EASE }}
          className="h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroPoster}
        >
          <source src={heroVideo} type="video/mp4" />
        </motion.video>
      </motion.div>

      {/* Static fallback  */}
      <img
        src={heroPoster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
      />

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Content —  */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white"
      >
        {/* Headline — */}
        <h1 className="font-headline text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={i}
              className="mr-[0.28em] inline-block overflow-hidden align-bottom last:mr-0"
            >
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.85,
                  delay: OPENING_BEAT + i * 0.09,
                  ease: CINEMATIC_EASE,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: CINEMATIC_EASE, delay: HEADLINE_DURATION }}
          className="mx-auto mt-5 max-w-xl font-body text-lg text-white/90"
        >
          Gated lakefront living on Table Rock Lake, thoughtfully developed
          lots ready to build, in a community built to last.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: CINEMATIC_EASE, delay: HEADLINE_DURATION + 0.3 }}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="/properties"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[15px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            Explore Properties
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/contact"
            className="rounded-full border border-white/70 bg-white/10 px-7 py-3 font-body text-[15px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
          >
            Contact Us
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}