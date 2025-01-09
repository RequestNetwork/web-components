declare global {
    interface Window {
        html2pdf: any;
    }
}
export declare const exportToPDF: (invoice: any, currency: any, logo: string) => Promise<void>;
