import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import notFoundImage from "../assets/404.webp";

/** Shown for any URL that doesn't match a route. */
export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const previous = document.title;
    document.title = "Page Not Found | LedgeRock";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="bg-[#FAF7F1]">
      <Navbar />

      <main className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 lg:gap-16">
          {/* Message */}
          <div className="order-2 text-center md:order-1 md:text-left">
            <p className="mb-5 flex items-center justify-center gap-3 font-body text-xs font-medium uppercase tracking-[0.2em] text-primary md:justify-start">
              <span aria-hidden="true" className="h-px w-10 bg-tertiary" />
              Error 404
            </p>
            <h1 className="font-headline text-4xl font-semibold tracking-tight text-neutral-800 sm:text-5xl">
              This page can&apos;t be found
            </h1>
            <p className="mx-auto mt-5 max-w-md font-body text-base leading-relaxed text-neutral-600 md:mx-0 md:text-lg">
              The page you&apos;re looking for may have moved, or the link may be
              incorrect. Let&apos;s get you back on track.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
              >
                Back to Home
              </Link>
              <Link
                to="/properties"
                className="inline-flex w-full items-center justify-center rounded-full border border-primary px-6 py-3 font-body text-sm font-semibold text-primary transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
              >
                View Properties
              </Link>
            </div>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center gap-1.5 rounded-md font-body text-sm text-neutral-600 underline-offset-4 transition hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Go back to the previous page
            </button>
          </div>

          {/* Illustration: mix-blend-multiply drops its white background on the cream page */}
          <div className="order-1 md:order-2">
            <img
              src={notFoundImage}
              alt="Illustration of a person searching with binoculars beside a 404 error sign"
              width={1200}
              height={1200}
              className="mx-auto w-full max-w-sm mix-blend-multiply md:max-w-none"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
