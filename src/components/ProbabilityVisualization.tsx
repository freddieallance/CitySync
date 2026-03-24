import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, AlertTriangle, Info, BarChart3, Activity } from 'lucide-react';

interface ProbabilityData {
  historicalTrends: {
    date: string;
    value: number;
    mean: number;
    upperBound: number;
    lowerBound: number;
  }[];
  extremeWeatherProbability: {
    condition: string;
    probability: number;
    threshold: number;
    severity: 'low' | 'moderate' | 'high' | 'extreme';
    historicalOccurrences: number;
    description: string;
  }[];
  statistics: {
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    confidenceInterval95: { lower: number; upper: number };
  };
  parameter: string;
  unit: string;
}

interface ProbabilityVisualizationProps {
  data: {
    temperature?: ProbabilityData;
    precipitation?: ProbabilityData;
    windSpeed?: ProbabilityData;
  };
  targetDate?: string;
}

export function ProbabilityVisualization({ data, targetDate }: ProbabilityVisualizationProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'extreme': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg">
          <p className="text-xs text-blue-900 mb-1">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)} {entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderParameterAnalysis = (paramData: ProbabilityData, paramName: string) => {
    if (!paramData) return null;

    return (
      <div className="space-y-4">
        {/* Historical Trends with Confidence Intervals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Historical Trends & Confidence Intervals
            </CardTitle>
            <CardDescription>
              10+ year data showing typical range and variations ({paramData.unit})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={paramData.historicalTrends}>
                <defs>
                  <linearGradient id="confidenceArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  label={{ value: paramData.unit, angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="line"
                />
                
                {/* Confidence interval band */}
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="none"
                  fill="url(#confidenceArea)"
                  name="Upper 95% CI"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="none"
                  fill="url(#confidenceArea)"
                  name="Lower 95% CI"
                />
                
                {/* Mean line */}
                <Line
                  type="monotone"
                  dataKey="mean"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={false}
                  name="Historical Mean"
                />
                
                {/* Actual values */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="Actual Value"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Statistics Summary */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-blue-100">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Mean ± Std Dev</p>
                <p className="text-blue-900">
                  {paramData.statistics.mean.toFixed(1)} ± {paramData.statistics.stdDev.toFixed(1)} {paramData.unit}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">95% Confidence</p>
                <p className="text-blue-900 text-xs">
                  [{paramData.statistics.confidenceInterval95.lower.toFixed(1)}, {paramData.statistics.confidenceInterval95.upper.toFixed(1)}] {paramData.unit}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Historical Range</p>
                <p className="text-blue-900 text-xs">
                  {paramData.statistics.min.toFixed(1)} - {paramData.statistics.max.toFixed(1)} {paramData.unit}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Median</p>
                <p className="text-blue-900">
                  {paramData.statistics.median.toFixed(1)} {paramData.unit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extreme Weather Probability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              Extreme Weather Likelihood
            </CardTitle>
            <CardDescription>
              Probability of adverse conditions based on historical data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {paramData.extremeWeatherProbability.map((condition, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getSeverityIcon(condition.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-blue-900">{condition.condition}</p>
                        <Badge className={getSeverityColor(condition.severity)}>
                          {condition.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-blue-600">{condition.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-blue-900">
                      {condition.probability}%
                    </p>
                    <p className="text-xs text-blue-600">chance</p>
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="relative w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      condition.severity === 'extreme' ? 'bg-red-500' :
                      condition.severity === 'high' ? 'bg-orange-500' :
                      condition.severity === 'moderate' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${condition.probability}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-blue-600">
                  <span>Threshold: {condition.threshold.toFixed(1)} {paramData.unit}</span>
                  <span>{condition.historicalOccurrences} occurrences in 10+ years</span>
                </div>

                {index < paramData.extremeWeatherProbability.length - 1 && (
                  <div className="border-b border-blue-100 mt-3" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Source Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <Activity className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Data Source</AlertTitle>
          <AlertDescription className="text-xs text-blue-700">
            Analysis based on NASA Giovanni & POWER historical climate data (10+ years).
            Statistical confidence intervals calculated using standard deviation and t-distribution.
            Extreme weather probabilities derived from historical frequency analysis.
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  if (!data.temperature && !data.precipitation && !data.windSpeed) {
    return (
      <Alert className="border-blue-200">
        <Info className="h-4 w-4" />
        <AlertTitle>No Probability Data Available</AlertTitle>
        <AlertDescription>
          Probability analysis requires historical climate data. Try selecting a future date for your event.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {targetDate && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Probability Analysis for {targetDate}</AlertTitle>
          <AlertDescription className="text-blue-700">
            Based on 10+ years of historical weather data from NASA satellite observations
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="temperature" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="temperature" disabled={!data.temperature}>
            Temperature
          </TabsTrigger>
          <TabsTrigger value="precipitation" disabled={!data.precipitation}>
            Precipitation
          </TabsTrigger>
          <TabsTrigger value="windSpeed" disabled={!data.windSpeed}>
            Wind Speed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="temperature" className="mt-4">
          {data.temperature && renderParameterAnalysis(data.temperature, 'Temperature')}
        </TabsContent>

        <TabsContent value="precipitation" className="mt-4">
          {data.precipitation && renderParameterAnalysis(data.precipitation, 'Precipitation')}
        </TabsContent>

        <TabsContent value="windSpeed" className="mt-4">
          {data.windSpeed && renderParameterAnalysis(data.windSpeed, 'Wind Speed')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
