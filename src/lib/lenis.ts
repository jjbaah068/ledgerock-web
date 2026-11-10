import { createContext, useContext } from "react";
import type Lenis from "lenis";

/** The single Lenis instance created in the root layout (null until it mounts). */
export const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
