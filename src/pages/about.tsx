import { motion } from "motion/react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import masterPlan from "../assets/img6.png";
import aboutCover from "../assets/img8.png";
import entrance from "../assets/img7.png";


const danielPortrait =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&q=80&auto=format&fit=crop";

const beckyPortrait =
  "https://images.unsplash.com/photo-1627161683077-e34782c24d81?w=800&h=1000&q=80&auto=format&fit=crop";

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
  { label: "SHORELINE", image: shorelineImage },
  { label: "THE ENTRANCE", image: entrance },
  { label: "DOCK ACCESS", image: dockImage },
];

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

export default function About() {
  return (
    <>
      <Navbar transparent />

      {/* Full-bleed cover hero — matches Home's transparent-nav treatment */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <img
          src={aboutCover}
          alt="Table Rock Lake at Ledge Rock at Cricket Creek"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: CINEMATIC_EASE, delay: 0.3 }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white"
        >
          <h1 className="font-headline text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            An Architect&apos;s Return to Table Rock Lake
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-body text-lg text-white/90">
            Lakeshore Properties Group, LLC was formed in 2014 to bring one
            architect&apos;s vision for lakeside living back to the water he
            grew up on.
          </p>
        </motion.div>
      </section>

      {/* Stats strip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="border-b border-neutral-100 bg-white px-6 py-10 lg:px-8"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-headline text-3xl font-semibold text-primary">
                {stat.value}
              </p>
              <p className="mt-1 font-body text-sm text-neutral-700/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Meet Daniel Butler */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="bg-[#FAF7F1] px-6 py-20 lg:px-8"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-5 md:items-center">
          <div className="md:col-span-2">
            <img
              src={danielPortrait}
              alt="Daniel Butler"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div className="md:col-span-3">
            <h2 className="font-headline text-3xl font-semibold text-neutral-700">
              Meet Daniel Butler
            </h2>
            <div className="mt-2 h-0.5 w-16 bg-tertiary" />

            <p className="mt-6 font-body text-[15px] leading-relaxed text-neutral-700/85">
              Lakeshore Properties Group is owned and managed by Daniel
              Butler, a Springfield, Missouri native and graduate of the
              University of Kansas School of Architecture.
            </p>
            <p className="mt-4 font-body text-[15px] leading-relaxed text-neutral-700/85">
              After building a successful architecture firm in the Pacific
              Northwest, Daniel returned to the Ozarks and the lake he grew
              up on, to be closer to family and pursue land development on
              Table Rock Lake.
            </p>

            <a
              href="/contact"
              className="mt-6 inline-block font-body text-[15px] font-medium text-primary underline decoration-tertiary decoration-2 underline-offset-4 transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            >
              See how Daniel can help design your home
            </a>
          </div>
        </div>
      </motion.section>

      {/* Meet Becky  */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="bg-white px-6 py-20 lg:px-8"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-5 md:items-center">
          <div className="order-2 md:order-1 md:col-span-3">
            <h2 className="font-headline text-3xl font-semibold text-neutral-700">
              Meet Becky
            </h2>
            <div className="mt-2 h-0.5 w-16 bg-tertiary" />

            <p className="mt-6 font-body text-[15px] leading-relaxed text-neutral-700/85">
              Becky is the on-the-ground agent for Ledge Rock at Cricket
              Creek &mdash; touring lots with buyers and representing them
              through the transaction, start to close.
            </p>
            <p className="mt-4 font-body text-[15px] italic leading-relaxed text-neutral-700/60">
              Full bio, credentials, and brokerage affiliation coming soon.
            </p>

            <a
              href="/contact"
              className="mt-6 inline-block font-body text-[15px] font-medium text-primary underline decoration-tertiary decoration-2 underline-offset-4 transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            >
              Get in touch with Becky
            </a>
          </div>

          <div className="order-1 md:order-2 md:col-span-2">
            <img
              src={beckyPortrait}
              alt="Becky"
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </motion.section>

      {/* The Land — unchanged, per Dan's confirmed facts */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="bg-white px-6 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="font-headline text-3xl font-semibold text-neutral-700">
            The Land
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-tertiary" />

          <p className="mt-6 font-body text-[15px] leading-relaxed text-neutral-700/85">
            In 2014, Lakeshore Properties Group acquired 20 acres of land
            with 1,250 feet of shoreline fronting Table Rock Lake in Omaha,
            Arkansas, near Cricket Creek Marina, and has since developed the
            property into 14 lakefront and lakeview residential lots.
          </p>
          <p className="mt-4 font-body text-[15px] leading-relaxed text-neutral-700/85">
            Ledge Rock at Cricket Creek is a gated community with all
            underground utilities and roadway already in place.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-100 bg-white">
            <img
              src={masterPlan}
              alt="Ledge Rock at Cricket Creek master site plan showing lot layout, sold lots, and the proposed marina expansion"
              className="w-full object-contain"
            />
          </div>
          <p className="mt-3 font-body text-sm text-neutral-700/60">
            Master site plan &mdash; 13500&ndash;13800 Ledge Rock Lane, Omaha,
            Arkansas 72662.
          </p>

          <a
            href="/properties"
            className="mt-6 inline-block font-body text-[15px] font-medium text-primary underline decoration-tertiary decoration-2 underline-offset-4 transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            Explore Ledge Rock at Cricket Creek
          </a>
        </div>
      </motion.section>

      {/* The Setting —*/}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="bg-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="flex w-full flex-col justify-center px-6 py-16 lg:w-1/3 lg:px-16 lg:py-0">
            <h2 className="font-headline text-2xl font-semibold uppercase tracking-wide text-neutral-700">
              The Setting
            </h2>
            <p className="mt-5 font-body text-[15px] leading-relaxed text-neutral-700/85">
              Ledge Rock sits along a quiet stretch of the Long Creek arm of
              Table Rock Lake &mdash; a gated, tree-lined community where a
              paved private road leads every lot to the water. Residents
              reach the lake via the Dock Road, with parking and a lake
              trail already in place, and a professionally managed dock
              planned nearby through Cricket Creek Marina.
            </p>
          </div>

          <div className="grid w-full grid-cols-3 lg:w-2/3">
            {SETTING_GRID.map((item) => (
              <div
                key={item.label}
                className="group relative h-[70vh] min-h-[500px] overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute bottom-6 left-6 font-body text-base font-medium uppercase tracking-wide text-white">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* What's Next */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="bg-white px-6 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="font-headline text-3xl font-semibold text-neutral-700">
            What&apos;s Next
          </h2>
          <div className="mt-2 h-0.5 w-16 bg-tertiary" />

          <p className="mt-6 font-body text-[15px] leading-relaxed text-neutral-700/85">
            Lakeshore Properties Group has acquired adjacent parcels for
            future development, and will be releasing mountaintop lakeview
            properties in the future.
          </p>
        </div>
      </motion.section>

      {/* Closing CTA */}
      <section className="bg-neutral px-6 py-16 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-headline text-2xl font-semibold text-white sm:text-3xl">
            Have a Question About the Land or the Process?
          </h2>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-full bg-primary px-7 py-3 font-body text-[15px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral"
          >
            Get in Touch
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}