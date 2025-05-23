
import { useState } from "react";
// import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, Loader2, Shield, User, Users } from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ConnectButton } from "@mysten/dapp-kit";
import { useWalletConnection } from "@/hooks/useWalletConnnection";

const AdminPanel = () => {
  const { currentAccount, isConnected, connect } = useWalletConnection();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  // Mock data - in real app would come from contract
  const isAdmin = true; // Would check if user has OwnerCap
  const platformFee = "2.5%";
  const totalRevenue = 156.75;
  const availableToWithdraw = 24.32;
  
  // Mock stats data
  const revenueData = [
    { name: "Jan", revenue: 12.5 },
    { name: "Feb", revenue: 19.8 },
    { name: "Mar", revenue: 25.4 },
    { name: "Apr", revenue: 18.2 },
    { name: "May", revenue: 32.1 },
    { name: "Jun", revenue: 48.7 },
  ];
  
  const eventsData = [
    { name: "Music", count: 12 },
    { name: "Tech", count: 8 },
    { name: "Art", count: 5 },
    { name: "Conference", count: 9 },
    { name: "Workshop", count: 4 },
    { name: "Other", count: 2 },
  ];
  
  const usersData = [
    { name: "Organizers", count: 18 },
    { name: "Attendees", count: 245 },
    { name: "New Users (30d)", count: 43 },
  ];

  const handleWithdrawFees = async () => {
    try {
      setIsWithdrawing(true);
      
      // Simulate blockchain interaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // This would call the actual contract in a real implementation
      // await contractWithdrawPlatformFees();
      
      toast.success("Platform fees withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing platform fees:", error);
      toast.error("Failed to withdraw platform fees. Please try again.");
    } finally {
      setIsWithdrawing(false);
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
              Please connect your wallet to access the admin panel
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

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center mt-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              You don't have permission to access the admin panel.
              Only the contract owner with OwnerCap can access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full">
            <Shield className="h-4 w-4 text-event-primary" />
            <span className="text-sm">Admin Access</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Platform Fee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-2xl font-bold">{platformFee}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-2xl font-bold">{totalRevenue} SUI</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available to Withdraw</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{availableToWithdraw} SUI</span>
                <Button 
                  size="sm"
                  onClick={handleWithdrawFees} 
                  disabled={isWithdrawing || availableToWithdraw <= 0} 
                  className="bg-gradient-to-r from-event-primary to-event-accent"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Withdrawing
                    </>
                  ) : (
                    <>
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Withdraw
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Platform Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} SUI`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Events by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={eventsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Number of Events" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usersData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {data.name === "Organizers" ? (
                            <User className="h-5 w-5 text-muted-foreground mr-2" />
                          ) : (
                            <Users className="h-5 w-5 text-muted-foreground mr-2" />
                          )}
                          <span>{data.name}</span>
                        </div>
                        <span className="font-bold">{data.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contract Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Contract Address</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">0x1234...5678</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Owner Address</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">{currentAccount?.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span>{platformFee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Contract Version</span>
                      <span>v1.0.2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
