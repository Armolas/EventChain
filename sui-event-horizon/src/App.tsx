
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";

// Pages
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import MyTickets from "./pages/MyTickets";
import MyPOAPs from "./pages/MyPOAPs";
import CreateEvent from "./pages/CreateEvent";
import NotFound from "./pages/NotFound";
import TransferTicket from "./pages/TransferTicket";
import ClaimPOAP from "./pages/ClaimPOAP";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminPanel from "./pages/AdminPanel";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Context Providers
// import { WalletProvider } from "./contexts/WalletContext";
import { EventsProvider } from "./contexts/EventsContext";
import { platformId } from "./utils/constants";

// Network configuration
const networkConfig = {
  localnet: { url: "http://127.0.0.1:9000" },
  devnet: { url: "https://fullnode.devnet.sui.io" },
  testnet: { url: "https://fullnode.testnet.sui.io" },
  mainnet: { url: "https://fullnode.mainnet.sui.io" },
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider autoConnect={true}>
        <EventsProvider platformId={platformId}>
          <Toaster />
          <Sonner position="bottom-right" />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/event/:id" element={<EventDetail />} />
                  <Route path="/my-tickets" element={<MyTickets />} />
                  <Route path="/my-poaps" element={<MyPOAPs />} />
                  <Route path="/create-event" element={<CreateEvent />} />
                  <Route path="/transfer-ticket/:id" element={<TransferTicket />} />
                  <Route path="/claim-poap/:eventId" element={<ClaimPOAP />} />
                  <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </EventsProvider>
      </WalletProvider>
        </SuiClientProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
