import { Invoice } from "../app/types/invoice";

// Define sort options
export type SortOption = {
  value: string;
  label: string;
  field: keyof Invoice | null;
  direction: "asc" | "desc";
};

export const sortOptions: SortOption[] = [
  {
    value: "numberAsc",
    label: "Number (A-Z)",
    field: "number",
    direction: "asc",
  },
  {
    value: "numberDesc",
    label: "Number (Z-A)",
    field: "number",
    direction: "desc",
  },
  {
    value: "dateDesc",
    label: "Newest First",
    field: "date",
    direction: "desc",
  },
  { value: "dateAsc", label: "Oldest First", field: "date", direction: "asc" },
  {
    value: "dueDateAsc",
    label: "Due Date (Ascending)",
    field: "dueDate",
    direction: "asc",
  },
  {
    value: "dueDateDesc",
    label: "Due Date (Descending)",
    field: "dueDate",
    direction: "desc",
  },
  {
    value: "totalDesc",
    label: "Total (High to Low)",
    field: "total",
    direction: "desc",
  },
  {
    value: "totalAsc",
    label: "Total (Low to High)",
    field: "total",
    direction: "asc",
  },
  {
    value: "statusAsc",
    label: "Status (A-Z)",
    field: "status",
    direction: "asc",
  },
  {
    value: "statusDesc",
    label: "Status (Z-A)",
    field: "status",
    direction: "desc",
  },
];

export function sortInvoices(
  invoices: Invoice[],
  sortOption: string
): Invoice[] {
  const selectedSort = sortOptions.find(
    (option) => option.value === sortOption
  );

  if (!selectedSort || !selectedSort.field) return invoices;

  return [...invoices].sort((a, b) => {
    const fieldA = a[selectedSort.field as keyof Invoice];
    const fieldB = b[selectedSort.field as keyof Invoice];

    if (fieldA === undefined || fieldB === undefined) return 0;

    if (selectedSort.field === "date" || selectedSort.field === "dueDate") {
      const dateA = new Date(fieldA as Date).getTime();
      const dateB = new Date(fieldB as Date).getTime();
      return selectedSort.direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (selectedSort.field === "total" || selectedSort.field === "balance") {
      const numA = Number(fieldA);
      const numB = Number(fieldB);
      return selectedSort.direction === "asc" ? numA - numB : numB - numA;
    }

    const strA = String(fieldA).toLowerCase();
    const strB = String(fieldB).toLowerCase();

    if (selectedSort.direction === "asc") {
      return strA.localeCompare(strB);
    } else {
      return strB.localeCompare(strA);
    }
  });
}

export function filterInvoices(
  invoices: Invoice[],
  searchTerm: string
): Invoice[] {
  if (!searchTerm) return invoices;

  const search = searchTerm.toLowerCase();
  return invoices.filter((invoice) => {
    return (
      invoice.number.toLowerCase().includes(search) ||
      invoice.customer.name.toLowerCase().includes(search) ||
      invoice.status.toLowerCase().includes(search) ||
      (invoice.notes && invoice.notes.toLowerCase().includes(search))
    );
  });
}

export function sortAndFilterInvoices(
  invoices: Invoice[],
  sortOption: string,
  searchTerm: string
): Invoice[] {
  const sorted = sortInvoices(invoices, sortOption);
  return filterInvoices(sorted, searchTerm);
}
