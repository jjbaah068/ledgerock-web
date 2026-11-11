import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

/** Slim footer strip for admin pages: logo on the left, copyright on the right. */
export default function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-700/10 bg-[#EFEBE3]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-8">
        <Link
          to="/"
          aria-label="LedgeRock home"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {/* mix-blend-multiply drops the logo's white background on the cream strip */}
          <img src={logo} alt="" className="h-8 w-auto mix-blend-multiply" />
        </Link>
        <p className="text-center font-body text-xs text-neutral-700/70">
          &copy; {year} Lakeshore Properties Group, LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
