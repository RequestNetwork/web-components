import { formatUnits } from "viem";
import { loadScript } from "./loadScript";
import { calculateItemTotal } from "@requestnetwork/shared-utils/invoiceTotals";
import { CurrencyTypes } from "@requestnetwork/types";

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
  currency: CurrencyTypes.CurrencyDefinition | undefined,
  paymentCurrencies: (CurrencyTypes.CurrencyDefinition | undefined)[],
  logo: string
) => {
  await ensureHtml2PdfLoaded();

  const formatDate = (date: string | undefined) => {
    return date ? new Date(date).toLocaleDateString() : "-";
  };

  const renderAddress = (info: any) => {
    const parts = [
      info?.address?.["street-address"],
      info?.address?.locality,
      info?.address?.["postal-code"],
      info?.address?.["country-name"],
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "-";
  };

  const content = `
    <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" /> 
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <style>
        body { font-family: 'Urbanist', sans-serif; }
      </style>
    </head>
    <body>
    <div id="invoice" style="max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        ${logo ? `<img src="${logo}" alt="Logo" style="width: 50px; height: 50px;">` : ""}
        <div style="text-align: right;">
          <p>Issued on ${formatDate(invoice.contentData?.creationDate)}</p>
          <p>Payment due by ${formatDate(invoice.contentData?.paymentTerms?.dueDate)}</p>
        </div>
      </div>

      <h1 style="text-align: center; color: #333; font-size: 28px; font-weight: bold; margin-bottom: 14px;">INVOICE #${
        invoice.contentData?.invoiceNumber || "-"
      }</h1>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; background-color: #FBFBFB; padding: 10px;">
        <div>
          <strong>From:</strong><br>
          <p style="font-size: 14px">${invoice.payee?.value || "-"}</p>
          ${invoice.contentData?.sellerInfo?.firstName || ""} ${invoice.contentData?.sellerInfo?.lastName || ""}<br>
          ${renderAddress(invoice.contentData?.sellerInfo)}<br>
          ${invoice.contentData?.sellerInfo?.taxRegistration ? `VAT: ${invoice.contentData.sellerInfo.taxRegistration}` : ""}
        </div>

        <div>
          <strong>To:</strong><br>
          <p style="font-size: 14px">${invoice.payer?.value || "-"}</p>
          ${invoice.contentData?.buyerInfo?.firstName || ""} ${invoice.contentData?.buyerInfo?.lastName || ""}<br>
          ${renderAddress(invoice.contentData?.buyerInfo)}<br>
          ${invoice.contentData?.buyerInfo?.taxRegistration ? `VAT: ${invoice.contentData.buyerInfo.taxRegistration}` : ""}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <strong>Payment Chain:</strong> ${paymentCurrencies.length > 0 ? paymentCurrencies[0]?.network : "-"}<br>
        <strong>Invoice Currency:</strong> ${invoice.currency || "-"}<br>
        <strong>Settlement Currency:</strong> ${paymentCurrencies.length > 0 ? paymentCurrencies[0]?.symbol : "-"}<br>
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
          ${(invoice.contentData?.invoiceItems || [])
            .map(
              (item: any) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.name || "-"}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.quantity || "-"}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item.unitPrice
                  ? formatUnits(BigInt(item.unitPrice), currency?.decimals || 0)
                  : "-"
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item.discount
                  ? formatUnits(BigInt(item.discount), currency?.decimals || 0)
                  : "-"
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item.tax?.amount ? `${item.tax.amount}%` : "-"
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
                item
                  ? formatUnits(
                      BigInt(calculateItemTotal(item)),
                      currency?.decimals || 0
                    )
                  : "-"
              }</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>Due:</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>${
              invoice.expectedAmount
                ? `${formatUnits(BigInt(invoice.expectedAmount), currency?.decimals || 0)} ${invoice.currency || ""}`
                : "-"
            }</strong></td>
          </tr>
        </tfoot>
      </table>
      
      ${
        invoice.contentData?.note
          ? `<div style="margin-top: 20px;">
        <h3>Note:</h3>
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
    filename: `invoice-${invoice.contentData?.invoiceNumber || "unknown"}.pdf`,
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
    },
  };

  const element = document.createElement("div");
  element.innerHTML = content;
  document.body.appendChild(element);

  await window.html2pdf().from(element).set(opt).save();

  document.body.removeChild(element);
};
