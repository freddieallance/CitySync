import { MetricCard } from "./MetricCard";
import { Activity, AlertTriangle, Cloud, Heart, Navigation, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { trafficData, airQualityData, monthlyRainfall, diseaseDistribution } from "../lib/mockData";
import { Badge } from "./ui/badge";

export function OverviewDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Smart Healthy Sarawak Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-time insights for urban health and sustainability
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Traffic Congestion"
          value="68%"
          change={5.2}
          trend="down"
          icon={<Navigation className="h-4 w-4" />}
          subtitle="Peak hour average"
        />
        <MetricCard
          title="Flood Risk Level"
          value="Medium"
          icon={<AlertTriangle className="h-4 w-4" />}
          subtitle="3 high-risk areas"
        />
        <MetricCard
          title="Air Quality Index"
          value="68"
          change={3.1}
          trend="up"
          icon={<Cloud className="h-4 w-4" />}
          subtitle="Moderate (Safe)"
        />
        <MetricCard
          title="Healthcare Access"
          value="85%"
          change={2.4}
          trend="up"
          icon={<Heart className="h-4 w-4" />}
          subtitle="Population coverage"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Traffic Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Congestion (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="congestion" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Air Quality Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Air Quality Index (Weekly)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={airQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="aqi" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rainfall Data */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Rainfall (mm)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRainfall}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rainfall" fill="#3b82f6" />
                <Bar dataKey="threshold" fill="#ef4444" opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Disease Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Disease Distribution (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
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

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="destructive">High Priority</Badge>
            <p className="text-sm">
              Traffic congestion on Jalan Pending increased by 15% during peak hours. Consider implementing smart traffic light systems.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary">Warning</Badge>
            <p className="text-sm">
              Kuching Central and Sibu show high flood risk due to low elevation and above-threshold rainfall. Monitor water levels closely.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-green-600">Good</Badge>
            <p className="text-sm">
              Air quality remains in safe range across most areas. Continue monitoring industrial zones.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary">Notice</Badge>
            <p className="text-sm">
              Healthcare facility utilization at 92% of capacity in Kuching. Consider expanding clinic hours or mobile health units.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
