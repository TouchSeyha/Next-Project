"use client"

import { useState } from "react"
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline"
import { deleteQuotation } from "@/lib/quotations"
import { printQuotation, formatDate, formatCurrency } from "@/lib/print"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"
import QuotationDetailModal from "./quotationDetailModal"

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

interface QuotationTableProps {
  quotations: Quotation[]
  customers: Customer[]
  onEdit: (quotation: Quotation) => void
  onDelete: () => void
}

export function QuotationTable({
  quotations,
  onEdit,
  onDelete,
}: QuotationTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(
    null
  )
  const [quotationToView, setQuotationToView] = useState<Quotation | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const openDeleteModal = (quotation: Quotation, e: React.MouseEvent) => {
    e.stopPropagation()
    setQuotationToDelete(quotation)
  }

  const closeDeleteModal = () => {
    setQuotationToDelete(null)
    setDeleteError(null)
  }

  const handleConfirmDelete = async () => {
    if (!quotationToDelete) return

    const id = quotationToDelete.id
    setIsDeleting(id)
    setDeleteError(null)

    try {
      await deleteQuotation(id)
      closeDeleteModal()
      onDelete()
    } catch (error) {
      console.error("Failed to delete quotation:", error)
      setDeleteError(
        error instanceof Error ? error.message : "Unknown error occurred"
      )
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditClick = (quotation: Quotation, e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(quotation)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleViewDetails = (quotation: Quotation, e: React.MouseEvent) => {
    e.stopPropagation()
    setQuotationToView(quotation)
  }

  const closeDetailModal = () => {
    setQuotationToView(null)
  }

  const handlePrint = (quotation: Quotation, e: React.MouseEvent) => {
    e.stopPropagation()
    printQuotation(quotation)
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border dark:border-gray-700 backdrop-brightness-50">
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
                Valid Until
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
            {quotations.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No quotations found
                </td>
              </tr>
            ) : (
              quotations.map((quotation) => (
                <tr
                  key={quotation.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {quotation.number}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(quotation.date)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(quotation.validUntil)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {quotation.customer.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(quotation.total)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {quotation.status}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-4">
                      <button
                        onClick={(e) => handleViewDetails(quotation, e)}
                        title="View Details"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => handlePrint(quotation, e)}
                        title="Print Quotation"
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      >
                        <PrinterIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => handleEditClick(quotation, e)}
                        title="Edit Quotation"
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => openDeleteModal(quotation, e)}
                        disabled={isDeleting === quotation.id}
                        title="Delete Quotation"
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                      >
                        {isDeleting === quotation.id ? (
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
        isOpen={quotationToDelete !== null}
        title="Delete Quotation"
        message={`Are you sure you want to delete quotation ${quotationToDelete?.number}? This action cannot be undone.`}
        isDeleting={isDeleting === quotationToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        error={deleteError}
      />

      <QuotationDetailModal
        quotation={quotationToView}
        isOpen={quotationToView !== null}
        onClose={closeDetailModal}
      />
    </>
  )
}
