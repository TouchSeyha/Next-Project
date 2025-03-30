export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  createdAt: Date
}

export type CustomerFormData = Omit<Customer, "id" | "createdAt">