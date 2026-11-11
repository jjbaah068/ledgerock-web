import type { ReactNode } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const EFFECTIVE_DATE = "November 9, 2026";
const COMPANY = "Lakeshore Properties Group, LLC";
const EMAIL = "danb@lakeshorepropgrp.com";
const PHONE_DISPLAY = "(206) 979-4955";
const PHONE_HREF = "tel:+12069794955";
const ADDRESS = "13500–13800 Ledge Rock Lane, Omaha, AR 72662";

interface PolicySection {
  id: string;
  title: string;
  body: ReactNode;
}

const linkClass = "font-medium text-primary underline underline-offset-2 hover:text-primary-dark";

const SECTIONS: PolicySection[] = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>
          <strong>Information you give us.</strong> When you use our contact
          form or ask about a specific lot, we collect what you enter: your
          name, email address, phone number (optional), the lot or topic you’re
          interested in, and your message. If you call or email us directly,
          we receive whatever you choose to share.
        </p>
        <p>
          <strong>Information collected automatically.</strong> Like most
          websites, our hosting provider and the services listed below receive
          basic technical information when you visit, such as your IP address,
          browser type, device type, and the pages you request. We do not use
          this to identify you.
        </p>
        <p>
          We do not ask for or collect payment information, Social Security
          numbers, or other sensitive personal information through this website.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    body: (
      <>
        <p>We use the information you provide to:</p>
        <ul>
          <li>respond to your questions and requests;</li>
          <li>share details about available lots, pricing, tours, and the community;</li>
          <li>follow up about a lot or inquiry you’ve expressed interest in;</li>
          <li>keep our website secure and working properly; and</li>
          <li>meet legal, tax, and record-keeping obligations.</li>
        </ul>
        <p>
          We will not add you to a marketing mailing list unless you ask us to,
          and you can ask us to stop contacting you at any time.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "How we share information",
    body: (
      <>
        <p>
          <strong>We do not sell or rent your personal information.</strong>{" "}
          We share it only when needed to help you, specifically:
        </p>
        <ul>
          <li>
            with our team and the real estate agent who works with buyers at
            Ledge Rock, so they can answer your inquiry or arrange a tour;
          </li>
          <li>
            with service providers who help us run this website and handle
            email, who may use it only to provide those services to us; and
          </li>
          <li>
            when required by law, or to protect our rights, our property, or
            the safety of others.
          </li>
        </ul>
        <p>
          If you move forward with purchasing a lot, your information will also
          be shared with the parties involved in that transaction (such as
          title companies, lenders, or attorneys), as is normal in a real
          estate sale.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and third-party services",
    body: (
      <>
        <p>
          Our website does not use advertising cookies or analytics tracking.
          It does rely on a few third-party services that may receive technical
          information when their content loads in your browser:
        </p>
        <ul>
          <li>
            <strong>Netlify</strong>, which hosts this website and may keep
            standard server logs.
          </li>
          <li>
            <strong>Google Fonts</strong>, which supplies the typefaces used on
            the site.
          </li>
          <li>
            <strong>Google Maps</strong>, which displays the embedded map on our
            Table Rock Living page and may set its own cookies.
          </li>
        </ul>
        <p>
          These providers handle data under their own privacy policies. See,
          for example,{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Google’s Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="https://www.netlify.com/privacy/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Netlify’s Privacy Statement
          </a>
          . You can block or delete cookies in your browser settings; the
          site will still work, although the map may not load.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep information",
    body: (
      <p>
        We keep inquiry information for as long as it’s useful for helping you
        or for following up on lot sales, and longer only when the law requires
        us to keep records. When we no longer need it, we delete it or make it
        anonymous.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect information",
    body: (
      <p>
        This website is served over a secure (HTTPS) connection, and we limit
        access to inquiry information to the people who need it to help you. No
        method of sending or storing data online is completely secure, so
        please don’t send sensitive information such as financial account
        numbers through our forms or by email.
      </p>
    ),
  },
  {
    id: "your-choices",
    title: "Your choices and rights",
    body: (
      <>
        <p>You can contact us at any time to:</p>
        <ul>
          <li>ask what personal information we have about you;</li>
          <li>correct information that is wrong or out of date;</li>
          <li>ask us to delete your information; or</li>
          <li>ask us to stop contacting you.</li>
        </ul>
        <p>
          Depending on where you live, you may have additional rights under
          state law. We will respond to requests within a reasonable time and
          may need to confirm your identity before acting on them. We will not
          treat you differently for making a request.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children’s privacy",
    body: (
      <p>
        This website is intended for adults interested in purchasing property.
        We do not knowingly collect information from children under 13. If you
        believe a child has sent us personal information, please contact us and
        we will delete it.
      </p>
    ),
  },
  {
    id: "other-sites",
    title: "Links to other websites",
    body: (
      <p>
        Our site may link to other websites, such as map providers or local
        attractions. We are not responsible for how those sites handle your
        information, so please review their privacy policies.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time. When we do, we will change
        the “Effective date” at the top of this page. Significant changes will
        be made clear on this page.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <>
        <p>
          If you have questions about this policy or how we handle your
          information, please get in touch:
        </p>
        <address className="not-italic">
          <strong>{COMPANY}</strong>
          <br />
          {ADDRESS}
          <br />
          <a href={`mailto:${EMAIL}`} className={linkClass}>
            {EMAIL}
          </a>
          <br />
          <a href={PHONE_HREF} className={linkClass}>
            {PHONE_DISPLAY}
          </a>
        </address>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <div className="bg-neutral-50">
      <Navbar />

      <header className="bg-[#FAF7F1] px-6 pb-14 pt-12 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 flex items-center gap-3 font-body text-xs font-medium uppercase tracking-[0.2em] text-primary">
            <span aria-hidden="true" className="h-px w-10 bg-tertiary" />
            Legal
          </p>
          <h1 className="font-headline text-4xl font-semibold tracking-tight text-neutral-800 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-neutral-600 md:text-lg">
            How {COMPANY} collects, uses, and protects the information you share
            with us through the Ledge Rock at Cricket Creek website.
          </p>
          <p className="mt-6 font-body text-sm text-neutral-500">
            Effective date: {EFFECTIVE_DATE}
          </p>
        </div>
      </header>

      <main className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
          {/* On this page */}
          <nav aria-label="On this page" className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="font-headline text-sm font-bold uppercase tracking-wider text-neutral-700">
                On this page
              </p>
              <ol className="mt-4 space-y-2.5 border-l border-neutral-200 font-body text-sm">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l border-transparent pl-4 text-neutral-500 transition-colors hover:border-primary hover:text-primary"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="space-y-12 lg:col-span-8">
            {SECTIONS.map((section, i) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <h2 className="font-headline text-2xl font-semibold text-neutral-800">
                  <span className="mr-3 text-tertiary">{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 font-body text-[15px] leading-relaxed text-neutral-600 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-neutral-800 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {section.body}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
