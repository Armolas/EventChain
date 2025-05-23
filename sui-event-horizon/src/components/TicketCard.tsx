import { Ticket } from "@/contexts/EventsContext";
import { Calendar, MapPin, QrCode, User, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEvents } from "@/contexts/EventsContext";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard = ({ ticket }: TicketCardProps) => {
  const [showQR, setShowQR] = useState(false);
  // const { transferTicket } = useEvents();
  const currentAccount = useCurrentAccount();
  const { getEventById } = useEvents();
  const event = getEventById(ticket.eventId);
  const ticketTypeId = ticket.ticketTypeId;
  const ticketType = event?.ticketTypes[ticketTypeId];
  const eventDate = new Date(event?.timestamp || Date.now());

  // Format timestamp to readable date

  const formattedDate = eventDate.toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      <div className="glassmorphism-card overflow-hidden group">
        <div className="relative h-32">
          <img
            src={event.imageUrl || "/placeholder-event.jpg"}
            alt={ticket.eventName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="font-bold text-lg line-clamp-1">{ticket.eventName}</h3>
            <div className="text-xs opacity-80 flex items-center gap-2 mt-1">
              <span>{ticket.id}</span>
              {ticket.attended ? (
                <span className="flex items-center text-emerald-300">
                  <Check className="h-3 w-3 mr-1" /> Attended
                </span>
              ) : (
                <span className="flex items-center text-amber-300">
                  <X className="h-3 w-3 mr-1" /> Not used
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-3 pb-3 border-b border-gray-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Date: {formattedDate}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5 mr-1.5" />
              <span>Owner: {ticket.owner.slice(0, 6)}...{ticket.owner.slice(-4)}</span>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQR(true)}
              className="flex-1 flex items-center justify-center"
            >
              <QrCode className="h-4 w-4 mr-2" />
              View Ticket
            </Button>
            {ticket.attended ? (
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                <Link to={`/claim-poap/${ticket.id}`}>
                  Claim POAP
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="flex-1"
                disabled={ticket.owner !== currentAccount?.address}
              >
                <Link to={`/transfer-ticket/${ticket.id}`}>
                  Transfer
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Ticket</DialogTitle>
            <DialogDescription>
              Present this QR code at the event entrance
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-white p-4 rounded-lg mb-3">
              <div className="w-64 h-64 bg-black/90 flex items-center justify-center">
                <QrCode className="h-32 w-32 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg">{ticket.eventName}</h3>
              <div className="text-sm text-muted-foreground mb-1">
                {ticketType?.name || "General Admission"}
              </div>
              <div className="text-xs text-muted-foreground">
                Ticket ID: {ticket.id}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Owner: {ticket.owner.slice(0, 6)}...{ticket.owner.slice(-4)}
              </div>
              {ticket.attended && (
                <div className="text-xs text-emerald-500 mt-1 flex items-center justify-center">
                  <Check className="h-3 w-3 mr-1" /> Already checked in
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TicketCard;