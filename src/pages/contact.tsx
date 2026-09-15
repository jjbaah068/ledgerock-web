import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight, Navigation } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const INTEREST_OPTIONS = [
  "General inquiry",
  "Buying a lot",
  "Design services",
  "Design-build team",
  "Private tour",
  "Not sure yet",
];

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const lotParam = searchParams.get("lot");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Honeypot check — 
    if (formData.get("company")) {
      return;
    }

    setIsSubmitting(true);

    console.log("Contact form submission:", Object.fromEntries(formData));

    setIsSubmitting(false);
    setIsSubmitted(true);
    form.reset();
  }

  return (
    <>
      <Navbar />

      {/* Page header */}
      <section className="bg-[#FAF7F1] px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-headline text-4xl font-semibold text-neutral-700 sm:text-5xl">
            Let&apos;s Talk About Your Lake Home
          </h1>
          <p className="mt-4 font-body text-base text-neutral-700/80">
            Send your questions straight to us, and we will follow up to
            help you through the transaction.
          </p>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="bg-white px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-5">
          {/* Contact information */}
          <div className="md:col-span-2">
            <div className="rounded-2xl bg-[#FAF7F1] p-7">
              <h2 className="font-headline text-lg font-semibold text-neutral-700">
                Contact Information
              </h2>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <div>
                    <p className="font-body text-sm font-medium text-neutral-700">
                      Location
                    </p>
                    <p className="mt-0.5 font-body text-[15px] text-neutral-700/80">
                      Ledge Rock at Cricket Creek
                      <br />
                      Table Rock Lake, Omaha, AR
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </span>
                  <div>
                    <p className="font-body text-sm font-medium text-neutral-700">
                      Phone
                    </p>
                    <a
                      href="tel:+12069794955"
                      className="mt-0.5 block font-body text-[15px] text-neutral-700/80 transition-colors hover:text-primary"
                    >
                      (206) 979-4955
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  <div>
                    <p className="font-body text-sm font-medium text-neutral-700">
                      Email
                    </p>
                    <a
                      href="mailto:danb@lakeshorepropgrp.com"
                      className="mt-0.5 block font-body text-[15px] text-neutral-700/80 transition-colors hover:text-primary"
                    >
                      danb@lakeshorepropgrp.com
                    </a>
                    <a
                      href="mailto:dbutlerarchitect@gmail.com"
                      className="font-body text-[15px] text-neutral-700/80 transition-colors hover:text-primary"
                    >
                      dbutlerarchitect@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Directions —  */}
            <div className="mt-6 rounded-2xl border border-neutral-100 p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Navigation className="h-4 w-4 text-primary" />
                </span>
                <div>
                  <p className="font-body text-sm font-medium text-neutral-700">
                    Find Us
                  </p>
                  <p className="mt-0.5 font-body text-[15px] text-neutral-700/80">
                    Ledge Rock at Cricket Creek sits on Table Rock Lake near
                    Omaha, Arkansas.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Cricket+Creek+Marina+Omaha+AR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 font-body text-[15px] font-medium text-primary underline decoration-tertiary decoration-2 underline-offset-4 transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-neutral-100 p-7">
              {isSubmitted ? (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
                  <h2 className="font-headline text-xl font-semibold text-neutral-700">
                    Thanks &mdash; your message is on its way.
                  </h2>
                  <p className="mt-2 font-body text-[15px] text-neutral-700/80">
                    We will get back to you directly and follow up to help
                    with next steps.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-headline text-lg font-semibold text-neutral-700">
                    Send Us a Message
                  </h2>
                  <p className="mt-1 font-body text-sm text-neutral-700/70">
                    We&apos;ll get back to you within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    {/* Honeypot field — hidden from real visitors */}
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="font-body text-sm font-medium text-neutral-700"
                        >
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Jane Doe"
                          required
                          className="mt-1.5 w-full rounded-lg border border-neutral-100 px-4 py-2.5 font-body text-[15px] text-neutral-700 placeholder:text-neutral-700/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="font-body text-sm font-medium text-neutral-700"
                        >
                          Phone Number{" "}
                          <span className="text-neutral-700/50">(optional)</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(555) 000-0000"
                          className="mt-1.5 w-full rounded-lg border border-neutral-100 px-4 py-2.5 font-body text-[15px] text-neutral-700 placeholder:text-neutral-700/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="font-body text-sm font-medium text-neutral-700"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="jane@example.com"
                        required
                        className="mt-1.5 w-full rounded-lg border border-neutral-100 px-4 py-2.5 font-body text-[15px] text-neutral-700 placeholder:text-neutral-700/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="interest"
                        className="font-body text-sm font-medium text-neutral-700"
                      >
                        What are you looking for?
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        defaultValue={lotParam ? "Buying a lot" : INTEREST_OPTIONS[0]}
                        className="mt-1.5 w-full rounded-lg border border-neutral-100 bg-white px-4 py-2.5 font-body text-[15px] text-neutral-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {INTEREST_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="font-body text-sm font-medium text-neutral-700"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell us a bit more about what you need..."
                        defaultValue={lotParam ? `I'm interested in ${lotParam}. ` : undefined}
                        required
                        className="mt-1.5 w-full rounded-lg border border-neutral-100 px-4 py-2.5 font-body text-[15px] text-neutral-700 placeholder:text-neutral-700/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[15px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}