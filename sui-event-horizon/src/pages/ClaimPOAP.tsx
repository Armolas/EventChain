
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "@/contexts/EventsContext";
// import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConnectButton } from "@mysten/dapp-kit";
import { useWalletConnection } from "@/hooks/useWalletConnnection";

const ClaimPOAP = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, userTickets, getEventById } = useEvents();
  const { isConnected, connect } = useWalletConnection();
  const [isClaiming, setIsClaiming] = useState(false);
  
  const event = getEventById(eventId || "");
  const hasTicket = userTickets.some(ticket => ticket.eventId === eventId);
  
  // Check if user already has this POAP
  // This would be a real check in the actual implementation
  const alreadyHasPOAP = false;
  
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center mt-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please connect your wallet to claim your POAP
            </p>
          </CardContent>
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
  
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center mt-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The event you're looking for doesn't exist
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/events')} className="w-full">
              Back to Events
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (!hasTicket) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center mt-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Eligible</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You need to have attended this event to claim a POAP. No ticket was found in your wallet.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate(`/event/${eventId}`)} className="w-full">
              View Event
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (alreadyHasPOAP) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center mt-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Check className="h-6 w-6 text-green-500 mr-2" />
              Already Claimed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              You have already claimed your POAP for this event
            </p>
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-event-primary/20">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/my-poaps')} className="bg-gradient-to-r from-event-primary to-event-accent">
              View My POAPs
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const handleClaim = async () => {
    try {
      setIsClaiming(true);
      
      // Simulate blockchain interaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // This would call the actual contract in a real implementation
      // await contractClaimPOAP(eventId);
      
      toast.success("POAP claimed successfully!");
      navigate('/my-poaps');
    } catch (error) {
      console.error("Error claiming POAP:", error);
      toast.error("Failed to claim POAP. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center mt-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Claim Your POAP</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-event-primary/20">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-2">{event.name}</h2>
          <p className="text-muted-foreground mb-6">
            You attended this event and are eligible to claim a proof of attendance protocol token.
          </p>
          
          <div className="flex justify-center mb-6">
            <Award className="h-16 w-16 text-event-primary" />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleClaim} 
            disabled={isClaiming} 
            className="w-full bg-gradient-to-r from-event-primary to-event-accent"
          >
            {isClaiming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting POAP...
              </>
            ) : (
              "Claim POAP"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClaimPOAP;
