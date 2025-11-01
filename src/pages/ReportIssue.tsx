import { useMemo, useRef, useState } from "react";
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, MapPin, Camera, Upload, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    lat: "",
    lng: "",
  });
  const [locationInput, setLocationInput] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [apiKey] = useState<string>("AIzaSyBKiBCSg4R50qS0zwWPZcPJ18jg2KYjcY0");
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const libraries = useMemo(() => ["places"] as ("places")[], []);
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey, libraries });

  const categories = [
    { value: "garbage", label: "Garbage / Waste" },
    { value: "pothole", label: "Pothole / Road Damage" },
    { value: "streetlight", label: "Broken Street Light" },
    { value: "drainage", label: "Drainage / Sewage" },
    { value: "vandalism", label: "Vandalism" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare payload with optional coordinates if both provided and valid
      const locationText = formData.location || locationInput;
      const latNum = parseFloat(formData.lat);
      const lngNum = parseFloat(formData.lng);
      const hasLat = !Number.isNaN(latNum);
      const hasLng = !Number.isNaN(lngNum);
      const hasFiles = selectedFiles.length > 0;
      let res: Response;
      if (hasFiles) {
        const fd = new FormData();
        fd.append("title", formData.title);
        fd.append("category", formData.category);
        fd.append("description", formData.description);
        fd.append("location", locationText);
        if (hasLat && hasLng && latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180) {
          fd.append("lat", String(latNum));
          fd.append("lng", String(lngNum));
        }
        selectedFiles.forEach((f) => fd.append("photos", f));
        res = await fetch("/api/issues", { method: "POST", body: fd });
      } else {
        let payload: any = {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          location: locationText,
        };
        if (hasLat && hasLng && latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180) {
          payload.coordinates = { lat: latNum, lng: lngNum };
        }
        res = await fetch("/api/issues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Failed to submit");
      toast.success("Issue reported successfully!", {
        description: "Municipal authorities have been notified.",
      });
      setFormData({ title: "", category: "", description: "", location: "", lat: "", lng: "" });
      setLocationInput("")
      setSelectedFiles([])
    } catch (err) {
      toast.error("Unable to submit issue", { description: (err as Error).message });
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by this browser");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((prev) => ({
          ...prev,
          lat: String(latitude),
          lng: String(longitude),
        }));
        setGeoLoading(false);
        toast.success("Location captured");
      },
      (err) => {
        setGeoLoading(false);
        toast.error("Unable to get location", { description: err.message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const hasCoords = useMemo(() => {
    const latNum = parseFloat(formData.lat);
    const lngNum = parseFloat(formData.lng);
    return !Number.isNaN(latNum) && !Number.isNaN(lngNum);
  }, [formData.lat, formData.lng]);

  const mapCenter = useMemo(() => {
    if (hasCoords) {
      return { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) };
    }
    return { lat: 20.5937, lng: 78.9629 }; // Fallback (India centroid)
  }, [hasCoords, formData.lat, formData.lng]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Report an Issue</h1>
          <p className="text-muted-foreground text-lg">
            Help improve your community by reporting local problems
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Fast Response</p>
            <p className="text-xs text-muted-foreground">Authorities notified instantly</p>
          </Card>
          <Card className="p-4 text-center">
            <Camera className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Photo Verification</p>
            <p className="text-xs text-muted-foreground">Upload proof of the issue</p>
          </Card>
          <Card className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Track Progress</p>
            <p className="text-xs text-muted-foreground">Get real-time updates</p>
          </Card>
        </div>

        {/* Report Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Broken street light on Main Street"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative flex gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                  {isLoaded ? (
                    <Autocomplete
                      onLoad={(ac) => (autocompleteRef.current = ac)}
                      onPlaceChanged={() => {
                        const place = autocompleteRef.current?.getPlace();
                        if (!place) return;
                        const name = place.formatted_address || place.name || "";
                        const loc = place.geometry?.location;
                        if (loc) {
                          const newLocation = name || "";
                          setFormData({
                            ...formData,
                            location: newLocation,
                            lat: String(loc.lat()),
                            lng: String(loc.lng()),
                          });
                          setLocationInput(newLocation);
                        } else if (name) {
                          setFormData({ ...formData, location: name });
                          setLocationInput(name);
                        }
                      }}
                      options={{
                        types: ['geocode', 'establishment'],
                        fields: ['formatted_address', 'geometry', 'name']
                      }}
                    >
                      <Input
                        id="location"
                        placeholder="Search address or landmark"
                        value={locationInput}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setLocationInput(newValue);
                          setFormData({ ...formData, location: newValue });
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                        autoComplete="off"
                        className="pl-10"
                        required
                      />
                    </Autocomplete>
                  ) : (
                    <Input
                      id="location"
                      placeholder="Loading maps..."
                      value={locationInput}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setLocationInput(newValue);
                        setFormData({ ...formData, location: newValue });
                      }}
                      className="pl-10"
                      required
                    />
                  )}
                </div>
                <Button type="button" variant="outline" onClick={handleUseMyLocation} disabled={geoLoading}>
                  {geoLoading ? "Getting..." : "Use my location"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Pick a place or use your current location</p>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude (optional)</Label>
                <Input
                  id="lat"
                  placeholder="e.g., 12.9716"
                  inputMode="decimal"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                />
                <p className="text-[10px] text-muted-foreground">Range: -90 to 90</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude (optional)</Label>
                <Input
                  id="lng"
                  placeholder="e.g., 77.5946"
                  inputMode="decimal"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                />
                <p className="text-[10px] text-muted-foreground">Range: -180 to 180</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the issue..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Photos (Optional)</Label>
              <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                <label className="flex flex-col items-center justify-center p-8 cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">Click to upload photos</p>
                  <p className="text-xs text-muted-foreground">
                    Before and after photos help resolve issues faster
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setSelectedFiles(files);
                    }}
                  />
                </label>
              </Card>
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {selectedFiles.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Map Preview */}
            <div className="space-y-2">
              <Label>Location Preview</Label>
              <Card className="h-64 overflow-hidden">
                {isLoaded && (
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "256px" }}
                    center={mapCenter}
                    zoom={hasCoords ? 15 : 4}
                    onClick={(e) => {
                      if (!e.latLng) return;
                      const lat = e.latLng.lat();
                      const lng = e.latLng.lng();
                      setFormData((prev) => ({ ...prev, lat: String(lat), lng: String(lng) }));
                    }}
                  >
                    {hasCoords && (
                      <Marker position={{ lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) }} />
                    )}
                  </GoogleMap>
                )}
              </Card>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="hero" size="lg" className="flex-1">
                <AlertCircle className="w-5 h-5" />
                Submit Report
              </Button>
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Privacy Notice */}
        <Card className="mt-8 p-6 bg-muted/50">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Your report helps everyone
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All reports are reviewed by municipal authorities. Your identity is kept confidential, 
            and you'll receive updates on the resolution progress. Thank you for making your community better!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;
