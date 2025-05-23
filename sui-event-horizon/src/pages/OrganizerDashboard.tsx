
import { useState } from "react";
import { useEvents } from "@/contexts/EventsContext";
// import { useWallet } from "@/contexts/WalletContext";
import { useWalletConnection } from "@/hooks/useWalletConnnection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, Calendar, Loader2, Ticket, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ConnectButton } from "@mysten/dapp-kit";

const OrganizerDashboard = () => {
  const { events, loading } = useEvents();
  const { isConnected, connect, currentAccount } = useWalletConnection();
  const [withdrawingEventId, setWithdrawingEventId] = useState<string | null>(null);

  // Filter events created by the connected wallet
  const organizedEvents = events.filter(event => event.organizer === currentAccount?.address);

  // Mock ticket sales data - would come from contract in a real implementation
  const getTicketData = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return [];
    
    return event.ticketTypes.map(type => ({
      name: type.name,
      sold: type.maxSupply - type.remainingSupply,
      value: (type.maxSupply - type.remainingSupply) * parseFloat(type.price),
    }));
  };

  const handleWithdrawRevenue = async (eventId: string) => {
    try {
      setWithdrawingEventId(eventId);
      
      // Simulate blockchain interaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // This would call the actual contract in a real implementation
      // await contractWithdrawRevenue(eventId);
      
      toast.success("Revenue withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing revenue:", error);
      toast.error("Failed to withdraw revenue. Please try again.");
    } finally {
      setWithdrawingEventId(null);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center mt-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Please connect your wallet to access the organizer dashboard
            </p>
            <ConnectButton 
              connectText="Connect Wallet"
              className="bg-gradient-to-r from-event-primary to-event-accent hover:opacity-90 transition-opacity"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center mt-16">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p>Loading your events...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (organizedEvents.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center mt-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Events Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              You haven't created any events yet
            </p>
            <Button className="bg-gradient-to-r from-event-primary to-event-accent">
              <Link to="/create-event">Create an Event</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <Button className="bg-gradient-to-r from-event-primary to-event-accent">
            <Link to="/create-event">Create New Event</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">{organizedEvents.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Ticket className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">
                  {organizedEvents.reduce((total, event) => {
                    return total + event.ticketTypes.reduce((subtotal, type) => {
                      return subtotal + (type.maxSupply - type.remainingSupply);
                    }, 0);
                  }, 0)}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ArrowUp className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">
                  {organizedEvents.reduce((total, event) => {
                    return total + event.ticketTypes.reduce((subtotal, type) => {
                      return subtotal + ((type.maxSupply - type.remainingSupply) * parseFloat(type.price));
                    }, 0);
                  }, 0).toFixed(2)} SUI
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mt-4">Your Events</h2>
        
        <Tabs defaultValue={organizedEvents[0]?.id}>
          <TabsList className="mb-4 overflow-auto">
            {organizedEvents.map((event) => (
              <TabsTrigger key={event.id} value={event.id} className="min-w-[120px]">
                {event.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {organizedEvents.map((event) => (
            <TabsContent key={event.id} value={event.id}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ticket Types:</span>
                        <span>{event.ticketTypes.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Revenue:</span>
                        <span className="font-medium">
                          {event.ticketTypes.reduce((total, type) => {
                            return total + ((type.maxSupply - type.remainingSupply) * parseFloat(type.price));
                          }, 0).toFixed(2)} SUI
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => handleWithdrawRevenue(event.id)} 
                        disabled={withdrawingEventId === event.id} 
                        className="w-full bg-gradient-to-r from-event-primary to-event-accent"
                      >
                        {withdrawingEventId === event.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Withdrawing...
                          </>
                        ) : (
                          <>
                            <ArrowDown className="mr-2 h-4 w-4" />
                            Withdraw Revenue
                          </>
                        )}
                      </Button>
                      <div className="text-xs text-center text-muted-foreground mt-2">
                        *Platform fee of 2.5% will be deducted
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getTicketData(event.id)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="sold"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {getTicketData(event.id).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} tickets`, 'Sold']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="h-64 mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getTicketData(event.id)}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} SUI`, 'Revenue']} />
                          <Bar dataKey="value" name="Revenue (SUI)" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
