import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, TrendingUp, TrendingDown, Minus, AlertTriangle, Info, AlertCircle, Brain, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AIInsightsProps {
  location: string;
  currentWeather: any;
  forecast?: any[];
  nasaData?: any;
  communityReviews?: any[];
}

interface Insight {
  category: string;
  title: string;
  description: string;
  severity: 'Info' | 'Warning' | 'Critical';
  actionable: string;
}

interface SafetyData {
  overallSafetyScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  insights: Insight[];
  predictions: {
    next6Hours: string;
    next24Hours: string;
    trend: 'Improving' | 'Stable' | 'Worsening';
  };
  recommendations: string[];
  emergencyContacts?: string | Record<string, any>;
}

export function AIInsights({ location, currentWeather, forecast, nasaData, communityReviews }: AIInsightsProps) {
  const [insights, setInsights] = useState<SafetyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0/ai/safety-insights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          currentWeather,
          forecast: forecast?.slice(0, 3),
          nasaData,
          communityReviews: communityReviews?.slice(0, 5)
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate insights');
      }

      const data = await response.json();
      setInsights(data);
    } catch (error: any) {
      console.error('AI insights error:', error);
      toast.error(error.message || 'Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [location, currentWeather]);

  if (loading && !insights) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Generating AI insights...</span>
        </div>
      </Card>
    );
  }

  if (!insights) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'Warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'Worsening': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden border-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3>AI Safety Insights</h3>
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <p className="text-sm text-white/80 mt-1">
                Powered by Google Gemini 2.0 Flash • Multi-source analysis
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadInsights}
            disabled={loading}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Safety Score */}
      <div className="p-6 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overall Safety Score</p>
            <div className="flex items-center gap-3">
              <div className="text-4xl">{insights.overallSafetyScore}</div>
              <div className="text-muted-foreground">/100</div>
            </div>
          </div>
          <Badge className={`${getRiskColor(insights.riskLevel)} border-2 px-4 py-2`}>
            <span className="mr-1">⚠</span>
            {insights.riskLevel} Risk
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              insights.overallSafetyScore >= 70 ? 'bg-green-500' :
              insights.overallSafetyScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${insights.overallSafetyScore}%` }}
          />
        </div>
      </div>

      {/* Predictions */}
      <div className="p-6 border-b bg-background">
        <div className="flex items-center gap-2 mb-3">
          {getTrendIcon(insights.predictions.trend)}
          <h4 className="text-sm">Trend: <span className={`
            ${insights.predictions.trend === 'Improving' ? 'text-green-600' : ''}
            ${insights.predictions.trend === 'Worsening' ? 'text-red-600' : ''}
            ${insights.predictions.trend === 'Stable' ? 'text-gray-600' : ''}
          `}>{insights.predictions.trend}</span></h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Next 6 Hours</p>
            <p className="text-sm">{insights.predictions.next6Hours}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Next 24 Hours</p>
            <p className="text-sm">{insights.predictions.next24Hours}</p>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="p-6">
        <h4 className="text-sm mb-3">Key Insights</h4>
        <div className="space-y-3">
          {insights.insights.slice(0, expanded ? undefined : 3).map((insight, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
              <div className="flex items-start gap-3">
                {getSeverityIcon(insight.severity)}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h5 className="text-sm">{insight.title}</h5>
                    <Badge variant="outline" className="text-xs">
                      {insight.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.description}
                  </p>
                  {insight.actionable && (
                    <div className="bg-primary/10 rounded px-3 py-2 mt-2">
                      <p className="text-sm text-primary">
                        💡 {insight.actionable}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {insights.insights.length > 3 && (
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-3"
          >
            {expanded ? 'Show Less' : `Show ${insights.insights.length - 3} More Insights`}
          </Button>
        )}
      </div>

      {/* Recommendations */}
      {insights.recommendations.length > 0 && (
        <div className="p-6 border-t bg-muted/20">
          <h4 className="text-sm mb-3">AI Recommendations</h4>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Emergency Contacts */}
      {insights.emergencyContacts && (
        <div className="p-6 border-t bg-red-50">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm text-red-600 mb-2">Emergency Information</h4>
              {typeof insights.emergencyContacts === 'string' ? (
                <p className="text-sm text-red-700">{insights.emergencyContacts}</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(insights.emergencyContacts).map(([key, value]) => (
                    <div key={key} className="text-sm text-red-700">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>{' '}
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
