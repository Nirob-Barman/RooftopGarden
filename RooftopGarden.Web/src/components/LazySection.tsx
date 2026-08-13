import type { ReactNode } from 'react'
import { useInView } from './useInView'

// Delays mounting `children` (and therefore any query hook inside them)
// until the wrapping div is about to enter the viewport.
export function LazySection({ children }: { children: ReactNode }) {
  const [ref, isVisible] = useInView()
  return <div ref={ref}>{isVisible ? children : null}</div>
}
