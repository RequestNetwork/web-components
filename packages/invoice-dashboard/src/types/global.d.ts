declare interface Window {
  ethereum: {
    on: (event: string, callback: (accounts: string[]) => void) => void;
    removeListener: (
      event: string,
      callback: (accounts: string[]) => void
    ) => void;
    request: (request: { method: string }) => Promise<void>;
    autoRefreshOnNetworkChange: boolean;
  };
}
