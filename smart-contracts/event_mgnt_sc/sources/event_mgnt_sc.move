module event_mgnt_sc::event_mgnt_sc {

    use std::string::String;
    use sui::object::{Self as object, UID, ID};
    use sui::tx_context::{Self as tx_context, TxContext};
    use sui::transfer;
    use sui::balance::{Self as balance, Balance};
    use sui::coin::{Self as coin, Coin};
    use sui::clock::{Self as clock, Clock};
    use sui::sui::SUI;
    use sui::event;
    use sui::vec_map::{Self as vec_map, VecMap};
    use std::vector::insert;
    use std::ascii::string;


    // Constants
    const PLATFORM_ADDR: address = @0xCAFE;
    const FEE_BPS: u64 = 250; 
    const BPS_DENOM: u64 = 10_000;

    // Error codes
    const E_EVENT_CLOSED: u64 = 0;
    const E_SOLD_OUT: u64 = 1;
    const E_WRONG_EVENT: u64 = 2;
    const E_NOT_ATTENDED: u64 = 3;
    const E_POAP_CLAIMED: u64 = 4;
    const EMaxTicketsReached: u64 = 5;
    const EInsufficientPayment: u64 = 6;
    const EInvalidPaymentForFreeEvent: u64 = 7;
    const EUnauthorized: u64 = 8;
    const EEventNotEnded: u64 = 9;


    public struct TicketType has store {
        name: String,
        description: String,
        price: u64,
        max_tickets: u64,
        tickets_sold: u64,
        cover_img: String,

    }
    /// Singleton object that stores the platform fee recipient.
    public struct Platform has key, store {
        id: UID,
        admin: address,
        events: VecMap<ID, Event>
    }

    public struct Event has key, store {
        
        id: UID,
        organizer: address,
        name: String,
        description: String,
        timestamp: u64,
        location: String,
        is_paid: bool,
        tickets_sold: u64,
        balance: Balance<SUI>,
        closed: bool,
        cover_img:String,
        ticket_type:vector<TicketType>,
        registered_users: vector<address>, // registered User objects
        attended_users: vector<address>, // attended User objects
    }

    public struct Ticket has key, store {
        id: UID,
        event_id: ID,
        ticket_type: u64,
        owner: address,
        attended: bool,
        poap_claimed: bool,
    }


    public struct Poap has key, store {
        id: UID,
        event_id: ID,
    }

    public struct TicketPurchased has copy, drop {
        event_id: ID,
        ticket_id: u64,
        buyer: address,
    }

    public struct RevenueWithdrawn has copy, drop {
        event_id: ID,
        amount: u64,
        organizer: address,
    }
    // Getter functions for Platform
    public fun get_platform_events(platform: &Platform): &VecMap<ID, Event> {
        &platform.events
    }

    // Getter functions for Event
    public fun get_event_id(event: &Event): ID {
        object::uid_to_inner(&event.id)
    }

    public fun get_event_organizer(event: &Event): address {
        event.organizer
    }

    public fun get_event_name(event: &Event): String {
        event.name
    }

    public fun get_event_description(event: &Event): String {
        event.description
    }

    public fun get_event_timestamp(event: &Event): u64 {
        event.timestamp
    }

    public fun get_event_location(event: &Event): String {
        event.location
    }

    public fun get_event_is_paid(event: &Event): bool {
        event.is_paid
    }

   

    public fun get_event_tickets_sold(event: &Event): u64 {
        event.tickets_sold
    }

    public fun get_event_closed(event: &Event): bool {
        event.closed
    }
 
    public fun get_event_ticket_type(event: &Event): &vector<TicketType> {
        &event.ticket_type
    }

    // Getter: Return all active events (not closed)
    public fun get_active_events(platform: &Platform): vector<ID> {
        let mut result = vector::empty<ID>();
        let keys = sui::vec_map::keys(&platform.events);
        let mut i = 0;
        while (i < vector::length(&keys)) {
            let key = *vector::borrow(&keys, i);
            let evt = sui::vec_map::get(&platform.events, &key);
            if (!evt.closed) {
                vector::push_back(&mut result, key);
            };
            i = i + 1;
        };
        result
    }


    // Getter: Return all event IDs by organizer
    public fun get_events_by_organizer(platform: &Platform, organizer: address): vector<ID> {
        let mut result = vector::empty<ID>();
        let keys = sui::vec_map::keys(&platform.events);
        let mut i = 0;
        while (i < vector::length(&keys)) {
            let key = *vector::borrow(&keys, i);
            let evt = sui::vec_map::get(&platform.events, &key);
            if (evt.organizer == organizer) {
                vector::push_back(&mut result, key);
            };
            i = i + 1;
        };
        result
    }

    // Getter: Return a reference to an event by its ID
    public fun get_event_by_id(self: &Platform, event_id: &ID): &Event {
        sui::vec_map::get(&self.events, event_id)
    }


    public entry fun initialize_platform(ctx: &mut TxContext) {
        let platform = Platform {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
            events: sui::vec_map::empty<ID, Event>()
        };
        transfer::share_object(platform); // 🔥 this will make it shared
    }

    public entry fun create_event(
        self: &mut Platform,
        name: String,
        description: String,
        timestamp: u64,
        location: String,
        is_paid: bool,
       
        cover_img: String,
        ticket_names: vector<String>,
        ticket_descriptions: vector<String>,
        ticket_prices: vector<u64>,
        ticket_limits: vector<u64>,
        ticket_images: vector<String>,
        ctx: &mut TxContext
    ): ID {
        let id = object::new(ctx);
        let organizer = tx_context::sender(ctx);
        let balance = balance::zero<SUI>();

        let mut ticket_types: vector<TicketType> = vector::empty();
        let len = vector::length(&ticket_names);
        let mut i = 0;
        while (i < len) {
            let t = TicketType {
                name: *vector::borrow(&ticket_names, i),
                description: *vector::borrow(&ticket_descriptions, i),
                price: *vector::borrow(&ticket_prices, i),
                max_tickets: *vector::borrow(&ticket_limits, i),
                tickets_sold: 0,
                cover_img: *vector::borrow(&ticket_images, i),
            };
            vector::push_back(&mut ticket_types, t);
            i = i + 1;
        };
        let mut registered_users = vector::empty<address>();
        let mut attended_users = vector::empty<address>();


        let new_event = Event {
            id,
            organizer,
            name,
            description,
            timestamp,
            location,
            is_paid,
            tickets_sold: 0,
            balance,
            closed: false,
            cover_img,
            ticket_type: ticket_types,
            registered_users,
            attended_users,
        };

        let eid = object::uid_to_inner(&new_event.id);
        sui::vec_map::insert(&mut self.events, eid, new_event);
        eid
    }

    public fun get_event_mut(
        self: &mut Platform,
        event_id: &ID
    ): &mut Event {
        sui::vec_map::get_mut(&mut self.events, event_id)
    }
    public fun get_event(
        self: &Platform,
        event_id: &ID
    ): &Event {
        sui::vec_map::get(&self.events, event_id)
    }

     #[allow(lint(self_transfer))]
    public fun buy_ticket(
        self: &mut Platform,
        event_id: ID,
        payment: Coin<SUI>,
        ticket_type_id: u64,
        ctx: &mut TxContext
    ) {
        let admin = self.admin;
        let event = sui::vec_map::get_mut(&mut self.events, &event_id);

        let buyer = tx_context::sender(ctx);
        let price = event.ticket_type[ticket_type_id].price;
        let max_tickets = event.ticket_type[ticket_type_id].max_tickets;
        let ticket_sold = event.ticket_type[ticket_type_id].tickets_sold;

        assert!(!event.closed, E_EVENT_CLOSED);
        assert!(ticket_sold < max_tickets, EMaxTicketsReached);

        if (event.is_paid) {
            let value = coin::value(&payment);
            assert!(value >= price, EInsufficientPayment);

            let mut payment_balance = coin::into_balance(payment);
            let mut taken = balance::split(&mut payment_balance, price);

            let fee_amt = price * FEE_BPS / BPS_DENOM;
            let _org_amt = price - fee_amt;

            let fee_bal = balance::split(&mut taken, fee_amt);
            balance::join(&mut event.balance, taken);

            transfer::public_transfer(coin::from_balance(fee_bal, ctx), admin);

            if (balance::value(&payment_balance) > 0) {
                transfer::public_transfer(coin::from_balance(payment_balance, ctx), buyer);
            } else {
                balance::destroy_zero(payment_balance);
            }
        } else {
            assert!(coin::value(&payment) == 0, EInvalidPaymentForFreeEvent);
            coin::destroy_zero(payment);
        };

        event.tickets_sold = event.tickets_sold + 1;
        event.ticket_type[ticket_type_id].tickets_sold = event.ticket_type[ticket_type_id].tickets_sold + 1;

        // Step 2: Release the mutable borrow of `event` before using `self` again
        let event_id_copy = object::uid_to_inner(&event.id); // make a copy
         let id = object::new(ctx);

        // Now, create the user and push ticket
        let ticket = Ticket {
            id,
            event_id: event_id_copy,
            ticket_type: ticket_type_id,
            owner: buyer,
            attended: false,
            poap_claimed: false,
        };


        // Fire event and transfer
        event::emit(TicketPurchased {
            event_id: event_id_copy,
            ticket_id: event.tickets_sold,
            buyer,
        });

        transfer::transfer(ticket, buyer);

        
    }


    public fun mark_attended(self: &mut Platform, ticket: &mut Ticket, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let event = sui::vec_map::get_mut(&mut self.events, &ticket.event_id);
        assert!(event.organizer == sender, EUnauthorized);
        assert!(ticket.attended == false, E_NOT_ATTENDED);
        let owner = ticket.owner;
        if (!vector::contains(&event.registered_users, &owner)) {
            vector::push_back(&mut event.registered_users, owner);
        };
        ticket.attended = true;
    }

    public entry fun close_event(event: &mut Event, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(event.organizer == sender, EUnauthorized);
        event.closed = true;
    }

    public fun claim_poap(ticket: &mut Ticket, ctx: &mut TxContext) {
        assert!(ticket.attended, E_NOT_ATTENDED);
        assert!(!ticket.poap_claimed, E_POAP_CLAIMED);
        let owner = ticket.owner;
        let sender = tx_context::sender(ctx);
        assert!(owner == sender, EUnauthorized);
        ticket.poap_claimed = true;
        let id = object::new(ctx);
        let poap = Poap {
            id,
            event_id: ticket.event_id,
        };
        transfer::transfer(poap, owner);
        
    }

    public fun withdraw_revenue(event: &mut Event, clock: &Clock, ctx: &mut TxContext): Coin<SUI> {
        let caller = tx_context::sender(ctx);
        assert!(caller == event.organizer, EUnauthorized);
        let now = clock::timestamp_ms(clock);
        assert!(now > event.timestamp, EEventNotEnded);

        let amount = balance::value(&event.balance);
        let bal = balance::withdraw_all(&mut event.balance);

        event::emit(RevenueWithdrawn {
            event_id: object::uid_to_inner(&event.id),
            amount,
            organizer: caller,
        });

        coin::from_balance(bal, ctx)
    }

    public entry fun transfer_ticket(ticket: Ticket, recipient: address, _ctx: &mut TxContext) {
        assert!(ticket.owner == tx_context::sender(_ctx), EUnauthorized);
        assert!(ticket.attended == false, E_NOT_ATTENDED);
        assert!(recipient != ticket.owner, EUnauthorized);
        let mut ticket_mut = ticket;
        ticket_mut.owner = recipient;
        transfer::public_transfer(ticket_mut, recipient);
    }
    public entry fun update_platform_admin(
        platform: &mut Platform,
        new_admin: address,
        ctx: &TxContext
    ) {
        assert!(tx_context::sender(ctx) == platform.admin, EUnauthorized);
        platform.admin = new_admin;
    }

    public entry fun update_event(
        event: &mut Event,
        name: String,
        description: String,
        timestamp: u64,
        location: String,
        is_paid: bool,
    
    ) {
        event.name = name;
        event.description = description;
        event.timestamp = timestamp;
        event.location = location;
        event.is_paid = is_paid;
    }


}
