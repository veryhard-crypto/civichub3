import { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, AlertCircle, Users, Navigation, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const MapView = () => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [apiKey] = useState<string>("AIzaSyBKiBCSg4R50qS0zwWPZcPJ18jg2KYjcY0");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey });

  // Mock data for events (kept), issues will be fetched from API
  const eventMarkers = [
    {
      id: "1",
      type: "event",
      title: "Community Cleanup Drive",
      location: "Central Park",
      date: "June 15, 2024",
      participants: 24,
      category: "cleanup",
      lat: 40.785091,
      lng: -73.968285,
    },
    {
      id: "2",
      type: "issue",
      title: "Broken Street Light",
      location: "Main Street & 5th Ave",
      status: "reported",
      priority: "medium",
      lat: 40.782865,
      lng: -73.965355,
    },
    {
      id: "3",
      type: "event",
      title: "Tree Plantation Drive",
      location: "Riverside Park",
      date: "June 20, 2024",
      participants: 18,
      category: "environment",
      lat: 40.788916,
      lng: -73.971392,
    },
    {
      id: "4",
      type: "issue",
      title: "Illegal Dumping",
      location: "Industrial Area Block C",
      status: "in-progress",
      priority: "high",
      lat: 40.780580,
      lng: -73.962440,
    },
  ];

  const mapContainerStyle = {
    width: "100%",
    height: "600px",
  };

  const center = {
    lat: 40.785091,
    lng: -73.968285,
  };

  const [issues, setIssues] = useState<any[]>([]);
  useEffect(() => {
    let cancelled = false;
    const fetchIssues = async () => {
      try {
        const res = await fetch("/api/issues", { cache: "no-store" as any });
        const data = await res.json();
        if (!cancelled) setIssues(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setIssues((prev) => prev);
      }
    };
    fetchIssues();
    const id = setInterval(fetchIssues, 10000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const markers = useMemo(() => {
    const issueMarkers = issues
      .filter((i) => i.coordinates && typeof i.coordinates.lat === "number" && typeof i.coordinates.lng === "number")
      .map((i) => ({
        id: i._id,
        type: "issue" as const,
        title: i.title,
        location: i.location,
        status: i.status,
        priority: i.status === "open" ? "high" : i.status,
        lat: i.coordinates.lat,
        lng: i.coordinates.lng,
      }));
    return [...eventMarkers, ...issueMarkers];
  }, [issues]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Civic Map</h1>
            <p className="text-muted-foreground">
              Explore local events and reported issues in real-time
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/events">
              <Button variant="default">
                <Calendar className="w-4 h-4" />
                Create Event
              </Button>
            </Link>
            <Link to="/report">
              <Button variant="secondary">
                <AlertCircle className="w-4 h-4" />
                Report Issue
              </Button>
            </Link>
          </div>
        </div>

        {/* Legend */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm">Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-sm">Issues</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent"></div>
              <span className="text-sm">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
              <span className="text-sm">Resolved</span>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden h-[600px] relative">
              {isLoaded && (
                  <GoogleMap
                    onLoad={() => setMapLoaded(true)}
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={15}
                  >
                    {mapLoaded && markers.map((marker) => {
                      const color = marker.type === "event" ? "%232d9569" : "%23ef4444";
                      const iconUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='${color}' stroke='%23ffffff' stroke-width='2'/%3E%3C/svg%3E`;
                      
                      return (
                        <Marker
                          key={marker.id}
                          position={{ lat: marker.lat, lng: marker.lng }}
                          onClick={() => setSelectedMarker(marker.id)}
                          icon={{
                            url: iconUrl,
                            scaledSize: { width: 24, height: 24 } as google.maps.Size,
                          }}
                        />
                      );
                    })}
                    
                    {selectedMarker && (
                      <InfoWindow
                        position={{
                          lat: markers.find((m) => m.id === selectedMarker)!.lat,
                          lng: markers.find((m) => m.id === selectedMarker)!.lng,
                        }}
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div className="p-2">
                          <h4 className="font-semibold text-sm mb-1">
                            {markers.find((m) => m.id === selectedMarker)!.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {markers.find((m) => m.id === selectedMarker)!.location}
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                )}
            </Card>
          </div>

          {/* Sidebar with marker details */}
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Nearby Activity</h3>
              </div>
              
              <div className="space-y-3">
                {markers.map((marker) => (
                  <Card
                    key={marker.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedMarker === marker.id ? 'border-2 border-primary' : ''
                    }`}
                    onClick={() => setSelectedMarker(marker.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {marker.type === "event" ? (
                              <Calendar className="w-4 h-4 text-primary" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-destructive" />
                            )}
                            <Badge variant={marker.type === "event" ? "default" : "destructive"} className="text-xs">
                              {marker.type}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-sm">{marker.title}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {marker.location}
                          </p>
                        </div>
                      </div>
                      
                      {marker.type === "event" && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{marker.date}</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {marker.participants}
                          </span>
                        </div>
                      )}
                      
                      {marker.type === "issue" && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {marker.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {marker.priority} priority
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Make an immediate impact in your community
              </p>
              <div className="space-y-2">
                <Link to="/events">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4" />
                    Create New Event
                  </Button>
                </Link>
                <Link to="/report">
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="w-4 h-4" />
                    Report New Issue
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
