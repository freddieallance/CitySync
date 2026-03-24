import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, MapPin, AlertTriangle, CloudRain, Wind, Loader2, Flame, Activity } from 'lucide-react';
import { getConditions } from '../lib/api';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { LocationPicker } from './LocationPicker';

interface ConditionsMapPageProps {
  onBack: () => void;
  userLocation?: { latitude: number; longitude: number; name?: string } | null;
  onLocationChange: (location: { latitude: number; longitude: number; name: string }) => void;
}

export function ConditionsMapPage({ onBack, userLocation, onLocationChange }: ConditionsMapPageProps) {
  const [conditions, setConditions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // userLocation should always be set (either GPS or default)
    loadConditions();
  }, [userLocation]);

  const loadConditions = async () => {
    try {
      setLoading(true);
      const data = await getConditions(userLocation?.latitude, userLocation?.longitude);
      setConditions(data);
    } catch (error) {
      console.error('Failed to load conditions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="text-blue-700">Loading weather data from NASA satellites...</p>
        </div>
      </div>
    );
  }

  const riskAreas = [
    ...conditions.flood.affectedAreas.map((area: string) => ({
      name: area,
      type: 'Flood Risk',
      severity: conditions.flood.riskLevel,
      icon: CloudRain,
      color: 'text-blue-600'
    })),
    ...conditions.haze.affectedAreas.map((area: string) => ({
      name: area,
      type: 'Haze',
      severity: conditions.haze.severity,
      icon: Wind,
      color: 'text-orange-600'
    }))
  ];

  // Check for wildfire and natural event warnings
  const hasWildfires = conditions.wildfires?.detected;
  const hasNaturalEvents = conditions.naturalEvents?.total > 0;
  const totalAlerts = riskAreas.length + (hasWildfires ? 1 : 0) + (hasNaturalEvents ? 1 : 0);

  return (
    <div className="min-h-screen p-4">
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-blue-100">
            <ArrowLeft className="h-5 w-5 text-blue-700" />
          </Button>
          <div className="flex-1">
            <h1 className="text-blue-900">Weather & Environmental Map</h1>
            <p className="text-sm text-blue-600">Real-time conditions and safety alerts</p>
          </div>
          <LocationPicker 
            currentLocation={userLocation}
            onLocationChange={onLocationChange}
          />
        </div>

        {/* Alert Summary */}
        {totalAlerts > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Active Warnings</AlertTitle>
            <AlertDescription>
              {totalAlerts} environmental concern(s) detected in your area.
              {hasWildfires && ` Includes ${conditions.wildfires.count} active wildfire(s).`}
              {hasNaturalEvents && ` ${conditions.naturalEvents.total} natural event(s) tracked.`}
            </AlertDescription>
          </Alert>
        )}

        {/* Detailed Conditions */}
        <div className="grid gap-6">
          {/* Flood Risk Areas */}
          {conditions.flood.affectedAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-blue-600" />
                  Flood Risk Areas
                </CardTitle>
                <CardDescription>
                  Areas with elevated flood risk based on satellite data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p>Overall Risk Level</p>
                    <p className="text-sm text-muted-foreground mt-1">Based on rainfall and elevation data</p>
                  </div>
                  <Badge variant="destructive">{conditions.flood.riskLevel}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">Affected Areas:</p>
                  {conditions.flood.affectedAreas.map((area: string) => (
                    <div key={area} className="flex items-center gap-2 p-3 border rounded-lg">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>{area}</span>
                      <Badge variant="outline" className="ml-auto">Avoid</Badge>
                    </div>
                  ))}
                </div>
                <Alert>
                  <AlertDescription className="text-sm">
                    <strong>Recommendation:</strong> Avoid these areas during heavy rainfall. Monitor local authorities for evacuation orders.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Haze Areas */}
          {conditions.haze.affectedAreas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-orange-600" />
                  Haze Affected Areas
                </CardTitle>
                <CardDescription>
                  Areas with reduced air quality due to haze
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Severity</p>
                    <p>{conditions.haze.severity}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Visibility</p>
                    <p>{conditions.haze.visibility} km</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">Affected Areas:</p>
                  {conditions.haze.affectedAreas.map((area: string) => (
                    <div key={area} className="flex items-center gap-2 p-3 border rounded-lg">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      <span>{area}</span>
                      <Badge variant="outline" className="ml-auto">Limit Outdoor Activities</Badge>
                    </div>
                  ))}
                </div>
                <Alert>
                  <AlertDescription className="text-sm">
                    <strong>Recommendation:</strong> Limit outdoor activities in these areas. Use masks if necessary. Stay indoors when possible.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Air Quality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Regional Air Quality
              </CardTitle>
              <CardDescription>
                Current air quality index across Sarawak
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">AQI</p>
                  <p>{conditions.airQuality.aqi}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="bg-yellow-600">{conditions.airQuality.status}</Badge>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">PM2.5</p>
                  <p>{conditions.airQuality.pm25} µg/m³</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Recommendation</p>
                  <p className="text-xs">Acceptable</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wildfires */}
          {hasWildfires && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                  Active Wildfires
                </CardTitle>
                <CardDescription>
                  Real-time wildfire detection from NASA FIRMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{conditions.wildfires.count} active fire(s)</strong> detected within 500km.
                    {conditions.wildfires.nearestDistance && 
                      ` Nearest fire is ${conditions.wildfires.nearestDistance}km away.`
                    }
                  </AlertDescription>
                </Alert>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p>Risk Level</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on proximity to active fires
                    </p>
                  </div>
                  <Badge variant={
                    conditions.wildfires.riskLevel === 'Extreme' ? 'destructive' :
                    conditions.wildfires.riskLevel === 'High' ? 'destructive' :
                    'default'
                  }>
                    {conditions.wildfires.riskLevel}
                  </Badge>
                </div>
                {conditions.wildfires.fires?.slice(0, 3).map((fire: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <Flame className="h-4 w-4 text-orange-600" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{fire.distance}km away</span>
                      <p className="text-xs text-muted-foreground">
                        Confidence: {fire.confidence}
                      </p>
                    </div>
                    <Badge variant="outline">{fire.brightness}K</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Natural Events */}
          {hasNaturalEvents && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-yellow-600" />
                  Natural Disaster Events
                </CardTitle>
                <CardDescription>
                  Active events from NASA EONET tracking system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p>Total Events</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Within 500km in the last 30 days
                    </p>
                  </div>
                  <Badge>{conditions.naturalEvents.total}</Badge>
                </div>
                {conditions.naturalEvents.byCategory?.slice(0, 3).map((cat: any) => (
                  <div key={cat.category} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{cat.category}</span>
                      <Badge variant="outline">{cat.count}</Badge>
                    </div>
                    {cat.events[0] && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Latest: {cat.events[0].title}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Weather Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Weather Overview</CardTitle>
              <CardDescription>
                Current weather conditions from satellite data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p>{conditions.weather.temperature}°C</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p>{conditions.weather.humidity}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Rain Chance</p>
                  <p>{conditions.weather.rainChance}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">UV Index</p>
                  <p>{conditions.weather.uvIndex}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Wind Speed</p>
                  <p>{conditions.weather.windSpeed} km/h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Source */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              <strong>Data Sources:</strong> {conditions.dataSource?.sources?.join(', ') || 'NASA POWER API'}
            </p>
            <p className="text-xs text-blue-700 mt-2">
              Location: {conditions.location?.name || 'Current Location'} ({conditions.location?.latitude?.toFixed(4)}, {conditions.location?.longitude?.toFixed(4)})
            </p>
            <p className="text-xs text-blue-700">
              Last updated: {new Date(conditions.timestamp).toLocaleString()}
            </p>
            <p className="text-xs text-blue-600 mt-2 italic">
              🛰️ Powered by multiple NASA satellite data sources - free, open, and global coverage
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
