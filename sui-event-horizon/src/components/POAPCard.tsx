
import { POAP } from "@/contexts/EventsContext";
import { Button } from "./ui/button";
import { ShareIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface POAPCardProps {
  poap: POAP;
}

const POAPCard = ({ poap }: POAPCardProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const claimedDate = new Date(poap.claimedAt);
  
  return (
    <>
      <div className="glassmorphism-card overflow-hidden group relative">
        <div className="absolute top-1 right-1 z-10">
          <span className="text-xs bg-gradient-to-r from-event-primary to-event-accent text-white px-2 py-0.5 rounded-full">
            POAP
          </span>
        </div>
        <div className="flex items-center justify-center p-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-event-primary/20">
            <img
              src={poap.imageUrl}
              alt={poap.eventName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="p-4 text-center">
          <h3 className="font-bold text-lg line-clamp-1">{poap.eventName}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Claimed on {claimedDate.toLocaleDateString()}
          </p>
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setShowShareDialog(true)}
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share your POAP</DialogTitle>
            <DialogDescription>
              Share this proof of attendance with others
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center p-4">
              <img
                src={poap.imageUrl}
                alt={poap.eventName}
                className="w-48 h-48 rounded-full object-cover border-4 border-event-primary/20"
              />
            </div>
            <div className="text-center">
              <h3 className="font-bold">{poap.eventName}</h3>
              <p className="text-sm text-muted-foreground">
                Claimed on {claimedDate.toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-event-primary to-event-accent">
                Copy Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default POAPCard;
