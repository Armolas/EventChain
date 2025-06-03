import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useEventManager } from '@/hooks/useEventManager';
import { useCurrentAccount } from '@mysten/dapp-kit';

// Types
export interface TicketType {
  id: number; // Unique identifier for the ticket type
  name: string;
  description: string;
  price: string; // Using string for price to avoid floating-point precision issues
  maxSupply: number;
  remainingSupply: number;
  coverImg: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  timestamp: number; // Unix timestamp in milliseconds
  imageUrl: string;
  organizer: string;
  isPaid: boolean;
  ticketTypes: TicketType[];
  closed: boolean;
}

export interface Ticket {
  id: string;
  eventId: string;
  ticketTypeId: number;
  eventName: string;
  owner: string;
  attended: boolean;
  poapClaimed: boolean;
}

export interface POAP {
  id: string;
  eventId: string;
  eventName: string;
  imageUrl: string;
  claimedAt: number; // Unix timestamp
}

interface EventsContextProps {
  events: Event[];
  userTickets: Ticket[];
  userPOAPs: POAP[];
  loading: boolean;
  filteredEvents: Event[];
  applyFilters: (filters: EventFilters) => void;
  getEventById: (id: string) => Event | undefined;
  purchaseTicket: (eventId: string, ticketTypeId: number, paymentObjectId: string) => Promise<boolean>;
  createEvent: (eventData: Omit<Event, 'id' | 'organizer' | 'closed'>, ticketTypes: Omit<TicketType, 'id' | 'remainingSupply'>[]) => Promise<boolean>;
  markAttended: (ticketId: string, capId: string) => Promise<boolean>;
  claimPoap: (ticketId: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  transferEventTicket: (ticketId: string, recipientAddress: string) => Promise<boolean>;
}

export interface EventFilters {
  location?: string;
  dateRange?: { start?: number; end?: number };
  isPaid?: boolean;
  search?: string;
  organizer?: string;
}

const EventsContext = createContext<EventsContextProps | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

interface EventsProviderProps {
  children: ReactNode;
  platformId: string;
}

export const EventsProvider = ({ children, platformId }: EventsProviderProps) => {
  const currentAccount = useCurrentAccount();
  const {
    useAllEvents,
    useActiveEvents,
    useUserTickets,
    useUserPoaps,
    useEventsByOrganizer,
    useEventById,
    buyTicket,
    transferTicket,
    createEvent: createEventSC,
    markAttended: markAttendedSC,
    claimPoap: claimPoapSC,
  } = useEventManager();

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [userPOAPs, setUserPOAPs] = useState<POAP[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all events data
  const { data: allEventsData, refetch: refetchEvents } = useAllEvents(platformId);
  const { data: activeEventsData } = useActiveEvents(platformId);
  
  // Fetch user-specific data
  const { data: userTicketsData, refetch: refetchUserTickets } = useUserTickets(
    currentAccount?.address || ''
  );
  
  const { data: userPoapsData, refetch: refetchUserPoaps } = useUserPoaps(
    currentAccount?.address || ''
  );

  // Transform contract data to our app's format
  const transformEventData = useCallback((rawEvents: any[]): Event[] => {
    console.log('rawEvents', rawEvents);
    return rawEvents.map((rawEvent: any) => ({
      id: rawEvent.fields.id.id,
      name: rawEvent.fields.name,
      description: rawEvent.fields.description,
      location: rawEvent.fields.location,
      timestamp: Number(rawEvent.fields.timestamp),
      imageUrl: rawEvent.fields.cover_img,
      organizer: rawEvent.fields.organizer,
      isPaid: rawEvent.fields.is_paid,
      closed: rawEvent.fields.closed,
      ticketTypes: rawEvent.fields.ticket_type.map((t: any, index: number) => ({
        id: index, // Use index as unique identifier
        name: t.fields.name,
        description: t.fields.description,
        price: (Number(t.fields.price) / 1e9).toString(), // Convert from MIST to SUI
        maxSupply: Number(t.fields.max_tickets),
        remainingSupply: Number(t.fields.max_tickets) - Number(t.fields.tickets_sold),
        coverImg: t.fields.cover_img,
      })),
    }));
  }, []);

  const transformTicketData = useCallback((rawTickets: any[], events: Event[]): Ticket[] => {
    return rawTickets.map((ticket: any) => {
      const event = events.find(e => e.id === ticket.event_id);
      return {
        id: ticket.id.id.toString(),
        eventId: ticket.event_id,
        ticketTypeId: ticket.ticket_type,
        eventName: event?.name || 'Unknown Event',
        owner: ticket.owner,
        attended: ticket.attended,
        poapClaimed: ticket.poap_claimed,
      };
    });
  }, []);

  const transformPoapData = useCallback((rawPoaps: any[], events: Event[]): POAP[] => {
    return rawPoaps.map((poap: any) => {
      const event = events.find(e => e.id === poap.fields.event_id);
      return {
        id: poap.fields.id.id,
        eventId: poap.fields.event_id,
        eventName: event?.name || 'Unknown Event',
        imageUrl: event?.imageUrl || '',
        claimedAt: Date.now(), // Use current time since contract doesn't store claim time
      };
    });
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        refetchEvents(),
        refetchUserTickets(),
        refetchUserPoaps(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  }, [refetchEvents, refetchUserTickets, refetchUserPoaps]);

  // Update state when data changes
  useEffect(() => {
    if (allEventsData && userTicketsData && userPoapsData) {
      const transformedEvents = transformEventData(allEventsData);
      setEvents(transformedEvents);
      setFilteredEvents(transformedEvents);
      
      setUserTickets(transformTicketData(userTicketsData, transformedEvents));
      setUserPOAPs(transformPoapData(userPoapsData, transformedEvents));
      setLoading(false);
    }
  }, [allEventsData, userTicketsData, userPoapsData, transformEventData, transformTicketData, transformPoapData]);

  const applyFilters = useCallback((filters: EventFilters) => {
    let filtered = [...events];
    
    if (filters.location) {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.dateRange) {
      filtered = filtered.filter(event => {
        const eventDate = event.timestamp;
        const matchesStart = !filters.dateRange?.start || eventDate >= filters.dateRange.start;
        const matchesEnd = !filters.dateRange?.end || eventDate <= filters.dateRange.end;
        return matchesStart && matchesEnd;
      });
    }
    
    if (filters.isPaid !== undefined) {
      filtered = filtered.filter(event => event.isPaid === filters.isPaid);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchLower) || 
        event.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.organizer) {
      filtered = filtered.filter(event => 
        event.organizer === filters.organizer
      );
    }
    
    setFilteredEvents(filtered);
  }, [events]);

  const getEventById = useCallback((id: string) => {
    return events.find(event => event.id === id);
  }, [events]);

  const transferEventTicket = useCallback(async (
    ticketId: string,
    recipientAddress: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const ticket = userTickets.find(t => t.id === ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      console.log('Transferring ticket:', { ticketId, recipientAddress });
      await transferTicket(ticketId, recipientAddress);
      await refreshData();
      return true;
    } catch (error) {
      console.error('Error transferring ticket:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [transferTicket, platformId, userTickets, refreshData]); 

  const purchaseTicket = useCallback(async (
    eventId: string,
    ticketTypeId: number,
    paymentObjectId: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Purchasing ticket:', { eventId, ticketTypeId, paymentObjectId });
      // Find the event and ticket type to get the price
      const event = events.find(e => e.id === eventId);
      const ticketType = event?.ticketTypes.find(t => t.id === ticketTypeId);
      if (!ticketType) {
        throw new Error('Ticket type not found');
      }
      const ticketPrice = Math.floor(parseFloat(ticketType.price) * 1e9); // Convert SUI to MIST
      await buyTicket(platformId, eventId, paymentObjectId, ticketTypeId, BigInt(ticketPrice));
      await refreshData();
      return true;
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [buyTicket, platformId, refreshData]);

  const createEvent = useCallback(async (
    eventData: Omit<Event, 'id' | 'organizer' | 'closed'>,
    ticketTypes: Omit<TicketType, 'id' | 'remainingSupply'>[]
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Transform ticket types data for the contract
      const ticketNames = ticketTypes.map(t => t.name);
      const ticketDescriptions = ticketTypes.map(t => t.description);
      const ticketPrices = ticketTypes.map(t => Math.floor(parseFloat(t.price) * 1e9)); // Convert SUI to MIST
      const ticketLimits = ticketTypes.map(t => t.maxSupply);
      const ticketImages = ticketTypes.map(t => t.coverImg);

      await createEventSC(
        platformId,
        eventData.name,
        eventData.description,
        eventData.timestamp,
        eventData.location,
        eventData.isPaid,
        eventData.imageUrl,
        ticketNames,
        ticketDescriptions,
        ticketPrices,
        ticketLimits,
        ticketImages
      );

      await refreshData();
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [createEventSC, platformId, refreshData]);

  const markAttended = useCallback(async (
    ticketId: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await markAttendedSC(platformId, ticketId);
      await refreshData();
      return true;
    } catch (error) {
      console.error('Error marking ticket as attended:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [markAttendedSC, platformId, refreshData]);

  const claimPoap = useCallback(async (
    ticketId: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await claimPoapSC(ticketId);
      await refreshData();
      return true;
    } catch (error) {
      console.error('Error claiming POAP:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [claimPoapSC, platformId, refreshData]);

  return (
    <EventsContext.Provider
      value={{
        events,
        userTickets,
        userPOAPs,
        loading,
        filteredEvents,
        applyFilters,
        getEventById,
        purchaseTicket,
        createEvent,
        markAttended,
        claimPoap,
        refreshData,
        transferEventTicket
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};