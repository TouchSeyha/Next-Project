'use server'

import { prisma } from '@/lib/prisma'

export async function getCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return customers
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    throw new Error('Failed to fetch customers')
  }
}

export async function getCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        quotations: true,
        invoices: true
      }
    })
    return customer
  } catch (error) {
    console.error(`Failed to fetch customer with ID ${id}:`, error)
    throw new Error(`Failed to fetch customer with ID ${id}`)
  }
}

export async function createCustomer(data: { name: string; email: string; phone?: string; address?: string }) {
  const { name, email, phone, address } = data

  if (!name || !email) {
    throw new Error('Name and email are required')
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone: phone || undefined,
        address: address || undefined
      }
    })
    return customer
  } catch (error) {
    console.error('Failed to create customer:', error)
    throw new Error('Failed to create customer')
  }
}

export async function deleteCustomer(id: string) {
  if (!id) {
    throw new Error('Customer ID is required for deletion')
  }
  
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        quotations: true,
        invoices: true
      }
    })

    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`)
    }

    await prisma.$transaction(async (tx) => {
      // Delete all related quotations
      if (customer.quotations.length > 0) {
        await tx.quotation.deleteMany({
          where: { customerId: id }
        })
      }
      
      // Delete all related invoices
      if (customer.invoices.length > 0) {
        await tx.invoice.deleteMany({
          where: { customerId: id }
        })
      }
      
      // Finally delete the customer
      await tx.customer.delete({
        where: { id }
      })
    })

    return { 
      success: true,
      message: `Customer and all related records deleted successfully` 
    }
  } catch (error) {
    console.error(`Failed to delete customer with ID ${id}:`, error)
    if (error instanceof Error) {
      throw new Error(`Failed to delete customer: ${error.message}`)
    }
    throw new Error(`Failed to delete customer with ID ${id}`)
  }
}

export async function updateCustomer(id: string, data: { name?: string; email?: string; phone?: string; address?: string }) {
  if (!id) {
    throw new Error('Customer ID is required for updating')
  }

  // Validate required fields
  if (!data.name || !data.email) {
    throw new Error('Name and email are required')
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id }
    })

    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`)
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null
      }
    })

    return updatedCustomer
  } catch (error) {
    console.error(`Failed to update customer with ID ${id}:`, error)
    throw new Error(`Failed to update customer: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

