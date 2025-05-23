
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface WalletContextProps {
  walletAddress: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Mock wallet connection - would be replaced with actual Sui wallet integration
  const connect = async () => {
    try {
      setIsConnecting(true);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock address - would be replaced with actual wallet address
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 14) + "...";
      setWalletAddress(mockAddress);
      
      // Save to localStorage for persistence
      localStorage.setItem("walletAddress", mockAddress);
      
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWalletAddress(null);
    localStorage.removeItem("walletAddress");
    toast.info("Wallet disconnected");
  };
  
  // Check if wallet was previously connected on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnecting,
        connect,
        disconnect,
        isConnected: !!walletAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
