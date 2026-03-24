import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Satellite, CheckCircle2, XCircle, Loader2, AlertCircle, Rocket, Cloud, Globe, Flame, Zap, Database, Map, Image } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0`;

interface NASAStatusPageProps {
  onBack: () => void;
}

interface APIStatus {
  name: string;
  status: 'checking' | 'working' | 'failed' | 'not-checked';
  description: string;
  type: 'public' | 'authenticated' | 'external';
  icon: React.ReactNode;
  features: string[];
}

export function NASAStatusPage({ onBack }: NASAStatusPageProps) {
  const [checking, setChecking] = useState(false);
  const [apis, setApis] = useState<APIStatus[]>([
    {
      name: 'NASA POWER',
      status: 'not-checked',
      description: 'Climate & weather data',
      type: 'public',
      icon: <Zap className="w-5 h-5 text-yellow-600" />,
      features: ['Temperature', 'Precipitation', 'Wind Speed', 'Humidity', 'Solar Energy']
    },
    {
      name: 'NASA FIRMS',
      status: 'not-checked',
      description: 'Wildfire detection',
      type: 'public',
      icon: <Flame className="w-5 h-5 text-orange-600" />,
      features: ['Active Fires', 'Fire History', 'Heat Anomalies', 'Satellite Detection']
    },
    {
      name: 'NASA EONET',
      status: 'not-checked',
      description: 'Natural disaster events',
      type: 'public',
      icon: <Globe className="w-5 h-5 text-blue-600" />,
      features: ['Storms', 'Floods', 'Earthquakes', 'Volcanoes', 'Severe Weather']
    },
    {
      name: 'Earthdata Search',
      status: 'not-checked',
      description: 'Dataset search & discovery',
      type: 'public',
      icon: <Database className="w-5 h-5 text-green-600" />,
      features: ['Weather Datasets', 'Climate Collections', 'Historical Data', 'Data Discovery']
    },
    {
      name: 'Giovanni',
      status: 'not-checked',
      description: 'Time-series analysis',
      type: 'public',
      icon: <Map className="w-5 h-5 text-indigo-600" />,
      features: ['Time Series', 'Maps', 'Probability Analysis', 'Climate Trends']
    },
    {
      name: 'Worldview',
      status: 'not-checked',
      description: 'Satellite imagery',
      type: 'public',
      icon: <Image className="w-5 h-5 text-teal-600" />,
      features: ['Real-time Imagery', 'True Color', 'Weather Layers', 'Cloud Cover']
    },
    {
      name: 'GES DISC',
      status: 'not-checked',
      description: 'Earth science datasets',
      type: 'authenticated',
      icon: <Satellite className="w-5 h-5 text-purple-600" />,
      features: ['Atmospheric Data', 'Climate Models', 'Precipitation', 'Air Quality']
    },
    {
      name: 'DataRods',
      status: 'not-checked',
      description: 'Hydrology data',
      type: 'authenticated',
      icon: <Satellite className="w-5 h-5 text-cyan-600" />,
      features: ['Precipitation', 'Soil Moisture', 'Water Resources', 'Drought Monitoring']
    },
    {
      name: 'NASA Open API',
      status: 'not-checked',
      description: 'Space exploration data',
      type: 'external',
      icon: <Rocket className="w-5 h-5 text-pink-600" />,
      features: ['APOD', 'Mars Rovers', 'Asteroids', 'Earth Imagery', 'Space Events']
    },
    {
      name: 'OpenWeather',
      status: 'not-checked',
      description: 'Real-time weather',
      type: 'external',
      icon: <Cloud className="w-5 h-5 text-sky-600" />,
      features: ['Current Weather', '5-Day Forecast', 'Hourly Data', 'Weather Alerts']
    },
  ]);

  const checkAllAPIs = async () => {
    setChecking(true);
    console.log('🧪 Checking all NASA APIs...');

    const apiChecks = [
      { index: 0, endpoint: '/test-nasa-power' },
      { index: 1, endpoint: '/test-nasa-firms' },
      { index: 2, endpoint: '/test-nasa-eonet' },
      { index: 3, endpoint: '/test-earthdata-search' },
      { index: 4, endpoint: '/test-giovanni' },
      { index: 5, endpoint: '/test-worldview' },
      { index: 6, endpoint: '/test-ges-disc' },
      { index: 7, endpoint: '/test-datarods' },
      { index: 8, endpoint: '/test-nasa-open-api' },
      { index: 9, endpoint: '/test-openweather' },
    ];

    for (const check of apiChecks) {
      // Mark as checking
      setApis(prev => prev.map((api, i) => 
        i === check.index ? { ...api, status: 'checking' as const } : api
      ));

      try {
        const response = await fetch(`${API_BASE}${check.endpoint}`);
        const data = await response.json();
        
        const newStatus = data.success ? 'working' : 'failed';
        
        setApis(prev => prev.map((api, i) => 
          i === check.index ? { ...api, status: newStatus as const } : api
        ));
        
        console.log(`${apis[check.index].name}: ${newStatus}`);
      } catch (error) {
        console.error(`${apis[check.index].name} check failed:`, error);
        setApis(prev => prev.map((api, i) => 
          i === check.index ? { ...api, status: 'failed' as const } : api
        ));
      }

      // Small delay between checks
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setChecking(false);
    console.log('✅ API check complete!');
  };

  useEffect(() => {
    // Auto-check on mount
    checkAllAPIs();
  }, []);

  const workingCount = apis.filter(a => a.status === 'working').length;
  const failedCount = apis.filter(a => a.status === 'failed').length;

  return (
    <div className="min-h-screen p-4 pb-20">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Header */}
      <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>NASA API Status</CardTitle>
                <CardDescription>Live status of all integrated APIs</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{workingCount}/10</div>
              <div className="text-xs text-gray-600">Working</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-green-700">{workingCount}</div>
            <div className="text-xs text-green-600">Working</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-red-700">{failedCount}</div>
            <div className="text-xs text-red-600">Failed</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-blue-700">6</div>
            <div className="text-xs text-blue-600">Public</div>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <Button
        onClick={checkAllAPIs}
        disabled={checking}
        className="w-full mb-6"
        size="lg"
      >
        {checking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking APIs...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" />
            Refresh Status
          </>
        )}
      </Button>

      {/* Public APIs Section */}
      <div className="mb-6">
        <h3 className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-green-600" />
          Public NASA APIs
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            No credentials needed
          </Badge>
        </h3>
        <div className="space-y-3">
          {apis.filter(a => a.type === 'public').map((api, index) => (
            <APICard key={index} api={api} />
          ))}
        </div>
      </div>

      {/* Authenticated APIs Section */}
      <div className="mb-6">
        <h3 className="flex items-center gap-2 mb-3">
          <Satellite className="w-5 h-5 text-purple-600" />
          Authenticated NASA APIs
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
            Bearer Token required
          </Badge>
        </h3>
        <div className="space-y-3">
          {apis.filter(a => a.type === 'authenticated').map((api, index) => (
            <APICard key={index} api={api} />
          ))}
        </div>
      </div>

      {/* External APIs Section */}
      <div className="mb-6">
        <h3 className="flex items-center gap-2 mb-3">
          <Rocket className="w-5 h-5 text-pink-600" />
          External APIs
          <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-300">
            API keys in backend
          </Badge>
        </h3>
        <div className="space-y-3">
          {apis.filter(a => a.type === 'external').map((api, index) => (
            <APICard key={index} api={api} />
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <CardTitle className="text-base">About These APIs</CardTitle>
              <CardDescription className="text-sm mt-2">
                <div className="space-y-2">
                  <p><strong className="text-blue-700">Public APIs</strong> work without any setup - they're free and open to use.</p>
                  <p><strong className="text-blue-700">Authenticated APIs</strong> require a NASA Earthdata Bearer Token configured in the backend.</p>
                  <p><strong className="text-blue-700">External APIs</strong> require API keys from NASA and OpenWeather, configured in the backend.</p>
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

function APICard({ api }: { api: APIStatus }) {
  const getStatusIcon = () => {
    switch (api.status) {
      case 'working':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'checking':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getCardStyle = () => {
    switch (api.status) {
      case 'working':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'checking':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className={`${getCardStyle()} transition-all`}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            {api.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{api.name}</h4>
              {api.status === 'working' && (
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  Working
                </Badge>
              )}
              {api.status === 'failed' && (
                <Badge variant="destructive">Failed</Badge>
              )}
              {api.status === 'checking' && (
                <Badge variant="secondary">Checking...</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{api.description}</p>
            <div className="flex flex-wrap gap-1">
              {api.features.slice(0, 3).map((feature, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {api.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{api.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            {getStatusIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
