
import { useEvents } from "@/contexts/EventsContext";
// import { useWallet } from "@/contexts/WalletContext";
import { useWalletConnection } from "@/hooks/useWalletConnnection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Ticket, Image, Loader2, Wallet } from "lucide-react";
import { ConnectButton } from "@mysten/dapp-kit";
import { useEventManager } from "@/hooks/useEventManager";
import { platformId } from "@/utils/constants";

const CreateEvent = () => {
  // const { createEvent } = useEvents();
  const { createEvent } = useEventManager();
  const { isConnected, connect } = useWalletConnection();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1488590528505-98d2b5aba04b");
  const [isPaid, setIsPaid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ticket types state
  const [ticketTypes, setTicketTypes] = useState([
    {
      id: "new-1",
      name: "General Admission",
      description: "Access to the event",
      price: 2,
      maxSupply: 100,
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    },
  ]);

  const handleAddTicketType = () => {
    const newId = `new-${ticketTypes.length + 1}`;
    setTicketTypes([
      ...ticketTypes,
      {
        id: newId,
        name: "",
        description: "",
        price: 2,
        maxSupply: 100,
        imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      },
    ]);
  };

  const handleTicketTypeChange = (index: number, field: string, value: string | number) => {
    const updatedTicketTypes = [...ticketTypes];
    // @ts-ignore
    updatedTicketTypes[index][field] = value;
    setTicketTypes(updatedTicketTypes);
  };

  const handleRemoveTicketType = (index: number) => {
    if (ticketTypes.length > 1) {
      const updatedTicketTypes = [...ticketTypes];
      updatedTicketTypes.splice(index, 1);
      setTicketTypes(updatedTicketTypes);
    } else {
      toast.error("You need at least one ticket type");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Basic validation
    if (!name || !description || !location || !date || !time) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate ticket types
    for (const ticket of ticketTypes) {
      if (!ticket.name || ticket.maxSupply <= 0) {
        toast.error("Please fill in all ticket information correctly");
        return;
      }
      if (isPaid && (ticket.price) <= 0) {
        toast.error("Paid events must have a positive ticket price");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      // Update ticket prices if free event
      let processedTicketTypes = [...ticketTypes];
      if (!isPaid) {
        processedTicketTypes = ticketTypes.map(ticket => ({
          ...ticket,
          price: 0,
        }));
      }
      const ticketNames = processedTicketTypes.map(ticket => ticket.name);
      const ticketDescriptions = processedTicketTypes.map(ticket => ticket.description);
      const ticketPrices = processedTicketTypes.map(ticket => ticket.price);
      const ticketMaxSupplies = processedTicketTypes.map(ticket => ticket.maxSupply);
      const ticketImageUrls = processedTicketTypes.map(ticket => ticket.imageUrl);

    
      // Convert ticket prices to the smallest SUI unit (mist, 1 SUI = 1_000_000_000 mist)
      const ticketPricesInMist = ticketPrices.map((price) =>
        Math.round(Number(price) * 1_000_000_000)
      );

      const success = await createEvent(
        platformId,
        name,
        description,
        new Date(`${date}T${time}`).getTime(),
        location,
        isPaid,
        imageUrl,
        ticketNames,
        ticketDescriptions,
        ticketPricesInMist,
        ticketMaxSupplies,
        ticketImageUrls
      );

      if (success) {
        toast.success("Event created successfully!");
        navigate("/events");
      } else {
        toast.error("Failed to create event");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center mt-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Connect your wallet</h1>
          <p className="text-muted-foreground mb-6">
            Please connect your wallet to create an event.
          </p>
          <ConnectButton 
            connectText="Connect Wallet"
            className="bg-gradient-to-r from-event-primary to-event-accent hover:opacity-90 transition-opacity"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Event</h1>
          <p className="text-muted-foreground">
            Set up your event details and start selling tickets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="glassmorphism-card p-6 md:p-8 mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-event-primary" />
                  Event Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Event Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter event name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 min-h-32"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-event-primary" />
                      <Input
                        id="location"
                        placeholder="Enter event location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="flex-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Cover Image URL</Label>
                    <div className="flex items-center mt-1">
                      <Image className="h-4 w-4 mr-2 text-event-primary" />
                      <Input
                        id="image"
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isPaid">Paid Event</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle if this is a paid event
                      </p>
                    </div>
                    <Switch
                      id="isPaid"
                      checked={isPaid}
                      onCheckedChange={setIsPaid}
                    />
                  </div>
                </div>
              </div>

              <div className="glassmorphism-card p-6 md:p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <Ticket className="h-5 w-5 mr-2 text-event-primary" />
                    Ticket Types
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTicketType}
                  >
                    Add Ticket Type
                  </Button>
                </div>

                <div className="space-y-6">
                  {ticketTypes.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Ticket Type #{index + 1}</h3>
                        {ticketTypes.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTicketType(index)}
                            className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`ticketName-${index}`}>Ticket Name</Label>
                        <Input
                          id={`ticketName-${index}`}
                          placeholder="e.g. General Admission, VIP"
                          value={ticket.name}
                          onChange={(e) =>
                            handleTicketTypeChange(index, "name", e.target.value)
                          }
                          className="mt-1"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor={`ticketName-${index}`}>Ticket Description</Label>
                        <Input
                          id={`ticketName-${index}`}
                          placeholder="e.g. Access to the event, VIP access"
                          value={ticket.description}
                          onChange={(e) =>
                            handleTicketTypeChange(index, "description", e.target.value)
                          }
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`ticketName-${index}`}>Ticket Image URL</Label>
                        <Input
                          id={`ticketName-${index}`}
                          placeholder="e.g. https://example.com/image.jpg"
                          value={ticket.imageUrl}
                          onChange={(e) =>
                            handleTicketTypeChange(index, "imageUrl", e.target.value)
                          }
                          className="mt-1"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`ticketPrice-${index}`}>Price</Label>
                          <div className="flex items-center mt-1">
                            <Input
                              id={`ticketPrice-${index}`}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={ticket.price}
                              onChange={(e) =>
                                handleTicketTypeChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              disabled={!isPaid}
                              className="flex-1"
                              required
                            />
                            <span className="ml-2">SUI</span>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`ticketSupply-${index}`}>Supply</Label>
                          <Input
                            id={`ticketSupply-${index}`}
                            type="number"
                            min="1"
                            placeholder="100"
                            value={ticket.maxSupply}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              handleTicketTypeChange(index, "maxSupply", value);
                            }}
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-event-primary to-event-accent"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="glassmorphism-card p-6">
                <h2 className="text-lg font-bold mb-4">Tips</h2>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="bg-event-primary/10 text-event-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      1
                    </span>
                    <span>
                      <strong>Event details:</strong> Be descriptive and include all important information.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-event-primary/10 text-event-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </span>
                    <span>
                      <strong>Images:</strong> Use high-quality images to attract attendees.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-event-primary/10 text-event-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      3
                    </span>
                    <span>
                      <strong>Ticket types:</strong> Create different tiers for different experiences.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-event-primary/10 text-event-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      4
                    </span>
                    <span>
                      <strong>Free events:</strong> Toggle off "Paid Event" for free events.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-event-primary/10 text-event-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      5
                    </span>
                    <span>
                      <strong>Platform fees:</strong> A 2.5% fee is applied to all paid ticket sales.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
