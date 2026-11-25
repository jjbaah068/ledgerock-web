import type { ReactNode } from "react";

interface AdminAuthLayoutProps {
  /** Illustration shown beside the form. Works best with a white background. */
  image: string;
  /** Alt text for the illustration. Use "" if it is purely decorative. */
  imageAlt?: string;
  /** Optional heading/text shown under the illustration on larger screens. */
  caption?: ReactNode;
  /** The form or content shown in the form panel. */
  children: ReactNode;
}

/**
 * Two-column layout for admin auth screens: an illustration panel and a
 * form panel. On phones the illustration shrinks to a short welcome banner
 * above the form, shown whole (never cropped) so the scene still reads.
 */
export default function AdminAuthLayout({
  image,
  imageAlt = "",
  caption,
  children,
}: AdminAuthLayoutProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#FAF7F1] p-0 sm:p-6 lg:p-10">
      <div className="grid min-h-svh w-full max-w-5xl overflow-hidden bg-white sm:min-h-0 sm:rounded-3xl sm:shadow-[0_20px_60px_-25px_rgba(74,78,74,0.35)] grid-rows-[auto_1fr] lg:min-h-[620px] lg:grid-cols-2 lg:grid-rows-1">
        {/* Illustration panel */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden bg-[#F3EDE2] px-6 pb-2 pt-8 sm:pt-10 lg:px-12 lg:py-12">
          {/* Soft circle behind the scene for depth */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EAE2D3] lg:size-[30rem] lg:-translate-y-[58%]"
          />
          {/* mix-blend-multiply drops the illustration's white background on the cream panel */}
          <img
            src={image}
            alt={imageAlt}
            width={735}
            height={736}
            className="relative h-44 w-auto object-contain mix-blend-multiply sm:h-56 lg:h-auto lg:w-full lg:max-w-md"
          />
          {caption && (
            <div className="relative mt-6 hidden max-w-sm text-center lg:block">{caption}</div>
          )}
        </div>

        {/* Form panel */}
        <div className="flex items-start justify-center bg-[#FDFBF7] px-6 pb-12 pt-8 sm:px-12 sm:py-12 lg:items-center lg:px-14">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </main>
  );
}
