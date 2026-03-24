import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar, Sun, Home, Loader2 } from 'lucide-react';
import { getHistory } from '../lib/api';

interface HistoryPageProps {
  accessToken: string;
  onBack: () => void;
}

interface HistoryItem {
  activityType: string;
  activity: string;
  conditions: any;
  timestamp: string;
}

export function HistoryPage({ accessToken, onBack }: HistoryPageProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory(accessToken);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1>Activity History</h1>
            <p className="text-sm text-muted-foreground">Your past activities and conditions</p>
          </div>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No activity history yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Select activities to start building your history
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {item.activityType === 'outdoor' ? (
                        <div className="p-2 bg-green-100 rounded-full">
                          <Sun className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-2 bg-purple-100 rounded-full">
                          <Home className="h-5 w-5 text-purple-600" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{item.activity}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.timestamp)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {item.activityType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p>{item.conditions.weather.temperature}°C</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs text-muted-foreground">Rain Chance</p>
                      <p>{item.conditions.weather.rainChance || item.conditions.weather.precipitation}%</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs text-muted-foreground">Air Quality</p>
                      <p>AQI {item.conditions.airQuality.aqi}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-xs text-muted-foreground">Humidity</p>
                      <p>{item.conditions.weather.humidity}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
