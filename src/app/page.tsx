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
import {
  DashboardStats,
  StatusData,
  CustomerData,
  RevenueData,
  ComparisonData,
  BalanceData,
  calculateDashboardStats,
  prepareChartData
} from "@/utils/dashboardData"
import {
  CHART_COLORS,
  STATUS_COLORS,
  PIE_COLORS,
  CustomTooltip,
  chartCommonProps
} from "@/utils/chartConfig"

export default function Home() {
  // State for data
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // State for dashboard stats and charts
  const [stats, setStats] = useState<DashboardStats>({
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
  const [monthlyComparisonData, setMonthlyComparisonData] = useState<ComparisonData[]>([])
  const [balanceData, setBalanceData] = useState<BalanceData[]>([])

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Fetch data
        const invoiceData = await getInvoices()
        const quotationData = await getQuotations()
        const customerData = await getCustomers()

        // Update state with raw data
        setInvoices(invoiceData)
        setQuotations(quotationData)
        setCustomers(customerData)

        // Calculate dashboard statistics
        const dashboardStats = calculateDashboardStats(
          invoiceData,
          quotationData,
          customerData
        )
        setStats(dashboardStats)

        // Process data for charts
        const chartData = prepareChartData(invoiceData, quotationData, customerData)
        setRevenueData(chartData.revenueData)
        setStatusData(chartData.statusData)
        setCustomerData(chartData.customerData)
        setMonthlyComparisonData(chartData.comparisonData)
        setBalanceData(chartData.balanceData)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute top-0 w-full h-full rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute top-0 w-full h-full rounded-full border-8 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Loading Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400">Please wait while we prepare your analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Business Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Overview of your invoices, quotations, and customer data
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="transform transition-all hover:scale-105 duration-300 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Revenue
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(stats.totalRevenue)}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
                  <span className="inline-block h-4 w-4 text-green-500 mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </span>
                  From {stats.totalInvoices} invoices
                </p>
              </div>
            </div>
          </div>

          <div className="transform transition-all hover:scale-105 duration-300 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Outstanding Balance
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-orange-500 dark:text-orange-400">
                    {formatCurrency(stats.outstandingBalance)}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Awaiting payment
                </p>
              </div>
            </div>
          </div>

          <div className="transform transition-all hover:scale-105 duration-300 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customers
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.totalCustomers}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Total active customers
                </p>
              </div>
            </div>
          </div>

          <div className="transform transition-all hover:scale-105 duration-300 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Average Invoice
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {formatCurrency(stats.averageInvoiceValue)}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Per invoice value
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-all duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Revenue Over Time
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={chartCommonProps.areaChart.margin}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary.main} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary.main} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...chartCommonProps.cartesianGrid} />
                <XAxis dataKey="month" {...chartCommonProps.xAxis} />
                <YAxis {...chartCommonProps.yAxis} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke={CHART_COLORS.primary.main}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two Column Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Invoice Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-all duration-200">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Invoice Status Distribution
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={{ stroke: "#9CA3AF", strokeWidth: 1 }}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] ||
                          PIE_COLORS[index % PIE_COLORS.length]
                        }
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "transparent" }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    {...chartCommonProps.legend}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-all duration-200">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Top Customers by Revenue
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={customerData}
                  layout="vertical"
                  margin={chartCommonProps.barChart.margin}
                >
                  <CartesianGrid {...chartCommonProps.cartesianGrid} />
                  <XAxis
                    type="number"
                    {...chartCommonProps.xAxis}
                    tickFormatter={(value) => formatCurrency(value).split(".")[0]}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#9CA3AF"
                    tick={{ fontSize: 12 }}
                    width={100}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="total"
                    name="Revenue"
                    radius={[0, 4, 4, 0]}
                  >
                    {customerData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS.success.main}
                        opacity={0.7 + (0.3 * (1 - index / customerData.length))}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-all duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Monthly Comparison: Invoices vs Quotations
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyComparisonData}
                margin={chartCommonProps.barChart.margin}
              >
                <CartesianGrid {...chartCommonProps.cartesianGrid} />
                <XAxis
                  dataKey="month"
                  {...chartCommonProps.xAxis}
                />
                <YAxis
                  {...chartCommonProps.yAxis}
                  tickFormatter={(value) => value.toString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
                <Bar
                  dataKey="invoices"
                  name="Invoices"
                  fill={CHART_COLORS.primary.main}
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="quotations"
                  name="Quotations"
                  fill={CHART_COLORS.warning.main}
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-all duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Outstanding Balance by Days
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={balanceData}
                margin={chartCommonProps.lineChart.margin}
              >
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={CHART_COLORS.primary.main} stopOpacity={1} />
                    <stop offset="100%" stopColor={CHART_COLORS.danger.main} stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...chartCommonProps.cartesianGrid} />
                <XAxis
                  dataKey="range"
                  {...chartCommonProps.xAxis}
                />
                <YAxis
                  {...chartCommonProps.yAxis}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Outstanding Balance"
                  stroke="url(#colorBalance)"
                  strokeWidth={3}
                  dot={{ stroke: CHART_COLORS.danger.main, fill: 'white', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: CHART_COLORS.danger.main }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
