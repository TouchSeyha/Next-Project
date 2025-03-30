"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { getInvoices } from "@/lib/invoices"
import { getQuotations } from "@/lib/quotations"
import { getCustomers } from "@/lib/customers"
import { formatCurrency } from "@/lib/print"
import { Invoice } from "./types/invoice"
import { Quotation } from "./types/quotation"
import { Customer } from "./types/invoice"

type RevenueData = {
  month: string
  revenue: number
}

type StatusData = {
  status: string
  value: number
}

type CustomerData = {
  name: string
  total: number
}

type ComparisonData = {
  month: string
  invoices: number
  quotations: number
}

type BalanceData = {
  range: string
  amount: number
}

type Stats = {
  totalInvoices: number
  totalQuotations: number
  totalCustomers: number
  totalRevenue: number
  outstandingBalance: number
  averageInvoiceValue: number
}

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [stats, setStats] = useState<Stats>({
    totalInvoices: 0,
    totalQuotations: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    outstandingBalance: 0,
    averageInvoiceValue: 0,
  })

  // Chart data states
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [statusData, setStatusData] = useState<StatusData[]>([])
  const [customerData, setCustomerData] = useState<CustomerData[]>([])
  const [monthlyComparisonData, setMonthlyComparisonData] = useState<
    ComparisonData[]
  >([])
  const [balanceData, setBalanceData] = useState<BalanceData[]>([])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Fetch data
        const invoiceData = await getInvoices()
        const quotationData = await getQuotations()
        const customerData = await getCustomers()

        setInvoices(invoiceData)
        setQuotations(quotationData)
        setCustomers(customerData)

        // Calculate summary stats
        const totalRevenue = invoiceData.reduce(
          (sum, inv) => sum + inv.total,
          0
        )
        const outstandingBalance = invoiceData.reduce(
          (sum, inv) => sum + inv.balance,
          0
        )

        setStats({
          totalInvoices: invoiceData.length,
          totalQuotations: quotationData.length,
          totalCustomers: customerData.length,
          totalRevenue,
          outstandingBalance,
          averageInvoiceValue:
            invoiceData.length > 0 ? totalRevenue / invoiceData.length : 0,
        })

        // Process data for charts
        prepareChartData(invoiceData, quotationData, customerData)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const prepareChartData = (
    invoices: Invoice[],
    quotations: Quotation[],
    customers: Customer[]
  ): void => {
    // 1. Revenue Over Time (last 6 months)
    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    const today = new Date()
    const monthlyRevenue = Array(6).fill(0)

    invoices.forEach((invoice) => {
      const invDate = new Date(invoice.date)
      const monthDiff =
        today.getMonth() -
        invDate.getMonth() +
        12 * (today.getFullYear() - invDate.getFullYear())
      if (monthDiff >= 0 && monthDiff < 6) {
        monthlyRevenue[5 - monthDiff] += invoice.total
      }
    })

    const revenueOverTime = Array(6)
      .fill()
      .map((_, idx) => {
        const monthIndex = (today.getMonth() - 5 + idx) % 12
        return {
          month: monthLabels[monthIndex < 0 ? monthIndex + 12 : monthIndex],
          revenue: monthlyRevenue[idx],
        }
      })
    setRevenueData(revenueOverTime)

    // 2. Invoice Status Distribution
    const statusCounts = {}
    invoices.forEach((invoice) => {
      statusCounts[invoice.status] = (statusCounts[invoice.status] || 0) + 1
    })

    const statusDistribution = Object.entries(statusCounts).map(
      ([status, count]) => ({
        status,
        value: count,
      })
    )
    setStatusData(statusDistribution)

    // 3. Top Customers by Revenue
    const customerRevenue = {}
    invoices.forEach((invoice) => {
      const customerName = invoice.customer.name
      customerRevenue[customerName] =
        (customerRevenue[customerName] || 0) + invoice.total
    })

    const topCustomers = Object.entries(customerRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, total]) => ({ name, total }))
    setCustomerData(topCustomers)

    // 4. Monthly Comparison: Invoices vs Quotations
    const monthlyInvoices = Array(6).fill(0)
    const monthlyQuotations = Array(6).fill(0)

    invoices.forEach((invoice) => {
      const invDate = new Date(invoice.date)
      const monthDiff =
        today.getMonth() -
        invDate.getMonth() +
        12 * (today.getFullYear() - invDate.getFullYear())
      if (monthDiff >= 0 && monthDiff < 6) {
        monthlyInvoices[5 - monthDiff] += 1
      }
    })

    quotations.forEach((quotation) => {
      const quoteDate = new Date(quotation.date)
      const monthDiff =
        today.getMonth() -
        quoteDate.getMonth() +
        12 * (today.getFullYear() - quoteDate.getFullYear())
      if (monthDiff >= 0 && monthDiff < 6) {
        monthlyQuotations[5 - monthDiff] += 1
      }
    })

    const comparisonData = Array(6)
      .fill()
      .map((_, idx) => {
        const monthIndex = (today.getMonth() - 5 + idx) % 12
        return {
          month: monthLabels[monthIndex < 0 ? monthIndex + 12 : monthIndex],
          invoices: monthlyInvoices[idx],
          quotations: monthlyQuotations[idx],
        }
      })
    setMonthlyComparisonData(comparisonData)

    // 5. Outstanding Balance by Due Date
    const dueDateGroups = {
      Current: 0,
      "1-30 Days": 0,
      "31-60 Days": 0,
      "61-90 Days": 0,
      "90+ Days": 0,
    }

    invoices.forEach((invoice) => {
      if (invoice.balance <= 0) return

      const dueDate = new Date(invoice.dueDate)
      const daysDiff = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))

      if (daysDiff <= 0) {
        dueDateGroups["Current"] += invoice.balance
      } else if (daysDiff <= 30) {
        dueDateGroups["1-30 Days"] += invoice.balance
      } else if (daysDiff <= 60) {
        dueDateGroups["31-60 Days"] += invoice.balance
      } else if (daysDiff <= 90) {
        dueDateGroups["61-90 Days"] += invoice.balance
      } else {
        dueDateGroups["90+ Days"] += invoice.balance
      }
    })

    const balanceByDueDate = Object.entries(dueDateGroups).map(
      ([range, amount]) => ({
        range,
        amount,
      })
    )
    setBalanceData(balanceByDueDate)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ]
  const STATUS_COLORS = {
    Paid: "#00C49F",
    Pending: "#FFBB28",
    Draft: "#0088FE",
    Overdue: "#FF8042",
    Cancelled: "#8884d8",
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Business Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase">
            Total Revenue
          </h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            {formatCurrency(stats.totalRevenue)}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            From {stats.totalInvoices} invoices
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase">
            Outstanding Balance
          </h3>
          <p className="text-2xl font-bold text-orange-500 dark:text-orange-400 mt-2">
            {formatCurrency(stats.outstandingBalance)}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            Awaiting payment
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase">
            Customers
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            {stats.totalCustomers}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            Total active customers
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Revenue Over Time
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis
                stroke="#9CA3AF"
                tickFormatter={(value) => formatCurrency(value).split(".")[0]}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                  color: "#F9FAFB",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#6366F1"
                fill="#6366F1"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Invoice Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Invoice Status
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        STATUS_COLORS[entry.status] ||
                        COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Customers by Revenue
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customerData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  stroke="#9CA3AF"
                  tickFormatter={(value) => formatCurrency(value).split(".")[0]}
                />
                <YAxis type="category" dataKey="name" stroke="#9CA3AF" />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    color: "#F9FAFB",
                  }}
                />
                <Bar dataKey="total" name="Revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Comparison: Invoices vs Quotations
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyComparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                  color: "#F9FAFB",
                }}
              />
              <Legend />
              <Bar dataKey="invoices" name="Invoices" fill="#6366F1" />
              <Bar dataKey="quotations" name="Quotations" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Outstanding Balance */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Outstanding Balance by Days
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={balanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#9CA3AF" />
              <YAxis
                stroke="#9CA3AF"
                tickFormatter={(value) => formatCurrency(value).split(".")[0]}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                  color: "#F9FAFB",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                name="Outstanding Balance"
                stroke="#EF4444"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
