"use client"

import { useState } from "react"
import {
  CheckCircleIcon,
  DocumentTextIcon,
  ScaleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"

export default function Agreements() {
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const agreementSections = [
    {
      title: "Terms of Service",
      icon: <DocumentTextIcon className="h-8 w-8 text-indigo-500" />,
      content:
        "By using Touch Seyha System for invoice and quotation management, you agree to abide by our terms and conditions. Our service is designed to help businesses manage their financial documents efficiently while maintaining compliance with relevant regulations.",
    },
    {
      title: "Data Usage Agreement",
      icon: <ScaleIcon className="h-8 w-8 text-green-500" />,
      content:
        "We process your data according to strict guidelines to ensure security and compliance. Your business data, including customer information and transaction details, will only be used for the purposes explicitly stated in our terms and with your consent.",
    },
    {
      title: "License Agreement",
      icon: <CheckCircleIcon className="h-8 w-8 text-blue-500" />,
      content:
        "Touch Seyha System grants you a limited, non-exclusive license to use our software for your business operations. This license is subject to your continued compliance with our terms and the timely payment of any applicable subscription fees.",
    },
    {
      title: "Service Level Agreement",
      icon: <ClockIcon className="h-8 w-8 text-orange-500" />,
      content:
        "We strive to maintain 99.9% uptime for our invoice and quotation management system. In the event of scheduled maintenance, we will provide advance notice. For any unplanned disruptions, our team will work to restore service as quickly as possible.",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Legal Agreements
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Please review the following agreements that govern your use of Touch
          Seyha System for invoice and quotation management.
        </p>
      </div>

      {/* Agreement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {agreementSections.map((section, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
          >
            <div className="flex items-start mb-4">
              {section.icon}
              <h2 className="text-xl font-semibold ml-3 dark:text-white">
                {section.title}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {section.content}
            </p>
            <div className="mt-4 text-right">
              <button className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium">
                Read Full Agreement
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Guidelines */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Usage Guidelines
        </h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <p>
            When using Touch Seyha System for invoice and quotation management,
            please adhere to the following guidelines:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Do not use our system for any illegal activities or to store
              prohibited content
            </li>
            <li>
              Maintain the confidentiality of your account credentials and
              report any suspicious activity
            </li>
            <li>
              Respect the intellectual property rights associated with our
              software
            </li>
            <li>
              Do not attempt to reverse-engineer the system or bypass security
              measures
            </li>
            <li>
              Report any bugs or security vulnerabilities to our team promptly
            </li>
          </ul>
        </div>
      </div>

      {/* Agreement Acceptance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"></div>
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Accept Agreements
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        To continue using Touch Seyha System, please review and accept our terms
        and conditions.
      </p>

      <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor="terms"
            className="font-medium text-gray-700 dark:text-gray-300"
          >
            I have read and agree to the Terms of Service, Privacy Policy, and
            all related agreements
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!acceptedTerms}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            acceptedTerms
              ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Accept & Continue
        </button>
      </div>
    </div>
  )
}
