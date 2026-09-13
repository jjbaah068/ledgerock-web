import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-[#FAF7F1] backdrop-blur-sm">
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
                                className={`border-b-2 pb-1 font-body text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm ${isActive
                                        ? "border-primary text-primary"
                                        : "border-transparent text-neutral-700 hover:text-primary"
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
                    className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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