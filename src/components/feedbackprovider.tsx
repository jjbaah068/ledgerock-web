import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, CircleAlert, CircleCheck, Info, LoaderCircle, Trash2, X } from "lucide-react";
import {
  ConfirmContext,
  ToastContext,
  describeError,
  type ConfirmFn,
  type ConfirmOptions,
  type Toast,
  type ToastApi,
  type ToastInput,
  type ToastTone,
} from "@/lib/feedback";

const MAX_TOASTS = 4;
const DEFAULT_DURATION: Record<ToastTone, number> = {
  success: 5000,
  info: 6000,
  warning: 8000,
  error: 10000,
};

const TONE_STYLES: Record<ToastTone, { icon: typeof CircleCheck; accent: string; iconColor: string; label: string }> = {
  success: { icon: CircleCheck, accent: "bg-primary", iconColor: "text-primary", label: "Success" },
  info: { icon: Info, accent: "bg-[#6B8CA8]", iconColor: "text-[#4E6F8C]", label: "Notice" },
  warning: { icon: AlertTriangle, accent: "bg-tertiary", iconColor: "text-[#8A6F38]", label: "Warning" },
  error: { icon: CircleAlert, accent: "bg-red-500", iconColor: "text-red-600", label: "Error" },
};

const clock = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (confirmed: boolean) => void;
  reject: (error: unknown) => void;
}

