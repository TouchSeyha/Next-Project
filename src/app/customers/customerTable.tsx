"use client"

import { useRouter } from "next/navigation"
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { deleteCustomer } from "../actions/customers"
import { Customer } from "../types/customer"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"

interface CustomerTableProps {
  customers: Customer[]
  onEdit: (customer: Customer) => void
  onDelete: () => void // This is the callback to refresh the list
}

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  )
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  const openDeleteModal = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation()
    setCustomerToDelete(customer)
  }

  const closeDeleteModal = () => {
    setCustomerToDelete(null)
    setDeleteError(null)
  }

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return

    const id = customerToDelete.id
    setIsDeleting(id)
    setDeleteError(null)

    try {
      // Call the server action to delete the customer
      await deleteCustomer(id)

      // Close the modal
      closeDeleteModal()

      // Call the callback to refresh the customer list in the parent
      onDelete()
    } catch (error) {
      console.error("Failed to delete customer:", error)
      // Set error message to display in the modal
      setDeleteError(
        error instanceof Error ? error.message : "Unknown error occurred"
      )
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditClick = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(customer)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleRowClick = (id: string) => {
    router.push(`/customers/${id}`)
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
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Phone
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Address
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
              >
                Created
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
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => handleRowClick(customer.id)}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {customer.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {customer.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {customer.phone
                      ? `${customer.phone.slice(0, 3)}-${customer.phone.slice(
                          3,
                          6
                        )}-${customer.phone.slice(6)}`
                      : "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {customer.address || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-4">
                      <button
                        onClick={(e) => handleEditClick(customer, e)}
                        title="Edit Customer"
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => openDeleteModal(customer, e)}
                        disabled={isDeleting === customer.id}
                        title="Delete Customer"
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                      >
                        {isDeleting === customer.id ? (
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
        isOpen={customerToDelete !== null}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.name}? This action cannot be undone.`}
        isDeleting={isDeleting === customerToDelete?.id}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        error={deleteError}
      />
    </>
  )
}
