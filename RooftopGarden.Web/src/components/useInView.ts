import { useEffect, useRef, useState } from 'react'

// Fires once when the observed element gets within `rootMargin` of the
// viewport, then stops watching — used to defer below-the-fold data fetches
// (each section's own query hook only mounts once this returns true).
export function useInView(rootMargin = '200px') {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || isVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin, isVisible])

  return [ref, isVisible] as const
}
