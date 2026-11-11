import type { ReactNode } from "react";

interface AdminAuthLayoutProps {
  /** Image shown in the left panel. Pass any imported asset or public URL. */
  image: string;
  /** Alt text for the left-panel image. Use "" if it is purely decorative. */
  imageAlt?: string;
  /** Optional content layered over the image (caption, tagline, etc.). */
  imageOverlay?: ReactNode;
  /** The form or content shown in the right panel. */
  children: ReactNode;
}

/**
 * Two-column layout for admin auth screens: a swappable image on the left
 * and a form panel on the right. The image collapses to a short banner on
 * narrow screens so the form stays first-class on mobile.
 */
export default function AdminAuthLayout({
  image,
  imageAlt = "",
  imageOverlay,
  children,
}: AdminAuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F1] p-4 sm:p-6 lg:p-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-25px_rgba(74,78,74,0.35)] lg:min-h-[640px] lg:grid-cols-2">
        {/* Left: replaceable image */}
        <div className="relative h-48 sm:h-64 lg:h-auto">
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {imageOverlay && (
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/55 via-black/10 to-transparent p-6 sm:p-8">
              {imageOverlay}
            </div>
          )}
        </div>

        {/* Right: form panel */}
        <div className="flex items-center justify-center bg-[#FDFBF7] px-6 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </main>
  );
}
