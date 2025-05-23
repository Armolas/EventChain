
import HeroSection from "@/components/HeroSection";
import FeaturedEvents from "@/components/FeaturedEvents";
import FeaturesSection from "@/components/FeaturesSection";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnnection";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { isConnected } = useWalletConnection();

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <FeaturedEvents />
      <FeaturesSection />
      
      {/* CTA Section */}
      <div className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join the future of event ticketing on the blockchain and create unforgettable experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isConnected ? (
              <Link to="/create-event">
                <Button size="lg" className="bg-gradient-to-r from-event-primary to-event-accent">
                  Create Your First Event
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/events">
                <Button size="lg" className="bg-gradient-to-r from-event-primary to-event-accent">
                  Explore Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
