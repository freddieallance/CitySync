import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { MapPin, Search, Loader2, Navigation, Globe } from 'lucide-react';

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

interface LocationPickerProps {
  currentLocation?: { latitude: number; longitude: number; name?: string } | null;
  onLocationChange: (location: { latitude: number; longitude: number; name: string }) => void;
}

export function LocationPicker({ currentLocation, onLocationChange }: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a city or location name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }

      const data: LocationResult[] = await response.json();
      
      if (data.length === 0) {
        setError('No locations found. Try a different search term.');
      } else {
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Location search error:', err);
      setError('Failed to search locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (result: LocationResult) => {
    const locationName = 
      result.address.city || 
      result.address.town || 
      result.address.village || 
      result.address.county || 
      result.address.state || 
      'Selected Location';
    
    const fullName = result.address.country 
      ? `${locationName}, ${result.address.country}`
      : locationName;

    onLocationChange({
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      name: fullName
    });

    setOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setError('');
  };

  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      setError('GPS not available on this device. Try searching for a city instead.');
      return;
    }

    setLoading(true);
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();
          const locationName = 
            data.address?.city || 
            data.address?.town || 
            data.address?.village || 
            data.address?.county || 
            'Current Location';
          
          const fullName = data.address?.country
            ? `${locationName}, ${data.address.country}`
            : locationName;

          onLocationChange({ latitude, longitude, name: fullName });
          setOpen(false);
          setSearchQuery('');
          setSearchResults([]);
        } catch (error) {
          console.error('Error getting location name:', error);
          onLocationChange({ latitude, longitude, name: 'Current Location' });
          setOpen(false);
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        // Provide user-friendly error messages
        let errorMessage = 'Unable to get your GPS location. ';
        
        if (geoError.code === 1) {
          errorMessage += 'Permission denied. Please allow location access or search for a city.';
        } else if (geoError.code === 2) {
          errorMessage += 'Position unavailable. Try searching for a city instead.';
        } else if (geoError.code === 3) {
          errorMessage += 'Request timed out. Try again or search for a city.';
        } else {
          errorMessage += 'Try searching for a city instead.';
        }
        
        console.log('GPS error:', geoError.code, geoError.message);
        setError(errorMessage);
        setLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const popularLocations = [
    { name: 'Los Angeles, USA', latitude: 34.0522, longitude: -118.2437 },
    { name: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093 },
    { name: 'Athens, Greece', latitude: 37.9838, longitude: 23.7275 },
    { name: 'São Paulo, Brazil', latitude: -23.5505, longitude: -46.6333 },
    { name: 'Jakarta, Indonesia', latitude: -6.2088, longitude: 106.8456 },
    { name: 'Mumbai, India', latitude: 19.0760, longitude: 72.8777 },
    { name: 'Cape Town, South Africa', latitude: -33.9249, longitude: 18.4241 },
    { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503 },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MapPin className="h-4 w-4" />
          Change Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Choose Location
          </DialogTitle>
          <DialogDescription>
            Search for any city worldwide or use your current GPS location
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Current Location Display */}
          {currentLocation && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm">
                      <strong>Current:</strong> {currentLocation.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentLocation.latitude.toFixed(4)}°, {currentLocation.longitude.toFixed(4)}°
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* GPS Button */}
          <Button 
            variant="outline" 
            className="w-full gap-2" 
            onClick={handleUseCurrentGPS}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            Use My Current GPS Location
          </Button>

          {/* Search Input */}
          <div className="space-y-2">
            <p className="text-sm">Or search for a city:</p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., San Francisco, Singapore, Berlin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                disabled={loading}
              />
              <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm">Select a location:</p>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {searchResults.map((result, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleSelectLocation(result)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{result.display_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {parseFloat(result.lat).toFixed(4)}°, {parseFloat(result.lon).toFixed(4)}°
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Popular Locations */}
          {searchResults.length === 0 && !loading && (
            <div className="space-y-2">
              <p className="text-sm">Popular locations:</p>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {popularLocations.map((location, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent justify-center py-2 transition-colors"
                    onClick={() => {
                      onLocationChange(location);
                      setOpen(false);
                    }}
                  >
                    {location.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
