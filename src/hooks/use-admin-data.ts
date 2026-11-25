import { useEffect, useState, useSyncExternalStore } from "react"
import { getAdminDataVersion, subscribeAdminData } from "@/data/admindashboard"
import { errorMessage } from "@/lib/api"

export function useAdminDataVersion(): number {
  return useSyncExternalStore(subscribeAdminData, getAdminDataVersion, getAdminDataVersion)
}

export function useAdminResource<T>(load: () => Promise<T>) {
  const version = useAdminDataVersion()
  const [state, setState] = useState<{ data?: T; error?: string }>({})

  useEffect(() => {
    let active = true
    load()
      .then((data) => {
        if (active) setState({ data })
      })
      .catch((error: unknown) => {
        if (active) setState((current) => ({ data: current.data, error: errorMessage(error) }))
      })
    return () => {
      active = false
    }
  }, [load, version])

  return { ...state, loading: state.data === undefined && !state.error }
}
