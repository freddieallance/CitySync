import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, CloudRain, Wind, Droplets, Sun, AlertTriangle, CheckCircle2, Loader2, Satellite, Cloud, Eye, Gauge, Navigation, Thermometer } from 'lucide-react';
import { getConditions, saveActivity, getActivitySafety } from '../lib/api';
import { getOutdoorActivities, getIndoorActivities, ActivitySuggestion } from '../lib/activities';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { LocationPicker } from './LocationPicker';
import { AIChatAssistant } from './AIChatAssistant';
import { AIInsights } from './AIInsights';
import { AISmartRecommendations } from './AISmartRecommendations';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0`;

interface RecommendationsPageProps {
  activityType: 'outdoor' | 'indoor';
  onBack: () => void;
  onViewConditions: () => void;
  onSelectActivity: (activity: string) => void;
  accessToken?: string;
  userLocation?: { latitude: number; longitude: number; name?: string } | null;
  onLocationChange: (location: { latitude: number; longitude: number; name: string }) => void;
}

export function RecommendationsPage({ activityType, onBack, onViewConditions, onSelectActivity, accessToken, userLocation, onLocationChange }: RecommendationsPageProps) {
  const [conditions, setConditions] = useState<any>(null);
  const [hybridWeather, setHybridWeather] = useState<any>(null);
  const [activities, setActivities] = useState<ActivitySuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation) {
      loadConditions();
    }
  }, [activityType, userLocation]);

  const loadConditions = async () => {
    try {
      setLoading(true);
      
      // Fetch both old conditions and new hybrid weather in parallel
      const [conditionsData, hybridData] = await Promise.all([
        getConditions(userLocation?.latitude, userLocation?.longitude),
        fetch(`${API_BASE}/hybrid-weather?lat=${userLocation?.latitude}&lon=${userLocation?.longitude}&forecast=false`)
          .then(r => r.json())
          .catch(err => {
            console.warn('Hybrid weather not available:', err);
            return null;
          })
      ]);
      
      setConditions(conditionsData);
      
      if (hybridData?.success) {
        setHybridWeather(hybridData.data);
        console.log('✅ Hybrid weather loaded:', hybridData.hybridMode ? 'OpenWeather + NASA' : 'NASA only');
      }
      
      const suggestions = activityType === 'outdoor' 
        ? getOutdoorActivities(conditionsData)
        : getIndoorActivities(conditionsData);
      
      setActivities(suggestions);
    } catch (error) {
      console.error('Failed to load conditions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectActivity = async (activity: ActivitySuggestion) => {
    setSelectedActivity(activity.name);
    
    // Navigate to places page
    onSelectActivity(activity.name);
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'excellent':
        return 'bg-green-600';
      case 'good':
        return 'bg-blue-600';
      case 'fair':
        return 'bg-yellow-600';
      case 'poor':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            Loading conditions from NASA...
          </p>
          {userLocation && (
            <p className="text-xs text-muted-foreground">
              📍 {userLocation.name || 'Current Location'}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="capitalize">{activityType} Activities</h1>
            <p className="text-sm text-muted-foreground">
              Based on live NASA satellite data {userLocation?.name && `for ${userLocation.name}`}
            </p>
          </div>
          <LocationPicker 
            currentLocation={userLocation}
            onLocationChange={onLocationChange}
          />
        </div>

        {/* Current Conditions Summary */}
        {conditions && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Current Conditions</span>
                  {hybridWeather ? (
                    <Badge variant={hybridWeather.current.source === 'openweather' ? 'default' : 'secondary'} className="gap-1">
                      {hybridWeather.current.source === 'openweather' ? (
                        <>
                          <Cloud className="h-3 w-3" />
                          Hybrid Mode
                        </>
                      ) : (
                        <>
                          <Satellite className="h-3 w-3" />
                          Satellite
                        </>
                      )}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <Satellite className="h-3 w-3" />
                      Live
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={onViewConditions}>
                  View Details
                </Button>
              </CardTitle>
              <CardDescription>
                Compare data from multiple sources for best accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="integrated" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="openweather" className="gap-1">
                    <Cloud className="h-3 w-3" />
                    OpenWeather
                  </TabsTrigger>
                  <TabsTrigger value="nasa" className="gap-1">
                    <Satellite className="h-3 w-3" />
                    NASA POWER
                  </TabsTrigger>
                  <TabsTrigger value="integrated" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Integrated
                  </TabsTrigger>
                </TabsList>

                {/* OpenWeather Tab */}
                <TabsContent value="openweather" className="mt-4">
                  {hybridWeather?.current.source === 'openweather' ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Real-time (Updated every 10 min)
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Sun className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Temperature</p>
                            <p>{hybridWeather.current.temperature.toFixed(1)}°C</p>
                            <p className="text-xs text-muted-foreground">
                              Feels {hybridWeather.current.feelsLike.toFixed(1)}°C
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CloudRain className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Precipitation</p>
                            <p>{hybridWeather.current.precipitation.toFixed(1)}mm</p>
                            <p className="text-xs text-muted-foreground">
                              {hybridWeather.probabilities?.rain || 0}% chance
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Wind Speed</p>
                            <p>{hybridWeather.current.windSpeed.toFixed(1)} km/h</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Navigation className="h-3 w-3" style={{ transform: `rotate(${hybridWeather.current.windDirection}deg)` }} />
                              {hybridWeather.current.windDirection}°
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Humidity</p>
                            <p>{hybridWeather.current.humidity}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground mb-3">Additional Data</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Cloud className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-muted-foreground">Cloud Cover</p>
                              <p className="text-sm">{hybridWeather.current.cloudCover}%</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-muted-foreground">Visibility</p>
                              <p className="text-sm">{hybridWeather.current.visibility.toFixed(1)} km</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-muted-foreground">Pressure</p>
                              <p className="text-sm">{hybridWeather.current.pressure} hPa</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-yellow-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Conditions</p>
                              <p className="text-sm capitalize">{hybridWeather.current.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>OpenWeather Unavailable</AlertTitle>
                      <AlertDescription>
                        OpenWeather data is not currently available. Showing NASA satellite data instead.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                {/* NASA POWER Tab */}
                <TabsContent value="nasa" className="mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="gap-1">
                      <Satellite className="h-3 w-3" />
                      Satellite Data (Updated daily)
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p>{conditions.weather.temperature}°C</p>
                        {hybridWeather?.historical && (
                          <p className="text-xs text-muted-foreground">
                            Avg: {hybridWeather.historical.temperatureStats.mean.toFixed(1)}°C
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CloudRain className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Rain Chance</p>
                        <p>{conditions.weather.rainChance}%</p>
                        {hybridWeather?.historical && (
                          <p className="text-xs text-muted-foreground">
                            {hybridWeather.historical.precipitationStats.daysWithRain} rainy days/yr
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Air Quality</p>
                        <p>AQI {conditions.airQuality.aqi}</p>
                        <p className="text-xs text-muted-foreground">{conditions.airQuality.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Humidity</p>
                        <p>{conditions.weather.humidity}%</p>
                      </div>
                    </div>
                  </div>
                  {hybridWeather?.historical && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-3">Historical Climate Data (365 days)</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Temp Range</p>
                          <p className="text-sm">
                            {hybridWeather.historical.temperatureStats.min.toFixed(1)}°C - {hybridWeather.historical.temperatureStats.max.toFixed(1)}°C
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Precipitation</p>
                          <p className="text-sm">{hybridWeather.historical.precipitationStats.mean.toFixed(1)} mm</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Wind Speed</p>
                          <p className="text-sm">{hybridWeather.historical.windStats.mean.toFixed(1)} km/h</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Integrated Tab */}
                <TabsContent value="integrated" className="mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Best of Both Sources
                    </Badge>
                    {hybridWeather?.probabilities && (
                      <Badge variant="outline">
                        {hybridWeather.probabilities.confidence}% Confidence
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p>
                          {hybridWeather?.current.temperature 
                            ? `${hybridWeather.current.temperature.toFixed(1)}°C`
                            : `${conditions.weather.temperature}°C`
                          }
                        </p>
                        {hybridWeather?.current.feelsLike && hybridWeather.current.source === 'openweather' && (
                          <p className="text-xs text-muted-foreground">
                            Feels {hybridWeather.current.feelsLike.toFixed(1)}°C
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CloudRain className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {hybridWeather?.current.source === 'openweather' ? 'Precipitation' : 'Rain Chance'}
                        </p>
                        <p>
                          {hybridWeather?.current.source === 'openweather'
                            ? `${hybridWeather.current.precipitation.toFixed(1)}mm`
                            : `${conditions.weather.rainChance}%`
                          }
                        </p>
                        {hybridWeather?.probabilities && (
                          <p className="text-xs text-muted-foreground">
                            {hybridWeather.probabilities.rain}% probability
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {hybridWeather?.current.source === 'openweather' ? 'Wind Speed' : 'Air Quality'}
                        </p>
                        <p>
                          {hybridWeather?.current.source === 'openweather'
                            ? `${hybridWeather.current.windSpeed.toFixed(1)} km/h`
                            : `AQI ${conditions.airQuality.aqi}`
                          }
                        </p>
                        {hybridWeather?.current.windDirection !== undefined && hybridWeather.current.source === 'openweather' && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Navigation className="h-3 w-3" style={{ transform: `rotate(${hybridWeather.current.windDirection}deg)` }} />
                            {hybridWeather.current.windDirection}°
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Humidity</p>
                        <p>
                          {hybridWeather?.current.humidity 
                            ? `${hybridWeather.current.humidity}%`
                            : `${conditions.weather.humidity}%`
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Combined insights */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-3">Combined Analysis</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {hybridWeather?.current.source === 'openweather' && (
                        <>
                          <div className="flex items-center gap-2">
                            <Cloud className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-muted-foreground">Cloud Cover</p>
                              <p className="text-sm">{hybridWeather.current.cloudCover}%</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-muted-foreground">Visibility</p>
                              <p className="text-sm">{hybridWeather.current.visibility.toFixed(1)} km</p>
                            </div>
                          </div>
                        </>
                      )}
                      {hybridWeather?.probabilities && (
                        <>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Heavy Rain Risk</p>
                              <p className="text-sm">{hybridWeather.probabilities.heavyRain}%</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-orange-500" />
                            <div>
                              <p className="text-xs text-muted-foreground">Heat Risk</p>
                              <p className="text-sm">{hybridWeather.probabilities.extremeHeat}%</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Data sources */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Data Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Cloud className="h-3 w-3" />
                        {hybridWeather?.current.source === 'openweather' ? 'OpenWeather (Active)' : 'OpenWeather (Unavailable)'}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Satellite className="h-3 w-3" />
                        NASA POWER (Active)
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Warnings */}
        {hybridWeather?.alerts && hybridWeather.alerts.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Weather Alerts</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {hybridWeather.alerts.map((alert: any, index: number) => (
                  <li key={index}>
                    <strong>{alert.event}</strong> ({alert.severity}): {alert.description}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {conditions && (conditions.flood.affectedAreas.length > 0 || (conditions.haze.affectedAreas && conditions.haze.affectedAreas.length > 0)) && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Environmental Alerts</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2">
                {conditions.flood.affectedAreas.length > 0 && (
                  <li>Flood risk in: {conditions.flood.affectedAreas.join(', ')}</li>
                )}
                {conditions.haze.affectedAreas && conditions.haze.affectedAreas.length > 0 && (
                  <li>{conditions.haze.severity} haze in: {conditions.haze.affectedAreas.join(', ')}</li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Activity Recommendations */}
        <div className="space-y-4">
          <h2>Recommended Activities</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activities.map((activity) => (
              <Card 
                key={activity.name}
                className={selectedActivity === activity.name ? 'border-primary border-2' : ''}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">{activity.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{activity.name}</span>
                        <Badge className={getSuitabilityColor(activity.suitability)}>
                          {activity.suitability}
                        </Badge>
                      </div>
                    </div>
                  </CardTitle>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    {activity.suitability === 'excellent' || activity.suitability === 'good' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    )}
                    <p className="text-muted-foreground">{activity.reason}</p>
                  </div>
                  <Button 
                    variant={selectedActivity === activity.name ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleSelectActivity(activity)}
                  >
                    {selectedActivity === activity.name ? 'Selected ✓' : 'Select Activity'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI-Powered Insights */}
        {conditions && (
          <div className="mt-6">
            <AIInsights
              location={userLocation?.name || 'Current Location'}
              currentWeather={conditions.weather}
              nasaData={conditions.nasa}
            />
          </div>
        )}

        {/* AI-Powered Smart Recommendations */}
        {conditions && (
          <div className="mt-6">
            <AISmartRecommendations
              location={userLocation?.name || 'Current Location'}
              weather={conditions.weather}
              nasaData={conditions.nasa}
              activityType={activityType}
              onActivitySelect={(activity) => {
                setSelectedActivity(activity);
                onSelectActivity(activity);
              }}
            />
          </div>
        )}

        {/* Data Source Info */}
        {conditions && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-900">
                <strong>📍 Location:</strong> {userLocation?.name || conditions.location?.name || 'Current Location'}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Coordinates: {conditions.location?.latitude.toFixed(4)}°, {conditions.location?.longitude.toFixed(4)}°
              </p>
              {userLocation?.name?.includes('Default') && (
                <p className="text-xs text-blue-600 mt-1 italic">
                  ℹ️ Using default location (GPS unavailable in this environment)
                </p>
              )}
              <p className="text-xs text-blue-700 mt-2">
                <strong>Data Source:</strong> {conditions.dataSource?.primary || 'NASA POWER API'}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {conditions.dataSource?.note || 'Based on recent 7-day satellite data averages'}
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Last updated: {new Date(conditions.timestamp).toLocaleTimeString()}
              </p>
              <p className="text-xs text-blue-600 mt-2 italic">
                🛰️ Powered by NASA satellite data - completely free, no API keys needed
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Chat Assistant - Floating Button */}
      <AIChatAssistant
        context={{
          location: userLocation?.name || 'Current Location',
          weather: conditions?.weather,
          nasaData: conditions?.nasa
        }}
        accessToken={accessToken}
      />
    </div>
  );
}