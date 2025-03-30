'use server'

import { prisma } from "./prisma";

export async function getQuotations() {
  try {
    return await prisma.quotation.findMany({
      include: {
        customer: true,
        items: true,
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

export async function getQuotationById(id: string) {
  try {
    return await prisma.quotation.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
      },
    });
  } catch (error) {
    console.error(`Failed to fetch quotation with ID ${id}:`, error);
    throw new Error(`Failed to fetch quotation with ID ${id}`);
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

export async function createQuotation(formData: FormData) {
  const number = formData.get('number') as string;
  const date = new Date(formData.get('date') as string);
  const validUntil = new Date(formData.get('validUntil') as string);
  const customerId = formData.get('customerId') as string;
  const subtotal = parseFloat(formData.get('subtotal') as string);
  const taxRate = parseFloat(formData.get('taxRate') as string);
  const taxAmount = parseFloat(formData.get('taxAmount') as string);
  const total = parseFloat(formData.get('total') as string);
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
    const result = await prisma.quotation.create({
      data: {
        number,
        date,
        validUntil,
        customerId,
        subtotal,
        taxRate,
        taxAmount,
        total,
        notes,
        status,
        items: {
          create: items,
        },
      },
    });
    
    return result;
  } catch (error) {
    console.error('Failed to create quotation:', error);
    throw new Error('Failed to create quotation');
  }
}

export async function updateQuotation(id: string, formData: FormData) {
  const number = formData.get('number') as string;
  const date = new Date(formData.get('date') as string);
  const validUntil = new Date(formData.get('validUntil') as string);
  const customerId = formData.get('customerId') as string;
  const subtotal = parseFloat(formData.get('subtotal') as string);
  const taxRate = parseFloat(formData.get('taxRate') as string);
  const taxAmount = parseFloat(formData.get('taxAmount') as string);
  const total = parseFloat(formData.get('total') as string);
  const notes = formData.get('notes') as string;
  const status = formData.get('status') as string;
  
  try {
    // Delete existing items to replace with new ones
    await prisma.item.deleteMany({
      where: { quotationId: id },
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

    const result = await prisma.quotation.update({
      where: { id },
      data: {
        number,
        date,
        validUntil,
        customerId,
        subtotal,
        taxRate,
        taxAmount,
        total,
        notes,
        status,
        items: {
          create: items,
        },
      },
    });

    return result;
  } catch (error) {
    console.error(`Failed to update quotation with ID ${id}:`, error);
    throw new Error('Failed to update quotation');
  }
}

export async function deleteQuotation(id: string) {
  try {
    // First delete all related items
    await prisma.item.deleteMany({
      where: { quotationId: id },
    });
    
    // Then delete the quotation
    const result = await prisma.quotation.delete({
      where: { id },
    });

    return result;
  } catch (error) {
    console.error(`Failed to delete quotation with ID ${id}:`, error);
    throw new Error('Failed to delete quotation');
  }
}
