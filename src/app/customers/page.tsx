"use client"

import { useState, useEffect } from "react"
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline"
import CustomerTable from "./customerTable"
import { Button, Input } from "@headlessui/react"
import CustomerTableSkeleton from "./customerTableSkeleton"
import { getCustomers } from "../../lib/customers"
import CustomerForm from "./customerForm"
import { Customer } from "../types/customer"

export default function CustomersPage() {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true)
      try {
        const data = await getCustomers()
        setCustomers(data as Customer[])
      } catch (error) {
        console.error("Failed to load customers:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [refreshKey])

  const handleCustomerAdded = () => {
    setIsFormVisible(false)
    setEditingCustomer(null)
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsFormVisible(true)
  }

  const handleDeleteCustomer = () => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const handleCancelForm = () => {
    setIsFormVisible(false)
    setEditingCustomer(null)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase()
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      (customer.phone && customer.phone.toLowerCase().includes(search)) ||
      (customer.address && customer.address.toLowerCase().includes(search))
    )
  })

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all customers in your account
          </p>
        </div>
        <div className="mt-4 sm:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
          <Input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 sm:w-72 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
          />
          {editingCustomer ? (
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
                  Add Customer
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {isFormVisible && (
        <div
          className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          id="customer-form"
        >
          <CustomerForm
            onSuccess={handleCustomerAdded}
            customer={editingCustomer}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <CustomerTableSkeleton />
        ) : (
          <CustomerTable
            customers={filteredCustomers}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        )}
      </div>
    </div>
  )
}
