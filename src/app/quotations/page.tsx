"use client"

import { useState, useEffect } from "react"
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { getQuotations, getCustomers } from "@/lib/quotations"
import { Button } from "@headlessui/react"
import { QuotationTable } from "./quotationTable"
import { QuotationForm } from "./quotationForm"
import { Customer, Quotation } from "../types/quotation"

export default function Quotations() {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false)
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(
    null
  )

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const quotationData = await getQuotations()
        const customerData = await getCustomers()
        setQuotations(quotationData)
        setCustomers(customerData)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [refreshKey])

  const handleQuotationAdded = (): void => {
    setIsFormVisible(false)
    setEditingQuotation(null)
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const handleEditQuotation = (quotation: Quotation): void => {
    setEditingQuotation(quotation)
    setIsFormVisible(true)
  }

  const handleDeleteQuotation = (): void => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const handleCancelForm = (): void => {
    setIsFormVisible(false)
    setEditingQuotation(null)
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quotations
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all quotations in your account
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {editingQuotation ? (
            <Button
              onClick={handleCancelForm}
              className="inline-flex items-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              <XMarkIcon
                className="-ml-0.5 mr-1.5 h-5 w-5"
                aria-hidden="true"
              />
              Cancel Edit
            </Button>
          ) : (
            <Button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isFormVisible ? (
                "Cancel"
              ) : (
                <>
                  <PlusIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  Add Quotation
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {isFormVisible && (
        <div
          className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          id="quotation-form"
        >
          <QuotationForm
            onSuccess={handleQuotationAdded}
            quotation={editingQuotation}
            customers={customers}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p>Loading quotations...</p>
        ) : (
          <QuotationTable
            quotations={quotations}
            customers={customers}
            onEdit={handleEditQuotation}
            onDelete={handleDeleteQuotation}
          />
        )}
      </div>
    </div>
  )
}
