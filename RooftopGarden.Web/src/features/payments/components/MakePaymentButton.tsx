import { useState } from 'react'
import { useMakePaymentMutation } from '../paymentsApi'
import { PAYMENT_METHODS } from '../enums'

export function MakePaymentButton({ orderId }: { orderId: number }) {
  const [method, setMethod] = useState<string>(PAYMENT_METHODS[0])
  const [makePayment, { isLoading, error }] = useMakePaymentMutation()

  return (
    <div className="mt-4 flex items-end gap-3 rounded border border-gray-200 p-4 dark:border-gray-700">
      <div>
        <label className="block text-sm font-medium" htmlFor="paymentMethod">
          Payment method
        </label>
        <select
          id="paymentMethod"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="mt-1 rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
        >
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        disabled={isLoading}
        onClick={() => makePayment({ orderId, paymentMethod: method })}
        className="rounded bg-green-700 px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Pay now'}
      </button>
      {error && <p className="text-sm text-red-600">Payment failed.</p>}
    </div>
  )
}
