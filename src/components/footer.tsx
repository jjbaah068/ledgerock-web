import logo from "../assets/logo.png";

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

// TODO: replace with real profile URLs once Dan/Becky share them.
const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-neutral">
      {/* Giant background wordmark — decorative brand presence, rendered as
          text rather than a stretched logo image so it stays crisp at any
          size instead of pixelating. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
      >
        <span className="whitespace-nowrap font-headline text-[5.5rem] font-bold leading-none text-white/[0.06] sm:text-[8rem] lg:text-[11rem]">
          LedgeRock
        </span>
      </div>

      {/* Real content — logo, social, contact, copyright — layered cleanly
          on top, centered rather than split across columns. */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-20 text-center lg:px-8">
        <img
          src={logo}
          alt="Ledge Rock at Cricket Creek"
          className="mx-auto h-40 w-auto"
        />

        {/* Social */}
        <div className="mt-8 flex items-center justify-center gap-3">
          {SOCIAL_LINKS.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral"
              >
                <Icon />
              </a>
            );
          })}
        </div>

        {/* Contact */}
        <div className="mt-8 space-y-1.5 font-body text-[15px] text-white/80">
          <p>13500&ndash;13800 Ledge Rock Lane, Omaha, Arkansas 72662</p>
          <p>
            <a
              href="tel:+12069794955"
              className="transition-colors hover:text-tertiary"
            >
              (206) 979-4955
            </a>
            <span className="mx-2 text-white/30">&middot;</span>
            <a
              href="mailto:danb@lakeshorepropgrp.com"
              className="transition-colors hover:text-tertiary"
            >
              danb@lakeshorepropgrp.com
            </a>
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="font-body text-sm text-white/50">
            &copy; {year} Lakeshore Properties Group, LLC. All rights reserved.
          </p>
          <p className="font-body text-sm text-white/50">
            Site by{" "}
            <a
              href="https://nexuxgh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-tertiary"
            >
              Nexux
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}