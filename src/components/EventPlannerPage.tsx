import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Download, 
  AlertTriangle, 
  ThermometerSun, 
  ThermometerSnowflake,
  Wind,
  CloudRain,
  Droplets,
  Loader2,
  TrendingUp,
  BarChart3,
  Info,
  CheckCircle2
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { LocationPicker } from './LocationPicker';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { ProbabilityVisualization } from './ProbabilityVisualization';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0`;

interface EventPlannerPageProps {
  onBack: () => void;
  accessToken: string;
  userLocation: { latitude: number; longitude: number; name?: string } | null;
  onLocationChange?: (location: { latitude: number; longitude: number; name: string }) => void;
}

interface WeatherProbability {
  condition: string;
  probability: number;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  threshold: number;
  historicalMean: number;
  description: string;
}

interface HistoricalData {
  date: string;
  temperature: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

export function EventPlannerPage({ onBack, accessToken, userLocation, onLocationChange }: EventPlannerPageProps) {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('hiking');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [location, setLocation] = useState(userLocation);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showMockData, setShowMockData] = useState(false);

  // Mock probability data for demonstration
  const mockProbabilityData = {
    temperature: {
      historicalTrends: [
        { date: '2020-11-10', value: 28.5, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2020-11-11', value: 29.1, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2020-11-12', value: 27.8, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2021-11-10', value: 28.9, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2021-11-11', value: 28.2, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2021-11-12', value: 29.5, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2022-11-10', value: 27.5, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2022-11-11', value: 28.7, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2022-11-12', value: 28.1, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2023-11-10', value: 29.3, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2023-11-11', value: 28.0, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2023-11-12', value: 28.6, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2024-11-10', value: 28.4, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
        { date: '2024-11-11', value: 28.8, mean: 28.3, upperBound: 29.4, lowerBound: 27.2 },
      ],
      extremeWeatherProbability: [
        { condition: 'Extreme Heat', probability: 5, threshold: 35, severity: 'extreme' as const, historicalOccurrences: 3, description: 'Temperature above 35°C (95°F) - Very hot conditions' },
        { condition: 'Very Hot', probability: 15, threshold: 32, severity: 'high' as const, historicalOccurrences: 9, description: 'Temperature above 32°C (90°F) - Hot and uncomfortable' },
        { condition: 'Hot Weather', probability: 45, threshold: 28, severity: 'moderate' as const, historicalOccurrences: 27, description: 'Temperature above 28°C (82°F) - Warm conditions' },
        { condition: 'Cool Weather', probability: 10, threshold: 18, severity: 'low' as const, historicalOccurrences: 6, description: 'Temperature below 18°C (64°F) - Cooler than average' },
      ],
      statistics: {
        mean: 28.3,
        median: 28.4,
        stdDev: 2.1,
        min: 22.5,
        max: 34.8,
        confidenceInterval95: { lower: 27.2, upper: 29.4 }
      },
      parameter: 'Temperature',
      unit: '°C'
    },
    precipitation: {
      historicalTrends: [
        { date: '2020-11-10', value: 2.3, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2020-11-11', value: 0.5, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2020-11-12', value: 8.1, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2021-11-10', value: 3.2, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2021-11-11', value: 12.5, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2021-11-12', value: 1.8, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2022-11-10', value: 0.0, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2022-11-11', value: 4.6, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2022-11-12', value: 6.3, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2023-11-10', value: 9.7, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2023-11-11', value: 2.1, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2023-11-12', value: 5.4, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2024-11-10', value: 3.8, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
        { date: '2024-11-11', value: 7.2, mean: 5.2, upperBound: 8.5, lowerBound: 1.9 },
      ],
      extremeWeatherProbability: [
        { condition: 'Heavy Rain', probability: 8, threshold: 50, severity: 'extreme' as const, historicalOccurrences: 5, description: 'Precipitation above 50mm - Very heavy rainfall' },
        { condition: 'Moderate Rain', probability: 25, threshold: 20, severity: 'high' as const, historicalOccurrences: 15, description: 'Precipitation above 20mm - Significant rainfall' },
        { condition: 'Light Rain', probability: 55, threshold: 5, severity: 'moderate' as const, historicalOccurrences: 33, description: 'Precipitation above 5mm - Noticeable rain' },
        { condition: 'Any Rain', probability: 70, threshold: 1, severity: 'low' as const, historicalOccurrences: 42, description: 'Any measurable precipitation' },
      ],
      statistics: {
        mean: 5.2,
        median: 4.1,
        stdDev: 6.8,
        min: 0,
        max: 65.3,
        confidenceInterval95: { lower: 1.9, upper: 8.5 }
      },
      parameter: 'Precipitation',
      unit: 'mm'
    },
    windSpeed: {
      historicalTrends: [
        { date: '2020-11-10', value: 8.5, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2020-11-11', value: 12.3, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2020-11-12', value: 9.1, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2021-11-10', value: 11.7, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2021-11-11', value: 7.8, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2021-11-12', value: 13.2, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2022-11-10', value: 6.5, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2022-11-11', value: 10.9, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2022-11-12', value: 9.4, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2023-11-10', value: 14.1, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2023-11-11', value: 8.2, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2023-11-12', value: 11.5, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2024-11-10', value: 9.8, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
        { date: '2024-11-11', value: 10.6, mean: 10.2, upperBound: 14.5, lowerBound: 5.9 },
      ],
      extremeWeatherProbability: [
        { condition: 'Very Windy', probability: 3, threshold: 30, severity: 'extreme' as const, historicalOccurrences: 2, description: 'Wind speed above 30 m/s - Very strong winds' },
        { condition: 'Strong Winds', probability: 12, threshold: 20, severity: 'high' as const, historicalOccurrences: 7, description: 'Wind speed above 20 m/s - Strong winds' },
        { condition: 'Breezy', probability: 65, threshold: 10, severity: 'moderate' as const, historicalOccurrences: 39, description: 'Wind speed above 10 m/s - Noticeable breeze' },
        { condition: 'Calm', probability: 15, threshold: 5, severity: 'low' as const, historicalOccurrences: 9, description: 'Wind speed below 5 m/s - Light winds' },
      ],
      statistics: {
        mean: 10.2,
        median: 9.9,
        stdDev: 3.5,
        min: 2.1,
        max: 28.4,
        confidenceInterval95: { lower: 5.9, upper: 14.5 }
      },
      parameter: 'Wind Speed',
      unit: 'm/s'
    }
  };

  // Set default date to 7 days from now
  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    setSelectedDate(defaultDate);
  }, []);

  useEffect(() => {
    if (userLocation) {
      setLocation(userLocation);
    }
  }, [userLocation]);

  const handleLocationSelect = (newLocation: { latitude: number; longitude: number; name: string }) => {
    setLocation(newLocation);
    onLocationChange?.(newLocation);
  };

  const analyzeEventConditions = async () => {
    if (!location || !selectedDate) {
      return;
    }

    try {
      setLoading(true);
      setResults(null); // Clear previous results

      // Format the date as YYYY-MM-DD for the API
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');

      console.log('🔍 Analyzing event probability...', {
        location: location.name,
        date: formattedDate,
        eventType
      });

      const response = await fetch(`${API_BASE}/weather/event-probability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || publicAnonKey}`
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          date: formattedDate,
          eventType,
          locationName: location.name
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Event probability data received:', {
          hasTemperature: !!data.probabilityData?.temperature,
          hasPrecipitation: !!data.probabilityData?.precipitation,
          hasWind: !!data.probabilityData?.windSpeed,
          samples: data.dataSource?.samplesUsed
        });
        setResults(data);
      } else {
        console.error('❌ Failed to analyze conditions:', data.error);
        alert(`Failed to analyze: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error analyzing event conditions:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadData = () => {
    if (!results || !selectedDate) return;

    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    link.download = `weather-analysis-${formattedDate}-${eventName || 'event'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (!results || !results.historicalData || !selectedDate) return;

    const headers = ['Date', 'Temperature (°C)', 'Precipitation (mm)', 'Wind Speed (m/s)', 'Humidity (%)'];
    const rows = results.historicalData.map((row: HistoricalData) => [
      row.date,
      row.temperature,
      row.precipitation,
      row.windSpeed,
      row.humidity
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    link.download = `weather-data-${formattedDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'extreme': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionIcon = (condition: string) => {
    if (condition.includes('hot') || condition.includes('heat')) return <ThermometerSun className="w-5 h-5" />;
    if (condition.includes('cold')) return <ThermometerSnowflake className="w-5 h-5" />;
    if (condition.includes('wind')) return <Wind className="w-5 h-5" />;
    if (condition.includes('wet') || condition.includes('rain')) return <CloudRain className="w-5 h-5" />;
    if (condition.includes('humid')) return <Droplets className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen p-4">
      <div>
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-primary mb-2">🗓️ Weather Event Planner</h1>
          <p className="text-muted-foreground">
            Plan your outdoor events with confidence using NASA historical weather data and probability forecasts
          </p>
        </div>

        {/* Event Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Tell us about your planned outdoor event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="eventName">Event Name (Optional)</Label>
                <Input
                  id="eventName"
                  placeholder="e.g., Summer Hike, Beach Picnic"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hiking">🥾 Hiking</SelectItem>
                    <SelectItem value="fishing">🎣 Fishing</SelectItem>
                    <SelectItem value="camping">⛺ Camping</SelectItem>
                    <SelectItem value="beach">🏖️ Beach Visit</SelectItem>
                    <SelectItem value="picnic">🧺 Picnic</SelectItem>
                    <SelectItem value="sports">⚽ Outdoor Sports</SelectItem>
                    <SelectItem value="cycling">🚴 Cycling</SelectItem>
                    <SelectItem value="photography">📷 Photography</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Planned Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-1 justify-start text-left"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Location</Label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-muted rounded-md text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{location?.name || 'No location selected'}</span>
                    </div>
                  </div>
                  <LocationPicker
                    currentLocation={location}
                    onLocationChange={handleLocationSelect}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={analyzeEventConditions}
              disabled={loading || !location || !selectedDate}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching 5 Years of NASA Data... (10-15s)
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analyze Weather Probability
                </>
              )}
            </Button>

            {/* Demo/Mock Data Button */}
            <Button
              onClick={() => {
                setShowMockData(true);
                setResults({
                  probabilityData: mockProbabilityData,
                  targetDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
                  location: location || { latitude: 0, longitude: 0, name: 'Demo Location' },
                  dataSource: {
                    api: 'DEMO DATA',
                    yearsAnalyzed: 5,
                    samplesUsed: 60,
                    dateRange: '2020-2024'
                  }
                });
              }}
              variant="outline"
              className="w-full mt-2"
            >
              <Info className="mr-2 h-4 w-4" />
              View Demo Visualization (Mock Data)
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <>
            {/* Overall Recommendation */}
            <Alert className={`mb-6 ${results.overallSafety === 'safe' ? 'bg-green-50 border-green-200' : results.overallSafety === 'caution' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
              {results.overallSafety === 'safe' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className={`h-4 w-4 ${results.overallSafety === 'caution' ? 'text-yellow-600' : 'text-red-600'}`} />
              )}
              <AlertTitle className={results.overallSafety === 'safe' ? 'text-green-800' : results.overallSafety === 'caution' ? 'text-yellow-800' : 'text-red-800'}>
                {results.recommendation}
              </AlertTitle>
              <AlertDescription className={results.overallSafety === 'safe' ? 'text-green-700' : results.overallSafety === 'caution' ? 'text-yellow-700' : 'text-red-700'}>
                Based on {results.yearsOfData} years of NASA historical weather data for this location and time of year
              </AlertDescription>
            </Alert>

            {/* Download Buttons */}
            <div className="flex gap-2 mb-6">
              <Button onClick={downloadData} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download JSON
              </Button>
              <Button onClick={downloadCSV} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>

            <Tabs defaultValue="probabilities" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="probabilities">Probabilities</TabsTrigger>
                <TabsTrigger value="visualization">Statistical Analysis</TabsTrigger>
                <TabsTrigger value="trends">Historical Trends</TabsTrigger>
                <TabsTrigger value="details">Detailed Data</TabsTrigger>
              </TabsList>

              {/* Probabilities Tab */}
              <TabsContent value="probabilities" className="space-y-4">
                {results.probabilities?.map((prob: WeatherProbability, index: number) => (
                  <Card key={index} className={`border-2 ${getSeverityColor(prob.severity)}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${getSeverityColor(prob.severity)}`}>
                          {getConditionIcon(prob.condition)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3>{prob.condition}</h3>
                            <Badge variant="outline" className={getSeverityColor(prob.severity)}>
                              {prob.probability}% Probability
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {prob.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Likelihood</span>
                              <span>{prob.probability}%</span>
                            </div>
                            <Progress value={prob.probability} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Historical average: {prob.historicalMean.toFixed(1)}</span>
                              <span>Threshold: {prob.threshold}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Summary Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Expected Conditions Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">🌡️ Temperature</span>
                        <span>{results.expectedConditions?.temperature}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">💨 Wind Speed</span>
                        <span>{results.expectedConditions?.windSpeed} m/s</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">🌧️ Precipitation</span>
                        <span>{results.expectedConditions?.precipitation} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">💧 Humidity</span>
                        <span>{results.expectedConditions?.humidity}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Statistical Analysis Tab */}
              <TabsContent value="visualization" className="space-y-4">
                {showMockData && results?.probabilityData && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <Info className="h-4 w-4 text-orange-600" />
                    <AlertTitle className="text-orange-900">Demo Mode - Sample Data</AlertTitle>
                    <AlertDescription className="text-orange-700">
                      This is mock/demo data showing how the probability visualization works. 
                      Click "Analyze Weather Probability" for real NASA data for your selected date and location.
                    </AlertDescription>
                  </Alert>
                )}
                
                {loading ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
                        <h3 className="text-blue-900 mb-2">Analyzing NASA Historical Data...</h3>
                        <p className="text-sm text-blue-600 mb-4">
                          Fetching 5 years of satellite observations
                        </p>
                        <div className="max-w-md mx-auto bg-blue-50 p-4 rounded-lg">
                          <p className="text-xs text-blue-700">
                            ⏱️ This usually takes 10-15 seconds<br/>
                            📊 Processing temperature, precipitation & wind data<br/>
                            🛰️ Calculating statistical confidence intervals
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : results?.probabilityData ? (
                  <ProbabilityVisualization 
                    data={results.probabilityData}
                    targetDate={selectedDate ? format(selectedDate, 'MMMM d, yyyy') : undefined}
                  />
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8 text-muted-foreground">
                        <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="mb-2">No statistical analysis available yet</p>
                        <p className="text-xs mb-4">Click one of the buttons above to see visualizations</p>
                        <div className="flex flex-col gap-2 max-w-xs mx-auto text-xs">
                          <div className="bg-blue-50 p-3 rounded-lg text-left">
                            <p className="text-blue-900 mb-1">📊 <strong>Analyze Weather Probability</strong></p>
                            <p className="text-blue-600">Fetches real NASA data for your date/location (10-15s)</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg text-left">
                            <p className="text-orange-900 mb-1">🎨 <strong>View Demo Visualization</strong></p>
                            <p className="text-orange-600">Shows sample data instantly to preview the feature</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Historical Trends Tab */}
              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Temperature Trends</CardTitle>
                    <CardDescription>
                      Historical temperature patterns for {selectedDate ? format(selectedDate, 'MMMM d') : 'selected date'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={results.historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#f97316" 
                          fill="#fed7aa" 
                          name="Temperature (°C)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Precipitation & Wind Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={results.historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="precipitation" fill="#3b82f6" name="Precipitation (mm)" />
                        <Bar yAxisId="right" dataKey="windSpeed" fill="#10b981" name="Wind Speed (m/s)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Detailed Data Tab */}
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Location Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{location?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coordinates:</span>
                        <span>{location?.latitude.toFixed(4)}°, {location?.longitude.toFixed(4)}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Event Date:</span>
                        <span>{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data Source:</span>
                        <span>NASA POWER API</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Historical Period:</span>
                        <span>{results.yearsOfData} years</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Thresholds Used</CardTitle>
                    <CardDescription>
                      Conditions that trigger warnings for your event type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <ThermometerSun className="w-4 h-4 text-red-600" />
                          <span className="text-sm">Very Hot</span>
                        </div>
                        <span className="text-sm">≥ 35°C (95°F)</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <ThermometerSnowflake className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Very Cold</span>
                        </div>
                        <span className="text-sm">≤ 5°C (41°F)</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Wind className="w-4 h-4 text-cyan-600" />
                          <span className="text-sm">Very Windy</span>
                        </div>
                        <span className="text-sm">≥ 10 m/s (22 mph)</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CloudRain className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm">Very Wet</span>
                        </div>
                        <span className="text-sm">≥ 10 mm precipitation</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Very Humid</span>
                        </div>
                        <span className="text-sm">≥ 85% humidity</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>About This Analysis</AlertTitle>
                  <AlertDescription>
                    This probability forecast is based on NASA POWER historical climate data spanning multiple years. 
                    It analyzes weather patterns for the same date across previous years to calculate the likelihood 
                    of specific conditions occurring. While this provides valuable insights for planning, actual 
                    weather conditions may vary. We recommend checking short-term forecasts closer to your event date.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </>
        )}

        {!results && !loading && (
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-2">Plan with Confidence</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Enter your event details above and we'll analyze NASA historical weather data to tell you the 
                    probability of encountering very hot, very cold, very windy, very wet, or very uncomfortable 
                    conditions for your planned date and location.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-2xl mx-auto pt-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <ThermometerSun className="w-6 h-6 text-red-500 mx-auto mb-1" />
                    <p className="text-xs">Very Hot</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <ThermometerSnowflake className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs">Very Cold</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Wind className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
                    <p className="text-xs">Very Windy</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <CloudRain className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
                    <p className="text-xs">Very Wet</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg col-span-2 md:col-span-1">
                    <Droplets className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs">Uncomfortable</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}