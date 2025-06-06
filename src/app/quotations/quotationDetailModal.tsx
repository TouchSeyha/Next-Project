"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"

type Item = {
  id: string
  description: string
  quantity: number
  price: number
  amount: number
}

type Customer = {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
}

type Quotation = {
  id: string
  number: string
  date: Date
  validUntil: Date
  customer: Customer
  customerId: string
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes?: string | null
  status: string
  items: Item[]
}

interface QuotationDetailModalProps {
  quotation: Quotation | null
  isOpen: boolean
  onClose: () => void
}

export default function QuotationDetailModal({
  quotation,
  isOpen,
  onClose,
}: QuotationDetailModalProps) {
  if (!isOpen || !quotation) return null

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-brightness-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Quotation Details: {quotation.number}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                Quotation Info
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    Number:
                  </span>
                  <span className="font-medium dark:text-white">
                    {quotation.number}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    Date:
                  </span>
                  <span className="font-medium dark:text-white">
                    {formatDate(quotation.date)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    Valid Until:
                  </span>
                  <span className="font-medium dark:text-white">
                    {formatDate(quotation.validUntil)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span className="font-medium dark:text-white">
                    {quotation.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                Customer Info
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    Name:
                  </span>
                  <span className="font-medium dark:text-white">
                    {quotation.customer.name}
                  </span>
                </div>
                {quotation.customer.email && (
                  <div className="flex justify-between border-b pb-1 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Email:
                    </span>
                    <span className="font-medium dark:text-white">
                      {quotation.customer.email}
                    </span>
                  </div>
                )}
                {quotation.customer.phone && (
                  <div className="flex justify-between border-b pb-1 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Phone:
                    </span>
                    <span className="font-medium dark:text-white">
                      {quotation.customer.phone}
                    </span>
                  </div>
                )}
                {quotation.customer.address && (
                  <div className="flex justify-between border-b pb-1 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Address:
                    </span>
                    <span className="font-medium dark:text-white">
                      {quotation.customer.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3 dark:text-white">Items</h3>
          <div className="overflow-x-auto border rounded-md dark:border-gray-700 mb-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {quotation.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal:</span>
                <span>{formatCurrency(quotation.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax ({quotation.taxRate * 100}%):</span>
                <span>{formatCurrency(quotation.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>{formatCurrency(quotation.total)}</span>
              </div>
            </div>
          </div>

          {quotation.notes && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <h3 className="text-md font-medium mb-2 dark:text-white">
                Notes
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {quotation.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
