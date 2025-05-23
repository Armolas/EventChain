
import { Ticket } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-event-primary to-event-accent flex items-center justify-center">
              <Ticket className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">EventChain</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
            
            <div className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} EventChain. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
