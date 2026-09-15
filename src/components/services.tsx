import { motion, type Variants } from "motion/react";
import { FileText, PencilRuler, Building2 } from "lucide-react";

interface ServiceTier {
  id: string;
  icon: typeof FileText;
  title: string;
  description: string;
  bestFor: string;
}

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: "land-only",
    icon: FileText,
    title: "Land, With Guidance",
    description:
      "Lakeshore Properties Group acts as developer for owners who already have a contractor and design in hand, helping interpret the Plat Plan, CC&Rs, and local codes as you build.",
    bestFor: "Best for buyers with a builder and home design already lined up.",
  },
  {
    id: "design",
    icon: PencilRuler,
    title: "Custom Design by Daniel Butler",
    description:
      "Daniel Butler, architect and owner of Lakeshore Properties Group, designs a custom home built to the CC&Rs, then stays involved to help your contractor adapt it to the site through construction.",
    bestFor: "Best for buyers who need a design but want to choose their own contractor.",
  },
  {
    id: "design-build",
    icon: Building2,
    title: "Full Design-Build Team",
    description:
      "A complete design and construction team, established locally with a track record of finished homes in the subdivision, carrying your project from concept through move-in.",
    bestFor: "Best for buyers who want one team accountable for the whole build.",
  },
];

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: CINEMATIC_EASE },
  },
};

export default function Services() {
  return (
    <section className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
            Three Ways to Build at Ledge Rock
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-16 bg-tertiary" />
          <p className="mt-5 font-body text-base text-neutral-700/80">
            However involved you want us, there&apos;s a path that fits,
            from land alone to a fully managed design-build process.
          </p>
        </motion.div>

        {/* Service cards — stagger in on scroll, then a bit of playful
            physics on hover: the card lifts, the icon circle fills solid
            and gives the icon a small spin. */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {SERVICE_TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.id}
                variants={cardItem}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
                className="group flex flex-col rounded-2xl border border-neutral-100 p-7 transition-shadow duration-300 hover:shadow-lg hover:shadow-neutral-200/60"
              >
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ duration: 0.4, ease: CINEMATIC_EASE }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary"
                >
                  <Icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-white" />
                </motion.div>

                <h3 className="mt-5 font-headline text-xl font-semibold text-neutral-700">
                  {tier.title}
                </h3>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-neutral-700/80">
                  {tier.description}
                </p>
                <p className="mt-4 font-body text-sm italic text-secondary">
                  {tier.bestFor}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Fallback CTA for undecided buyers */}
        <div className="mt-12 text-center">
          <p className="font-body text-[15px] text-neutral-700/80">
            Not sure which path fits?{" "}
            <a
              href="/contact"
              className="font-medium text-primary underline decoration-tertiary decoration-2 underline-offset-4 hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            >
              Talk to Dan
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}