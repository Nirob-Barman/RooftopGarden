// Mirrors RooftopGarden.Domain.Enums.PaymentMethod / PaymentStatus (serialized as strings).
export const PAYMENT_METHODS = [
  'CreditCard',
  'DebitCard',
  'PayPal',
  'MobileBanking',
  'BankTransfer',
  'CashOnDelivery',
] as const

export const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refunded'] as const
