'use server'

import { prisma } from "./prisma";

export async function getInvoices() {
  try {
    return await prisma.invoice.findMany({
      include: {
        customer: true,
        quotation: true,
        items: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    throw new Error('Failed to fetch invoices');
  }
}

export async function getInvoiceById(id: string) {
  try {
    return await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        quotation: true,
        items: true,
      },
    });
  } catch (error) {
    console.error(`Failed to fetch invoice with ID ${id}:`, error);
    throw new Error(`Failed to fetch invoice with ID ${id}`);
  }
}

export async function getCustomers() {
  try {
    return await prisma.customer.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    throw new Error('Failed to fetch customers');
  }
}

export async function getQuotations() {
  try {
    return await prisma.quotation.findMany({
      where: {
        status: 'Accepted',
      },
      orderBy: {
        date: 'desc',
      },
    });
  } catch (error) {
    console.error('Failed to fetch quotations:', error);
    throw new Error('Failed to fetch quotations');
  }
}

export async function createInvoice(formData: FormData) {
  const number = formData.get('number') as string;
  const date = new Date(formData.get('date') as string);
  const dueDate = new Date(formData.get('dueDate') as string);
  const customerId = formData.get('customerId') as string;
  const quotationId = (formData.get('quotationId') as string) || null;
  const subtotal = parseFloat(formData.get('subtotal') as string);
  const taxRate = parseFloat(formData.get('taxRate') as string);
  const taxAmount = parseFloat(formData.get('taxAmount') as string);
  const total = parseFloat(formData.get('total') as string);
  const amountPaid = parseFloat(formData.get('amountPaid') as string) || 0;
  const balance = parseFloat(formData.get('balance') as string);
  const notes = formData.get('notes') as string;
  const status = formData.get('status') as string;
  
  // Parse items from form data
  const itemDescriptions = formData.getAll('itemDescription') as string[];
  const itemQuantities = formData.getAll('itemQuantity') as string[];
  const itemPrices = formData.getAll('itemPrice') as string[];
  const itemAmounts = formData.getAll('itemAmount') as string[];
  
  const items = itemDescriptions.map((description, index) => ({
    description,
    quantity: parseFloat(itemQuantities[index]),
    price: parseFloat(itemPrices[index]),
    amount: parseFloat(itemAmounts[index]),
  }));

  try {
    const result = await prisma.invoice.create({
      data: {
        number,
        date,
        dueDate,
        customerId,
        quotationId,
        subtotal,
        taxRate,
        taxAmount,
        total,
        amountPaid,
        balance,
        notes,
        status,
        items: {
          create: items,
        },
      },
    });
    
    return result;
  } catch (error) {
    console.error('Failed to create invoice:', error);
    throw new Error('Failed to create invoice');
  }
}

export async function updateInvoice(id: string, formData: FormData) {
  const number = formData.get('number') as string;
  const date = new Date(formData.get('date') as string);
  const dueDate = new Date(formData.get('dueDate') as string);
  const customerId = formData.get('customerId') as string;
  const quotationId = (formData.get('quotationId') as string) || null;
  const subtotal = parseFloat(formData.get('subtotal') as string);
  const taxRate = parseFloat(formData.get('taxRate') as string);
  const taxAmount = parseFloat(formData.get('taxAmount') as string);
  const total = parseFloat(formData.get('total') as string);
  const amountPaid = parseFloat(formData.get('amountPaid') as string) || 0;
  const balance = parseFloat(formData.get('balance') as string);
  const notes = formData.get('notes') as string;
  const status = formData.get('status') as string;
  
  try {
    // Delete existing items to replace with new ones
    await prisma.item.deleteMany({
      where: { invoiceId: id },
    });
    
    // Parse items from form data
    const itemDescriptions = formData.getAll('itemDescription') as string[];
    const itemQuantities = formData.getAll('itemQuantity') as string[];
    const itemPrices = formData.getAll('itemPrice') as string[];
    const itemAmounts = formData.getAll('itemAmount') as string[];
    
    const items = itemDescriptions.map((description, index) => ({
      description,
      quantity: parseFloat(itemQuantities[index]),
      price: parseFloat(itemPrices[index]),
      amount: parseFloat(itemAmounts[index]),
    }));

    const result = await prisma.invoice.update({
      where: { id },
      data: {
        number,
        date,
        dueDate,
        customerId,
        quotationId,
        subtotal,
        taxRate,
        taxAmount,
        total,
        amountPaid,
        balance,
        notes,
        status,
        items: {
          create: items,
        },
      },
    });

    return result;
  } catch (error) {
    console.error(`Failed to update invoice with ID ${id}:`, error);
    throw new Error('Failed to update invoice');
  }
}

export async function deleteInvoice(id: string) {
  try {
    // First delete all related items
    await prisma.item.deleteMany({
      where: { invoiceId: id },
    });
    
    // Then delete the invoice
    const result = await prisma.invoice.delete({
      where: { id },
    });

    return result;
  } catch (error) {
    console.error(`Failed to delete invoice with ID ${id}:`, error);
    throw new Error('Failed to delete invoice');
  }
}
