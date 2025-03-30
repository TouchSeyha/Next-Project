'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import quotations from '@/app/data/data.json'

export default function EditQuotation({ params }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    id: '',
    date: '',
    customer: {
      id: '',
      name: ''
    },
    status: '',
    items: []
  })

  useEffect(() => {
    // Find the quotation by ID
    const found = quotations.data.find(q => q.id === parseInt(params.id))
    
    if (found) {
      setFormData(found)
    }
    
    setLoading(false)
  }, [params.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      // Handle nested fields like 'customer.name'
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'price' || field === 'qty' ? parseFloat(value) : value
    }
    
    setFormData({
      ...formData,
      items: updatedItems
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // In a real app, you would call an API to update the quotation
    // For now, we'll just simulate a successful update
    
    // After update, redirect to the quotations list
    router.push('/quotations')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-lg text-gray-300">Loading...</p>
      </div>
    )
  }

  if (!formData.id) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h1 className="text-2xl font-bold text-white mb-4">Quotation Not Found</h1>
        <p className="text-gray-300 mb-6">The quotation you're looking for doesn't exist.</p>
        <Link href="/quotations" 
              className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400">
          Back to Quotations
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">Edit Quotation</h1>
          <p className="mt-2 text-sm text-gray-300">
            Update the details for quotation #{formData.id}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <Link
            href="/quotations"
            className="block rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="edit-form"
            className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
          >
            Save Changes
          </button>
        </div>
      </div>

      <form id="edit-form" onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="date" className="block text-sm font-medium text-gray-300">
                Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm text-white sm:text-sm p-2"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-300">
                Status
              </label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm text-white sm:text-sm p-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Revise">Revise</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="customer.id" className="block text-sm font-medium text-gray-300">
                Customer ID
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="customer.id"
                  id="customer.id"
                  value={formData.customer.id}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm text-white sm:text-sm p-2"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="customer.name" className="block text-sm font-medium text-gray-300">
                Customer Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="customer.name"
                  id="customer.name"
                  value={formData.customer.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm text-white sm:text-sm p-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-white mb-4">Items</h2>
          
          {formData.items.map((item, index) => (
            <div key={item.id} className="border border-gray-700 rounded-md p-4 mb-4">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-300">
                    Item ID
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={item.id}
                      onChange={(e) => handleItemChange(index, 'id', e.target.value)}
                      className="block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm text-white sm:text-sm p-2"
                      disabled
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Item Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                      className="block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm text-white sm:text-sm p-2"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Description
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm text-white sm:text-sm p-2"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-300">
                    Price
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      className="block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm text-white sm:text-sm p-2"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-300">
                    Quantity
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      className="block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm text-white sm:text-sm p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  )
}