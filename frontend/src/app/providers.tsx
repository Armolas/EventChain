"use client";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

// Network configuration
const networkConfig = {
  localnet: { url: "http://127.0.0.1:9000" },
  devnet: { url: "https://fullnode.devnet.sui.io" },
  testnet: { url: "https://fullnode.testnet.sui.io" },
  mainnet: { url: "https://fullnode.mainnet.sui.io" },
};

// Create a query client for React Query
const queryClient = new QueryClient();

// The autoConnect property may be different in newer versions
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider autoConnect={true}>
            {children}
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  );
}