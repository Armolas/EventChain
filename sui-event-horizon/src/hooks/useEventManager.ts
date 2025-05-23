// hooks/useEventManager.ts
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useNetworkVariable } from '../utils/networkConfig';
import { useQuery } from '@tanstack/react-query';

export function useEventManager() {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const packageId = "0xeeea3e14b44ebc4db154f243ecfc6cbdbee8390b4c01a6b8cf893a4d5514a65c";
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
    const target = `${packageId}::event_mgnt_sc::create_event`;
    tx.moveCall({
      target: target,
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
  const markAttended = async (
    platformId: string,
    ticketId: string,
    capId: string
  ) => {
    const tx = new Transaction();
    const target = `${packageId}::event_mgnt_sc::mark_attended`;
    tx.moveCall({
      target: target,
      arguments: [
        tx.object(platformId),
        tx.object(ticketId),
        tx.object(capId),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Close Event
  const closeEvent = async (platformId: string, eventId: string, capId: string) => {
    const tx = new Transaction();
    const target = `${packageId}::event_mgnt_sc::close_event`;
    tx.moveCall({
      target: target,
      arguments: [
        tx.object(platformId),
        tx.object(eventId),
        tx.object(capId),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Claim POAP
  const claimPoap = async (platformId: string, ticketId: string) => {
    const tx = new Transaction();
    const target = `${packageId}::event_mgnt_sc::claim_poap`;
    tx.moveCall({
      target: target,
      arguments: [
        tx.object(platformId),
        tx.object(ticketId),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Withdraw Revenue
  const withdrawRevenue = async (
    platformId: string,
    eventId: string,
    clockId: string
  ) => {
    const tx = new Transaction();
    const target = `${packageId}::event_mgnt_sc::withdraw_revenue`;
    tx.moveCall({
      target: target,
      arguments: [
        tx.object(platformId),
        tx.object(eventId),
        tx.object(clockId),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Transfer Ticket
  const transferTicket = async (
    platformId: string,
    ticketId: string,
    recipient: string
  ) => {
    const tx = new Transaction();
    const target = `${packageId}::event_mgnt_sc::transfer_ticket`;
    tx.moveCall({
      target: target,
      arguments: [
        tx.object(platformId),
        tx.object(ticketId),
        tx.pure.address(recipient),
      ],
    });
    return signAndExecuteTransaction({ transaction: tx });
  };

  // Update Platform Admin
  const updatePlatformAdmin = async (
    platformId: string,
    newAdmin: string
  ) => {
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
    platformId: string,
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
        tx.object(platformId),
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
        
        // The events are stored in a VecMap in the platform object
        // This might require custom parsing depending on how it's stored
        // You may need to adjust this based on your actual storage structure
        const contentFields = (platform.data.content as any)?.fields || {};
        const events = contentFields.events?.fields?.contents || [];
        return events.map((event: any) => event.fields.value);
      },
      enabled: !!platformId,
    });
  };

  // Get all active events (not closed)
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

  // Get user tickets
  const useUserTickets = (platformId: string, userAddress: string) => {
    return useQuery({
      queryKey: ['userTickets', platformId, userAddress],
      queryFn: async () => {
        const platform = await getPlatform(platformId);
        if (!platform.data?.content || platform.data.content.dataType !== 'moveObject') {
          return [];
        }
        
        // Check if user exists in the platform's users map
        const fields = (platform.data.content as any)?.fields || {};
        const users = fields.users?.fields?.contents || [];
        const user = users.find((u: any) => u.fields.key === userAddress);
        
        return user?.fields.value?.fields?.tickets || [];
      },
      enabled: !!platformId && !!userAddress,
    });
  };

  // Get user POAPs
  const useUserPoaps = (platformId: string, userAddress: string) => {
    return useQuery({
      queryKey: ['userPoaps', platformId, userAddress],
      queryFn: async () => {
        const platform = await getPlatform(platformId);
        if (!platform.data?.content || platform.data.content.dataType !== 'moveObject') {
          return [];
        }
        
        // Check if user exists in the platform's users map
        const users = (platform.data.content as any).fields.users?.fields?.contents || [];
        const user = users.find((u: any) => u.fields.key === userAddress);
        
        return user?.fields.value?.fields?.poaps || [];
      },
      enabled: !!platformId && !!userAddress,
    });
  };

  // Get events by organizer
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
        return event?.fields?.ticket_type || [];
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