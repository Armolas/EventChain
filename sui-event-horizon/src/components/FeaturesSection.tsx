
import { Calendar, Check, Ticket, Trophy } from "lucide-react";

const features = [
  {
    title: "NFT Tickets",
    description: "Your tickets are NFTs on the blockchain, giving you true ownership and enabling secure transfers.",
    icon: Ticket,
  },
  {
    title: "Create & Manage Events",
    description: "Easily create events with customizable ticket types, pricing, and manage sales in real-time.",
    icon: Calendar,
  },
  {
    title: "POAP Collectibles",
    description: "Attendees can claim digital collectibles that prove they were at your event.",
    icon: Trophy,
  },
  {
    title: "True Ownership",
    description: "Decentralized ticketing means no middlemen, lower fees, and better revenue for organizers.",
    icon: Check,
  },
];

const FeaturesSection = () => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">
          The Future of Event Ticketing
        </h2>
        <p className="text-muted-foreground">
          EventChain leverages blockchain technology to revolutionize how tickets are sold, owned, and transferred.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <div 
            key={i} 
            className="glassmorphism-card p-6 hover-scale"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-event-primary to-event-accent flex items-center justify-center mb-4">
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
