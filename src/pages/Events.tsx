import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users, Clock, Search, Filter, Plus, Heart, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const events = [
    {
      id: 1,
      title: "Community Cleanup Drive",
      description: "Join us for a neighborhood cleanup to make our streets cleaner and greener. Bring gloves and bags!",
      category: "cleanup",
      date: "June 15, 2024",
      time: "9:00 AM - 12:00 PM",
      location: "Central Park",
      participants: 24,
      maxParticipants: 50,
      organizer: "Green Earth NGO",
      points: 50,
      featured: true,
    },
    {
      id: 2,
      title: "Tree Plantation Drive",
      description: "Help us plant 100 trees along the riverside. Contribute to a greener tomorrow!",
      category: "environment",
      date: "June 20, 2024",
      time: "7:00 AM - 11:00 AM",
      location: "Riverside Park",
      participants: 18,
      maxParticipants: 30,
      organizer: "Save Our Planet",
      points: 75,
      featured: false,
    },
    {
      id: 3,
      title: "Food Donation Drive",
      description: "Collect and distribute food to families in need. Every contribution counts!",
      category: "donation",
      date: "June 18, 2024",
      time: "2:00 PM - 6:00 PM",
      location: "Community Center",
      participants: 31,
      maxParticipants: 40,
      organizer: "Hope Foundation",
      points: 60,
      featured: true,
    },
    {
      id: 4,
      title: "Street Art Workshop",
      description: "Beautify public spaces with community art. All skill levels welcome!",
      category: "community",
      date: "June 22, 2024",
      time: "3:00 PM - 7:00 PM",
      location: "Downtown Plaza",
      participants: 12,
      maxParticipants: 25,
      organizer: "Arts for All",
      points: 40,
      featured: false,
    },
  ];

  const categoryColors: Record<string, string> = {
    cleanup: "bg-primary/10 text-primary border-primary/20",
    environment: "bg-secondary/10 text-secondary border-secondary/20",
    donation: "bg-accent/10 text-accent border-accent/20",
    community: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Community Events</h1>
            <p className="text-muted-foreground">
              Join local events and make a difference in your neighborhood
            </p>
          </div>
          <Button variant="hero" size="lg">
            <Plus className="w-5 h-5" />
            Create Event
          </Button>
        </div>

        {/* AI Suggestion Banner */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">AI-Powered Recommendations</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Based on your interests and location, we think you'd love these events! (Coming soon with Lovable Cloud)
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/20 text-primary border-0">Environmental</Badge>
                <Badge className="bg-secondary/20 text-secondary border-0">Within 5km</Badge>
                <Badge className="bg-accent/20 text-accent border-0">High Impact</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events by title, location, or organizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20"
            >
              {event.featured && (
                <div className="bg-gradient-to-r from-primary to-secondary px-4 py-2">
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <Heart className="w-4 h-4 fill-white" />
                    Featured Event
                  </div>
                </div>
              )}
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-2xl font-bold leading-tight">{event.title}</h3>
                    <Badge className={`${categoryColors[event.category]} border`}>
                      {event.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>
                      {event.participants} / {event.maxParticipants} participants
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Organized by</p>
                    <p className="font-medium">{event.organizer}</p>
                  </div>
                  <Badge variant="secondary" className="text-base font-semibold px-4 py-2">
                    +{event.points} pts
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="default" className="w-full">
                    Join Event
                  </Button>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Events
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Events;
