// Blank means same origin: in production, Netlify proxies /api/* to the backend (_redirects is generated in vite.config.ts).
export const API_URL = String(import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");

export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  status: number;
  code: string;
  fields: FieldErrors;
  unlockAt?: string;

  constructor(status: number, code: string, message: string, fields: FieldErrors = {}, unlockAt?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
    this.unlockAt = unlockAt;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  json?: unknown;
  form?: FormData;
}

interface ErrorBody {
  code?: string;
  message?: string;
  fields?: FieldErrors;
  unlockAt?: string;
}

const NETWORK_MESSAGE = "We couldn't reach the server. Check your connection and try again.";
const SERVER_MESSAGE = "Something went wrong. Please try again.";

let onSignedOut: (() => void) | null = null;

export function setSignedOutHandler(handler: () => void): () => void {
  onSignedOut = handler;
  return () => {
    if (onSignedOut === handler) onSignedOut = null;
  };
}

export async function api<T>(path: string, { method = "GET", json, form }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (json !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      credentials: "include",
      body: form ?? (json !== undefined ? JSON.stringify(json) : undefined),
    });
  } catch {
    throw new ApiError(0, "NETWORK", NETWORK_MESSAGE);
  }

  if (response.status === 204) return undefined as T;

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(response.status, "SERVER_ERROR", SERVER_MESSAGE);
  }

  if (!response.ok) {
    const error = (body ?? {}) as ErrorBody;
    if (response.status === 401 && error.code === "NOT_SIGNED_IN") onSignedOut?.();
    throw new ApiError(
      response.status,
      error.code ?? "SERVER_ERROR",
      error.message ?? SERVER_MESSAGE,
      error.fields,
      error.unlockAt,
    );
  }
  return body as T;
}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : SERVER_MESSAGE;
}

export function errorFields(error: unknown): FieldErrors {
  return error instanceof ApiError ? error.fields : {};
}
