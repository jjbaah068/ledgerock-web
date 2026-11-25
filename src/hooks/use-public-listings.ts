import { useEffect, useMemo, useState } from "react"
import {
  fetchPublishedListing,
  fetchPublishedListings,
  getStaticListing,
  isPropertyId,
  STATIC_LISTINGS,
  type Listing,
} from "@/data/listings"
import { ApiError } from "@/lib/api"

export function usePublicListings() {
  const [published, setPublished] = useState<Listing[]>([])
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    fetchPublishedListings()
      .then((listings) => {
        if (active) setPublished(listings)
      })
      .catch(() => {
        if (active) setFailed(true)
      })
    return () => {
      active = false
    }
  }, [])

  const listings = useMemo(() => [...published, ...STATIC_LISTINGS], [published])
  return { published, listings, failed }
}

type ListingState = { id: string; listing?: Listing; failed?: boolean }

export function usePublicListing(id: string) {
  const staticListing = getStaticListing(id)
  const shouldFetch = !staticListing && isPropertyId(id)
  const [state, setState] = useState<ListingState | null>(null)

  useEffect(() => {
    if (!shouldFetch) return
    let active = true
    fetchPublishedListing(id)
      .then((listing) => {
        if (active) setState({ id, listing })
      })
      .catch((error: unknown) => {
        if (active) setState({ id, failed: !(error instanceof ApiError && error.status === 404) })
      })
    return () => {
      active = false
    }
  }, [id, shouldFetch])

  const current = state?.id === id ? state : null
  return {
    listing: staticListing ?? current?.listing,
    loading: shouldFetch && !current,
    failed: Boolean(current?.failed),
  }
}
