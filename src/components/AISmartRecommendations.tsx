import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Clock, Shield, Package, Lightbulb, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AISmartRecommendationsProps {
  location: string;
  weather: any;
  nasaData?: any;
  activityType: 'outdoor' | 'indoor';
  onActivitySelect?: (activity: string) => void;
}

interface ActivityRecommendation {
  activity: string;
  safetyRating: 'Safe' | 'Moderate' | 'Risky';
  score: number;
  tips: string[];
  bestTime: string;
  equipment: string[];
  reasoning: string;
}

interface RecommendationData {
  recommendations: ActivityRecommendation[];
  overallAssessment: string;
  alerts: string[];
}

export function AISmartRecommendations({
  location,
  weather,
  nasaData,
  activityType,
  onActivitySelect
}: AISmartRecommendationsProps) {
  const [data, setData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0/ai/recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          weather,
          nasaData,
          activityType
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate recommendations');
      }

      const result = await response.json();
      setData(result);
    } catch (error: any) {
      console.error('Smart recommendations error:', error);
      toast.error(error.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case 'Safe': return 'bg-green-100 text-green-700 border-green-300';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Risky': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSafetyIcon = (rating: string) => {
    switch (rating) {
      case 'Safe': return '✅';
      case 'Moderate': return '⚠️';
      case 'Risky': return '🚫';
      default: return '❓';
    }
  };

  if (!data && !loading) {
    return (
      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-2">Get AI-Powered Activity Recommendations</h3>
          <p className="text-muted-foreground mb-6">
            Let our AI analyze weather, NASA data, and environmental conditions to suggest the best activities for you.
          </p>
          <Button onClick={generateRecommendations} size="lg" className="gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Smart Recommendations
          </Button>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-muted-foreground">Analyzing environmental data...</p>
            <p className="text-sm text-muted-foreground mt-1">
              This may take a few moments
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Overall Assessment */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-2">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-2 flex items-center gap-2">
              AI Assessment
              <Badge variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Gemini 2.0
              </Badge>
            </h4>
            <p className="text-sm text-muted-foreground">{data.overallAssessment}</p>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-2 border-yellow-300">
          <h4 className="text-sm text-yellow-800 mb-2">⚠️ Important Alerts</h4>
          <ul className="space-y-1">
            {data.alerts.map((alert, index) => (
              <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                <span>•</span>
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Recommendations */}
      <div className="space-y-3">
        {data.recommendations.map((rec, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4>{rec.activity}</h4>
                    <Badge className={`${getSafetyColor(rec.safetyRating)} border`}>
                      {getSafetyIcon(rec.safetyRating)} {rec.safetyRating}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Score: {rec.score}/100
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {rec.bestTime}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedIndex === index && (
              <div className="border-t p-4 bg-muted/20 space-y-4">
                {/* Reasoning */}
                <div>
                  <h5 className="text-sm mb-2">Why this activity?</h5>
                  <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                </div>

                {/* Safety Tips */}
                {rec.tips.length > 0 && (
                  <div>
                    <h5 className="text-sm mb-2 flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Safety Tips
                    </h5>
                    <ul className="space-y-1">
                      {rec.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Equipment */}
                {rec.equipment.length > 0 && (
                  <div>
                    <h5 className="text-sm mb-2 flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      Recommended Equipment
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {rec.equipment.map((item, itemIndex) => (
                        <Badge key={itemIndex} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={() => onActivitySelect?.(rec.activity)}
                  className="w-full"
                  variant={rec.safetyRating === 'Safe' ? 'default' : 'outline'}
                >
                  Select This Activity
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Regenerate Button */}
      <Button
        onClick={generateRecommendations}
        variant="outline"
        className="w-full gap-2"
        disabled={loading}
      >
        <Sparkles className="h-4 w-4" />
        Regenerate Recommendations
      </Button>
    </div>
  );
}
