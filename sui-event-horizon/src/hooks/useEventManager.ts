// hooks/useEventManager.ts
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useQuery } from '@tanstack/react-query';


export function useEventManager() {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const packageId = "0x00d783254dc24acdd0f6fbe2dd43bea9b33dd28fbd5e83bd88f2f8a8ac1cd51e";
  const account = useCurrentAccount();

  // ========== Transaction Functions ==========

  // Initialize Platform
  const initializePlatform = async () => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::event_mgnt_sc::initialize_platform`,
      arguments: [],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Create Event
  const createEvent = async (
    platformId: string,
    name: string,
    description: string,
    timestamp: number,
    location: string,
    isPaid: boolean,
    coverImg: string,
    ticketNames: string[],
    ticketDescriptions: string[],
    ticketPrices: number[],
    ticketLimits: number[],
    ticketImages: string[]
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::event_mgnt_sc::create_event`,
      arguments: [
        tx.object(platformId),
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.u64(timestamp),
        tx.pure.string(location),
        tx.pure.bool(isPaid),
        tx.pure.string(coverImg),
        tx.pure.vector('string', ticketNames),
        tx.pure.vector('string', ticketDescriptions),
        tx.pure.vector('u64', ticketPrices),
        tx.pure.vector('u64', ticketLimits),
        tx.pure.vector('string', ticketImages),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Buy Ticket
  const buyTicket = async (
    platformId: string,
    eventId: string,
    paymentObjectId: string,
    ticketTypeId: number,
    ticketPrice: bigint // Pass the price as a bigint or number
  ) => {
    const tx = new Transaction();
    const target = `${packageId}::event_mgnt_sc::buy_ticket`;

    const [splitCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(ticketPrice)]);
    tx.moveCall({
      target: target,
      arguments: [
        tx.object(platformId),
        tx.pure.id(eventId),
        splitCoin,
        tx.pure.u64(ticketTypeId),
      ],
    });

    return signAndExecuteTransaction({ transaction: tx });
  };

  // Mark Attended
  const markAttended = async (platformId: string, ticketId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::event_mgnt_sc::mark_attended`,
      arguments: [
        tx.object(platformId),
        tx.object(ticketId),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Close Event
  const closeEvent = async (eventId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::event_mgnt_sc::close_event`,
      arguments: [
        tx.object(eventId),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Claim POAP
  const claimPoap = async (ticketId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::event_mgnt_sc::claim_poap`,
      arguments: [
        tx.object(ticketId),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Withdraw Revenue
  const withdrawRevenue = async (eventId: string, clockId: string = '0x6') => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::event_mgnt_sc::withdraw_revenue`,
      arguments: [
        tx.object(eventId),
        tx.object(clockId),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Transfer Ticket
  const transferTicket = async (ticketId: string, recipient: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::event_mgnt_sc::transfer_ticket`,
      arguments: [
        tx.object(ticketId),
        tx.pure.address(recipient),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Update Platform Admin
  const updatePlatformAdmin = async (platformId: string, newAdmin: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::event_mgnt_sc::update_platform_admin`,
      arguments: [
        tx.object(platformId),
        tx.pure.address(newAdmin),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Update Event
  const updateEvent = async (
    eventId: string,
    name: string,
    description: string,
    timestamp: number,
    location: string,
    isPaid: boolean
  ) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::event_mgnt_sc::update_event`,
      arguments: [
        tx.object(eventId),
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.u64(timestamp),
        tx.pure.string(location),
        tx.pure.bool(isPaid),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // ========== Getter Functions ==========

  // Get Platform object
  const getPlatform = async (platformId: string) => {
    return suiClient.getObject({
      id: platformId,
      options: {
        showContent: true,
        showType: true,
      },
    });
  };

  // Get all events
  const useAllEvents = (platformId: string) => {
    return useQuery({
      queryKey: ['allEvents', platformId],
      queryFn: async () => {
        const platform = await getPlatform(platformId);
        if (!platform.data?.content || platform.data.content.dataType !== 'moveObject') {
          return [];
        }
        const contentFields = (platform.data.content as any)?.fields || {};
        const events = contentFields.events?.fields?.contents || [];
        return events.map((event: any) => event.fields.value);
      },
      enabled: !!platformId,
    });
  };

  // Get all active events using the contract's getter
   const useActiveEvents = (platformId: string) => {
    return useQuery({
      queryKey: ['activeEvents', platformId],
      queryFn: async () => {
        const platform = await getPlatform(platformId);
        if (!platform.data?.content || platform.data.content.dataType !== 'moveObject') {
          return [];
        }
        
        // Filter events where closed = false
        const events = (platform.data.content as any).fields.events?.fields?.contents || [];
        return events
          .map((event: any) => event.fields.value)
          .filter((event: any) => !event.fields.closed);
      },
      enabled: !!platformId,
    });
  };

  // Get user tickets (query owned objects of type Ticket)
  const useUserTickets = (userAddress: string) => {
    return useQuery({
      queryKey: ['userTickets', userAddress],
      queryFn: async () => {
        const objects = await suiClient.getOwnedObjects({
          owner: userAddress,
          filter: {
            StructType: `${packageId}::event_mgnt_sc::Ticket`,
          },
          options: { showContent: true },
        });
        return objects.data.map((obj: any) => (obj.data.content as any)?.fields || {});
      },
      enabled: !!userAddress,
    });
  };

  // Get user POAPs (query owned objects of type Poap)
  const useUserPoaps = (userAddress: string) => {
    return useQuery({
      queryKey: ['userPoaps', userAddress],
      queryFn: async () => {
        const objects = await suiClient.getOwnedObjects({
          owner: userAddress,
          filter: {
            StructType: `${packageId}::event_mgnt_sc::Poap`,
          },
          options: { showContent: true },
        });
        return objects.data.map((obj: any) => (obj.data.content as any)?.fields || {});
      },
      enabled: !!userAddress,
    });
  };

  // Get events by organizer using the contract's getter
  const useEventsByOrganizer = (platformId: string, organizerAddress: string) => {
    return useQuery({
      queryKey: ['organizerEvents', platformId, organizerAddress],
      queryFn: async () => {
        const platform = await getPlatform(platformId);
        if (!platform.data?.content || platform.data.content.dataType !== 'moveObject') {
          return [];
        }
        
        // Filter events where organizer matches
        const events = (platform.data.content as any).fields.events?.fields?.contents || [];
        return events
          .map((event: any) => event.fields.value)
          .filter((event: any) => event.fields.organizer === organizerAddress);
      },
      enabled: !!platformId && !!organizerAddress,
    });
  };

  // Get event by ID
  const useEventById = (platformId: string, eventId: string) => {
    return useQuery({
      queryKey: ['event', platformId, eventId],
      queryFn: async () => {
        const platform = await getPlatform(platformId);
        if (!platform.data?.content || platform.data.content.dataType !== 'moveObject') {
          return null;
        }
        
        // Find the specific event
        const events = (platform.data.content as any).fields.events?.fields?.contents || [];
        const event = events.find((e: any) => e.fields.key === eventId);
        
        return event?.fields.value || null;
      },
      enabled: !!platformId && !!eventId,
    });
  };

  // Get ticket types for an event
  const useEventTicketTypes = (platformId: string, eventId: string) => {
    return useQuery({
      queryKey: ['eventTicketTypes', platformId, eventId],
      queryFn: async () => {
        const event = await useEventById(platformId, eventId).data;
        return event?.ticket_type || [];
      },
      enabled: !!platformId && !!eventId,
    });
  };

  return {
    // Transaction functions
    initializePlatform,
    createEvent,
    buyTicket,
    markAttended,
    closeEvent,
    claimPoap,
    withdrawRevenue,
    transferTicket,
    updatePlatformAdmin,
    updateEvent,

    // Getter functions
    getPlatform,
    useAllEvents,
    useActiveEvents,
    useUserTickets,
    useUserPoaps,
    useEventsByOrganizer,
    useEventById,
    useEventTicketTypes,
  };
}