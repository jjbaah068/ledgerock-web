import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import logo from "../assets/logo.webp";
import { useLenis } from "../lib/lenis";

const EASE = [0.16, 1, 0.3, 1] as const;

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
  const lenis = useLenis();

  useEffect(() => {
    if (!transparent) return;

    function handleScroll() {
      setIsScrolled(window.scrollY > 80);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  const close = () => setIsOpen(false);

  // While the menu is open: freeze page scroll and close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, lenis]);

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

      {/* Mobile menu: full-screen panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-[60] flex flex-col bg-[#FAF7F1] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.1 } }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {/* Top bar mirrors the header so the logo doesn't jump */}
            <div className="flex items-center justify-between px-6 py-4">
              <a href="/" onClick={close}>
                <img src={logo} alt="Ledge Rock at Cricket Creek" className="h-16 w-auto" />
              </a>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700/15 text-neutral-700 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links */}
            <motion.ul
              className="flex flex-1 flex-col justify-center px-6"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
                hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
            >
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                    }}
                    className="border-b border-neutral-700/10"
                  >
                    <a
                      href={link.href}
                      onClick={close}
                      aria-current={isActive ? "page" : undefined}
                      className="group flex items-center gap-4 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="w-6 font-body text-xs font-semibold tracking-widest text-neutral-700/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`flex-1 font-headline text-[1.75rem] leading-tight transition-colors ${
                          isActive ? "text-primary" : "text-neutral-700 group-hover:text-primary"
                        }`}
                      >
                        {link.label}
                      </span>
                      <ArrowUpRight
                        className={`h-5 w-5 transition-all ${
                          isActive
                            ? "text-primary"
                            : "text-neutral-700/30 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                        }`}
                      />
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>

            {/* Footer: CTA + contact */}
            <motion.div
              className="px-6 pb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.35, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <a
                href="/contact"
                onClick={close}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-body text-base font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Inquire about a lot
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <div className="mt-6 flex flex-col gap-3 font-body text-sm text-neutral-700/80">
                <a href="tel:+12069794955" className="flex items-center gap-3 hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" />
                  (206) 979-4955
                </a>
                <a href="mailto:danb@lakeshorepropgrp.com" className="flex items-center gap-3 hover:text-primary">
                  <Mail className="h-4 w-4 text-primary" />
                  danb@lakeshorepropgrp.com
                </a>
                <span className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  Omaha, Arkansas &middot; Table Rock Lake
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}