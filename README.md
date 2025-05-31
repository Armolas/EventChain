# 🎉 EventChain - Decentralized Event Management on Sui

EventChain is a decentralized event management platform built on the **Sui blockchain**. It empowers **event organizers** to create both free and paid events, sell NFT-based tickets, and distribute **Proof of Attendance Protocol (POAP)** NFTs after events. Users can explore events, purchase tickets, and prove their attendance – all powered by secure smart contracts.

---

## ✨ Features

### 👥 For Users
- 📅 Browse and explore events
- 🎟 Purchase NFT-based tickets (VIP/Regular tiers)
- 🔁 Transfer/resell tickets to others
- 🪪 Claim **POAP NFTs** after attending events
- 💼 View your owned tickets and POAPs

### 🧑‍💼 For Event Organizers
- 🛠 Create free or paid events
- 🧾 Define ticket tiers, price, and quantity
- 💰 Withdraw revenue after event ends
- 🔐 Only event creators can manage their events

### 👑 For Contract Owner (Platform Admin)
- 🧾 Earns **5% commission** on every paid ticket sale
- 🏦 Withdraw accumulated platform fees
- 🛡 Owns `OwnerCap` that authorizes sensitive admin functions

---

## 🔧 Smart Contract Overview (Sui + Move)

The smart contract is written in Move and deployed on the **Sui blockchain**.

### 📚 Modules and Capabilities

- `Event`: Represents an event (name, description, date, ticket tiers)
- `Ticket`: NFT ticket minted upon purchase (VIP, Regular)
- `POAP`: NFT issued to attendees after the event
- `EventManager`: Stores and manages all events on-chain
- `OwnerCap`: Grants special permissions to the platform admin

### 🧠 Core Functions

| Function | Description |
|---------|-------------|
| `create_event` | Organizer creates an event with tiered tickets |
| `buy_ticket` | User buys ticket to an event (NFT minted) |
| `transfer_ticket` | User transfers ticket to another wallet |
| `withdraw_revenue` | Organizer withdraws event revenue after it ends |
| `claim_poap` | Attendee claims a POAP NFT after the event |
| `withdraw_platform_fee` | Owner withdraws 5% platform commission |

---

## 🖥 Frontend Interface

Built with **React + Tailwind CSS** (or optionally Next.js), the dApp has:

- Home page with event showcase
- Event explorer with filters
- Event detail page with ticket purchase
- Ticket dashboard (owned NFTs)
- POAP collection page
- Event creation page
- Organizer dashboard
- Admin panel (for owner only)

Integration with **Sui Wallet** is used for all transactions and signature authorizations.

---

## 🧪 Testnet Deployment

| Contract | Status |
|----------|--------|
| EventChain Move Package | ✅ Deployed |
| Network | Sui Testnet |
| Explorer Link | *Coming Soon* |
| Contract Address | *Coming Soon* |

---

## 🛠️ Local Development Setup

### 🔗 Prerequisites
- [Node.js](https://nodejs.org)
- [Sui CLI](https://docs.sui.io/build/install)
- [Git](https://git-scm.com)

### 🚀 Backend (Move Contract)

```bash
git clone https://github.com/your-org/eventchain.git
cd eventchain
sui move build
sui move test
sui client publish --gas-budget 100000000
