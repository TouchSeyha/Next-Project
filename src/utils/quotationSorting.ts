import { Quotation } from "../app/types/quotation";

// Define sort options
export type SortOption = {
  value: string;
  label: string;
  field: keyof Quotation | null;
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
    value: "validUntilAsc",
    label: "Valid Until (Ascending)",
    field: "validUntil",
    direction: "asc",
  },
  {
    value: "validUntilDesc",
    label: "Valid Until (Descending)",
    field: "validUntil",
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

export function sortQuotations(
  quotations: Quotation[],
  sortOption: string
): Quotation[] {
  const selectedSort = sortOptions.find(
    (option) => option.value === sortOption
  );

  if (!selectedSort || !selectedSort.field) return quotations;

  return [...quotations].sort((a, b) => {
    const fieldA = a[selectedSort.field as keyof Quotation];
    const fieldB = b[selectedSort.field as keyof Quotation];

    if (fieldA === undefined || fieldB === undefined) return 0;

    if (selectedSort.field === "date" || selectedSort.field === "validUntil") {
      const dateA = new Date(fieldA as Date).getTime();
      const dateB = new Date(fieldB as Date).getTime();
      return selectedSort.direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (selectedSort.field === "total" || selectedSort.field === "subtotal") {
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

export function filterQuotations(
  quotations: Quotation[],
  searchTerm: string
): Quotation[] {
  if (!searchTerm) return quotations;

  const search = searchTerm.toLowerCase();
  return quotations.filter((quotation) => {
    return (
      quotation.number.toLowerCase().includes(search) ||
      quotation.customer.name.toLowerCase().includes(search) ||
      quotation.status.toLowerCase().includes(search) ||
      (quotation.notes && quotation.notes.toLowerCase().includes(search))
    );
  });
}

export function sortAndFilterQuotations(
  quotations: Quotation[],
  sortOption: string,
  searchTerm: string
): Quotation[] {
  const sorted = sortQuotations(quotations, sortOption);
  return filterQuotations(sorted, searchTerm);
}
