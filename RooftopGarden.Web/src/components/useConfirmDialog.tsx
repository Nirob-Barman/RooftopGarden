import { useCallback, useRef, useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'

interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

// Promise-based replacement for window.confirm() that renders this app's own
// styled dialog instead of the unstyled native browser prompt.
export function useConfirmDialog() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolveRef = useRef<((value: boolean) => void) | undefined>(undefined)

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts)
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
    })
  }, [])

  const settle = (value: boolean) => {
    resolveRef.current?.(value)
    setOptions(null)
  }

  const dialog = (
    <ConfirmDialog
      open={options !== null}
      title={options?.title ?? ''}
      message={options?.message ?? ''}
      confirmLabel={options?.confirmLabel}
      cancelLabel={options?.cancelLabel}
      destructive={options?.destructive}
      onConfirm={() => settle(true)}
      onCancel={() => settle(false)}
    />
  )

  return { confirm, dialog }
}
