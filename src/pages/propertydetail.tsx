import { useState, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
    ArrowLeft,
    MapPin,
    Compass,
    Tag,
    Route,
    Zap,
    Droplet,
    Wifi,
    ShieldCheck,
    LockKeyhole,
    CircleCheck,
} from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { STATUS_STYLES } from "../data/lots";
import { submitInquiry } from "../data/admindashboard";
import { usePublicListing } from "../hooks/use-public-listings";
import { errorFields, errorMessage } from "../lib/api";


const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

const LOT_FEATURES = [
    { icon: Route, label: "Paved Road Access" },
    { icon: Zap, label: "Power at Lot Corner" },
    { icon: Droplet, label: "Water at Lot Corner" },
    { icon: Wifi, label: "High-Speed Fiber" },
    { icon: ShieldCheck, label: "DOH-Approved Septic Layout" },
    { icon: LockKeyhole, label: "Gated Community" },
];

export default function PropertyDetail() {
    const { lotId } = useParams<{ lotId: string }>();
    const { listing: lot, loading, failed } = usePublicListing(lotId ?? "");
    const [selectedPhoto, setSelectedPhoto] = useState({ id: "", index: 0 });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const text = (key: string) => String(formData.get(key) ?? "").trim();

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await submitInquiry({
                name: text("name"),
                email: text("email"),
                phone: text("phone") || undefined,
                message: text("message"),
                topic: "Private tour",
                lotId: lot?.lotId,
                propertyId: lot?.propertyId,
                company: String(formData.get("company") ?? "") || undefined,
            });
            setIsSubmitted(true);
            form.reset();
        } catch (error) {
            setSubmitError(Object.values(errorFields(error))[0] ?? errorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <section className="bg-white px-6 py-24 text-center lg:px-8">
                    <p role="status" className="font-body text-[15px] text-neutral-700/80">
                        Loading property...
                    </p>
                </section>
                <Footer />
            </>
        );
    }

    if (!lot) {
        return (
            <>
                <Navbar />
                <section className="bg-white px-6 py-24 text-center lg:px-8">
                    <h1 className="font-headline text-3xl font-semibold text-neutral-700">
                        {failed ? "We couldn't load that property." : "We couldn't find that lot."}
                    </h1>
                    <p className="mt-3 font-body text-[15px] text-neutral-700/80">
                        {failed ? "Please check your connection and try again." : "It may have been renumbered or is no longer listed."}
                    </p>
                    <Link
                        to="/properties"
                        className="mt-6 inline-block font-body text-[15px] font-medium text-primary underline decoration-tertiary decoration-2 underline-offset-4 hover:text-primary-dark"
                    >
                        View All Available Lots
                    </Link>
                </section>
                <Footer />
            </>
        );
    }

    const photoIndex = selectedPhoto.id === lot.id ? selectedPhoto.index : 0;
    const mainImage = lot.gallery[photoIndex] ?? lot.image;
    const thumbnails = lot.gallery
        .map((src, index) => ({ src, index }))
        .filter(({ index }) => index !== photoIndex);
    const photoAlt = lot.isPlaceholderImage
        ? "Example home built at Ledge Rock"
        : `${lot.name} at Ledge Rock at Cricket Creek`;
    const quickSpecs = [
        ...lot.specs,
        ...(lot.viewType ? [{ label: "View Type", value: lot.viewType, icon: Compass }] : []),
        { label: "Status", value: lot.status, icon: Tag },
    ];
    const featureList = lot.lotId
        ? LOT_FEATURES
        : lot.features.map((label) => ({ icon: CircleCheck, label }));
    const noun = lot.lotId ? "Lot" : "Property";

    return (
        <>
            <Navbar />

            <section className="bg-white px-6 py-12 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    {/* Back link */}
                    <Link
                        to="/properties"
                        className="inline-flex items-center gap-1.5 font-body text-sm text-neutral-700/70 transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Available Lots
                    </Link>

                    {/* Header row: badge/location + title, price top-right */}
                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`rounded-full px-3 py-1 font-body text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[lot.status]}`}
                                >
                                    {lot.status}
                                </span>
                                <span className="flex items-center gap-1.5 font-body text-sm text-neutral-700/70">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    {lot.location}
                                </span>
                            </div>
                            <h1 className="mt-2 font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
                                {lot.name}
                                {lot.viewType && <> &mdash; {lot.viewType}</>}
                            </h1>
                        </div>

                        <p className="font-body text-2xl font-semibold text-primary sm:text-right">
                            {lot.price}
                        </p>
                    </div>

                    {/* Image gallery:  */}
                    <div key={lot.id} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <motion.div
                            initial={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
                            className={`relative overflow-hidden rounded-2xl ${thumbnails.length > 0 ? "sm:col-span-2" : "sm:col-span-3"}`}
                        >
                            <img
                                src={mainImage}
                                alt={photoAlt}
                                className="h-[420px] w-full object-cover"
                            />
                            {lot.isPlaceholderImage && (
                                <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 font-body text-xs text-white">
                                    Example home &mdash; lot photography coming soon
                                </span>
                            )}
                        </motion.div>

                        {thumbnails.length > 0 && (
                        <div data-lenis-prevent className="grid max-h-[420px] grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-1">
                            {thumbnails.map(({ src, index }, i) => (
                                <motion.button
                                    type="button"
                                    key={src}
                                    onClick={() => setSelectedPhoto({ id: lot.id, index })}
                                    aria-label={`Show photo ${index + 1} of ${lot.gallery.length}`}
                                    initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{
                                        duration: 0.6,
                                        ease: CINEMATIC_EASE,
                                        delay: 0.3 + i * 0.12,
                                    }}
                                    className="overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <img loading="lazy" decoding="async"
                                        src={src}
                                        alt={photoAlt}
                                        className="h-[200px] w-full object-cover"
                                    />
                                </motion.button>
                            ))}
                        </div>
                        )}
                    </div>

                    {/* Body: details left, inline inquiry form right */}
                    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            {/* Quick specs */}
                            <div className="grid grid-cols-2 gap-6 border-y border-neutral-100 py-6 sm:grid-cols-4">
                                {quickSpecs.map(({ label, value, icon: Icon }) => (
                                    <div key={label}>
                                        <Icon className="h-5 w-5 text-primary" />
                                        <p className="mt-2 font-body text-sm font-medium text-neutral-700">
                                            {value}
                                        </p>
                                        <p className="font-body text-xs text-neutral-700/60">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* About */}
                            {lot.description && (
                            <div className="mt-8">
                                <h2 className="font-headline text-xl font-semibold text-neutral-700">
                                    About This {noun}
                                </h2>
                                <p className="mt-3 whitespace-pre-line font-body text-[15px] leading-relaxed text-neutral-700/85">
                                    {lot.description}
                                </p>
                            </div>
                            )}

                            {/* Features */}
                            {featureList.length > 0 && (
                            <div className="mt-10">
                                <h2 className="font-headline text-xl font-semibold text-neutral-700">
                                    {noun} Features
                                </h2>
                                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {featureList.map((feature) => {
                                        const Icon = feature.icon;
                                        return (
                                            <div
                                                key={feature.label}
                                                className="flex items-center gap-2.5 rounded-xl border border-neutral-100 px-4 py-3"
                                            >
                                                <Icon className="h-4 w-4 shrink-0 text-primary" />
                                                <span className="font-body text-sm text-neutral-700/85">
                                                    {feature.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Inline inquiry sidebar */}
                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-neutral-100 p-6">
                                {isSubmitted ? (
                                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                                        <h3 className="font-headline text-lg font-semibold text-neutral-700">
                                            Thanks for reaching out.
                                        </h3>
                                        <p className="mt-2 font-body text-sm text-neutral-700/80">
                                            We&apos;ll follow up about {lot.name} shortly.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="font-headline text-lg font-semibold text-neutral-700">
                                            Interested in this {noun.toLowerCase()}?
                                        </h3>
                                        <p className="mt-1 font-body text-sm text-neutral-700/70">
                                            Reach out to schedule a private viewing or ask questions.
                                        </p>

                                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                                            <input
                                                type="text"
                                                name="company"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                aria-hidden="true"
                                                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                                            />

                                            <div>
                                                <label
                                                    htmlFor="detail-name"
                                                    className="font-body text-sm font-medium text-neutral-700"
                                                >
                                                    Name
                                                </label>
                                                <input
                                                    id="detail-name"
                                                    name="name"
                                                    type="text"
                                                    placeholder="Jane Doe"
                                                    required
                                                    className="mt-1.5 w-full rounded-lg border border-neutral-100 px-4 py-2.5 font-body text-[15px] text-neutral-700 placeholder:text-neutral-700/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="detail-email"
                                                    className="font-body text-sm font-medium text-neutral-700"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    id="detail-email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="jane@example.com"
                                                    required
                                                    className="mt-1.5 w-full rounded-lg border border-neutral-100 px-4 py-2.5 font-body text-[15px] text-neutral-700 placeholder:text-neutral-700/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="detail-phone"
                                                    className="font-body text-sm font-medium text-neutral-700"
                                                >
                                                    Phone{" "}
                                                    <span className="text-neutral-700/50">(optional)</span>
                                                </label>
                                                <input
                                                    id="detail-phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="(555) 000-0000"
                                                    className="mt-1.5 w-full rounded-lg border border-neutral-100 px-4 py-2.5 font-body text-[15px] text-neutral-700 placeholder:text-neutral-700/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="detail-message"
                                                    className="font-body text-sm font-medium text-neutral-700"
                                                >
                                                    Message
                                                </label>
                                                <textarea
                                                    id="detail-message"
                                                    name="message"
                                                    rows={5}
                                                    placeholder={`I'm interested in ${lot.name}. `}
                                                    required
                                                    className="mt-1.5 w-full rounded-lg border border-neutral-100 px-4 py-2.5 font-body text-[15px] text-neutral-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                            </div>

                                            {submitError && (
                                                <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-700">
                                                    {submitError}
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full rounded-full bg-primary px-6 py-3 font-body text-[15px] font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
                                            >
                                                {isSubmitting ? "Sending..." : "Schedule a Viewing"}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}