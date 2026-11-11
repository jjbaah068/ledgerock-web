import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CircleCheck,
  FileText,
  Globe,
  Home,
  Inbox,
  MailOpen,
  Plus,
} from "lucide-react";
import { useAdmin } from "@/components/adminlayout";
import { firstName } from "@/lib/adminsession";
import logo from "@/assets/logo.webp";
import { useAdminDataVersion } from "@/hooks/use-admin-data";
import {
  getDashboardStats,
  getRecentInquiries,
  getRecentProperties,
  type AdminPropertyStatus,
} from "@/data/admindashboard";

const STATUS_STYLES: Record<AdminPropertyStatus, string> = {
  Published: "bg-primary/15 text-primary-dark",
  Draft: "bg-neutral-700/10 text-neutral-700",
  Sold: "bg-tertiary/20 text-[#8A6F38]",
};

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function AdminDashboard() {
  const admin = useAdmin();
  useAdminDataVersion(); // re-render when properties or inquiries change
  const stats = getDashboardStats();
  const recentProperties = getRecentProperties();
  const recentInquiries = getRecentInquiries();

  const statCards: {
    label: string;
    value: number;
    icon: ComponentType<{ className?: string }>;
    highlight?: boolean;
  }[] = [
    { label: "Total", value: stats.total, icon: Home },
    { label: "Published", value: stats.published, icon: Globe },
    { label: "Drafts", value: stats.drafts, icon: FileText },
    { label: "Sold (YTD)", value: stats.soldYtd, icon: CircleCheck },
    { label: "New Inquiries", value: stats.newInquiries, icon: MailOpen, highlight: true },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* mix-blend-multiply drops the logo's white background on the cream page */}
          <img
            src={logo}
            alt="LedgeRock at Cricket Creek"
            className="mb-4 h-16 w-auto mix-blend-multiply sm:h-20"
          />
          <h1 className="font-headline text-2xl font-semibold text-primary sm:text-[1.75rem]">
            Welcome back, {firstName(admin.name)}.
          </h1>
          <p className="mt-1.5 font-body text-sm text-neutral-700/75">
            Here&apos;s an overview of Lakeshore Properties today.
          </p>
        </div>
        <Link
          to="/admin/properties/new"
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-primary-dark px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Property
        </Link>
      </div>

      {/* Stats */}
      <section aria-label="Property and inquiry totals" className="mt-8">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {statCards.map(({ label, value, icon: Icon, highlight }) => (
            <div
              key={label}
              className={`flex flex-col justify-between rounded-2xl p-4 shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)] sm:p-5 ${
                highlight
                  ? "border border-primary/20 bg-primary/10"
                  : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <dt
                  className={`font-body text-[11px] font-semibold uppercase tracking-wider ${
                    highlight ? "text-primary-dark" : "text-neutral-700/70"
                  }`}
                >
                  {label}
                </dt>
                <Icon
                  className={`h-4 w-4 shrink-0 ${highlight ? "text-primary" : "text-primary/80"}`}
                  aria-hidden="true"
                />
              </div>
              <dd
                className={`mt-4 font-headline text-3xl font-semibold tabular-nums ${
                  highlight ? "text-primary-dark" : "text-neutral-700"
                }`}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Recent activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent properties */}
        <section className="rounded-2xl bg-white shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)] lg:col-span-2">
          <div className="flex items-center justify-between rounded-t-2xl bg-[#F5F1EA] px-5 py-4 sm:px-6">
            <h2 className="font-headline text-lg font-semibold text-primary">
              Recent Properties
            </h2>
            <Link
              to="/admin/properties"
              className="rounded-sm font-body text-xs font-medium text-neutral-700/75 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              View All
            </Link>
          </div>

          {recentProperties.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No properties yet"
              description="Properties you add will appear here."
              action={{ label: "Add your first property", to: "/admin/properties/new" }}
            />
          ) : (
            <ul className="divide-y divide-neutral-100 px-5 sm:px-6">
              {recentProperties.map((property) => (
                <li key={property.id} className="flex items-center gap-4 py-5">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt=""
                      className="h-16 w-20 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-20 shrink-0 rounded-lg bg-[#EFEBE3]" aria-hidden="true" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-headline text-base font-semibold text-neutral-700">
                      {property.title}
                    </p>
                    <p className="truncate font-body text-xs text-neutral-700/70">
                      {property.address}
                    </p>
                    <p className="mt-1 font-body text-sm font-semibold text-primary-dark">
                      {priceFormatter.format(property.price)}
                    </p>
                  </div>
                  <span
                    className={`self-start rounded-full px-2.5 py-0.5 font-body text-[11px] font-semibold ${STATUS_STYLES[property.status]}`}
                  >
                    {property.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent inquiries */}
        <section className="flex flex-col rounded-2xl bg-white shadow-[0_6px_20px_-12px_rgba(74,78,74,0.35)]">
          <div className="rounded-t-2xl bg-[#F5F1EA] px-5 py-4">
            <h2 className="font-headline text-lg font-semibold text-primary">
              Recent Inquiries
            </h2>
          </div>

          {recentInquiries.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No inquiries yet"
              description="Messages from the contact form will show up here."
            />
          ) : (
            <ul className="space-y-3 p-4">
              {recentInquiries.map((inquiry) => (
                <li key={inquiry.id}>
                  <Link
                    to={`/admin/inquiries?id=${encodeURIComponent(inquiry.id)}`}
                    className={`block rounded-xl p-3.5 transition hover:ring-2 hover:ring-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      inquiry.status === "New" ? "bg-[#F5F1EA]" : "bg-neutral-100/70 opacity-70"
                    }`}
                  >
                    <p className="font-body text-sm font-semibold text-neutral-700">
                      {inquiry.name}
                    </p>
                    <p className="mt-0.5 truncate font-body text-xs text-neutral-700/70">
                      {inquiry.message}
                    </p>
                    {inquiry.status === "New" && (
                      <span className="mt-2 inline-block rounded-full bg-red-100 px-2 py-0.5 font-body text-[10px] font-semibold text-red-700">
                        Action Needed
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto border-t border-neutral-100 px-5 py-3 text-center">
            <Link
              to="/admin/inquiries"
              className="rounded-sm font-body text-xs font-medium text-primary-dark transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              View All Inquiries
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      </span>
      <p className="mt-4 font-headline text-base font-semibold text-neutral-700">
        {title}
      </p>
      <p className="mt-1 max-w-xs font-body text-sm text-neutral-700/70">
        {description}
      </p>
      {action && (
        <Link
          to={action.to}
          className="mt-4 rounded-sm font-body text-sm font-medium text-primary underline decoration-tertiary decoration-2 underline-offset-4 hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
