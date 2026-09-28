import logo from "../assets/logo.png";
import footerBg from "../assets/img2.png";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2c-2.72 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47a4.92 4.92 0 0 0-1.78 1.16A4.92 4.92 0 0 0 2.53 5.47c-.25.64-.42 1.37-.47 2.43C2.01 8.96 2 9.3 2 12s.01 3.04.06 4.1c.05 1.06.22 1.79.47 2.43a4.92 4.92 0 0 0 1.16 1.78 4.92 4.92 0 0 0 1.78 1.16c.64.25 1.37.42 2.43.47 1.06.05 1.4.06 4.1.06s3.04-.01 4.1-.06c1.06-.05 1.79-.22 2.43-.47a4.92 4.92 0 0 0 1.78-1.16 4.92 4.92 0 0 0 1.16-1.78c.25-.64.42-1.37.47-2.43.05-1.06.06-1.4.06-4.1s-.01-3.04-.06-4.1c-.05-1.06-.22-1.79-.47-2.43a4.92 4.92 0 0 0-1.16-1.78A4.92 4.92 0 0 0 18.6 2.53c-.64-.25-1.37-.42-2.43-.47C15.1 2.01 14.76 2 12.06 2H12Zm0 1.8c2.67 0 2.99.01 4.04.06.98.04 1.5.2 1.86.34.47.18.8.4 1.15.75.35.35.57.68.75 1.15.14.36.3.88.34 1.86.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.98-.2 1.5-.34 1.86-.18.47-.4.8-.75 1.15-.35.35-.68.57-1.15.75-.36.14-.88.3-1.86.34-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.04-1.5-.2-1.86-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.14-.36-.3-.88-.34-1.86C3.81 14.99 3.8 14.67 3.8 12s.01-2.99.06-4.04c.04-.98.2-1.5.34-1.86.18-.47.4-.8.75-1.15.35-.35.68-.57 1.15-.75.36-.14.88-.3 1.86-.34C8.01 3.81 8.33 3.8 11 3.8H12Zm0 3.06a5.14 5.14 0 1 0 0 10.28 5.14 5.14 0 0 0 0-10.28Zm0 8.48a3.34 3.34 0 1 1 0-6.68 3.34 3.34 0 0 1 0 6.68Zm5.34-8.68a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#F2F4F2] text-[#4A4E4A] font-body">
      {/* 1. TOP LIGHT SECTION WITH GRID LAYOUT */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-28 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand & Socials Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <img
              src={logo}
              alt="Ledge Rock at Cricket Creek"
              className="h-16 sm:h-20 w-auto object-contain"
            />
            <p className="mt-4 font-headline text-sm font-semibold tracking-wide text-[#4A7C59]">
              LedgeRock at Cricket Creek
            </p>
            
            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4A4E4A]/5 text-[#4A4E4A] transition-all hover:bg-[#4A7C59] hover:text-white"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Tagline / Callout Column */}
          <div className="lg:col-span-4">
            <h3 className="font-headline text-2xl font-bold tracking-tight text-[#4A4E4A]">
              Experience Lake Living.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6B6358]">
              Exclusive lakeside residential lots nestled in Omaha, Arkansas. Crafted for tranquility, luxury, and nature.
            </p>
            <div className="mt-6 space-y-1 text-sm font-medium text-[#4A4E4A]">
              <p>13500&ndash;13800 Ledge Rock Lane, Omaha, AR 72662</p>
              <p>
                <a href="tel:+12069794955" className="hover:text-[#4A7C59] transition-colors">
                  (206) 979-4955
                </a>
              </p>
              <p>
                <a href="mailto:danb@lakeshorepropgrp.com" className="hover:text-[#4A7C59] transition-colors">
                  danb@lakeshorepropgrp.com
                </a>
              </p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-headline text-sm font-bold uppercase tracking-wider text-[#4A4E4A]">
                Navigation
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-[#6B6358]">
                <li><a href="/properties" className="hover:text-[#4A7C59] transition-colors">Available Lots</a></li>
                <li><a href="/tablerockliving" className="hover:text-[#4A7C59] transition-colors">Location & Map</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline text-sm font-bold uppercase tracking-wider text-[#4A4E4A]">
                Company
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-[#6B6358]">
                <li><a href="/about" className="hover:text-[#4A7C59] transition-colors">Lakeshore Group</a></li>
                <li><a href="/contact" className="hover:text-[#4A7C59] transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#4A7C59] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Sub-bar overlay info above background */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B6358] border-t border-[#4A4E4A]/10 pt-6">
          <p>&copy; {year} Lakeshore Properties Group, LLC. All rights reserved.</p>
          <p>
            Site by{" "}
            <a
              href="https://nexuxgh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#4A4E4A] hover:text-[#4A7C59]"
            >
              Nexux
            </a>
          </p>
        </div>
      </div>

      {/* 2. BOTTOM CINEMATIC LANDSCAPE IMAGE WITH SEAMLESS TOP FADE */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        {/* Top Fade Gradient connecting the light background to the landscape image */}
        <div className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-[#F2F4F2] via-[#F2F4F2]/60 to-transparent" />
        
        {/* Landscape Image */}
        <img
          src={footerBg}
          alt="Ledge Rock Aerial Landscape"
          className="h-full w-full object-cover object-bottom filter contrast-[1.05] brightness-95"
        />

        {/* Soft Warm Sunburst Overlay matching Tertiary (#C4A66A) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#C4A66A]/10 to-transparent pointer-events-none" />
      </div>
    </footer>
  );
}