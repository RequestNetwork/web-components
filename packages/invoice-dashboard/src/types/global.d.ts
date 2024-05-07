declare interface Window {
  ethereum: {
    request: (request: { method: string }) => Promise<void>;
  };
}
