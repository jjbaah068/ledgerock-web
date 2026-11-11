import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";

/*
 * Site links shown across the top of admin pages that need them.
 * "Properties" stays inside the admin area; the others open the public site.
 */
const LINKS = [
  { label: "Home", to: "/", end: true },
  { label: "Properties", to: "/admin/properties", end: false },
  { label: "About", to: "/about", end: true },
  { label: "Contact", to: "/contact", end: true },
];

export default function AdminTopNav() {
  return (
    <header className="border-b border-neutral-700/10 bg-[#FAF7F1]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <Link
          to="/"
          aria-label="LedgeRock home"
          className="hidden shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:block"
        >
          {/* mix-blend-multiply drops the logo's white background on the cream bar */}
          <img src={logo} alt="" className="h-10 w-auto mix-blend-multiply" />
        </Link>

        <nav aria-label="Site" className="mx-auto sm:mx-0">
          <ul className="flex items-center gap-1 sm:gap-2">
            {LINKS.map(({ label, to, end }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    // Underlined only while hovered, or when it's the page you're on.
                    `block rounded-md px-3 py-1.5 font-body text-sm decoration-primary decoration-2 underline-offset-[6px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "font-semibold text-primary underline"
                        : "text-neutral-700/80 no-underline hover:text-primary hover:underline"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Keeps the links centred on wide screens */}
        <span className="hidden w-[72px] shrink-0 sm:block" aria-hidden="true" />
      </div>
    </header>
  );
}
