import { Link } from "react-router-dom";
import { ArrowLeft, Building2, ChevronRight } from "lucide-react";
import { ADMIN_PROPERTIES } from "@/data/admindashboard";

/** Reached from the "Edit Property" button: pick which listing to edit. */
export default function AdminChooseProperty() {
  const properties = [...ADMIN_PROPERTIES].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 lg:py-10">
      <Link
        to="/admin/properties"
        className="inline-flex items-center gap-1.5 rounded-sm font-body text-xs font-medium text-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to Properties
      </Link>
      <h1 className="mt-3 font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
        Edit Property
      </h1>
      <p className="mt-1.5 font-body text-sm text-neutral-700/75">
        Choose the listing you want to update.
      </p>

      <div className="mt-8 rounded-2xl bg-white p-3 shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)] sm:p-4">
        {properties.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <p className="mt-4 font-headline text-base font-semibold text-neutral-700">
              No properties to edit yet
            </p>
            <p className="mt-1 font-body text-sm text-neutral-700/70">
              Add a property first, then come back here to update it.
            </p>
            <Link
              to="/admin/properties/new"
              className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 font-body text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Add Property
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {properties.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/admin/properties/${p.id}/edit`}
                  className="flex items-center gap-4 rounded-xl px-3 py-3 transition hover:bg-[#F5F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {p.image ? (
                    <img src={p.image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <span className="h-12 w-16 shrink-0 rounded-lg bg-[#EFEBE3]" aria-hidden="true" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-headline text-base font-semibold text-neutral-700">
                      {p.title}
                    </span>
                    <span className="block truncate font-body text-xs text-neutral-700/70">
                      {[p.address, p.city].filter(Boolean).join(", ") || "No address yet"} · {p.status}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-700/40" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
