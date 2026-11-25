import { createContext, useContext, type ReactNode } from "react";
import { ApiError } from "@/lib/api";

export type ToastTone = "success" | "error" | "warning" | "info";

export interface ToastInput {
  title: string;
  /** Main message under the title. */
  description?: string;
  /** Where it came from, e.g. "Properties · Delete". Shown above the title. */
  source?: string;
  /** Extra lines, e.g. each field the server rejected. */
  details?: string[];
  /** Technical reference, e.g. "HTTP 422 · INCOMPLETE_LISTING". */
  reference?: string;
  /** Milliseconds before it closes. Defaults by tone. */
  duration?: number;
}

export interface Toast extends ToastInput {
  id: string;
  tone: ToastTone;
  createdAt: Date;
}

export interface ToastApi {
  success: (input: ToastInput) => void;
  info: (input: ToastInput) => void;
  warning: (input: ToastInput) => void;
  error: (input: ToastInput) => void;
  /** Error toast built from a failed API call: message, field problems and status code. */
  fromError: (error: unknown, input: Omit<ToastInput, "description" | "details" | "reference">) => void;
  dismiss: (id: string) => void;
}

export interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  /** The record being acted on, e.g. the property title, shown in a highlighted box. */
  subject?: { label: string; detail?: string };
  confirmLabel: string;
  /** Shown on the confirm button while `action` runs, e.g. "Deleting…". */
  busyLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "warning" | "default";
  /**
   * Work to run when confirmed. The dialog stays open with a spinner until it
   * finishes. If it throws, the dialog closes and the returned promise rejects.
   */
  action?: () => Promise<unknown>;
}

/** Resolves true when confirmed (and `action` succeeded), false when cancelled. */
export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

export const ToastContext = createContext<ToastApi | null>(null);
export const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside <FeedbackProvider>");
  return api;
}

export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error("useConfirm must be used inside <FeedbackProvider>");
  return confirm;
}

const NETWORK_REFERENCE = "No response from the server";

/** Turns any thrown error into toast text: message, unique field problems, and a reference code. */
export function describeError(error: unknown): Pick<ToastInput, "description" | "details" | "reference"> {
  if (!(error instanceof ApiError)) {
    return { description: "Something went wrong. Please try again.", reference: "Unexpected error" };
  }
  const details = [...new Set(Object.values(error.fields ?? {}))].filter((line) => line && line !== error.message);
  const reference =
    error.code === "NETWORK"
      ? NETWORK_REFERENCE
      : error.status
        ? `HTTP ${error.status} · ${error.code}`
        : error.code;
  const unlock = error.unlockAt
    ? ` Try again after ${new Date(error.unlockAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`
    : "";
  return { description: error.message + unlock, details: details.length ? details : undefined, reference };
}
