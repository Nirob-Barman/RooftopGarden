export type StatusTone = 'neutral' | 'success' | 'warning' | 'error' | 'primary'

const SUCCESS_STATUSES = ['delivered', 'confirmed', 'completed', 'approved', 'paid', 'active']
const ERROR_STATUSES = ['cancelled', 'canceled', 'rejected', 'failed', 'refunded', 'inactive']
const WARNING_STATUSES = ['pending', 'processing', 'awaitingpayment']

// Presentational-only mapping from a raw API status string to a color tone —
// does not gate any workflow (e.g. cancel/approve eligibility is decided elsewhere).
export function statusTone(status: string): StatusTone {
  const normalized = status.toLowerCase().replace(/\s+/g, '')
  if (SUCCESS_STATUSES.includes(normalized)) return 'success'
  if (ERROR_STATUSES.includes(normalized)) return 'error'
  if (WARNING_STATUSES.includes(normalized)) return 'warning'
  return 'primary'
}
