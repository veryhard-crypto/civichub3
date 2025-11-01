import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, Award, TrendingUp, Calendar, AlertCircle, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useStatistics } from "@/hooks/use-statistics";

const Home = () => {
  // Use the statistics hook to get real-time data
  const { statistics, isLoading } = useStatistics();

  const features = [
    {
      icon: MapPin,
      title: "Interactive Civic Map",
      description: "View and report local issues, join events, and track community progress in real-time.",
      color: "text-primary",
    },
    {
      icon: Calendar,
      title: "Community Events",
      description: "Organize cleanups, tree drives, and donation campaigns. Connect with local volunteers and NGOs.",
      color: "text-secondary",
    },
    {
      icon: Award,
      title: "Earn & Redeem Points",
      description: "Gain points and badges for civic actions. Compete on leaderboards and unlock rewards.",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Suggestions",
      description: "Get personalized event recommendations based on your interests and location.",
      color: "text-primary",
    },
  ];

  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const stats = [
    { label: "Active Citizens", value: formatNumber(statistics.activeCitizens), icon: Users },
    { label: "Events Completed", value: formatNumber(statistics.eventsCompleted), icon: Calendar },
    { label: "Issues Resolved", value: formatNumber(statistics.issuesResolved), icon: AlertCircle },
    { label: "NGOs Partnered", value: formatNumber(statistics.ngosPartnered), icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-50"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
              <MapPin className="w-4 h-4" />
              Empowering Local Communities
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Build Better
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Communities Together
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of citizens making real change. Report issues, organize events, and track impact—all in one powerful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/map">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  <MapPin className="w-5 h-5" />
                  Explore the Map
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Calendar className="w-5 h-5" />
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center space-y-2">
                  <Icon className="w-8 h-8 mx-auto text-primary mb-2" />
                  <div className="text-3xl md:text-4xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need for
              <span className="block text-primary">Civic Engagement</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to connect citizens, NGOs, and local authorities in one seamless platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20"
                  style={{ background: "var(--gradient-card)" }}
                >
                  <div className="space-y-4">
                    <div className={`w-14 h-14 rounded-xl bg-background flex items-center justify-center shadow-md ${feature.color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-50"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container mx-auto px-4 relative">
          <Card className="max-w-4xl mx-auto p-12 text-center shadow-2xl border-2 border-primary/20">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join your neighbors in building a cleaner, safer, and more connected community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/report">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    <AlertCircle className="w-5 h-5" />
                    Report an Issue
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    <Calendar className="w-5 h-5" />
                    Join an Event
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">CivicHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CivicHub. Empowering communities through civic action.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
