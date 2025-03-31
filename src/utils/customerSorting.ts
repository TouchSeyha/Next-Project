import { Customer } from "../app/types/customer";

// Define sort options
export type SortOption = {
  value: string;
  label: string;
  field: keyof Customer | null;
  direction: "asc" | "desc";
};

export const sortOptions: SortOption[] = [
  { value: "nameAsc", label: "Name (A-Z)", field: "name", direction: "asc" },
  { value: "nameDesc", label: "Name (Z-A)", field: "name", direction: "desc" },
  { value: "emailAsc", label: "Email (A-Z)", field: "email", direction: "asc" },
  {
    value: "emailDesc",
    label: "Email (Z-A)",
    field: "email",
    direction: "desc",
  },
  {
    value: "newest",
    label: "Newest First",
    field: "createdAt",
    direction: "desc",
  },
  {
    value: "oldest",
    label: "Oldest First",
    field: "createdAt",
    direction: "asc",
  },
];

export function sortCustomers(
  customers: Customer[],
  sortOption: string
): Customer[] {
  const selectedSort = sortOptions.find(
    (option) => option.value === sortOption
  );

  if (!selectedSort || !selectedSort.field) return customers;

  return [...customers].sort((a, b) => {
    const fieldA = a[selectedSort.field as keyof Customer];
    const fieldB = b[selectedSort.field as keyof Customer];

    if (fieldA === undefined || fieldB === undefined) return 0;

    if (selectedSort.field === "createdAt") {
      const dateA = new Date(fieldA as Date).getTime();
      const dateB = new Date(fieldB as Date).getTime();
      return selectedSort.direction === "asc" ? dateA - dateB : dateB - dateA;
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

export function filterCustomers(
  customers: Customer[],
  searchTerm: string
): Customer[] {
  if (!searchTerm) return customers;

  const search = searchTerm.toLowerCase();
  return customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      (customer.phone && customer.phone.toLowerCase().includes(search)) ||
      (customer.address && customer.address.toLowerCase().includes(search))
    );
  });
}

export function sortAndFilterCustomers(
  customers: Customer[],
  sortOption: string,
  searchTerm: string
): Customer[] {
  const sorted = sortCustomers(customers, sortOption);
  return filterCustomers(sorted, searchTerm);
}
