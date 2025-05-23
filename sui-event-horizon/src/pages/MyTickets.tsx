
import { useEvents } from "@/contexts/EventsContext";
// import { useWallet } from "@/contexts/WalletContext";
import TicketCard from "@/components/TicketCard";
import { Button } from "@/components/ui/button";
import { Ticket, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit";
import { useWalletConnection } from "@/hooks/useWalletConnnection";

const MyTickets = () => {
  const { userTickets, loading } = useEvents();
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
            Please connect your wallet to view your tickets.
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
          <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">
            View and manage your ticket collection.
          </p>
        </div>

        {userTickets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Ticket className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No tickets yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't purchased any tickets yet.
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

export default MyTickets;
