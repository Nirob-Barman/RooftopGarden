import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useRefreshMutation } from '../features/auth/authApi'
import { Spinner } from '../components/ui/Spinner'

// The access token lives only in memory (see authSlice), so a page reload loses
// it. The refresh token cookie survives, so we silently try to trade it for a
// new access token before rendering anything that depends on auth state.
export function AuthBootstrap({ children }: { children: ReactNode }) {
  const [refresh] = useRefreshMutation()
  const [ready, setReady] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    refresh().finally(() => setReady(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return <>{children}</>
}
