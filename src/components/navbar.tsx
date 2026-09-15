import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Table Rock Living", href: "/tablerockliving" },
];

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!transparent) return;

    function handleScroll() {
      setIsScrolled(window.scrollY > 80);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

 
  const isOverlay = transparent && !isScrolled;

  return (
    <header
      className={`w-full transition-colors duration-300 ${
        isOverlay
          ? "fixed top-0 z-50 bg-transparent"
          : transparent
            ? "fixed top-0 z-50 bg-[#FAF7F1] shadow-sm"
            : "sticky top-0 z-50 bg-[#FAF7F1]"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Primary"
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Ledge Rock at Cricket Creek"
            className="h-16 w-auto"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`border-b-2 pb-1 font-body text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm ${
                  isOverlay
                    ? isActive
                      ? "border-white text-white"
                      : "border-transparent text-white/85 hover:text-white focus-visible:ring-white"
                    : isActive
                      ? "border-primary text-primary focus-visible:ring-primary"
                      : "border-transparent text-neutral-700 hover:text-primary focus-visible:ring-primary"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href="/contact"
            className="rounded-full bg-primary px-6 py-2.5 font-body text-[15px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Inquire
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`inline-flex items-center justify-center rounded-md p-2 md:hidden focus-visible:outline-none focus-visible:ring-2 ${
            isOverlay
              ? "text-white focus-visible:ring-white"
              : "text-neutral-700 focus-visible:ring-primary"
          }`}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-neutral-100 bg-white px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-body text-base text-neutral-700 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-full bg-primary px-6 py-2.5 text-center font-body text-base font-medium text-white hover:bg-primary-dark"
            >
              Inquire
            </a>
          </div>
        </div>
      )}
    </header>
  );
}