
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "@/contexts/EventsContext";
// import { useWallet } from "@/contexts/WalletContext";
import { useWalletConnection } from "@/hooks/useWalletConnnection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Ticket, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ConnectButton } from "@mysten/dapp-kit";

const TransferTicket = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userTickets, getEventById, transferEventTicket } = useEvents();
  const { isConnected, connect } = useWalletConnection();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [ticketType, setTicketType] = useState("");
  
  const ticket = userTickets.find(ticket => ticket.id === id);
  useEffect(() => {
    if (ticket) {
      const event = getEventById(ticket.eventId);
      if (event) {
        setTicketType(event.ticketTypes[ticket.ticketTypeId].name);
      }
    }
  }, [ticket]);
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to transfer tickets
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <ConnectButton 
              connectText="Connect Wallet"
              className="bg-gradient-to-r from-event-primary to-event-accent hover:opacity-90 transition-opacity"
            />
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Ticket Not Found</CardTitle>
            <CardDescription>
              The ticket you're looking for doesn't exist or you don't have permission to transfer it.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/my-tickets')} className="w-full">
              Back to My Tickets
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientAddress) {
      toast.error("Please enter a recipient address");
      return;
    }
    
    try {
      setIsTransferring(true);
      
      await transferEventTicket(ticket.id, recipientAddress);
      setRecipientAddress("");
      
      toast.success("Ticket transferred successfully!");
      navigate('/my-tickets');
    } catch (error) {
      console.error("Error transferring ticket:", error);
      toast.error("Failed to transfer ticket. Please try again.");
    } finally {
      setIsTransferring(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Transfer Ticket</h1>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 bg-muted flex items-center justify-center rounded-lg">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg">{ticket.eventName}</h3>
                  <p className="text-sm text-muted-foreground">{ticketType}</p>
                </div>
                
                <div className="text-sm">
                  <p className="flex items-center">
                    <Ticket className="h-4 w-4 mr-2 text-muted-foreground" />
                    Ticket ID: {ticket.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>Transfer Details</CardTitle>
                <CardDescription>
                  Enter the recipient's wallet address to transfer this ticket
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleTransfer}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isTransferring} 
                    className="w-full bg-gradient-to-r from-event-primary to-event-accent"
                  >
                    {isTransferring ? (
                      "Transferring..."
                    ) : (
                      <>
                        Transfer Ticket <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/my-tickets')}
          >
            Back to My Tickets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferTicket;
