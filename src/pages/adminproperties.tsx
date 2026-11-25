import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CircleCheck,
  ImageIcon,
  MapPin,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import {
  deleteAdminProperty,
  formatUsd,
  listAdminProperties,
  updateAdminProperty,
  type AdminProperty,
  type AdminPropertyStatus,
} from "@/data/admindashboard";
import { useAdminResource } from "@/hooks/use-admin-data";
import { AdminError, AdminLoading } from "@/components/adminstatus";
import { useConfirm, useToast } from "@/lib/feedback";

type Filter = "All" | AdminPropertyStatus;
const FILTERS: Filter[] = ["All", "Published", "Draft", "Sold"];

const STATUS_BADGE: Record<AdminPropertyStatus, string> = {
  Published: "bg-primary text-white",
  Draft: "bg-white/90 text-neutral-700",
  Sold: "bg-tertiary text-white",
};

export default function AdminProperties() {
  const { data, error, loading } = useAdminResource(listAdminProperties);
  const properties = useMemo(() => data ?? [], [data]);
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const toast = useToast();
  const confirm = useConfirm();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties
      .filter((p) => filter === "All" || p.status === filter)
      .filter(
        (p) =>
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q),
      );
  }, [properties, filter, query]);

  const location = (p: AdminProperty) => [p.address, p.city].filter(Boolean).join(", ") || "No address yet";

  async function publish(property: AdminProperty) {
    setBusyId(property.id);
    try {
      await updateAdminProperty(property.id, { status: "Published" });
      toast.success({
        source: "Properties · Publish",
        title: "Listing published",
        description: `"${property.title}" is now live on the public site.`,
      });
    } catch (err) {
      toast.fromError(err, {
        source: "Properties · Publish",
        title: `"${property.title}" can't be published yet`,
      });
    } finally {
      setBusyId(null);
    }
  }

  async function markSold(property: AdminProperty) {
    setBusyId(property.id);
    try {
      const confirmed = await confirm({
        tone: "warning",
        title: "Mark this property as sold?",
        description: "It will show as Sold on the public site and count toward Sold (YTD). You can change the status later from Edit.",
        subject: { label: property.title, detail: `${location(property)} · ${formatUsd(property.price)}` },
        confirmLabel: "Mark as Sold",
        busyLabel: "Saving…",
        action: () => updateAdminProperty(property.id, { status: "Sold" }),
      });
      if (confirmed) {
        toast.success({ source: "Properties · Status", title: "Marked as sold", description: `"${property.title}" is now marked as Sold.` });
      }
    } catch (err) {
      toast.fromError(err, { source: "Properties · Status", title: `Couldn't mark "${property.title}" as sold` });
    } finally {
      setBusyId(null);
    }
  }

  async function remove(property: AdminProperty) {
    setBusyId(property.id);
    try {
      const photos = property.images.length;
      const confirmed = await confirm({
        tone: "danger",
        title: "Delete this property?",
        description: `This permanently removes the listing${photos ? ` and its ${photos} photo${photos === 1 ? "" : "s"}` : ""}. This can't be undone.`,
        subject: { label: property.title, detail: `${location(property)} · ${property.status}` },
        confirmLabel: "Delete property",
        busyLabel: "Deleting…",
        action: () => deleteAdminProperty(property.id),
      });
      if (confirmed) {
        toast.success({ source: "Properties · Delete", title: "Property deleted", description: `"${property.title}" was removed.` });
      }
    } catch (err) {
      toast.fromError(err, { source: "Properties · Delete", title: `Couldn't delete "${property.title}"` });
    } finally {
      setBusyId(null);
    }
  }

  const isFiltering = filter !== "All" || query.trim() !== "";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold text-neutral-700 sm:text-4xl">
            Properties
          </h1>
          <p className="mt-1.5 font-body text-sm text-neutral-700/75">
            Manage your real estate listings and portfolio.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 self-start">
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#64836E] px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-[#55705E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64836E] focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Property
          </Link>
          <Link
            to="/admin/properties/edit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#64836E] px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-[#55705E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64836E] focus-visible:ring-offset-2"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit Property
          </Link>
        </div>
      </div>

      {error && <AdminError message={error} retry />}

      {/* Filters + search */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter by status"
          className="inline-flex self-start rounded-full bg-[#EFEBE3] p-1"
        >
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`rounded-full px-4 py-1.5 font-body text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active
                    ? "bg-white text-neutral-700 shadow-sm"
                    : "text-neutral-700/70 hover:text-neutral-700"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <label className="relative block w-full sm:w-64">
          <span className="sr-only">Search properties</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-700/50"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search properties..."
            className="w-full rounded-full border border-neutral-700/15 bg-white py-2 pl-10 pr-4 font-body text-sm text-neutral-700 placeholder:text-neutral-700/45 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
        </label>
      </div>

      {loading && <AdminLoading label="Loading properties..." />}

      {/* Grid */}
      {!loading && (
      <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((property) => (
          <li key={property.id}>
            <PropertyCard
              property={property}
              busy={busyId === property.id}
              onStatusChange={(s) => (s === "Sold" ? markSold(property) : publish(property))}
              onDelete={() => remove(property)}
            />
          </li>
        ))}

        <li>
          <Link
            to="/admin/properties/new"
            className="group flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-700/20 bg-[#F5F1EA]/60 transition hover:border-primary/50 hover:bg-[#F5F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/80 text-white transition group-hover:bg-primary">
              <Plus className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="font-headline text-base font-semibold text-neutral-700">
              Create Listing
            </span>
          </Link>
        </li>
      </ul>
      )}

      {!loading && data && visible.length === 0 && (
        <p role="status" className="mt-6 font-body text-sm text-neutral-700/70">
          {isFiltering
            ? "No properties match your filters."
            : "No properties yet. Create your first listing to get started."}
        </p>
      )}
    </div>
  );
}

function PropertyCard({
  property,
  busy,
  onStatusChange,
  onDelete,
}: {
  property: AdminProperty;
  busy: boolean;
  onStatusChange: (status: AdminPropertyStatus) => void;
  onDelete: () => void;
}) {
  const { status } = property;
  const actionClass =
    "inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-body text-xs text-neutral-700/80 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)]">
      <div className="relative aspect-[4/3] bg-neutral-100">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#EFEBE3]">
            <ImageIcon className="h-8 w-8 text-neutral-700/30" aria-hidden="true" />
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 font-body text-[11px] font-semibold shadow-sm ${STATUS_BADGE[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-headline text-lg font-semibold text-neutral-700">
          {property.title}
        </h2>
        {(property.address || property.city) && (
          <p className="mt-1 flex items-center gap-1.5 font-body text-xs text-neutral-700/70">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {[property.address, property.city].filter(Boolean).join(", ")}
          </p>
        )}
        <p
          className={`mt-4 font-body text-lg ${
            status === "Draft"
              ? "italic text-neutral-700/70"
              : "font-semibold text-primary"
          }`}
        >
          {formatUsd(property.price)}
        </p>

        <div className="mt-auto flex items-center gap-2 border-t border-neutral-100 pt-3">
          <Link to={`/admin/properties/${property.id}/edit`} className={actionClass}>
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </Link>

          {status === "Published" && (
            <button type="button" disabled={busy} onClick={() => onStatusChange("Sold")} className={actionClass}>
              <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Sold
            </button>
          )}

          {status === "Draft" && (
            <button type="button" disabled={busy} onClick={() => onStatusChange("Published")} className={actionClass}>
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              Publish
            </button>
          )}

          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            aria-label={`Delete ${property.title}`}
            className="ml-auto rounded-md p-1 text-red-500 transition hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
