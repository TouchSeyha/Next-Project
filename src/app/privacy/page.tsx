"use client"

import { useState } from "react"
import {
  ShieldCheckIcon,
  LockClosedIcon,
  DocumentTextIcon,
  UserIcon,
} from "@heroicons/react/24/outline"

export default function PrivacyPage() {
  const [activeTab, setActiveTab] = useState("dataCollection")

  const tabs = [
    {
      id: "dataCollection",
      label: "Data Collection",
      icon: <DocumentTextIcon className="h-5 w-5" />,
    },
    {
      id: "dataProtection",
      label: "Data Protection",
      icon: <ShieldCheckIcon className="h-5 w-5" />,
    },
    {
      id: "userRights",
      label: "Your Rights",
      icon: <UserIcon className="h-5 w-5" />,
    },
    {
      id: "security",
      label: "Security",
      icon: <LockClosedIcon className="h-5 w-5" />,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          We are committed to protecting your privacy and ensuring your data is
          handled securely and transparently.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        {activeTab === "dataCollection" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Data Collection
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Touch Seyha System collects information necessary for invoice and
              quotation management:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                Business and customer information for invoice and quotation
                creation
              </li>
              <li>
                Transaction data including payments, products, and services
              </li>
              <li>Usage information to improve our system functionality</li>
              <li>
                Account information required for authentication and access
                control
              </li>
            </ul>
          </div>
        )}

        {activeTab === "dataProtection" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Data Protection
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We implement robust measures to protect your data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>End-to-end encryption for all sensitive financial data</li>
              <li>Regular security audits and compliance checks</li>
              <li>Strict data access controls and authentication protocols</li>
              <li>
                Data retention policies that limit storage to necessary periods
                only
              </li>
            </ul>
          </div>
        )}

        {activeTab === "userRights" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              As a user of our system, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                Access all data we have collected about you and your business
              </li>
              <li>Request correction of inaccurate information</li>
              <li>Export your data in common formats for portability</li>
              <li>Request deletion of your data when legally permissible</li>
              <li>Opt out of certain data collection practices</li>
            </ul>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our security measures include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>SSL/TLS encryption for all data transmission</li>
              <li>Secure cloud infrastructure with redundancy and failover</li>
              <li>Regular security patches and updates</li>
              <li>Two-factor authentication options</li>
              <li>Automated threat detection and prevention</li>
            </ul>
          </div>
        )}
      </div>

      {/* Contact Form */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Contact Us About Privacy
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          If you have any questions about how we handle your data, please reach
          out to us.
        </p>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              placeholder="Your privacy question or concern..."
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
