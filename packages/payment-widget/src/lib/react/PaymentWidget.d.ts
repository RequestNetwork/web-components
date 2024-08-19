import React from "react";
import type {
  SellerInfo,
  ProductInfo,
  AmountInUSD,
  SupportedCurrencies,
} from "../types";

export interface PaymentWidgetProps {
  sellerInfo?: SellerInfo;
  productInfo?: ProductInfo;
  amountInUSD: AmountInUSD;
  supportedCurrencies: SupportedCurrencies;
  sellerAddress: string;
  persistRequest?: boolean;
  showRNBranding?: boolean;
  builderId?: string;
  onPaymentSuccess?: (request: any) => void;
  onError?: (error: string) => void;
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
 *   persistRequest={true}
 *   onPaymentSuccess={(request) => {
 *     console.log(request);
 *   }}
 *   onError={(error) => {
 *     console.error(error);
 *   }}
 * />
 */
declare const PaymentWidget: React.FC<PaymentWidgetProps>;

export default PaymentWidget;
