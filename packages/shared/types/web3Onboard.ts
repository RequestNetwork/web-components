type ChainId = string;

type ConnectedChain = {
  id: ChainId;
  namespace: "evm";
};

type TokenSymbol = string;

type Balances = Record<TokenSymbol, string> | null;

interface SecondaryTokenBalances {
  name: TokenSymbol;
  balance: string;
  icon?: string;
}

type Address = string;

interface Ens {
  name: string;
  avatar: {
    url: string;
    linkage: Array<{
      type: string;
      content: string;
    }>;
  } | null;
  contentHash: string | null;
  getText: (key: string) => Promise<string | undefined>;
}

interface Uns {
  name: string;
}

type Account = {
  address: Address;
  ens: Ens | null;
  uns: Uns | null;
  balance: Balances | null;
  secondaryTokens?: SecondaryTokenBalances[] | null;
};

interface EIP1193Provider {
  request: (args: any) => Promise<any>;
  on: (event: string, listener: (...args: any[]) => void) => void;
  removeListener: (event: string, listener: (...args: any[]) => void) => void;
}

export interface WalletState {
  label: string;
  icon: string;
  provider: EIP1193Provider;
  accounts: Account[];
  chains: ConnectedChain[];
  instance?: unknown;
}
