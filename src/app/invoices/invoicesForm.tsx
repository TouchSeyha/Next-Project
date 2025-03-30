"use client"

import { useState, useEffect } from "react"
import { createInvoice, updateInvoice } from "@/lib/invoices"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { Customer, Quotation, Invoice, Item } from "../types/invoice"

interface InvoiceFormProps {
  customers: Customer[]
  quotations: Quotation[]
  invoice?: Invoice
  onSuccess: () => void
  onCancel: () => void
}

export function InvoiceForm({
  customers,
  quotations,
  invoice,
  onSuccess,
  onCancel,
}: InvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!invoice

  const [formData, setFormData] = useState({
    number: invoice?.number || `INV-${new Date().getFullYear()}-`,
    date: invoice?.date
      ? new Date(invoice.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    dueDate: invoice?.dueDate
      ? new Date(invoice.dueDate).toISOString().split("T")[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
    customerId: invoice?.customerId || "",
    quotationId: invoice?.quotationId || "",
    subtotal: invoice?.subtotal || 0,
    taxRate: invoice?.taxRate || 0.2,
    taxAmount: invoice?.taxAmount || 0,
    total: invoice?.total || 0,
    amountPaid: invoice?.amountPaid || 0,
    balance: invoice?.balance || 0,
    notes: invoice?.notes || "",
    status: invoice?.status || "Draft",
  })

  const [items, setItems] = useState<Item[]>(
    invoice?.items?.length
      ? invoice.items
      : [{ id: "", description: "", quantity: 1, price: 0, amount: 0 }]
  )

  // Recalculate financial values when items or tax rate changes
  useEffect(() => {
    // Calculate subtotal
    const newSubtotal = items.reduce((sum, item) => sum + item.amount, 0)

    // Calculate tax amount
    const newTaxAmount = newSubtotal * formData.taxRate

    // Calculate total
    const newTotal = newSubtotal + newTaxAmount

    // Calculate balance
    const newBalance = newTotal - formData.amountPaid

    setFormData((prev) => ({
      ...prev,
      subtotal: newSubtotal,
      taxAmount: newTaxAmount,
      total: newTotal,
      balance: newBalance,
    }))
  }, [items, formData.taxRate, formData.amountPaid])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target

    if (name === "amountPaid") {
      // When amount paid changes, recalculate balance
      const amountPaid = parseFloat(value) || 0
      setFormData((prev) => ({
        ...prev,
        [name]: amountPaid,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    const newItems = [...items]

    // Update the field
    if (field === "quantity" || field === "price") {
      newItems[index][field as "quantity" | "price"] = Number(value)

      // Auto-calculate amount
      newItems[index].amount = newItems[index].quantity * newItems[index].price
    } else if (field === "description") {
      newItems[index][field] = value as string
    }

    setItems(newItems)
  }

  const addItem = () => {
    setItems([
      ...items,
      { id: "", description: "", quantity: 1, price: 0, amount: 0 },
    ])
  }

  const removeItem = (index: number) => {
    if (items.length === 1) return
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formDataToSubmit = new FormData()

      // Add basic invoice fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, String(value))
      })

      // Add items
      items.forEach((item) => {
        formDataToSubmit.append("itemDescription", item.description)
        formDataToSubmit.append("itemQuantity", String(item.quantity))
        formDataToSubmit.append("itemPrice", String(item.price))
        formDataToSubmit.append("itemAmount", String(item.amount))
      })

      if (isEditing && invoice) {
        await updateInvoice(invoice.id, formDataToSubmit)
      } else {
        await createInvoice(formDataToSubmit)
      }

      onSuccess()
    } catch (err) {
      console.error("Failed to save invoice:", err)
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4 dark:text-white">
        {isEditing ? `Edit Invoice: ${invoice?.number}` : "Add New Invoice"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Invoice Number
            </label>
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="customerId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Customer
            </label>
            <select
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="quotationId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Based on Quotation (Optional)
            </label>
            <select
              id="quotationId"
              name="quotationId"
              value={formData.quotationId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">None</option>
              {quotations.map((quotation) => (
                <option key={quotation.id} value={quotation.id}>
                  {quotation.number}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Items
            </label>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Item
            </button>
          </div>

          <div className="mt-2 border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        placeholder="Item description"
                        required
                        className="w-full border-0 bg-transparent focus:ring-0 dark:text-white"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        placeholder="Qty"
                        required
                        min="0"
                        step="0.01"
                        className="w-full border-0 bg-transparent focus:ring-0 dark:text-white"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(index, "price", e.target.value)
                        }
                        placeholder="Price"
                        required
                        min="0"
                        step="0.01"
                        className="w-full border-0 bg-transparent focus:ring-0 dark:text-white"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length <= 1}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="taxRate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tax Rate
            </label>
            <input
              type="number"
              id="taxRate"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="amountPaid"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Amount Paid
            </label>
            <input
              type="number"
              id="amountPaid"
              name="amountPaid"
              value={formData.amountPaid}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>

        <div className="border-t pt-4 flex justify-between">
          <div>{error && <p className="text-red-500 text-sm">{error}</p>}</div>

          <div className="flex flex-col space-y-1 text-right">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Subtotal:
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(formData.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Tax ({(formData.taxRate * 100).toFixed(0)}%):
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(formData.taxAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Total:
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(formData.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Amount Paid:
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(formData.amountPaid)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-700 dark:text-gray-300">Balance:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(formData.balance)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Invoice"
              : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  )
}
