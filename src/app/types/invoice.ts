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
};

export type Invoice = {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  customer: Customer;
  customerId: string;
  quotation?: Quotation | null;
  quotationId?: string | null;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balance: number;
  notes?: string | null;
  status: string;
  items: Item[];
};
