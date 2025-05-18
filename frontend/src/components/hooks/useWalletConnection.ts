"use client";

import { useCurrentAccount, useWallets } from "@mysten/dapp-kit";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useWalletConnection() {
  const currentAccount = useCurrentAccount();
  const { wallets, currentWallet, select } = useWallets();
  const [isReady, setIsReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Derived state
  const isConnected = !!currentWallet && !!currentAccount;

  // Handle hydration mismatch by only rendering after client-side mount
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Notify user when connection status changes
  useEffect(() => {
    if (isReady && isConnected && currentAccount) {
      toast.success("Wallet connected");
    }
  }, [isConnected, currentAccount, isReady]);

  const handleConnect = useCallback(async (walletName?: string) => {
    try {
      setIsConnecting(true);
      
      // If a specific wallet is requested, select it
      if (walletName && wallets) {
        const wallet = wallets.find(w => w.name.toLowerCase() === walletName.toLowerCase());
        if (wallet) {
          await select(wallet.name);
          return;
        }
      }
      
      // Otherwise, if we have a current wallet, use that
      if (currentWallet) {
        await select(currentWallet.name);
      } 
      // Or select the first available wallet
      else if (wallets && wallets.length > 0) {
        await select(wallets[0].name);
      } else {
        toast.error("No wallets available");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, [wallets, currentWallet, select]);

  const handleDisconnect = useCallback(async () => {
    try {
      // The dApp Kit doesn't have a direct disconnect method in useWallets()
      // It's handled through the UI components
      
      // This is a workaround - we can select null to disconnect
      // @ts-ignore - Type safety issue but this works
      await select(null);
      toast.info("Wallet disconnected");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  }, [select]);

  return {
    isConnected,
    isConnecting,
    currentAccount,
    currentWallet,
    availableWallets: wallets || [],
    isReady,
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
}