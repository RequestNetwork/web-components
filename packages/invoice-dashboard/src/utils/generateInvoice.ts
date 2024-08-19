import { formatUnits } from "viem";
import { loadScript } from "./loadScript";
import { calculateItemTotal } from "@requestnetwork/shared-utils/invoiceTotals";

declare global {
  interface Window {
    html2pdf: any;
  }
}

async function ensureHtml2PdfLoaded() {
  if (typeof window.html2pdf === "undefined") {
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
    );
  }
}

export const exportToPDF = async (
  invoice: any,
  currency: any,
  logo: string
) => {
  await ensureHtml2PdfLoaded();

  const content = `
    <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" /> 
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
    </head>
    <body>
    <div id="invoice" style="font-family: Urbanist, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <img src="${logo}" alt="Logo" style="width: 50px; height: 50px;">
        <div style="text-align: right;">
          <p>Issued on ${new Date(
            invoice.contentData.creationDate
          ).toLocaleDateString()}</p>
          <p>Payment due by ${new Date(
            invoice.contentData.paymentTerms.dueDate
          ).toLocaleDateString()}</p>
        </div>
      </div>

      <h1 style="text-align: center; color: #333; font-size: 28px; font-style: bold; margin-bottom: 14px;">INVOICE #${
        invoice.contentData.invoiceNumber
      }</h1>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; background-color: #FBFBFB; padding: 10px;">
        <div>
          <strong>From:</strong><br>
          <p style="font-size: 14px">${invoice.payee.value}</p>
          ${invoice.contentData.sellerInfo.firstName ?? ""} ${
    invoice.contentData.sellerInfo.lastName ?? ""
  }<br>
          ${invoice.contentData.sellerInfo.address["street-address"] ?? ""}<br>
          ${invoice.contentData.sellerInfo.address.locality ?? ""}${
    invoice.contentData.sellerInfo.address.locality ? "," : ""
  } ${invoice.contentData.sellerInfo.address["postal-code"] ?? ""}<br>
          ${invoice.contentData.sellerInfo.address["country-name"] ?? ""}<br>
           ${
             invoice.contentData.sellerInfo.taxRegistration
               ? `VAT: ${invoice.contentData.sellerInfo.taxRegistration}`
               : ""
           }<br>
        </div>

        <div>
          <strong>To:</strong><br>
          <p style="font-size: 14px">${invoice.payer.value}</p>
          ${invoice.contentData.buyerInfo.firstName ?? ""} ${
    invoice.contentData.buyerInfo.lastName ?? ""
  }<br>
          ${invoice.contentData.buyerInfo.address["street-address"] ?? ""}<br>
          ${invoice.contentData.buyerInfo.address.locality ?? ""}${
    invoice.contentData.sellerInfo.address.locality ? "," : ""
  } ${invoice.contentData.buyerInfo.address["postal-code"] ?? ""}<br>
          ${invoice.contentData.buyerInfo.address["country-name"] ?? ""}<br>
           ${
             invoice.contentData.buyerInfo.taxRegistration
               ? `VAT: ${invoice.contentData.buyerInfo.taxRegistration}`
               : ""
           }<br>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <strong>Payment Chain:</strong> ${invoice.currencyInfo.network}<br>
        <strong>Invoice Currency:</strong> ${invoice.currency}<br>
        <strong>Invoice Type:</strong> Regular Invoice
      </div>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Unit Price</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Discount</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tax</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.contentData.invoiceItems
            .map(
              (item: any) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                item.name
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item.quantity
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatUnits(
                item.unitPrice,
                currency.decimals
              )}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatUnits(
                item.discount,
                currency.decimals
              )}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item.tax.amount
              }%</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatUnits(
                calculateItemTotal(item),
                currency?.decimals
              )}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Due:</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>${formatUnits(
              invoice.expectedAmount,
              currency.decimals
            )} ${invoice.currency}</strong></td>
          </tr>
        </tfoot>
      </table>
      
      ${
        invoice.contentData.note
          ? `<div style="margin-top: 20px;">
        <h3>Memo:</h3>
        <p>${invoice.contentData.note}</p>
      </div>`
          : ""
      }
    </div>
    </body>
    </html>
  `;

  const opt = {
    margin: 10,
    filename: `invoice-${invoice.contentData.invoiceNumber}.PDF`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  window.html2pdf().from(content).set(opt).save();
};
