import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Download, 
  TrendingUp, 
  Droplet, 
  Wind, 
  Thermometer, 
  Sun, 
  Cloud,
  Loader2,
  AlertTriangle,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { LocationPicker } from './LocationPicker';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface WeatherDashboardPageProps {
  onBack: () => void;
  userLocation?: { latitude: number; longitude: number; name?: string } | null;
  onLocationChange: (location: { latitude: number; longitude: number; name: string }) => void;
  accessToken?: string;
}

export function WeatherDashboardPage({ onBack, userLocation, onLocationChange, accessToken }: WeatherDashboardPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation) {
      loadDashboardData();
    }
  }, [userLocation, selectedDate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dayOfYear = getDayOfYear(selectedDate);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0/weather-dashboard`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            latitude: userLocation?.latitude,
            longitude: userLocation?.longitude,
            dayOfYear: dayOfYear,
            date: selectedDate.toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load dashboard data: ${response.statusText}`);
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error: any) {
      console.error('Dashboard data error:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateLong = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
  };

  const exportToJSON = () => {
    if (!dashboardData) return;
    
    const exportData = {
      location: {
        name: userLocation?.name,
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
      },
      date: selectedDate.toISOString(),
      dayOfYear: getDayOfYear(selectedDate),
      ...dashboardData,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weather-dashboard-${formatDate(selectedDate)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (!dashboardData) return;

    // Build CSV from historical data
    let csv = 'Metric,Value,Unit,Probability,Threshold\n';
    
    // Current conditions
    if (dashboardData.current) {
      csv += `Temperature,${dashboardData.current.temperature},°C,,\n`;
      csv += `Humidity,${dashboardData.current.humidity},%,,\n`;
      csv += `Precipitation,${dashboardData.current.precipitation},mm,,\n`;
      csv += `Wind Speed,${dashboardData.current.windSpeed},km/h,,\n`;
    }

    // Probabilities
    if (dashboardData.probabilities) {
      csv += `\nProbability Analysis\n`;
      Object.entries(dashboardData.probabilities).forEach(([key, value]: [string, any]) => {
        csv += `${key},${value.probability},%,${value.threshold},${value.unit}\n`;
      });
    }

    const csvBlob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weather-dashboard-${formatDate(selectedDate)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="text-blue-700">Loading weather probability data from NASA...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Dashboard</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-blue-100">
            <ArrowLeft className="h-5 w-5 text-blue-700" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-blue-900">Weather Probability Dashboard</h1>
            <p className="text-sm text-blue-600">
              Historical analysis and likelihood predictions powered by NASA Earth data
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <LocationPicker 
              currentLocation={userLocation}
              onLocationChange={onLocationChange}
            />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-blue-300">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateLong(selectedDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" onClick={exportToJSON} className="border-blue-300">
              <FileJson className="mr-2 h-4 w-4" />
              Export JSON
            </Button>

            <Button variant="outline" onClick={exportToCSV} className="border-blue-300">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Location & Date Info */}
        <Card className="mb-6 bg-white border-blue-200">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600">Location</Badge>
                <span className="text-blue-900">{userLocation?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-300">Coordinates</Badge>
                <span className="text-blue-700">
                  {userLocation?.latitude.toFixed(4)}°, {userLocation?.longitude.toFixed(4)}°
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-300">Day of Year</Badge>
                <span className="text-blue-700">{getDayOfYear(selectedDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-300">Data Source</Badge>
                <span className="text-blue-700">NASA POWER API (10+ years)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-blue-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
            <TabsTrigger value="wind">Wind & Air</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Current Conditions Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Thermometer className="h-5 w-5" />
                    Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {dashboardData?.current?.temperature?.toFixed(1) || '--'}°C
                  </div>
                  <p className="text-sm text-orange-100 mt-1">
                    Historical avg: {dashboardData?.historical?.temperature?.mean?.toFixed(1) || '--'}°C
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Droplet className="h-5 w-5" />
                    Precipitation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {dashboardData?.current?.precipitation?.toFixed(1) || '0.0'}mm
                  </div>
                  <p className="text-sm text-blue-100 mt-1">
                    {dashboardData?.probabilities?.precipitation?.probability || '--'}% chance of rain
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wind className="h-5 w-5" />
                    Wind Speed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {dashboardData?.current?.windSpeed?.toFixed(1) || '--'}km/h
                  </div>
                  <p className="text-sm text-green-100 mt-1">
                    Historical avg: {dashboardData?.historical?.windSpeed?.mean?.toFixed(1) || '--'}km/h
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Cloud className="h-5 w-5" />
                    Humidity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {dashboardData?.current?.humidity?.toFixed(0) || '--'}%
                  </div>
                  <p className="text-sm text-purple-100 mt-1">
                    Historical avg: {dashboardData?.historical?.humidity?.mean?.toFixed(0) || '--'}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Probability Thresholds */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Probability of Exceeding Thresholds
                </CardTitle>
                <CardDescription>
                  Based on {dashboardData?.yearsOfData || '10+'} years of historical NASA satellite data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.probabilities && Object.entries(dashboardData.probabilities).map(([key, data]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">{data.label}</p>
                        <p className="text-sm text-blue-600 mt-1">{data.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-blue-700">
                          {data.probability}%
                        </div>
                        <p className="text-xs text-blue-600">
                          Threshold: {data.threshold}{data.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 30-Day Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>30-Day Weather Trend</CardTitle>
                <CardDescription>Temperature and precipitation forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dashboardData?.trends || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#f97316"
                      fill="#fed7aa"
                      name="Temperature (°C)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="precipitation"
                      stroke="#3b82f6"
                      fill="#bfdbfe"
                      name="Precipitation (mm)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Temperature Tab */}
          <TabsContent value="temperature" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Analysis</CardTitle>
                <CardDescription>
                  Historical temperature patterns for {formatDateLong(selectedDate)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Temperature Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">Mean</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {dashboardData?.historical?.temperature?.mean?.toFixed(1) || '--'}°C
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">Maximum</p>
                    <p className="text-2xl font-bold text-red-900">
                      {dashboardData?.historical?.temperature?.max?.toFixed(1) || '--'}°C
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Minimum</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {dashboardData?.historical?.temperature?.min?.toFixed(1) || '--'}°C
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Std Dev</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {dashboardData?.historical?.temperature?.stdDev?.toFixed(1) || '--'}°C
                    </p>
                  </div>
                </div>

                {/* Temperature Distribution Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData?.temperatureDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="frequency" fill="#f97316" name="Frequency (%)" />
                  </BarChart>
                </ResponsiveContainer>

                {/* Heat Index Warning */}
                {dashboardData?.probabilities?.extremeHeat && (
                  <Alert className={
                    dashboardData.probabilities.extremeHeat.probability > 60
                      ? "border-red-500 bg-red-50"
                      : "border-orange-300 bg-orange-50"
                  }>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Extreme Heat Alert</AlertTitle>
                    <AlertDescription>
                      {dashboardData.probabilities.extremeHeat.probability}% probability of temperatures
                      exceeding {dashboardData.probabilities.extremeHeat.threshold}°C
                      ({(dashboardData.probabilities.extremeHeat.threshold * 9/5 + 32).toFixed(0)}°F).
                      {dashboardData.probabilities.extremeHeat.probability > 60 && 
                        " Consider rescheduling outdoor activities."}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Precipitation Tab */}
          <TabsContent value="precipitation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Precipitation Analysis</CardTitle>
                <CardDescription>
                  Rainfall probability and historical patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Precipitation Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Rain Probability</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {dashboardData?.probabilities?.precipitation?.probability || '--'}%
                    </p>
                  </div>
                  <div className="p-4 bg-cyan-50 rounded-lg">
                    <p className="text-sm text-cyan-600">Average Rainfall</p>
                    <p className="text-2xl font-bold text-cyan-900">
                      {dashboardData?.historical?.precipitation?.mean?.toFixed(1) || '--'}mm
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-600">Heavy Rain Chance</p>
                    <p className="text-2xl font-bold text-indigo-900">
                      {dashboardData?.probabilities?.heavyRain?.probability || '--'}%
                    </p>
                  </div>
                </div>

                {/* Precipitation Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData?.precipitationTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rainfall"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Average Rainfall (mm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wind & Air Tab */}
          <TabsContent value="wind" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wind Speed & Air Quality</CardTitle>
                <CardDescription>
                  Wind patterns and atmospheric conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Wind Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Average Wind</p>
                    <p className="text-2xl font-bold text-green-900">
                      {dashboardData?.historical?.windSpeed?.mean?.toFixed(1) || '--'}km/h
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-600">Max Wind</p>
                    <p className="text-2xl font-bold text-emerald-900">
                      {dashboardData?.historical?.windSpeed?.max?.toFixed(1) || '--'}km/h
                    </p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <p className="text-sm text-teal-600">High Wind Chance</p>
                    <p className="text-2xl font-bold text-teal-900">
                      {dashboardData?.probabilities?.highWind?.probability || '--'}%
                    </p>
                  </div>
                </div>

                {/* Wind Speed Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dashboardData?.windTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="speed"
                      stroke="#10b981"
                      fill="#d1fae5"
                      name="Wind Speed (km/h)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Data Attribution */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm text-blue-900">
                  <strong>🛰️ NASA Earth Observation Data Sources:</strong>
                </p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>• NASA POWER API - Prediction of Worldwide Energy Resources</li>
                  <li>• {dashboardData?.yearsOfData || '10+'} years of historical satellite measurements</li>
                  <li>• Daily climate data aggregated from multiple NASA satellites</li>
                  <li>• Global coverage with 0.5° x 0.5° spatial resolution</li>
                </ul>
                <p className="text-xs text-blue-600 mt-3 italic">
                  Last updated: {new Date().toLocaleString()} • Free and open NASA data
                </p>
              </div>
              <Download className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
