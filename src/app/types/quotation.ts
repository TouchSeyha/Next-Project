export type Item = {
  id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
};

export type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type Quotation = {
  id: string;
  number: string;
  date: Date;
  validUntil: Date;
  customer: Customer;
  customerId: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string | null;
  status: string;
  items: Item[];
};