import { AlertCircle, LoaderCircle } from "lucide-react";
import { refreshAdminData } from "@/data/admindashboard";

export function AdminLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <p role="status" className="flex items-center justify-center gap-2 px-6 py-14 font-body text-sm text-neutral-700/70">
      <LoaderCircle className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
      {label}
    </p>
  );
}

export function AdminError({ message, retry = false }: { message: string; retry?: boolean }) {
  return (
    <div role="alert" className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="flex-1">{message}</span>
      {retry && (
        <button
          type="button"
          onClick={refreshAdminData}
          className="rounded-sm font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}
