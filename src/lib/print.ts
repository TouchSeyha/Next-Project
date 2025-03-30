import { Invoice } from "@/app/types/invoice";
import { Quotation } from "@/app/types/quotation";

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString();
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function printQuotation(quotation: Quotation) {
  const printWindow = window.open("", "_blank", "width=800,height=600");
  
  if (!printWindow) {
    alert("Please allow popups for this website to print quotations");
    return;
  }
  
  const customer = quotation.customer;
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Quotation #${quotation.number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .quotation-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company { font-size: 24px; font-weight: bold; }
        .quotation-title { font-size: 24px; text-align: center; margin: 20px 0; }
        .section-title { font-size: 18px; font-weight: bold; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .quotation-details, .customer-details { margin-bottom: 20px; }
        .row { display: flex; margin-bottom: 5px; }
        .label { font-weight: bold; width: 150px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
        .totals { margin-top: 20px; margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .grand-total { font-weight: bold; font-size: 16px; border-top: 2px solid #000; padding-top: 5px; }
        @media print {
          button.print-button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="quotation-header">
        <div class="company">Touch Seyha System</div>
        <div>
          <div class="quotation-title">QUOTATION</div>
          <div class="quotation-number"># ${quotation.number}</div>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between;">
        <div class="quotation-details">
          <div class="section-title">Quotation Details</div>
          <div class="row"><span class="label">Date:</span> ${formatDate(
            quotation.date
          )}</div>
          <div class="row"><span class="label">Valid Until:</span> ${formatDate(
            quotation.validUntil
          )}</div>
          <div class="row"><span class="label">Status:</span> ${
            quotation.status
          }</div>
        </div>
        
        <div class="customer-details">
          <div class="section-title">Customer Details</div>
          <div class="row"><span class="label">Name:</span> ${
            customer.name
          }</div>
          ${
            customer.email
              ? `<div class="row"><span class="label">Email:</span> ${customer.email}</div>`
              : ""
          }
          ${
            customer.phone
              ? `<div class="row"><span class="label">Phone:</span> ${customer.phone}</div>`
              : ""
          }
          ${
            customer.address
              ? `<div class="row"><span class="label">Address:</span> ${customer.address}</div>`
              : ""
          }
        </div>
      </div>
      
      <div class="section-title">Items</div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Quantity</th>
            <th class="text-right">Price</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${quotation.items
            .map(
              (item: any) => `
            <tr>
              <td>${item.description}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${formatCurrency(item.price)}</td>
              <td class="text-right">${formatCurrency(item.amount)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(quotation.subtotal)}</span>
        </div>
        <div class="total-row">
          <span>Tax (${(quotation.taxRate * 100).toFixed(0)}%):</span>
          <span>${formatCurrency(quotation.taxAmount)}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>${formatCurrency(quotation.total)}</span>
        </div>
      </div>
      
      ${
        quotation.notes
          ? `
        <div class="section-title">Notes</div>
        <p>${quotation.notes}</p>
      `
          : ""
      }
      
      <div style="text-align: center; margin-top: 30px;">
        <button class="print-button" onclick="window.print(); return false;" style="padding: 10px 20px; cursor: pointer;">
          Print Quotation
        </button>
      </div>
    </body>
    </html>
  `;
  
  // Write the content to the new window and trigger print
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Wait for content to load before printing
  printWindow.onload = function() {
    // Auto-print if needed
    // printWindow.print();
  };
}

export function printInvoice(invoice: Invoice) {
  const printWindow = window.open("", "_blank", "width=800,height=600");
  
  if (!printWindow) {
    alert("Please allow popups for this website to print invoices");
    return;
  }
  
  const customer = invoice.customer;
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${invoice.number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company { font-size: 24px; font-weight: bold; }
        .invoice-title { font-size: 24px; text-align: center; margin: 20px 0; }
        .section-title { font-size: 18px; font-weight: bold; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .invoice-details, .customer-details { margin-bottom: 20px; }
        .row { display: flex; margin-bottom: 5px; }
        .label { font-weight: bold; width: 150px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .text-right { text-align: right; }
        .totals { margin-top: 20px; margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .grand-total { font-weight: bold; font-size: 16px; border-top: 2px solid #000; padding-top: 5px; }
        @media print {
          button.print-button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="company">Touch Seyha System</div>
        <div>
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-number"># ${invoice.number}</div>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between;">
        <div class="invoice-details">
          <div class="section-title">Invoice Details</div>
          <div class="row"><span class="label">Date:</span> ${formatDate(
            invoice.date
          )}</div>
          <div class="row"><span class="label">Due Date:</span> ${formatDate(
            invoice.dueDate
          )}</div>
          <div class="row"><span class="label">Status:</span> ${
            invoice.status
          }</div>
          ${
            invoice.quotation
              ? `<div class="row"><span class="label">Quotation:</span> ${invoice.quotation.number}</div>`
              : ""
          }
        </div>
        
        <div class="customer-details">
          <div class="section-title">Customer Details</div>
          <div class="row"><span class="label">Name:</span> ${
            customer.name
          }</div>
          ${
            customer.email
              ? `<div class="row"><span class="label">Email:</span> ${customer.email}</div>`
              : ""
          }
          ${
            customer.phone
              ? `<div class="row"><span class="label">Phone:</span> ${customer.phone}</div>`
              : ""
          }
          ${
            customer.address
              ? `<div class="row"><span class="label">Address:</span> ${customer.address}</div>`
              : ""
          }
        </div>
      </div>
      
      <div class="section-title">Items</div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Quantity</th>
            <th class="text-right">Price</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item: any) => `
            <tr>
              <td>${item.description}</td>
              <td class="text-right">${item.quantity}</td>
              <td class="text-right">${formatCurrency(item.price)}</td>
              <td class="text-right">${formatCurrency(item.amount)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(invoice.subtotal)}</span>
        </div>
        <div class="total-row">
          <span>Tax (${(invoice.taxRate * 100).toFixed(0)}%):</span>
          <span>${formatCurrency(invoice.taxAmount)}</span>
        </div>
        <div class="total-row">
          <span>Total:</span>
          <span>${formatCurrency(invoice.total)}</span>
        </div>
        <div class="total-row">
          <span>Amount Paid:</span>
          <span>${formatCurrency(invoice.amountPaid)}</span>
        </div>
        <div class="total-row grand-total">
          <span>Balance:</span>
          <span>${formatCurrency(invoice.balance)}</span>
        </div>
      </div>
      
      ${
        invoice.notes
          ? `
        <div class="section-title">Notes</div>
        <p>${invoice.notes}</p>
      `
          : ""
      }
      
      <div style="text-align: center; margin-top: 30px;">
        <button class="print-button" onclick="window.print(); return false;" style="padding: 10px 20px; cursor: pointer;">
          Print Invoice
        </button>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  // Wait for content to load before printing
  printWindow.onload = function() {
    // Auto-print if needed
    // printWindow.print();
  };
}
