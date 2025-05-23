import { Event } from "@/contexts/EventsContext";
import { formatDistanceToNow } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  // Convert timestamp (milliseconds) to Date object
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
    <Link
      to={`/event/${event.id}`}
      className="glassmorphism-card overflow-hidden hover-scale block"
    >
      <div className="relative h-48">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        {!hasAvailableTickets && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
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
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-1 mb-1">{event.name}</h3>
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>
            {eventDate.toLocaleDateString()} · {formattedTime} ·{" "}
            {formatDistanceToNow(eventDate, { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{event.location}</span>
        </div>
        <div className="mt-4 flex flex-col">
          <div className="text-xs text-muted-foreground mb-1">Tickets from:</div>
          <div className="flex items-baseline">
            {event.isPaid ? (
              <>
                <span className="text-lg font-semibold">
                  {Math.min(
                    ...event.ticketTypes.map((t) => parseFloat(t.price))
                  ).toFixed(2)}{" "}
                </span>
                <span className="text-sm ml-1">SUI</span>
              </>
            ) : (
              <span className="text-lg font-semibold text-emerald-600">
                Free
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;