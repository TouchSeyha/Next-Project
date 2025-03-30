"use client"

import { useState } from "react"
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline"
import { deleteInvoice } from "@/lib/invoices"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"
import InvoiceDetailModal from "./invoicesDetailModal"
import { Invoice } from "../types/invoice"

interface InvoiceTableProps {
  invoices: Invoice[]
  onEdit: (invoice: Invoice) => void
  onDelete: () => void
}

export function InvoiceTable({
  invoices,
  onEdit,
  onDelete,
}: InvoiceTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null)
  const [invoiceToView, setInvoiceToView] = useState<Invoice | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const openDeleteModal = (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation()
    setInvoiceToDelete(invoice)
  }

  const closeDeleteModal = () => {
    setInvoiceToDelete(null)
    setDeleteError(null)
  }

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return

    const id = invoiceToDelete.id
    setIsDeleting(id)
    setDeleteError(null)

    try {
      await deleteInvoice(id)
      closeDeleteModal()
      onDelete()
    } catch (error) {
      console.error("Failed to delete invoice:", error)
      setDeleteError(
        error instanceof Error ? error.message : "Unknown error occurred"
      )
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditClick = (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(invoice)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleViewDetails = (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation()
    setInvoiceToView(invoice)
  }

  const closeDetailModal = () => {
    setInvoiceToView(null)
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Number
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Due Date
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Balance
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {invoice.number}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {invoice.customer.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(invoice.total)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(invoice.balance)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {invoice.status}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-4">
                      <button
                        onClick={(e) => handleViewDetails(invoice, e)}
                        title="View Details"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => handleEditClick(invoice, e)}
                        title="Edit Invoice"
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => openDeleteModal(invoice, e)}
                        disabled={isDeleting === invoice.id}
                        title="Delete Invoice"
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                      >
                        {isDeleting === invoice.id ? (
                          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={invoiceToDelete !== null}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${invoiceToDelete?.number}? This action cannot be undone.`}
        isDeleting={isDeleting === invoiceToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        error={deleteError}
      />

      <InvoiceDetailModal
        invoice={invoiceToView}
        isOpen={invoiceToView !== null}
        onClose={closeDetailModal}
      />
    </>
  )
}
