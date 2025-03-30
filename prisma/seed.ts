import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.item.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.customer.deleteMany();

  console.log('Seeding database...');

  // Create customers with Cambodian details
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Angkor Tech Solutions Co., Ltd',
        email: 'accounts@angkortech.com.kh',
        phone: '+855 10 234 567',
        address: '#45, St. 310, Sangkat Boeung Keng Kang I, Khan Chamkarmon, Phnom Penh',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Cambodia Digital Services',
        email: 'billing@camdigital.com.kh',
        phone: '+855 12 345 678',
        address: '#78, St. 271, Sangkat Tuol Tumpung II, Khan Chamkarmon, Phnom Penh',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Mekong Innovations Ltd',
        email: 'finance@mekonginnovations.com',
        phone: '+855 15 789 012',
        address: '#27, National Road 6A, Sangkat Chroy Changvar, Khan Chroy Changvar, Phnom Penh',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Siem Reap Web Solutions',
        email: 'accounts@srwebsolutions.com.kh',
        phone: '+855 11 456 789',
        address: 'Sivatha Road, Svay Dangkum Commune, Siem Reap',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Phnom Penh Systems Integration',
        email: 'ar@ppsystems.com.kh',
        phone: '+855 17 901 234',
        address: '#152, St. 51, Sangkat Phsar Thmey I, Khan Daun Penh, Phnom Penh',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Kampot Software Development',
        email: 'payments@kampotdev.org',
        phone: '+855 69 012 345',
        address: 'Old Market Street, Kampong Bay South, Kampot',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Battambang Tech Hub',
        email: 'invoices@battambangtechhub.com',
        phone: '+855 77 123 456',
        address: 'River West Bank, Sangkat Svay Por, Battambang',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Khmer Design Studio',
        email: 'accounting@khmerdesigns.asia',
        phone: '+855 16 234 567',
        address: '#98, St. 315, Sangkat Boeung Kak II, Khan Toul Kork, Phnom Penh',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Kampong Cham IT Services',
        email: 'finance@kchamit.com',
        phone: '+855 89 345 678',
        address: 'Preah Bat Ang Eng St, Kampong Cham',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Cambodia Financial Technology Co., Ltd',
        email: 'billing@camfintech.com.kh',
        phone: '+855 81 456 789',
        address: '#220, Norodom Blvd, Sangkat Tonle Bassac, Khan Chamkarmon, Phnom Penh',
      },
    }),
  ]);

  console.log(`Created ${customers.length} customers`);

  // Create quotations
  const quotationStatuses = ['Draft', 'Sent', 'Accepted', 'Declined', 'Expired'];
  const quotations = [];

  for (let i = 0; i < 10; i++) {
    // Pick a random customer
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
    // Create dates
    const currentYear = new Date().getFullYear();
    const quoteDate = new Date(currentYear, Math.floor(Math.random() * 11), Math.floor(Math.random() * 28) + 1);
    const validUntil = new Date(quoteDate);
    validUntil.setDate(validUntil.getDate() + 30); // Valid for 30 days
    
    // Create quotation
    const status = quotationStatuses[Math.floor(Math.random() * quotationStatuses.length)];
    const quotationNumber = `Q-${currentYear}-${String(i + 101).padStart(3, '0')}`;
    
    // Create items for this quotation
    const itemCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
    const items = [];
    let subtotal = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const itemDescriptions = [
        'Cambodia Market Website Development',
        'Khmer Language Software Localization',
        'Bilingual App Development (Khmer/English)',
        'E-commerce Platform with Local Payment Integration',
        'Digital Marketing for Cambodia Market',
        'Phnom Penh SEO Optimization',
        'Cloud Infrastructure Setup for Cambodia Operations',
        'Khmer Unicode Database Migration',
        'Cyber Security Audit & Implementation',
        'Local Payment Gateway API Integration',
        'Staff Training Sessions in Khmer',
        'Cambodia-focused Content Management System',
      ];
      
      const description = itemDescriptions[Math.floor(Math.random() * itemDescriptions.length)];
      const quantity = Math.floor(Math.random() * 10) + 1;
      const price = parseFloat((Math.random() * 1000 + 100).toFixed(2));
      const amount = quantity * price;
      
      items.push({
        description,
        quantity,
        price,
        amount,
      });
      
      subtotal += amount;
    }
    
    const taxRate = 0.2; // 20% tax rate
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    
    const quotation = await prisma.quotation.create({
      data: {
        number: quotationNumber,
        date: quoteDate,
        validUntil,
        customerId: customer.id,
        subtotal,
        taxRate,
        taxAmount,
        total,
        notes: `Quotation for ${customer.name}. Valid until ${validUntil.toLocaleDateString()}.`,
        status,
        items: {
          create: items,
        },
      },
    });
    
    quotations.push(quotation);
  }

  console.log(`Created ${quotations.length} quotations with items`);

  // Create invoices
  const invoiceStatuses = ['Draft', 'Pending', 'Paid', 'Overdue', 'Cancelled'];
  const invoices = [];

  for (let i = 0; i < 10; i++) {
    // Pick a random customer
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
    // Determine if this invoice is based on a quotation
    const useQuotation = Math.random() > 0.5; // 50% chance
    let quotationId = null;
    let baseItems = [];
    
    if (useQuotation) {
      // Pick from accepted quotations for this customer
      const acceptedQuotations = quotations.filter(q => 
        q.customerId === customer.id && q.status === 'Accepted'
      );
      
      if (acceptedQuotations.length > 0) {
        const quotation = acceptedQuotations[Math.floor(Math.random() * acceptedQuotations.length)];
        quotationId = quotation.id;
        
        // Get items from this quotation
        const quotationItems = await prisma.item.findMany({
          where: { quotationId: quotation.id },
        });
        
        // Use these items as the base for our invoice items
        baseItems = quotationItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          amount: item.amount,
        }));
      }
    }
    
    // If not using a quotation or no accepted quotations found, create new items
    if (baseItems.length === 0) {
      const itemCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
      
      for (let j = 0; j < itemCount; j++) {
        const itemDescriptions = [
          'Cambodia Market Website Development',
          'Khmer Language Software Localization',
          'Bilingual App Development (Khmer/English)',
          'E-commerce Platform with Local Payment Integration',
          'Digital Marketing for Cambodia Market',
          'Phnom Penh SEO Optimization',
          'Cloud Infrastructure Setup for Cambodia Operations',
          'Khmer Unicode Database Migration',
          'Cyber Security Audit & Implementation',
          'Local Payment Gateway API Integration',
          'Staff Training Sessions in Khmer',
          'Cambodia-focused Content Management System',
        ];
        
        const description = itemDescriptions[Math.floor(Math.random() * itemDescriptions.length)];
        const quantity = Math.floor(Math.random() * 10) + 1;
        const price = parseFloat((Math.random() * 1000 + 100).toFixed(2));
        const amount = quantity * price;
        
        baseItems.push({
          description,
          quantity,
          price,
          amount,
        });
      }
    }
    
    // Calculate financial values
    const subtotal = baseItems.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = 0.2; // 20% tax rate
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    
    // Determine payment status and amount paid
    const status = invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)];
    let amountPaid = 0;
    
    if (status === 'Paid') {
      amountPaid = total;
    } else if (status === 'Pending') {
      // Sometimes partially paid
      amountPaid = Math.random() > 0.5 ? parseFloat((total * Math.random()).toFixed(2)) : 0;
    }
    
    const balance = total - amountPaid;
    
    // Create dates
    const currentYear = new Date().getFullYear();
    const invoiceDate = new Date(currentYear, Math.floor(Math.random() * 11), Math.floor(Math.random() * 28) + 1);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30); // Due in 30 days
    
    const invoiceNumber = `INV-${currentYear}-${String(i + 101).padStart(3, '0')}`;
    
    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        date: invoiceDate,
        dueDate,
        customerId: customer.id,
        quotationId,
        subtotal,
        taxRate,
        taxAmount,
        total,
        amountPaid,
        balance,
        notes: `Invoice for ${customer.name}. Payment due by ${dueDate.toLocaleDateString()}.`,
        status,
        items: {
          create: baseItems,
        },
      },
    });
    
    invoices.push(invoice);
  }

  console.log(`Created ${invoices.length} invoices with items`);
  console.log('Database seeding completed with Cambodia-related data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
