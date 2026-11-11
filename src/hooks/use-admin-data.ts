import { useSyncExternalStore } from "react"
import { getAdminDataVersion, subscribeAdminData } from "@/data/admindashboard"

/**
 * Re-renders the calling component whenever admin properties or inquiries
 * change, and returns a number that changes with them.
 */
export function useAdminDataVersion(): number {
  return useSyncExternalStore(subscribeAdminData, getAdminDataVersion, getAdminDataVersion)
}
