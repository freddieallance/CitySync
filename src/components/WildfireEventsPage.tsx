import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { Flame, AlertTriangle, MapPin, Calendar, TrendingUp, ArrowLeft, RefreshCw } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { LocationPicker } from './LocationPicker';

interface WildfireData {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number;
  confidence: string;
  distance: number;
  detected: string;
}

interface NaturalEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  link?: string;
}

interface WildfireEventsPageProps {
  onBack: () => void;
  userLocation: { latitude: number; longitude: number; name?: string } | null;
  onLocationChange?: (location: { latitude: number; longitude: number; name: string }) => void;
}

export function WildfireEventsPage({ onBack, userLocation, onLocationChange }: WildfireEventsPageProps) {
  const [wildfires, setWildfires] = useState<WildfireData[]>([]);
  const [naturalEvents, setNaturalEvents] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [userLocation]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const lat = userLocation?.latitude || 1.5535;
      const lon = userLocation?.longitude || 110.3593;

      // Fetch both wildfires and natural events in parallel
      const [wildfiresRes, eventsRes] = await Promise.all([
        fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0/wildfires?lat=${lat}&lon=${lon}&radius=500`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        ),
        fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0/natural-events?lat=${lat}&lon=${lon}&radius=500&days=30`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        ),
      ]);

      if (!wildfiresRes.ok || !eventsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const wildfiresData = await wildfiresRes.json();
      const eventsData = await eventsRes.json();

      setWildfires(wildfiresData.wildfires || []);
      setNaturalEvents(eventsData);
    } catch (err) {
      console.error('Error fetching wildfire/events data:', err);
      setError('Unable to load environmental alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (distance: number) => {
    if (distance < 50) return 'destructive';
    if (distance < 100) return 'default';
    if (distance < 200) return 'secondary';
    return 'outline';
  };

  const getConfidenceColor = (confidence: string) => {
    if (confidence === 'high') return 'destructive';
    if (confidence === 'nominal') return 'default';
    return 'secondary';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="flex items-center gap-2">
                <Flame className="h-7 w-7 text-orange-600" />
                Environmental Alerts
              </h1>
              <p className="text-muted-foreground">
                NASA real-time wildfire & disaster tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onLocationChange && (
              <LocationPicker 
                currentLocation={userLocation}
                onLocationChange={onLocationChange}
              />
            )}
            <Button 
              onClick={fetchData} 
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Location Info */}
        {userLocation && (
          <Alert className="border-blue-300 bg-blue-50">
            <MapPin className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-blue-900">
                  📍 Monitoring within 500km of {userLocation.name || 'your location'}
                </p>
                <p className="text-xs text-blue-700">
                  Coordinates: {userLocation.latitude.toFixed(4)}°N, {userLocation.longitude.toFixed(4)}°E
                  {onLocationChange && <span className="ml-2">• Click "Change Location" to view alerts elsewhere</span>}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Wildfires Section */}
        {!loading && !error && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                  Active Wildfires (Last 24 Hours)
                </CardTitle>
                <CardDescription>
                  🛰️ Real-time data from NASA FIRMS - MODIS satellites detect fires twice daily. Updates available 3-4 hours after satellite pass.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wildfires.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-green-300 bg-green-50 p-8 text-center">
                    <p className="text-green-800">
                      ✓ No active wildfires detected within 500km
                    </p>
                    <p className="mt-1 text-sm text-green-600">
                      Conditions are clear for outdoor activities
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{wildfires.length} active fire(s)</strong> detected within 500km.
                        {wildfires[0]?.distance < 100 && ' Nearest fire is within 100km - monitor conditions closely.'}
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      {wildfires.slice(0, 10).map((fire) => (
                        <div
                          key={fire.id}
                          className="flex items-start justify-between rounded-lg border bg-white p-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Flame className="h-4 w-4 text-orange-600" />
                              <span className="font-medium">
                                {fire.distance}km away
                              </span>
                              <Badge variant={getConfidenceColor(fire.confidence)}>
                                {fire.confidence} confidence
                              </Badge>
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {fire.latitude.toFixed(4)}, {fire.longitude.toFixed(4)}
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Brightness: {fire.brightness}K
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Detected: {fire.detected}
                              </div>
                            </div>
                          </div>
                          <Badge variant={getRiskColor(fire.distance)}>
                            {fire.distance < 50 ? 'EXTREME' :
                             fire.distance < 100 ? 'HIGH RISK' :
                             fire.distance < 200 ? 'MODERATE' : 'LOW RISK'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Natural Events Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Natural Disaster Events (Last 30 Days)
                </CardTitle>
                <CardDescription>
                  🌍 Real-time data from NASA EONET - Tracks storms, floods, wildfires, volcanic activity, and severe weather events globally
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!naturalEvents || naturalEvents.total === 0 ? (
                  <div className="rounded-lg border border-dashed border-green-300 bg-green-50 p-8 text-center">
                    <p className="text-green-800">
                      ✓ No active natural disaster events within 500km
                    </p>
                    <p className="mt-1 text-sm text-green-600">
                      No severe weather or disasters reported in your area
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        <strong>{naturalEvents.total} event(s)</strong> tracked within 500km
                      </AlertDescription>
                    </Alert>

                    {naturalEvents.byCategory.map((category: any) => (
                      <div key={category.category} className="space-y-2">
                        <h3 className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">{category.category}</Badge>
                          <span className="text-muted-foreground">
                            {category.count} event{category.count !== 1 ? 's' : ''}
                          </span>
                        </h3>
                        <div className="space-y-2">
                          {category.events.map((event: NaturalEvent) => (
                            <div
                              key={event.id}
                              className="rounded-lg border bg-white p-4"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{event.title}</h4>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {event.description}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    {event.distance !== undefined && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {event.distance}km away
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(event.date).toLocaleDateString()}
                                    </div>
                                  </div>
                                  {event.link && (
                                    <a
                                      href={event.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 inline-block text-xs text-blue-600 hover:underline"
                                    >
                                      View details →
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Source Footer */}
            <div className="rounded-lg bg-white/50 p-4 text-center text-xs text-muted-foreground space-y-3">
              <div>
                <p className="font-medium">
                  🛰️ Real-time data from NASA satellites and Earth observation systems
                </p>
                <p className="mt-2">
                  <strong>NASA FIRMS:</strong> MODIS & VIIRS satellites detect active fires globally, updated twice daily (3-4 hour delay)
                </p>
                <p className="mt-1">
                  <strong>NASA EONET:</strong> Tracks natural disasters in near real-time from multiple satellite sources
                </p>
                <p className="mt-2 text-green-700">
                  ✓ Free, open data • No authentication required • Global coverage
                </p>
              </div>
              
              {onLocationChange && (
                <div className="pt-3 border-t border-gray-300">
                  <p className="text-blue-700 font-medium">
                    📍 Location Features
                  </p>
                  <p className="mt-1">
                    • Auto-detects your GPS location on startup
                  </p>
                  <p>
                    • Click "Change Location" to search any city worldwide
                  </p>
                  <p>
                    • View alerts within 500km radius of any location
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
