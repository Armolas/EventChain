"use client";

import {
  useCurrentAccount,
  useWallets,
  useConnectWallet,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useWalletConnection() {
  const currentAccount = useCurrentAccount();
  const wallets = useWallets();
  const { mutateAsync: connectWallet } = useConnectWallet();
  const { mutateAsync: disconnectWallet } = useDisconnectWallet();
  const [isReady, setIsReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Derived state
  const isConnected = !!currentAccount;

  // Handle hydration mismatch
  useEffect(() => setIsReady(true), []);

  // Connection status notifications
 const lastNotifiedAddress = useRef<string | null>(null);

useEffect(() => {
  if (isReady && isConnected && currentAccount?.address) {
    if (lastNotifiedAddress.current !== currentAccount.address) {
      toast.success(`Connected to ${currentAccount.address}`);
      lastNotifiedAddress.current = currentAccount.address;
    }
  }
}, [isConnected, currentAccount, isReady]);

  const handleConnect = useCallback(
    async (walletName?: string) => {
      try {
        setIsConnecting(true);

        // Specific wallet requested
        if (walletName) {
          const wallet = wallets.find(
            (w) => w.name.toLowerCase() === walletName.toLowerCase()
          );
          if (!wallet) throw new Error("Wallet not found");
          await connectWallet({ wallet });
          return;
        }

        // Auto-connect to first available wallet
        if (wallets.length > 0) {
          await connectWallet({ wallet: wallets[0] });
        } else {
          throw new Error("No wallets available");
        }
      } catch (error) {
        console.error("Connection failed:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to connect"
        );
      } finally {
        setIsConnecting(false);
      }
    },
    [wallets, connectWallet]
  );

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnectWallet();
      toast.info("Wallet disconnected");
    } catch (error) {
      console.error("Disconnection failed:", error);
      toast.error("Failed to disconnect wallet");
    }
  }, [disconnectWallet]);

  return {
    isConnected,
    isConnecting,
    currentAccount,
    availableWallets: wallets,
    isReady,
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
}