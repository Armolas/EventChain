
import { useEvents } from "@/contexts/EventsContext";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedEvents = () => {
  const { events, loading } = useEvents();
  
  // Take up to 3 events for the featured section
  const featuredEvents = events.slice(0, 3);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Trending Events</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glassmorphism-card animate-pulse h-80">
              <div className="h-48 bg-gray-200 dark:bg-zinc-800"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Trending Events</h2>
        <Link to="/events">
          <Button variant="ghost" className="group">
            View all 
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedEvents;
