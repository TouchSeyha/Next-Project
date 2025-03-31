import { Invoice } from "../app/types/invoice";
import { Quotation } from "../app/types/quotation";
import { Customer } from "../app/types/invoice";

export type RevenueData = {
  month: string;
  revenue: number;
};

export type StatusData = {
  status: string;
  value: number;
};

export type CustomerData = {
  name: string;
  total: number;
};

export type ComparisonData = {
  month: string;
  invoices: number;
  quotations: number;
};

export type BalanceData = {
  range: string;
  amount: number;
};

export type DashboardStats = {
  totalInvoices: number;
  totalQuotations: number;
  totalCustomers: number;
  totalRevenue: number;
  outstandingBalance: number;
  averageInvoiceValue: number;
};

/**
 * Calculates dashboard statistics from invoice, quotation, and customer data
 */
export function calculateDashboardStats(
  invoices: Invoice[],
  quotations: Quotation[],
  customers: Customer[]
): DashboardStats {
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const outstandingBalance = invoices.reduce(
    (sum, inv) => sum + inv.balance,
    0
  );

  return {
    totalInvoices: invoices.length,
    totalQuotations: quotations.length,
    totalCustomers: customers.length,
    totalRevenue,
    outstandingBalance,
    averageInvoiceValue:
      invoices.length > 0 ? totalRevenue / invoices.length : 0,
  };
}

/**
 * Prepares all chart data from invoice, quotation, and customer data
 */
export function prepareChartData(invoices: Invoice[], quotations: Quotation[]) {
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
  ];
  const today = new Date();

  // Prepare revenue data
  const revenueData = prepareRevenueData(invoices, monthLabels, today);

  // Prepare status distribution data
  const statusData = prepareStatusData(invoices);

  // Prepare top customers data
  const customerData = prepareCustomerData(invoices);

  // Prepare monthly comparison data
  const comparisonData = prepareComparisonData(
    invoices,
    quotations,
    monthLabels,
    today
  );

  // Prepare balance by due date data
  const balanceData = prepareBalanceData(invoices, today);

  return {
    revenueData,
    statusData,
    customerData,
    comparisonData,
    balanceData,
  };
}

/**
 * Prepares revenue over time chart data
 */
function prepareRevenueData(
  invoices: Invoice[],
  monthLabels: string[],
  today: Date
): RevenueData[] {
  const monthlyRevenue = Array(6).fill(0);

  invoices.forEach((invoice) => {
    const invDate = new Date(invoice.date);
    const monthDiff =
      today.getMonth() -
      invDate.getMonth() +
      12 * (today.getFullYear() - invDate.getFullYear());
    if (monthDiff >= 0 && monthDiff < 6) {
      monthlyRevenue[5 - monthDiff] += invoice.total;
    }
  });

  return Array(6)
    .fill(null)
    .map((_, idx) => {
      const monthIndex = (today.getMonth() - 5 + idx) % 12;
      return {
        month: monthLabels[monthIndex < 0 ? monthIndex + 12 : monthIndex],
        revenue: monthlyRevenue[idx],
      };
    });
}

/**
 * Prepares invoice status distribution chart data
 */
function prepareStatusData(invoices: Invoice[]): StatusData[] {
  const statusCounts: Record<string, number> = {};

  invoices.forEach((invoice) => {
    statusCounts[invoice.status] = (statusCounts[invoice.status] || 0) + 1;
  });

  return Object.entries(statusCounts).map(([status, value]) => ({
    status,
    value,
  }));
}

/**
 * Prepares top customers by revenue chart data
 */
function prepareCustomerData(invoices: Invoice[]): CustomerData[] {
  const customerRevenue: Record<string, number> = {};

  invoices.forEach((invoice) => {
    const customerName = invoice.customer.name;
    customerRevenue[customerName] =
      (customerRevenue[customerName] || 0) + invoice.total;
  });

  return Object.entries(customerRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, total]) => ({ name, total }));
}

/**
 * Prepares monthly invoice vs quotation comparison chart data
 */
function prepareComparisonData(
  invoices: Invoice[],
  quotations: Quotation[],
  monthLabels: string[],
  today: Date
): ComparisonData[] {
  const monthlyInvoices = Array(6).fill(0);
  const monthlyQuotations = Array(6).fill(0);

  invoices.forEach((invoice) => {
    const invDate = new Date(invoice.date);
    const monthDiff =
      today.getMonth() -
      invDate.getMonth() +
      12 * (today.getFullYear() - invDate.getFullYear());
    if (monthDiff >= 0 && monthDiff < 6) {
      monthlyInvoices[5 - monthDiff] += 1;
    }
  });

  quotations.forEach((quotation) => {
    const quoteDate = new Date(quotation.date);
    const monthDiff =
      today.getMonth() -
      quoteDate.getMonth() +
      12 * (today.getFullYear() - quoteDate.getFullYear());
    if (monthDiff >= 0 && monthDiff < 6) {
      monthlyQuotations[5 - monthDiff] += 1;
    }
  });

  return Array(6)
    .fill(null)
    .map((_, idx) => {
      const monthIndex = (today.getMonth() - 5 + idx) % 12;
      return {
        month: monthLabels[monthIndex < 0 ? monthIndex + 12 : monthIndex],
        invoices: monthlyInvoices[idx],
        quotations: monthlyQuotations[idx],
      };
    });
}

/**
 * Prepares outstanding balance by days chart data
 */
function prepareBalanceData(invoices: Invoice[], today: Date): BalanceData[] {
  const dueDateGroups: Record<string, number> = {
    Current: 0,
    "1-30 Days": 0,
    "31-60 Days": 0,
    "61-90 Days": 0,
    "90+ Days": 0,
  };

  invoices.forEach((invoice) => {
    if (invoice.balance <= 0) return;

    const dueDate = new Date(invoice.dueDate);
    const daysDiff = Math.floor(
      (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 0) {
      dueDateGroups["Current"] += invoice.balance;
    } else if (daysDiff <= 30) {
      dueDateGroups["1-30 Days"] += invoice.balance;
    } else if (daysDiff <= 60) {
      dueDateGroups["31-60 Days"] += invoice.balance;
    } else if (daysDiff <= 90) {
      dueDateGroups["61-90 Days"] += invoice.balance;
    } else {
      dueDateGroups["90+ Days"] += invoice.balance;
    }
  });

  return Object.entries(dueDateGroups).map(([range, amount]) => ({
    range,
    amount,
  }));
}
