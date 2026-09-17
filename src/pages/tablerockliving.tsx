import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import {
  Fish,
  ShoppingCart,
  Anchor,
  MapPin,
  ArrowDown,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import aboutCover from "../assets/img1.png";
import entrance from "../assets/img7.png";

// PLACEHOLDER IMAGES
const shorelineImage =
  "https://images.unsplash.com/photo-1721069662098-f2031c2319b8?w=1600&q=80&auto=format&fit=crop";
const dockImage =
  "https://images.unsplash.com/photo-1731667251901-60977d1be3fe?w=1600&q=80&auto=format&fit=crop";
const golfImage =
  "https://images.unsplash.com/photo-1785843530152-b4b69040aa10?w=1600&q=80&auto=format&fit=crop";
const concertImage =
  "https://images.unsplash.com/photo-1768053921689-1bc09db904c9?w=1600&q=80&auto=format&fit=crop";
const canyonImage =
  "https://images.unsplash.com/photo-1658779987032-1f04a2960b2e?w=1600&q=80&auto=format&fit=crop";
const communityImage = 
  "https://images.unsplash.com/photo-1656076495328-a11c1bd59afa?w=1600&q=80&auto=format&fit=crop";


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

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

// ─── CINEMATIC SCROLL SECTION ────────────────────────────────────────────────
function ImmersiveSection({ 
  title, 
  subtitle, 
  description, 
  image, 
  align = "left" 
}: { 
  title: string; 
  subtitle: string; 
  description: string; 
  image: string; 
  align?: "left" | "right" 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  
  const textY = useTransform(scrollYProgress, [0.3, 0.6], [50, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  return (
    <section ref={ref} className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      <motion.div 
        className="absolute inset-0 origin-center"
        style={{ y: imgY, scale: imgScale }}
      >
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      <div className={`absolute inset-0 flex flex-col justify-end px-8 pb-24 sm:px-16 lg:pb-32 ${align === "right" ? "items-end text-right" : "items-start text-left"}`}>
        <motion.div 
          style={{ y: textY, opacity: textOpacity }} 
          className="max-w-2xl"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/70">
            {subtitle}
          </p>
          <h2 className="font-headline text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-6 font-body text-lg text-white/80 sm:text-xl">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}


export default function TableRockLiving() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <div className="bg-neutral">
      <Navbar transparent />

      {/* ── HERO SECTION ── */}
      <section ref={heroRef} className="relative flex h-screen items-center justify-center overflow-hidden bg-black">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
           <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 opacity-[0.035]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
              mixBlendMode: "overlay",
            }}
          />
          <img 
            src={dockImage} 
            alt="Table Rock Lake" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: CINEMATIC_EASE, delay: 0.2 }}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        >
          <h1 className="font-headline text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
            Table Rock Living
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-xl text-white/80">
            Quiet coves, easy highway access, and twenty minutes from everything Branson has to offer.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 z-20 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-5 w-5 text-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── IMMERSIVE STORY SECTIONS ── */}
      <ImmersiveSection
        subtitle="Life on the Water"
        title="The Long Creek Arm"
        description="A fisherman's dream — quiet coves, winding creek arms, and access to a full-service marina. It's the peaceful side of the lake, without the constant roar of boat traffic."
        image={shorelineImage}
        align="left"
      />
      
      <ImmersiveSection
        subtitle="The Surroundings"
        title="More Than Just a Lake"
        description="World-class golf at Big Cedar Nature Golf, live music at Thunder Ridge Amphitheatre, and exploring Dogwood Canyon. All within a short scenic drive from your front door."
        image={golfImage}
        align="right"
      />
      
      <ImmersiveSection
        subtitle="The Community"
        title="A Home, Not Just Land"
        description="The value isn't the gate at the entrance. It's the peace, permanence, and stewardship of the people living behind it. Land ownership is just the start of building a home here."
        image={communityImage}
        align="left"
      />

      {/* ── THE MARINA (Practical Info) ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="bg-[#FAF7F1] px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex w-fit items-center gap-2.5 font-body text-sm font-medium uppercase tracking-wide text-primary">
            <Anchor className="h-4 w-4" />
            The Marina
          </div>
          <h2 className="mt-4 font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
            Access to the Water
          </h2>
          <p className="mt-6 font-body text-lg leading-relaxed text-neutral-700/85">
            Ledge Rock has access to a full-service marina, with a
            professionally managed dock and parking planned nearby through
            Cricket Creek Marina under the Remote Service Dock provisions of
            the Corps of Engineers Shoreline Management Plan.
          </p>
          <p className="mt-4 font-body text-sm italic text-neutral-700/60">
            *The proposed dock location is pending approval by the Corps of
            Engineers.
          </p>
        </div>
      </motion.section>

      {/* ── LOCATION & ESSENTIALS ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="bg-white px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
            Close to Everything
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-tertiary" />
          <p className="mt-6 font-body text-lg text-neutral-700/80">
            A look at the map, and how close everything really is.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="overflow-hidden rounded-2xl border border-neutral-100 lg:col-span-3">
            <iframe
              src="https://www.google.com/maps?q=Omaha,+AR&z=10&output=embed"
              className="h-[420px] w-full border-0 grayscale filter transition-all duration-500 hover:grayscale-0 lg:h-[100%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map of Ledge Rock"
            />
          </div>

          <div className="flex flex-col gap-8 lg:col-span-2">
            <div className="rounded-2xl bg-[#FAF7F1] p-8">
              <h3 className="font-headline text-xl font-semibold text-neutral-700">
                Drive Times
              </h3>
              <ul className="mt-6 space-y-4">
                {DRIVE_TIMES.map((place) => (
                  <li
                    key={place.label}
                    className="flex items-center justify-between gap-3 border-b border-neutral-200/60 pb-4 font-body text-[15px] last:border-0 last:pb-0"
                  >
                    <span className="text-neutral-700">{place.label}</span>
                    <span className="font-medium text-primary">{place.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-neutral-100 p-8">
              <h3 className="flex items-center gap-2.5 font-headline text-lg font-semibold text-neutral-700">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Everyday Essentials
              </h3>
              <p className="mt-3 font-body text-sm text-neutral-700/70">
                Groceries, hardware, and everyday errands, about 28 minutes away.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {EVERYDAY_ESSENTIALS.map((place) => (
                  <span
                    key={place}
                    className="rounded-full bg-[#FAF7F1] px-4 py-2 font-body text-sm text-neutral-700"
                  >
                    {place}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── CLOSING CTA ── */}
      <section className="bg-neutral px-6 py-24 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-headline text-3xl font-semibold text-white sm:text-4xl">
            See What&apos;s Available
          </h2>
          <Link
            to="/properties"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-body text-[15px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral"
          >
            Explore Available Lots
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}