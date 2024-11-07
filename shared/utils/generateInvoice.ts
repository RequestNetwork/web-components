import { formatUnits } from "viem";
import { loadScript } from "./loadScript";
import { CurrencyTypes } from "@requestnetwork/types";
import { calculateItemTotal } from "./invoiceTotals";

declare global {
  interface Window {
    html2pdf: any;
  }
}

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

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
  logo: string | undefined
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
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
        body {
          font-family: 'Urbanist', sans-serif;
          font-size: 10px;
        }
        table {
          table-layout: fixed;
          width: 100%;
          border-collapse: collapse;
        }
        td, th {
          word-wrap: break-word;
          border: 1px solid #ddd;
          padding: 4px;
        }
        th {
          background-color: #f2f2f2;
          text-align: left;
        }
      </style>
    </head>
    <body>
    <div id="invoice" style="max-width: 680px; margin: 0 auto; padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        ${logo && logo.length > 0 ? `<img src="${logo}" alt="Logo" style="width: 50px; height: 50px;">` : ""}
        <div style="text-align: right;">
          <p>Issued on ${formatDate(invoice.contentData?.creationDate)}</p>
          <p>Payment due by ${formatDate(invoice.contentData?.paymentTerms?.dueDate)}</p>
        </div>
      </div>

      <h1 style="text-align: center; color: #333; font-size: 24px; font-weight: bold; margin-bottom: 14px;">INVOICE #${
        invoice.contentData?.invoiceNumber || "-"
      }</h1>

      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; background-color: #FBFBFB; padding: 10px;">
        <div style="width: 48%;">
          <strong>From:</strong><br>
          <p style="font-size: 10px; margin: 3px 0; word-break: break-all;">${invoice.payee?.value || "-"}</p>
          <p style="font-size: 10px; margin: 3px 0;">${invoice.contentData?.sellerInfo?.firstName || ""} ${invoice.contentData?.sellerInfo?.lastName || ""}</p>
          <p style="font-size: 10px; margin: 3px 0;">${renderAddress(invoice.contentData?.sellerInfo)}</p>
          ${invoice.contentData?.sellerInfo?.taxRegistration ? `<p style="font-size: 10px; margin: 3px 0;">VAT: ${invoice.contentData.sellerInfo.taxRegistration}</p>` : ""}
        </div>

        <div style="width: 48%;">
          <strong>To:</strong><br>
          <p style="font-size: 10px; margin: 3px 0; word-break: break-all;">${invoice.payer?.value || "-"}</p>
          <p style="font-size: 10px; margin: 3px 0;">${invoice.contentData?.buyerInfo?.firstName || ""} ${invoice.contentData?.buyerInfo?.lastName || ""}</p>
          <p style="font-size: 10px; margin: 3px 0;">${renderAddress(invoice.contentData?.buyerInfo)}</p>
          ${invoice.contentData?.buyerInfo?.taxRegistration ? `<p style="font-size: 10px; margin: 3px 0;">VAT: ${invoice.contentData.buyerInfo.taxRegistration}</p>` : ""}
        </div>
      </div>

      <div style="margin-bottom: 20px; font-size: 10px;">
        <strong>Payment Chain:</strong> ${paymentCurrencies.length > 0 ? paymentCurrencies[0]?.network : "-"}<br>
        <strong>Invoice Currency:</strong> ${invoice.currency || "-"}<br>
        <strong>Settlement Currency:</strong> ${paymentCurrencies.length > 0 ? paymentCurrencies[0]?.symbol : "-"}<br>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Description</th>
            <th style="width: 10%; text-align: right;">Quantity</th>
            <th style="width: 20%; text-align: right;">Unit Price</th>
            <th style="width: 15%; text-align: right;">Discount</th>
            <th style="width: 10%; text-align: right;">Tax</th>
            <th style="width: 20%; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(invoice.contentData?.invoiceItems || [])
            .map(
              (item: any) => `
            <tr>
              <td>${item.name || "-"}</td>
              <td style="text-align: right;">${item.quantity || "-"}</td>
              <td style="text-align: right;">${
                item.unitPrice
                  ? formatUnits(BigInt(item.unitPrice), currency?.decimals || 0)
                  : "-"
              }</td>
              <td style="text-align: right;">${
                item.discount
                  ? formatUnits(BigInt(item.discount), currency?.decimals || 0)
                  : "-"
              }</td>
              <td style="text-align: right;">${
                item.tax?.amount ? `${item.tax.amount}%` : "-"
              }</td>
              <td style="text-align: right;">${
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
            <td colspan="5" style="text-align: right;"><strong>Due:</strong></td>
            <td style="text-align: right;"><strong>${
              invoice.expectedAmount
                ? `${formatUnits(BigInt(invoice.expectedAmount), currency?.decimals || 0)} ${invoice.currency || ""}`
                : "-"
            }</strong></td>
          </tr>
        </tfoot>
      </table>

      ${
        invoice.contentData?.note
          ? `<div style="margin-top: 20px; font-size: 10px;">
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
