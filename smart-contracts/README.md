# Sui Smart Contracts

# Event Management Smart Contract

This Move smart contract provides a platform for managing events, ticket sales, and associated functionalities such as revenue withdrawal, ticket transfers, and Proof of Attendance Protocol (POAP) claims. The contract is designed to facilitate event organization and ticketing in a decentralized manner.

## Features

- **Platform Initialization**: Set up the platform with an admin and manage events.
- **Event Creation**: Organizers can create events with details like name, description, location, ticket price, and maximum tickets.
- **Ticket Purchase**: Users can buy tickets for events, with support for both paid and free events.
- **Attendance Marking**: Event organizers can mark ticket holders as attended.
- **POAP Claiming**: Attendees can claim a POAP after attending an event.
- **Revenue Withdrawal**: Event organizers can withdraw revenue after the event ends.
- **Ticket Transfer**: Ticket holders can transfer their tickets to others.
- **Event Updates**: Organizers can update event details.
- **Platform Admin Update**: The platform admin can be updated.

---

## Major Functions

### Platform Management

- **`initialize_platform`**

  - Initializes the platform with an admin and an empty list of events.
  - Transfers the platform object to the admin.

- **`update_platform_admin`**
  - Updates the platform admin to a new address.
  - Ensures only the current admin can perform this action.

### Event Management

- **`create_event`**

  - Allows the platform admin to create a new event.
  - Stores event details such as name, description, timestamp, location, ticket price, and maximum tickets.
  - Issues an `EventCap` to the event organizer for managing the event.

- **`update_event`**

  - Allows event organizers to update event details such as name, description, timestamp, location, ticket price, and maximum tickets.

- **`close_event`**
  - Marks an event as closed, preventing further ticket sales.
  - Requires the `EventCap` for authorization.

### Ticket Management

- **`buy_ticket`**

  - Allows users to purchase tickets for an event.
  - Handles payment processing for paid events, including platform fees.
  - Issues a `Ticket` to the buyer.

- **`transfer_ticket`**

  - Allows ticket holders to transfer their tickets to another address.

- **`mark_attended`**

  - Marks a ticket holder as having attended the event.
  - Requires the `EventCap` for authorization.

- **`claim_poap`**
  - Allows attendees to claim a POAP after attending an event.
  - Ensures the ticket is marked as attended and the POAP has not already been claimed.

### Revenue Management

- **`withdraw_revenue`**
  - Allows event organizers to withdraw revenue collected from ticket sales.
  - Ensures the caller is the event organizer and the event has ended.

---

## Data Structures

### Platform

- Stores the platform admin and a list of events.

### Event

- Represents an event with details such as name, description, location, ticket price, maximum tickets, and balance.

### EventCap

- Authorization object for managing a specific event.

### Ticket

- Represents a ticket for an event, including ownership and attendance status.

### Poap

- Represents a Proof of Attendance Protocol (POAP) token for an event.

---

## Error Codes

- **`E_EVENT_CLOSED`**: The event is closed.
- **`E_SOLD_OUT`**: Tickets are sold out.
- **`E_WRONG_EVENT`**: The ticket or cap does not belong to the specified event.
- **`E_NOT_ATTENDED`**: The ticket holder has not attended the event.
- **`E_POAP_CLAIMED`**: The POAP has already been claimed.
- **`EMaxTicketsReached`**: The maximum number of tickets has been reached.
- **`EInsufficientPayment`**: The payment is insufficient for the ticket price.
- **`EInvalidPaymentForFreeEvent`**: Payment was made for a free event.
- **`EUnauthorized`**: The caller is not authorized to perform the action.
- **`EEventNotEnded`**: The event has not ended.

---

## Usage

1. **Initialize the Platform**: Call `initialize_platform` to set up the platform with an admin.
2. **Create an Event**: Use `create_event` to create a new event.
3. **Buy Tickets**: Users can call `buy_ticket` to purchase tickets for an event.
4. **Mark Attendance**: Event organizers can use `mark_attended` to mark attendees.
5. **Claim POAP**: Attendees can call `claim_poap` to claim their POAP.
6. **Withdraw Revenue**: Event organizers can call `withdraw_revenue` to withdraw ticket sales revenue.
7. **Transfer Tickets**: Ticket holders can use `transfer_ticket` to transfer their tickets to others.

---

## License

This smart contract is provided under the MIT License. Use it at your own discretion.
