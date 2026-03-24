import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { trafficData, trafficHotspots } from "../lib/mockData";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { AlertCircle, Navigation, TrendingDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function TrafficDashboard() {
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Traffic Congestion Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Real-time traffic monitoring and congestion hotspots across Sarawak
        </p>
      </div>

      {/* Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>High Congestion Alert</AlertTitle>
        <AlertDescription>
          3 major roads are experiencing severe congestion. Average delay: 18 minutes.
        </AlertDescription>
      </Alert>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Congestion Level (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="congestion" stroke="#ef4444" strokeWidth={2} name="Congestion %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Speed (km/h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="speed" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Hotspots Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Traffic Hotspots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Congestion Level</TableHead>
                <TableHead>Incidents (Today)</TableHead>
                <TableHead>Avg Speed (km/h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trafficHotspots.map((hotspot) => (
                <TableRow key={hotspot.location}>
                  <TableCell>{hotspot.location}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(hotspot.level)}>
                      {hotspot.level}
                    </Badge>
                  </TableCell>
                  <TableCell>{hotspot.incidents}</TableCell>
                  <TableCell>{hotspot.avgSpeed}</TableCell>
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
            <TrendingDown className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p><strong>Short-term:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Deploy traffic officers to Jalan Pending and Jalan Tun Jugah during peak hours (8-9 AM, 5-6 PM)</li>
              <li>Activate real-time traffic alerts through mobile apps and digital signage</li>
              <li>Optimize traffic light timing at major intersections</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p><strong>Long-term:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Implement smart traffic management system with AI-powered signal control</li>
              <li>Develop alternative routes and improve public transportation connectivity</li>
              <li>Create park-and-ride facilities at strategic locations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
