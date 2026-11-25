import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Inbox,
  Mail,
  Reply,
  Search,
  Trash2,
} from "lucide-react";
import {
  deleteAdminInquiry,
  listAdminInquiries,
  updateAdminInquiry,
  type AdminInquiry,
  type InquiryStatus,
} from "@/data/admindashboard";
import { useAdminResource } from "@/hooks/use-admin-data";
import { AdminError, AdminLoading } from "@/components/adminstatus";
import { firstName } from "@/lib/adminsession";
import { useConfirm, useToast } from "@/lib/feedback";
import { getLotById } from "@/data/lots";

type Filter = "All" | InquiryStatus;
const FILTERS: Filter[] = ["All", "New", "Contacted", "Closed"];
const STATUSES: InquiryStatus[] = ["New", "Contacted", "Closed"];

const STATUS_BADGE: Record<InquiryStatus, string> = {
  New: "bg-red-100 text-red-700",
  Contacted: "bg-tertiary/80 text-white",
  Closed: "bg-neutral-700/10 text-neutral-700",
};

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
const longDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
const timeOfDay = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const cardShadow = "shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)]";

export default function AdminInquiries() {
  const { data, error, loading } = useAdminResource(listAdminInquiries);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const confirm = useConfirm();

  const inquiries = data ?? [];

  const q = query.trim().toLowerCase();
  const visible = inquiries
    .filter((i) => filter === "All" || i.status === filter)
    .filter(
      (i) =>
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.message.toLowerCase().includes(q) ||
        (i.property?.title.toLowerCase().includes(q) ?? false) ||
        (i.topic?.toLowerCase().includes(q) ?? false),
    );

  const selectedId = searchParams.get("id");
  const selected = inquiries.find((i) => i.id === selectedId) ?? null;

  function select(id: string | null) {
    setSearchParams(id ? { id } : {}, { replace: true });
  }

  async function changeStatus(inquiry: AdminInquiry, status: InquiryStatus) {
    if (status === inquiry.status) return;
    setBusy(true);
    try {
      await updateAdminInquiry(inquiry.id, status);
      toast.success({
        source: "Inquiries · Status",
        title: `Marked as ${status}`,
        description: `Inquiry from ${inquiry.name} moved from ${inquiry.status} to ${status}.`,
        duration: 3500,
      });
    } catch (err) {
      toast.fromError(err, { source: "Inquiries · Status", title: `Couldn't update the inquiry from ${inquiry.name}` });
    } finally {
      setBusy(false);
    }
  }

  async function remove(inquiry: AdminInquiry) {
    const index = visible.findIndex((i) => i.id === inquiry.id);
    const next = visible[index + 1] ?? visible[index - 1] ?? null;
    setBusy(true);
    try {
      const confirmed = await confirm({
        tone: "danger",
        title: "Delete this inquiry?",
        description: "The message and the sender's contact details will be permanently removed. This can't be undone.",
        subject: {
          label: `${inquiry.name} · ${inquiry.email}`,
          detail: `Received ${shortDate.format(new Date(inquiry.receivedAt))}${inquiry.property ? ` · ${inquiry.property.title}` : inquiry.topic ? ` · ${inquiry.topic}` : ""}`,
        },
        confirmLabel: "Delete inquiry",
        busyLabel: "Deleting…",
        action: () => deleteAdminInquiry(inquiry.id),
      });
      if (confirmed) {
        select(next?.id ?? null);
        toast.success({ source: "Inquiries · Delete", title: "Inquiry deleted", description: `The message from ${inquiry.name} was removed.` });
      }
    } catch (err) {
      toast.fromError(err, { source: "Inquiries · Delete", title: `Couldn't delete the inquiry from ${inquiry.name}` });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:py-10">
      {error && <AdminError message={error} retry />}
      <div className={`grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] ${error ? "mt-6" : ""}`}>
        {/* List */}
        <section
          aria-label="Inquiries"
          className={`rounded-2xl bg-white p-5 sm:p-6 ${cardShadow} ${selected ? "hidden lg:block" : ""}`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-headline text-2xl font-semibold text-neutral-700">
                Inquiries Management
              </h1>
              <p className="mt-1 font-body text-sm text-neutral-700/75">
                Review and respond to client messages.
              </p>
            </div>
            <label className="relative block w-full sm:w-56">
              <span className="sr-only">Search inquiries</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-700/50"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search inquiries..."
                className="w-full rounded-full border border-neutral-700/10 bg-[#F5F1EA] py-2 pl-10 pr-4 font-body text-sm text-neutral-700 placeholder:text-neutral-700/45 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </label>
          </div>

          <div role="group" aria-label="Filter by status" className="mt-5 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-1.5 font-body text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    active
                      ? "bg-primary text-white"
                      : "bg-[#EFEBE3] text-neutral-700/80 hover:text-neutral-700"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {loading ? (
            <AdminLoading label="Loading inquiries..." />
          ) : !data ? null : visible.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Inbox className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <p className="mt-4 font-headline text-base font-semibold text-neutral-700">
                {inquiries.length === 0 ? "No inquiries yet" : "No matching inquiries"}
              </p>
              <p className="mt-1 max-w-xs font-body text-sm text-neutral-700/70">
                {inquiries.length === 0
                  ? "Messages from the contact form will show up here."
                  : "Try a different search or filter."}
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {visible.map((inquiry) => {
                const active = inquiry.id === selected?.id;
                return (
                  <li key={inquiry.id}>
                    <button
                      type="button"
                      onClick={() => select(inquiry.id)}
                      aria-current={active ? "true" : undefined}
                      className={`block w-full rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        active
                          ? "border-primary/30 border-l-4 border-l-primary bg-primary/10"
                          : "border-neutral-700/10 bg-white hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-headline text-base font-semibold text-neutral-700">
                          {inquiry.name}
                        </p>
                        <time
                          dateTime={inquiry.receivedAt}
                          className="shrink-0 font-body text-[11px] text-neutral-700/60"
                        >
                          {shortDate.format(new Date(inquiry.receivedAt))}
                        </time>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-3">
                        <p className="truncate font-body text-xs text-neutral-700/70">
                          {inquiry.email}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 font-body text-[10px] font-semibold ${STATUS_BADGE[inquiry.status]}`}
                        >
                          {inquiry.status}
                        </span>
                      </div>
                      {(inquiry.property || inquiry.topic) && (
                        <p className="mt-1 truncate font-body text-xs font-semibold text-neutral-700">
                          Interest: {inquiry.property?.title ?? inquiry.topic}
                        </p>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Detail */}
        <section
          aria-label="Inquiry details"
          className={`flex flex-col rounded-2xl bg-white ${cardShadow} lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] ${
            selected ? "" : "hidden lg:flex"
          }`}
        >
          {selected ? (
            <InquiryDetail
              key={selected.id}
              inquiry={selected}
              busy={busy}
              onStatusChange={(status) => changeStatus(selected, status)}
              onBack={() => select(null)}
              onDelete={() => remove(selected)}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <p className="mt-4 font-headline text-base font-semibold text-neutral-700">
                No inquiry selected
              </p>
              <p className="mt-1 max-w-xs font-body text-sm text-neutral-700/70">
                Choose a message from the list to read it here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
    </>
  );
}

function InquiryDetail({
  inquiry,
  busy,
  onStatusChange: setStatus,
  onBack,
  onDelete,
}: {
  inquiry: AdminInquiry;
  busy: boolean;
  onStatusChange: (status: InquiryStatus) => void;
  onBack: () => void;
  onDelete: () => void;
}) {
  const received = new Date(inquiry.receivedAt);
  const propertyImage =
    inquiry.property?.image ??
    (inquiry.property?.lotId ? getLotById(inquiry.property.lotId)?.image : undefined);
  const subject = inquiry.property
    ? `Re: Your inquiry about ${inquiry.property.title}`
    : "Re: Your inquiry";
  const mailto = `mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}`;
  const iconButton =
    "flex h-8 w-8 items-center justify-center rounded-full text-neutral-700/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-body text-xs font-medium text-neutral-700/80 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:invisible"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All inquiries
        </button>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setStatus("New")}
            disabled={busy || inquiry.status === "New"}
            aria-label="Mark as new"
            title="Mark as new"
            className={`${iconButton} hover:bg-[#F5F1EA] hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent`}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            aria-label={`Delete inquiry from ${inquiry.name}`}
            title="Delete"
            className={`${iconButton} text-red-500 hover:bg-red-50 hover:text-red-700`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-headline text-2xl font-semibold text-neutral-700">
            {inquiry.name}
          </h2>
          <label className="shrink-0">
            <span className="sr-only">Status</span>
            <select
              value={inquiry.status}
              disabled={busy}
              onChange={(e) => setStatus(e.target.value as InquiryStatus)}
              className={`cursor-pointer appearance-none rounded-full border-0 px-3 py-1 text-center font-body text-[11px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${STATUS_BADGE[inquiry.status]}`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-white text-neutral-700">
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
        <a
          href={`mailto:${inquiry.email}`}
          className="mt-1 block font-body text-sm text-neutral-700/75 hover:text-primary"
        >
          {inquiry.email}
        </a>
        {inquiry.phone && (
          <a
            href={`tel:${inquiry.phone.replace(/[^\d+]/g, "")}`}
            className="block font-body text-sm text-neutral-700/75 hover:text-primary"
          >
            {inquiry.phone}
          </a>
        )}

        {inquiry.property && (
          <div className="mt-5 rounded-xl bg-[#F5F1EA] p-4">
            <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-neutral-700/70">
              Property of Interest
            </p>
            <div className="mt-3 flex items-center gap-3">
              {propertyImage ? (
                <img
                  src={propertyImage}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white">
                  <Building2 className="h-5 w-5 text-neutral-700/40" aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0">
                <p className="font-headline text-base font-semibold leading-snug text-neutral-700">
                  {inquiry.property.title}
                </p>
                {inquiry.property.href && (
                  <Link
                    to={inquiry.property.href}
                    target="_blank"
                    className="mt-0.5 inline-block font-body text-xs text-neutral-700/70 underline-offset-2 hover:text-primary hover:underline"
                  >
                    View Listing
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {inquiry.topic && (
          <p className="mt-4 font-body text-xs text-neutral-700/75">
            <span className="font-semibold text-neutral-700">Looking for:</span> {inquiry.topic}
          </p>
        )}

        <p className="mt-6 border-t border-neutral-100 pt-5 font-body text-xs text-neutral-700/60">
          Received:{" "}
          <time dateTime={inquiry.receivedAt}>
            {longDate.format(received)} at {timeOfDay.format(received)}
          </time>
        </p>
        <p className="mt-3 whitespace-pre-line font-body text-sm leading-relaxed text-neutral-700">
          {inquiry.message}
        </p>
      </div>

      {/* Reply */}
      <div className="border-t border-neutral-100 p-4">
        <a
          href={mailto}
          onClick={() => {
            if (inquiry.status === "New") setStatus("Contacted");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Reply className="h-4 w-4" aria-hidden="true" />
          Reply to {firstName(inquiry.name)}
        </a>
      </div>
    </>
  );
}
