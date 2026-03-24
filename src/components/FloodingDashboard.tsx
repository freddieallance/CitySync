import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { floodRiskData, monthlyRainfall } from "../lib/mockData";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { AlertTriangle, CloudRain, Droplets } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Progress } from "./ui/progress";

export function FloodingDashboard() {
  const getBadgeVariant = (risk: string) => {
    switch (risk) {
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
        <h1>Flood Risk Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Monitor flooding risks based on elevation, rainfall, and satellite data
        </p>
      </div>

      {/* Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>High Flood Risk Warning</AlertTitle>
        <AlertDescription>
          Kuching Central and Sibu are at high risk. Rainfall 40% above threshold. Activate emergency protocols.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">High Risk Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div>2 Areas</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Average Rainfall (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div>270mm</div>
              <p className="text-xs text-muted-foreground">+8% above threshold</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Population at Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div>~128,000</div>
              <p className="text-xs text-muted-foreground">In high-risk zones</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Rainfall vs Threshold</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRainfall}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rainfall" fill="#3b82f6" name="Rainfall (mm)" />
                <Bar dataKey="threshold" fill="#ef4444" opacity={0.3} name="Threshold" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rainfall Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRainfall}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rainfall" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Flood Risk Areas Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5" />
            Flood Risk by Area
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Elevation (m)</TableHead>
                <TableHead>Rainfall (mm/month)</TableHead>
                <TableHead>Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {floodRiskData.map((area) => {
                const riskScore = area.risk === "High" ? 85 : area.risk === "Medium" ? 55 : 25;
                return (
                  <TableRow key={area.area}>
                    <TableCell>{area.area}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(area.risk)}>
                        {area.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>{area.elevation}m</TableCell>
                    <TableCell>{area.rainfall}mm</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={riskScore} className="w-20" />
                        <span className="text-sm text-muted-foreground">{riskScore}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mitigation Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Mitigation Strategies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p><strong>Immediate Actions:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Issue flood warnings to residents in Kuching Central and Sibu</li>
              <li>Activate emergency response teams and prepare evacuation centers</li>
              <li>Monitor river levels and drainage systems in real-time</li>
              <li>Clear drainage systems and storm water channels</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p><strong>Long-term Infrastructure:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Improve drainage infrastructure in low-elevation areas</li>
              <li>Implement retention ponds and green infrastructure solutions</li>
              <li>Develop early warning systems using satellite data and IoT sensors</li>
              <li>Create flood protection zones and restrict development in high-risk areas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
