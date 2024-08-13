import React, { useEffect, useRef } from "react";

// Import the web component
import "../web-component";
import type {
  SellerInfo,
  ProductInfo,
  AmountInUSD,
  SupportedCurrencies,
} from "../types";

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
  amountInUSD: AmountInUSD;
  supportedCurrencies: SupportedCurrencies;
}

/**
 * @typedef {Object} SellerInfo
 * @property {string} [logo] - URL of the seller's logo
 * @property {string} [name] - Name of the seller
 */

// @ts-ignore
/**
 * @typedef {Object} ProductInfo
 * @property {string} [name] - Name of the product
 * @property {string} [description] - Description of the product
 * @property {string} [image] - URL of the product's image
 */

// @ts-ignore
/**
 * @typedef {number} amountInUSD - The price in US dollars that the seller wants to charge. This amount will be used to calculate the equivalent cryptocurrency amount for the buyer.
 */

// @ts-ignore
/**
 * @typedef {keyof typeof CURRENCY_ID} CurrencyID
 */

// @ts-ignore
/**
 * @typedef {[CurrencyID, ...CurrencyID[]]} SupportedCurrencies
 */

/**
 * @typedef {string} SellerAddress - The wallet address of the seller
 *  

// @ts-ignore
/**
 * @typedef {Object} PaymentWidgetProps
 * @property {SellerInfo} [sellerInfo]
 * @property {ProductInfo} [productInfo]
 * @property {number} amountInUSD
 * @property {SupportedCurrencies} supportedCurrencies
 * @property {SellerAddress} sellerAddress
 */

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
 * @param {PaymentWidgetProps} props - The component props
 * @returns {JSX.Element}
 *
 * @example
 * <PaymentWidget
 *   sellerInfo={{
 *     logo: 'https://example.com/logo.png',
 *     name: 'Example Store'
 *   }}
 *   productInfo={{
 *     name: 'Digital Art Collection',
 *     description: 'A curated collection of digital artworks.',
 *     image: 'https://example.com/product-image.jpg'
 *   }}
 *   amountInUSD={1.5}
 *   sellerAddress="0x1234567890123456789012345678901234567890"
 *   supportedCurrencies={['ETH_MAINNET', 'USDC_MAINNET', 'USDC_MATIC']}
 * />
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
