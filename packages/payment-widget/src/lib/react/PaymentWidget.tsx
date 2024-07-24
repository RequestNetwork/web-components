import React, { useEffect, useRef } from "react";

// Import the web component
import "../web-component";
import type { SellerInfo, ProductInfo, Total } from "../types";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "payment-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface PaymentWidgetProps {
  selletInfo?: SellerInfo;
  productInfo?: ProductInfo;
  total: Total;
}

/**
 * PaymentWidget is a React component that integrates Request Network's payment functionality into web applications.
 *
 * This component simplifies the process of accepting cryptocurrency payments by providing a pre-built,
 * customizable payment interface. It handles the complexities of blockchain transactions, allowing
 * developers to easily implement crypto payment options without deep blockchain knowledge.
 *
 * Key features:
 * - Supports multiple cryptocurrencies
 * - Handles transaction creation and management
 * - Provides real-time payment status updates
 * - Customizable appearance to match your application's design
 *
 * @component
 * @example
 * ```jsx
 * <PaymentWidget
 *   selletInfo={{
 *     logo: 'https://example.com/logo.png',
 *     name: 'Example Store'
 *   }}
 * />
 * ```
 *
 * @param {Object} props - The component props
 * @param {Object} props.selletInfo - (Optional) Information about the seller
 * @param {Object} props.productInfo - (Optional) Information about the product
 * @param {Total} props.total - The total amount to be paid
 * @param {string} props.selletInfo.logo - URL of the seller's logo
 * @param {string} props.selletInfo.name - Name of the seller
 * @param {string} props.productInfo.name - Name of the product
 * @param {string} props.productInfo.description - Description of the product
 * @param {string} props.productInfo.image - URL of the product's image
 */
export const PaymentWidget: React.FC<PaymentWidgetProps> = (props) => {
  const widgetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (widgetRef.current) {
      // Set props on the web component
      Object.entries(props).forEach(([key, value]) => {
        (widgetRef.current as any)[key] = value;
      });
    }
  }, [props]);

  return <payment-widget ref={widgetRef} />;
};
