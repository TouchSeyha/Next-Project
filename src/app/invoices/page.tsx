"use client"

import { useState, useEffect } from "react"
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { getInvoices, getCustomers, getQuotations } from "@/lib/invoices"
import { Button, Input } from "@headlessui/react"
import { InvoiceTable } from "./invoicesTable"
import { InvoiceForm } from "./invoicesForm"
import { Customer, Quotation, Invoice } from "../types/invoice"
import { sortOptions, sortAndFilterInvoices } from "../../utils/invoiceSorting"

export default function Invoices() {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<string>(sortOptions[0].value)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const invoiceData = await getInvoices()
        const customerData = await getCustomers()
        const quotationData = await getQuotations()

        setInvoices(invoiceData)
        setCustomers(customerData)
        setQuotations(quotationData)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [refreshKey])

  const handleInvoiceAdded = () => {
    setIsFormVisible(false)
    setEditingInvoice(null)
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setIsFormVisible(true)
  }

  const handleDeleteInvoice = () => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const handleCancelForm = () => {
    setIsFormVisible(false)
    setEditingInvoice(null)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value)
  }

  const filteredInvoices = sortAndFilterInvoices(invoices, sortOption, searchTerm)

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Invoices
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all invoices in your account
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-between w-full">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <Input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
            />
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full sm:w-auto p-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {editingInvoice ? (
            <Button
              onClick={handleCancelForm}
              className="inline-flex items-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 max-w-[200px] w-full sm:w-auto"
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
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 max-w-[200px] w-full sm:w-auto"
            >
              {isFormVisible ? (
                "Cancel"
              ) : (
                <>
                  <PlusIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  Add Invoice
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {isFormVisible && (
        <div
          className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          id="invoice-form"
        >
          <InvoiceForm
            onSuccess={handleInvoiceAdded}
            invoice={editingInvoice}
            customers={customers}
            quotations={quotations}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-center py-4">Loading invoices...</p>
        ) : (
          <InvoiceTable
            invoices={filteredInvoices}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
          />
        )}
      </div>
    </div>
  )
}
