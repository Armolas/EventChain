
import { useEvents } from "@/contexts/EventsContext";
// import { useWallet } from "@/contexts/WalletContext";
import { useWalletConnection } from "@/hooks/useWalletConnnection";
import POAPCard from "@/components/POAPCard";
import { Button } from "@/components/ui/button";
import { Award, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit";

const MyPOAPs = () => {
  const { userPOAPs, loading } = useEvents();
  const { isConnected, connect } = useWalletConnection();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center mt-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Connect your wallet</h1>
          <p className="text-muted-foreground mb-6">
            Please connect your wallet to view your POAPs.
          </p>
          <ConnectButton 
            connectText="Connect Wallet"
            className="bg-gradient-to-r from-event-primary to-event-accent hover:opacity-90 transition-opacity"
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-40 bg-gray-200 dark:bg-zinc-800 rounded mb-4"></div>
          <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My POAPs</h1>
          <p className="text-muted-foreground">
            Collection of proof of attendance protocol tokens.
          </p>
        </div>

        {userPOAPs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userPOAPs.map((poap) => (
              <POAPCard key={poap.id} poap={poap} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No POAPs yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't claimed any POAPs yet. Attend events and claim your proof of attendance.
            </p>
            <Button className="bg-gradient-to-r from-event-primary to-event-accent">
              <Link to="/events">Explore Events</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPOAPs;
