
import { useEvents, EventFilters } from "@/contexts/EventsContext";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import { Search, Filter, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";


const Events = () => {
  const { filteredEvents, loading, applyFilters, events } = useEvents();
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isPaidFilter, setIsPaidFilter] = useState<boolean | undefined>(undefined);



  // Apply filters when they change
  useEffect(() => {
    // Use a slight delay to avoid too many immediate re-renders during typing
    const handler = setTimeout(() => {
      applyFilters({
        ...filters,
        location: locationFilter,
        dateRange: dateFilter
          ? { start: new Date(dateFilter).setHours(0, 0, 0, 0) }
          : undefined,
        isPaid: isPaidFilter,
        search: searchTerm,
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [locationFilter, dateFilter, isPaidFilter, searchTerm, filters, applyFilters, events]);

  const clearFilters = () => {
    setLocationFilter("");
    setDateFilter("");
    setIsPaidFilter(undefined);
    setSearchTerm("");
    setFilters({});
  };

  return (
    <div className="min-h-screen flex flex-col mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Events</h1>
          <p className="text-muted-foreground">
            Discover and attend the best events in your area.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          {(locationFilter || dateFilter || isPaidFilter !== undefined || searchTerm) && (
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="glassmorphism-card p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="flex flex-col justify-end">
              <div className="flex items-center justify-between">
                <Label htmlFor="paid">Only free events</Label>
                <Switch
                  id="paid"
                  checked={isPaidFilter === false}
                  onCheckedChange={(checked) => setIsPaidFilter(checked ? false : undefined)}
                />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        ) : (
          filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                No events match your search criteria. Try adjusting your filters.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Events;
