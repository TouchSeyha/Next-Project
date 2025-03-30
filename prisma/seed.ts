import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data (optional, remove in production)
  await prisma.item.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.customer.deleteMany();

  console.log('Seeding database...');

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Acme Corporation',
        email: 'contact@acmecorp.com',
        phone: '555-123-4567',
        address: '123 Business Ave, Suite 100, Business City, 12345',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Tech Solutions Inc',
        email: 'info@techsolutions.com',
        phone: '555-987-6543',
        address: '456 Technology Park, Innovation City, 67890',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Global Enterprises',
        email: 'sales@globalenterprises.com',
        phone: '555-456-7890',
        address: '789 Global Blvd, International District, 54321',
      },
    }),
  ]);

  console.log(`Created ${customers.length} customers`);

  // Create Quotations
  const quotations = await Promise.all([
    prisma.quotation.create({
      data: {
        number: 'Q-2023-001',
        date: new Date('2023-01-15'),
        validUntil: new Date('2023-02-15'),
        customerId: customers[0].id,
        subtotal: 2500.00,
        taxRate: 0.20,
        taxAmount: 500.00,
        total: 3000.00,
        notes: 'Website development project quotation',
        status: 'Sent',
        items: {
          create: [
            {
              description: 'Website Design',
              quantity: 1,
              price: 1500.00,
              amount: 1500.00,
            },
            {
              description: 'Frontend Development',
              quantity: 1,
              price: 1000.00,
              amount: 1000.00,
            },
          ],
        },
      },
    }),
    prisma.quotation.create({
      data: {
        number: 'Q-2023-002',
        date: new Date('2023-02-10'),
        validUntil: new Date('2023-03-10'),
        customerId: customers[1].id,
        subtotal: 5000.00,
        taxRate: 0.20,
        taxAmount: 1000.00,
        total: 6000.00,
        notes: 'Mobile app development project',
        status: 'Accepted',
        items: {
          create: [
            {
              description: 'Mobile App Design',
              quantity: 1,
              price: 2000.00,
              amount: 2000.00,
            },
            {
              description: 'iOS Development',
              quantity: 1,
              price: 1500.00,
              amount: 1500.00,
            },
            {
              description: 'Android Development',
              quantity: 1,
              price: 1500.00,
              amount: 1500.00,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${quotations.length} quotations`);

  // Create Invoices
  const invoices = await Promise.all([
    // Invoice from an accepted quotation
    prisma.invoice.create({
      data: {
        number: 'INV-2023-001',
        date: new Date('2023-03-01'),
        dueDate: new Date('2023-03-31'),
        quotationId: quotations[1].id,
        customerId: customers[1].id,
        subtotal: 5000.00,
        taxRate: 0.20,
        taxAmount: 1000.00,
        total: 6000.00,
        amountPaid: 3000.00,
        balance: 3000.00,
        notes: 'First installment paid',
        status: 'Partially Paid',
        items: {
          create: [
            {
              description: 'Mobile App Design',
              quantity: 1,
              price: 2000.00,
              amount: 2000.00,
            },
            {
              description: 'iOS Development',
              quantity: 1,
              price: 1500.00,
              amount: 1500.00,
            },
            {
              description: 'Android Development',
              quantity: 1,
              price: 1500.00,
              amount: 1500.00,
            },
          ],
        },
      },
    }),
    // Direct invoice without quotation
    prisma.invoice.create({
      data: {
        number: 'INV-2023-002',
        date: new Date('2023-03-15'),
        dueDate: new Date('2023-04-15'),
        customerId: customers[2].id,
        subtotal: 800.00,
        taxRate: 0.20,
        taxAmount: 160.00,
        total: 960.00,
        amountPaid: 960.00,
        balance: 0.00,
        notes: 'Monthly maintenance service',
        status: 'Paid',
        items: {
          create: [
            {
              description: 'Server Maintenance - March 2023',
              quantity: 1,
              price: 500.00,
              amount: 500.00,
            },
            {
              description: 'Security Updates',
              quantity: 1,
              price: 300.00,
              amount: 300.00,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${invoices.length} invoices`);
  
  // Count all items
  const itemCount = await prisma.item.count();
  console.log(`Created ${itemCount} items`);
  
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
