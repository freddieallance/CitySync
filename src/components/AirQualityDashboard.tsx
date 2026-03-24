import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { airQualityData, airQualityByArea } from "../lib/mockData";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Activity, Wind, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function AirQualityDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "bg-green-600";
      case "Moderate":
        return "bg-yellow-600";
      default:
        return "bg-red-600";
    }
  };

  const radarData = airQualityByArea.map(area => ({
    area: area.area,
    AQI: area.aqi,
    PM25: area.pm25 * 2, // Scale for visualization
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Air Quality Monitoring</h1>
        <p className="text-muted-foreground mt-1">
          Track air quality index, PM2.5, PM10, and pollutant levels across Sarawak
        </p>
      </div>

      {/* Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Air Quality Status: Moderate</AlertTitle>
        <AlertDescription>
          Air quality is acceptable for most people. Unusually sensitive individuals should consider limiting prolonged outdoor exertion.
        </AlertDescription>
      </Alert>

      {/* AQI Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">AQI Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div className="space-y-1">
              <div className="bg-green-600 text-white p-2 rounded">Good (0-50)</div>
            </div>
            <div className="space-y-1">
              <div className="bg-yellow-500 text-white p-2 rounded">Moderate (51-100)</div>
            </div>
            <div className="space-y-1">
              <div className="bg-orange-500 text-white p-2 rounded">Unhealthy (101-150)</div>
            </div>
            <div className="space-y-1">
              <div className="bg-red-600 text-white p-2 rounded">Very Unhealthy (151-200)</div>
            </div>
            <div className="space-y-1">
              <div className="bg-purple-800 text-white p-2 rounded">Hazardous (201+)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly AQI Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={airQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="aqi" stroke="#10b981" strokeWidth={2} name="AQI" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Particulate Matter (PM2.5 & PM10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={airQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pm25" fill="#3b82f6" name="PM2.5 (µg/m³)" />
                <Bar dataKey="pm10" fill="#8b5cf6" name="PM10 (µg/m³)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Air Quality Comparison by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="area" />
              <PolarRadiusAxis />
              <Radar name="AQI" dataKey="AQI" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Air Quality by Area Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5" />
            Air Quality by Area
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>AQI</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>PM2.5 (µg/m³)</TableHead>
                <TableHead>Recommendation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {airQualityByArea.map((area) => (
                <TableRow key={area.area}>
                  <TableCell>{area.area}</TableCell>
                  <TableCell>{area.aqi}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(area.status)}>
                      {area.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{area.pm25}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {area.status === "Good" ? "Safe for outdoor activities" : "Limit prolonged exertion"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Improvement Strategies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p><strong>Monitoring & Enforcement:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Deploy additional air quality sensors in industrial zones and high-traffic areas</li>
              <li>Enforce stricter emissions standards for vehicles and industrial facilities</li>
              <li>Implement real-time air quality alerts through mobile apps</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p><strong>Long-term Solutions:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Promote public transportation and electric vehicle adoption</li>
              <li>Increase urban green spaces and tree planting initiatives</li>
              <li>Regulate industrial emissions with advanced filtration systems</li>
              <li>Develop clean energy alternatives to reduce fossil fuel dependency</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
