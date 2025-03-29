'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Modal from '@/app/components/modal'
import quotations from '@/app/data/data.json'

export default function DeleteQuotation({ params }) {
  const router = useRouter()
  const [quotation, setQuotation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    // Find the quotation by ID
    const found = quotations.data.find(q => q.id === parseInt(params.id))
    setQuotation(found)
    setLoading(false)
  }, [params.id])

  const handleDelete = () => {
    // In a real app, you would call an API to delete the quotation
    // For now, we'll just simulate a successful deletion
    
    // After deletion, redirect to the quotations list
    router.push('/quotations')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-lg text-gray-300">Loading...</p>
      </div>
    )
  }

  if (!quotation) {
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
    <>
      {showConfirmation && (
        <Modal 
          Title="Delete Quotation" 
          Message={`Are you sure you want to delete quotation #${quotation.id} for ${quotation.customer.name}? This action cannot be undone.`} 
          btnActionChar="Delete" 
          btnCancelChar="Cancel"
        />
      )}
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-white">Delete Quotation</h1>
            <p className="mt-2 text-sm text-gray-300">
              Review the quotation details before deleting.
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
              type="button"
              onClick={() => setShowConfirmation(true)}
              className="block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            >
              Delete Quotation
            </button>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="overflow-hidden bg-gray-800 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-white">Quotation Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-300">Details about quotation #{quotation.id}</p>
            </div>
            <div className="border-t border-gray-700">
              <dl>
                <div className="bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-300">Customer</dt>
                  <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">{quotation.customer.name}</dd>
                </div>
                <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-300">Date</dt>
                  <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">{quotation.date}</dd>
                </div>
                <div className="bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-300">Status</dt>
                  <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">{quotation.status}</dd>
                </div>
                <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-300">Items</dt>
                  <dd className="mt-1 text-sm text-white sm:col-span-2 sm:mt-0">
                    <ul className="divide-y divide-gray-700 rounded-md border border-gray-700">
                      {quotation.items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex w-0 flex-1 items-center">
                            <span className="ml-2 w-0 flex-1 truncate">{item.item} - {item.description}</span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className="font-medium">${item.price.toFixed(2)} × {item.qty}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}