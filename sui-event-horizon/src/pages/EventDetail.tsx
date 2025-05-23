import { useParams } from "react-router-dom";
import { useEvents } from "@/contexts/EventsContext";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Ticket,
  Share2,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiClient} from "@mysten/dapp-kit";



const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getEventById, purchaseTicket, loading } = useEvents();
  const event = getEventById(id || "");
  
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const isConnected = !!account;


  const getPaymentObject = async (): Promise<string> => {
    if (!account) throw new Error("No wallet connected");
    if (!event || selectedTicket < 0) throw new Error("Event or ticket not selected");

    const selectedTicketType = event.ticketTypes.find(t => t.id === selectedTicket);
    if (!selectedTicketType) throw new Error("Selected ticket not found");

    const ticketPrice = BigInt(Math.floor(parseFloat(selectedTicketType.price) * 1e9));

    // Get all SUI coins
    const { data: coins } = await suiClient.getCoins({
      owner: account.address,
      coinType: "0x2::sui::SUI",
    });

    if (coins.length === 0) throw new Error("No SUI coins found");

    // Find suitable coin (including some extra for gas)
    const suitableCoin = coins.find(coin => 
      BigInt(coin.balance) >= ticketPrice + BigInt(100000000) // Ticket price + 0.1 SUI for gas
    );

    if (!suitableCoin) {
      const totalBalance = coins.reduce((sum, coin) => sum + BigInt(coin.balance), BigInt(0));
      if (totalBalance < ticketPrice + BigInt(100000000)) {
        toast.error("Insufficient balance. Please add more SUI to your wallet.");
        throw new Error(`Insufficient balance. Needed: ${(Number(ticketPrice)/1e9 + 0.1).toFixed(2)} SUI (including gas)`);
      }

      toast.error("Please merge your coins to make a payment");
      throw new Error("Please merge your coins to make a payment");
    }

    return suitableCoin.coinObjectId;
  };

  const handlePurchase = async () => {
    if (selectedTicket < 0 || selectedTicket >= event?.ticketTypes.length) {
      toast.error("Please select a ticket type");
      return;
    }

    try {
      setIsPurchasing(true);
      const paymentObjectId = await getPaymentObject();
      const success = await purchaseTicket(event?.id || "", selectedTicket, paymentObjectId);
      
      if (success) {
        toast.success("Ticket purchased successfully!");
      } else {
        toast.error("Failed to purchase ticket");
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-64 bg-gray-200 dark:bg-zinc-800 rounded mb-4"></div>
          <div className="h-6 w-40 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center mt-16">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <a href="/events">
          <Button>
            Explore Events
          </Button>
        </a>
      </div>
    );
  }
  
  // Convert timestamp to Date object
  const eventDate = new Date(event.timestamp);
  // Format time as HH:MM
  const formattedTime = eventDate.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const hasAvailableTickets = event.ticketTypes.some(
    (ticket) => ticket.remainingSupply > 0
  );

  return (
    <div className="min-h-screen flex flex-col mt-16">
      <div className="w-full h-64 md:h-80 lg:h-96 relative">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Event details */}
          <div className="flex-1">
            <div className="glassmorphism-card p-6 md:p-8 mb-8">
              <div className="inline-flex mb-4">
                <span
                  className={`${
                    event.isPaid
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-emerald-100 text-emerald-800"
                  } text-xs font-medium px-2.5 py-0.5 rounded-full`}
                >
                  {event.isPaid ? "Paid" : "Free"}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-event-primary shrink-0" />
                  <div>
                    <div className="font-medium">Date & Time</div>
                    <div className="text-muted-foreground">
                      {eventDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {" at "}
                      {formattedTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-event-primary shrink-0" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-muted-foreground">{event.location}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="h-5 w-5 mr-3 text-event-primary shrink-0" />
                  <div>
                    <div className="font-medium">Organizer</div>
                    <div className="text-muted-foreground text-sm">
                      {event.organizer}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="font-bold text-lg mb-3">About this event</h2>
                <div
                  className={`text-muted-foreground ${
                    expandedDescription ? "" : "line-clamp-3"
                  }`}
                >
                  {event.description}
                </div>
                <Button
                  variant="ghost"
                  className="mt-2 h-auto p-0 font-medium flex items-center text-event-primary"
                  onClick={() => setExpandedDescription(!expandedDescription)}
                >
                  {expandedDescription ? (
                    <>
                      Show less <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Ticket selection and purchase */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="sticky top-24">
              <div className="glassmorphism-card p-6 mb-6">
                <h2 className="font-bold text-lg mb-4 flex items-center">
                  <Ticket className="h-5 w-5 mr-2 text-event-primary" />
                  Tickets
                </h2>

                {hasAvailableTickets ? (
                  <div className="space-y-4">
                    {event.ticketTypes.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          selectedTicket === ticket.id
                            ? "border-event-primary bg-event-primary/5"
                            : "hover:border-event-primary/50"
                        } ${ticket.remainingSupply === 0 ? "opacity-50" : ""}`}
                        onClick={() => {
                          if (ticket.remainingSupply > 0) {
                            setSelectedTicket(ticket.id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium group relative">
                              {ticket.name}
                              {ticket.description && (
                                <div className="absolute left-0 z-10 mt-2 w-64 rounded bg-background p-2 text-xs text-muted-foreground shadow-lg border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                                  {ticket.description}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {ticket.remainingSupply} remaining
                            </div>
                          </div>
                          <div className="font-bold">
                            {ticket.price === "0" ? (
                              <span className="text-emerald-600">Free</span>
                            ) : (
                              <>
                                {parseFloat(ticket.price).toFixed(2)} SUI
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {isConnected ? (
                      <Button
                        className="w-full bg-gradient-to-r from-event-primary to-event-accent hover:opacity-90"
                        onClick={handlePurchase}
                        disabled= { selectedTicket < 0 || isPurchasing}
                      >
                        {isPurchasing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Purchase Ticket"
                        )}
                      </Button>
                    ) : (
                          <ConnectButton 
                            connectText="Connect Wallet"
                            className="bg-gradient-to-r from-event-primary to-event-accent hover:opacity-90 transition-opacity"
                          />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-xl font-medium mb-2 text-red-500">
                      Sold Out
                    </div>
                    <p className="text-sm text-muted-foreground">
                      All tickets for this event have been sold.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;