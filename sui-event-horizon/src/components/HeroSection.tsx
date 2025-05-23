
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Ticket } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted pt-16 md:pt-24 lg:pt-32">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-event-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-event-accent/10 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4 py-16 md:py-24 flex flex-col lg:flex-row items-center">
        <div className="flex-1 text-center lg:text-left lg:max-w-2xl">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm mb-6 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-event-accent mr-2" />
            <span className="font-medium">
              Built on Sui blockchain
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="gradient-text">Explore Events.</span> <br />
            <span className="gradient-text">Own Tickets.</span> <br />
            <span className="gradient-text">Prove Attendance.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 md:pr-10 lg:pr-0">
            The next generation of event ticketing, powered by blockchain. Create events, purchase tickets as NFTs, and collect POAPs to prove attendance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/events">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-event-primary to-event-secondary hover:opacity-90 transition-opacity">
                Explore Events
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/create-event">
              <Button size="lg" variant="outline" className="w-full sm:w-auto group">
                Create Event
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero image */}
        <div className="flex-1 mt-12 lg:mt-0 animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 border-8 border-white/10 rounded-3xl -translate-x-8 translate-y-8" />
            <div className="w-full overflow-hidden rounded-3xl bg-gradient-to-r from-event-primary to-event-accent p-1">
              <div className="bg-white dark:bg-zinc-900 rounded-[calc(1.5rem-4px)] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                  alt="Event ticketing app" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          className="w-full h-auto text-background fill-current"
          viewBox="0 0 1440 74"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,37 C173,10 346,0 520,0 C693,0 866,10 1040,37 C1213,64 1386,74 1560,74 L1560,74 L0,74 L0,37 Z" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
