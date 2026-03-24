import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { healthcareAccess, healthcareUtilization, diseaseDistribution } from "../lib/mockData";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Heart, Building2, Users, Activity } from "lucide-react";
import { Progress } from "./ui/progress";

export function HealthcareDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Healthcare Access Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Monitor healthcare infrastructure, facility utilization, and population health metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Total Hospitals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>19</div>
            <p className="text-xs text-muted-foreground">Across 5 regions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Clinics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>128</div>
            <p className="text-xs text-muted-foreground">Primary care facilities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Healthcare Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>815</div>
            <p className="text-xs text-muted-foreground">Doctors & specialists</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Coverage Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>85%</div>
            <p className="text-xs text-muted-foreground">Population access</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Healthcare Facility Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthcareUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} name="Patient Visits" />
                <Line type="monotone" dataKey="capacity" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Capacity" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disease Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {diseaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Healthcare Access Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Healthcare Infrastructure by Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Hospitals</TableHead>
                <TableHead>Clinics</TableHead>
                <TableHead>Doctors</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Doctor-to-Population Ratio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthcareAccess.map((region) => {
                const ratio = Math.round(region.population / region.doctors);
                const isGood = ratio < 1000;
                return (
                  <TableRow key={region.area}>
                    <TableCell>{region.area}</TableCell>
                    <TableCell>{region.hospitals}</TableCell>
                    <TableCell>{region.clinics}</TableCell>
                    <TableCell>{region.doctors}</TableCell>
                    <TableCell>{region.population.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={isGood ? "outline" : "secondary"}>
                          1:{ratio}
                        </Badge>
                        {!isGood && <span className="text-xs text-muted-foreground">Needs improvement</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Regional Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Healthcare Accessibility Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {healthcareAccess.map((region) => {
            const score = Math.min(
              100,
              Math.round(
                (region.doctors / (region.population / 1000)) * 10 +
                (region.hospitals * 5) +
                (region.clinics * 2)
              )
            );
            return (
              <div key={region.area} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>{region.area}</span>
                  <span className="text-sm text-muted-foreground">{score}%</span>
                </div>
                <Progress value={score} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Healthcare Improvement Strategies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p><strong>Infrastructure Development:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Expand clinic network in Miri and Sibu where doctor-to-population ratios are high</li>
              <li>Establish mobile health units for remote areas with limited access</li>
              <li>Upgrade existing facilities with modern medical equipment</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p><strong>Workforce & Services:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Recruit additional doctors and specialists, especially in underserved regions</li>
              <li>Implement telemedicine services to improve access in rural areas</li>
              <li>Focus on preventive care to reduce burden of respiratory and cardiovascular diseases</li>
              <li>Develop specialized centers for chronic disease management</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p><strong>Technology Integration:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Deploy AI-powered diagnostic tools to assist healthcare providers</li>
              <li>Create centralized health information system for better data sharing</li>
              <li>Implement patient monitoring systems for chronic disease management</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