/** Provides useToast() and useConfirm() to the whole app. Mount once near the root. */
export default function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  // Kept after closing so the dialog's content stays visible during its exit animation.
  const [dialogOptions, setDialogOptions] = useState<ConfirmOptions | null>(null);
  const [busy, setBusy] = useState(false);
  const pendingRef = useRef<PendingConfirm | null>(null);

  const dismiss = useCallback((id: string) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((tone: ToastTone, input: ToastInput) => {
    const toast: Toast = { ...input, tone, id: crypto.randomUUID(), createdAt: new Date() };
    setToasts((list) => [...list, toast].slice(-MAX_TOASTS));
  }, []);

  const toastApi = useMemo<ToastApi>(
    () => ({
      success: (input) => push("success", input),
      info: (input) => push("info", input),
      warning: (input) => push("warning", input),
      error: (input) => push("error", input),
      fromError: (error, input) => push("error", { ...input, ...describeError(error) }),
      dismiss,
    }),
    [push, dismiss],
  );

  const confirm = useCallback<ConfirmFn>((options) => {
    // Only one dialog at a time: a new request cancels the previous one.
    pendingRef.current?.resolve(false);
    return new Promise<boolean>((resolve, reject) => {
      const next = { options, resolve, reject };
      pendingRef.current = next;
      setBusy(false);
      setDialogOptions(options);
      setPending(next);
    });
  }, []);

  const close = useCallback(() => {
    pendingRef.current = null;
    setPending(null);
    setBusy(false);
  }, []);

  const cancel = useCallback(() => {
    if (busy || !pending) return;
    pending.resolve(false);
    close();
  }, [busy, pending, close]);

  const accept = useCallback(async () => {
    if (!pending || busy) return;
    const { options, resolve, reject } = pending;
    if (!options.action) {
      resolve(true);
      close();
      return;
    }
    setBusy(true);
    try {
      await options.action();
      resolve(true);
    } catch (error) {
      reject(error);
    } finally {
      close();
    }
  }, [pending, busy, close]);

  return (
    <ToastContext.Provider value={toastApi}>
      <ConfirmContext.Provider value={confirm}>
        {children}
        <ConfirmDialog isOpen={pending !== null} options={dialogOptions} busy={busy} onCancel={cancel} onConfirm={accept} />
        <ToastViewport toasts={toasts} onDismiss={dismiss} />
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Confirmation modal                                                  */
/* ------------------------------------------------------------------ */

function ConfirmDialog({
  isOpen,
  options,
  busy,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  options: ConfirmOptions | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {

  const tone = options?.tone ?? "default";
  const Icon = tone === "danger" ? Trash2 : tone === "warning" ? AlertTriangle : Info;
  const iconWrap =
    tone === "danger" ? "bg-red-50 text-red-600" : tone === "warning" ? "bg-tertiary/15 text-[#8A6F38]" : "bg-primary/10 text-primary";
  const confirmButton =
    tone === "danger"
      ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
      : tone === "warning"
        ? "bg-[#6B5530] hover:bg-[#574524] focus-visible:ring-[#6B5530]"
        : "bg-primary hover:bg-primary-dark focus-visible:ring-primary";

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      isDismissable={!busy}
      isKeyboardDismissDisabled={busy}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-neutral-900/40 p-4 backdrop-blur-[2px] transition-opacity duration-200 data-entering:opacity-0 data-exiting:opacity-0 motion-reduce:transition-none sm:items-center"
    >
      <Modal className="w-full max-w-md transition duration-200 ease-out data-entering:translate-y-3 data-entering:scale-[0.98] data-entering:opacity-0 data-exiting:translate-y-3 data-exiting:opacity-0 motion-reduce:transition-none">
        <Dialog
          role="alertdialog"
          className="rounded-2xl bg-white p-6 shadow-[0_24px_60px_-20px_rgba(40,45,40,0.45)] outline-none"
        >
          {options && (
            <>
              <div className="flex items-start gap-4">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconWrap}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <Heading slot="title" className="font-headline text-lg font-semibold text-neutral-700">
                    {options.title}
                  </Heading>
                  {options.description && (
                    <div className="mt-1.5 font-body text-sm leading-relaxed text-neutral-700/75">
                      {options.description}
                    </div>
                  )}
                </div>
              </div>

              {options.subject && (
                <div className="mt-5 rounded-xl border border-neutral-700/10 bg-[#F5F1EA] px-4 py-3">
                  <p className="truncate font-body text-sm font-semibold text-neutral-700">{options.subject.label}</p>
                  {options.subject.detail && (
                    <p className="mt-0.5 truncate font-body text-xs text-neutral-700/65">{options.subject.detail}</p>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  autoFocus
                  onClick={onCancel}
                  disabled={busy}
                  className="rounded-full border border-neutral-700/20 bg-white px-5 py-2.5 font-body text-sm font-semibold text-neutral-700 transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {options.cancelLabel ?? "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={busy}
                  aria-busy={busy || undefined}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80 ${confirmButton}`}
                >
                  {busy && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {busy ? (options.busyLabel ?? "Working…") : options.confirmLabel}
                </button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  const reduceMotion = useReducedMotion();
  return (
    <section
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[110] flex flex-col items-center gap-3 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
    >
      <ol className="flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.li
              key={toast.id}
              layout={!reduceMotion}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 40, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="pointer-events-auto"
            >
              <ToastCard toast={toast} onDismiss={() => onDismiss(toast.id)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </section>
  );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { icon: Icon, accent, iconColor, label } = TONE_STYLES[toast.tone];
  const duration = toast.duration ?? DEFAULT_DURATION[toast.tone];
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration);
  const startedAt = useRef(0);

  // Count down, pausing while the pointer or keyboard focus is on the toast.
  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(onDismiss, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, onDismiss]);

  const isUrgent = toast.tone === "error" || toast.tone === "warning";

  return (
    <div
      role={isUrgent ? "alert" : "status"}
      aria-live={isUrgent ? "assertive" : "polite"}
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative overflow-hidden rounded-2xl border border-neutral-700/10 bg-white shadow-[0_16px_40px_-16px_rgba(40,45,40,0.4)]"
    >
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 ${accent}`} />
      <div className="flex gap-3 py-3.5 pl-5 pr-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-neutral-700/55">
            <span className="sr-only">{label}: </span>
            {toast.source ?? label}
          </p>
          <p className="mt-0.5 font-body text-sm font-semibold text-neutral-700">{toast.title}</p>
          {toast.description && (
            <p className="mt-1 font-body text-[13px] leading-snug text-neutral-700/80">{toast.description}</p>
          )}
          {toast.details && toast.details.length > 0 && (
            <ul className="mt-2 space-y-1 rounded-lg bg-[#F5F1EA] px-3 py-2">
              {toast.details.map((line) => (
                <li key={line} className="flex gap-1.5 font-body text-xs text-neutral-700/85">
                  <span aria-hidden="true" className="text-neutral-700/40">•</span>
                  {line}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 font-body text-[11px] text-neutral-700/50">
            <time dateTime={toast.createdAt.toISOString()}>{clock.format(toast.createdAt)}</time>
            {toast.reference && <> · {toast.reference}</>}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-700/50 transition hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 h-0.5 origin-left opacity-40 ${accent} motion-reduce:hidden`}
        style={{
          width: "100%",
          animation: `toast-countdown ${duration}ms linear forwards`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    </div>
  );
}
