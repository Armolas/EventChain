
import { Button } from "@/components/ui/button";
// import { useWallet } from "@/contexts/WalletContext";
import { ConnectButton } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui.js/utils";
import { useWalletConnection } from "@/hooks/useWalletConnnection";
import { 
  CalendarDays, 
  Ticket, 
  User, 
  Wallet,
  Menu,
  X,
  Plus
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    isConnected, 
    currentAccount, 
    disconnect, 
    isReady 
  } = useWalletConnection();

  const displayAddress = currentAccount ? formatAddress(currentAccount.address) : "";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-event-primary to-event-accent flex items-center justify-center">
            <Ticket className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl">EventChain</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/events" className="text-sm font-medium hover:text-event-primary transition-colors">
            Explore Events
          </Link>
          <Link to="/my-tickets" className="text-sm font-medium hover:text-event-primary transition-colors">
            My Tickets
          </Link>
          <Link to="/my-poaps" className="text-sm font-medium hover:text-event-primary transition-colors">
            My POAPs
          </Link>
          {isConnected && (
            <Link to="/create-event" className="text-sm font-medium hover:text-event-primary transition-colors">
              Create Event
            </Link>
          )}
        </nav>

        {/* Wallet Connection */}
        <div className="hidden md:flex items-center space-x-4">
          {isReady ? (isConnected ? (
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-2"
                onClick={disconnect}
              >
                <User className="h-3 w-3" />
                {displayAddress}
              </Button>
              <Link to="/create-event">
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Create
                </Button>
              </Link>
            </div>
          ) : (
              <ConnectButton 
                connectText="Connect Wallet"
                className="bg-gradient-to-r from-event-primary to-event-accent hover:opacity-90 transition-opacity"
              />
            )
           ) : (
            <Button className="bg-gradient-to-r from-event-primary to-event-accent hover:opacity-90 transition-opacity" disabled>
              Loading...
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-b">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/events" 
              className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CalendarDays className="h-5 w-5 text-event-primary" />
              <span>Explore Events</span>
            </Link>
            <Link 
              to="/my-tickets" 
              className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Ticket className="h-5 w-5 text-event-primary" />
              <span>My Tickets</span>
            </Link>
            <Link 
              to="/my-poaps" 
              className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-5 w-5 text-event-primary" />
              <span>My POAPs</span>
            </Link>
            {isConnected && (
              <Link 
                to="/create-event" 
                className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Plus className="h-5 w-5 text-event-primary" />
                <span>Create Event</span>
              </Link>
            )}
            
            {/* Mobile wallet connection */}
            <div className="pt-2 border-t">
              {isReady ? (
                isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 px-2 py-2">
                      <User className="h-5 w-5 text-event-primary" />
                      <span className="text-sm truncate">{displayAddress}</span>
                    </div>
                    <Button
                      onClick={disconnect}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <ConnectButton
                    connectText="Connect Wallet"
                    className="w-full bg-gradient-to-r from-event-primary to-event-accent"
                  />
                )
              ) : (
                <Button className="w-full bg-gradient-to-r from-event-primary to-event-accent" disabled>
                  Loading...
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
