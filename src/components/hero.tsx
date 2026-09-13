import { ArrowRight } from "lucide-react";
import heroPoster from "../assets/img1.png";
import heroVideo from "../assets/img1.png";

export default function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      {/* Background video (hidden when reduced-motion is preferred) */}
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        poster={heroPoster}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Static fallback shown only when reduced-motion is preferred */}
      <img
        src={heroPoster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
      />

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
        <h1 className="font-headline text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Find a Place You'll Be Proud to Call Home
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-body text-lg text-white/90">
          Gated lakefront living on Table Rock Lake, thoughtfully developed
          lots ready to build, in a community built to last.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
        </div>
      </div>
    </section>
  );
}