import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { ArrowLeft, Bot, Sparkles, MessageCircle, Bell, Camera, TrendingUp, Info } from 'lucide-react';
import { Separator } from './ui/separator';

interface AISettingsPageProps {
  onBack: () => void;
}

export function AISettingsPage({ onBack }: AISettingsPageProps) {
  const [settings, setSettings] = useState({
    chatEnabled: true,
    insightsEnabled: true,
    smartRecommendations: true,
    photoAnalysis: true,
    personalizedAlerts: false,
    saveHistory: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen p-4">
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1>AI Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure your AI assistant preferences
            </p>
          </div>
        </div>

        {/* AI Status */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3>Gemini AI</h3>
                <p className="text-sm text-white/80">Powered by Google</p>
              </div>
            </div>
            <Badge className="bg-green-500 text-white border-0">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              Active
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-white/70 mb-1">Conversations</p>
              <p className="text-2xl">247</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-white/70 mb-1">Insights Generated</p>
              <p className="text-2xl">89</p>
            </div>
          </div>
        </Card>

        {/* AI Features */}
        <Card className="p-6 mb-4">
          <h3 className="mb-4">AI Features</h3>
          
          {/* Chat Assistant */}
          <div className="flex items-start justify-between py-4">
            <div className="flex items-start gap-3 flex-1">
              <MessageCircle className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="text-sm mb-1">SafetyBot Chat Assistant</h4>
                <p className="text-sm text-muted-foreground">
                  Conversational AI helper for safety questions and recommendations
                </p>
              </div>
            </div>
            <Switch
              checked={settings.chatEnabled}
              onCheckedChange={() => toggleSetting('chatEnabled')}
            />
          </div>

          <Separator />

          {/* Safety Insights */}
          <div className="flex items-start justify-between py-4">
            <div className="flex items-start gap-3 flex-1">
              <TrendingUp className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="text-sm mb-1">AI Safety Insights</h4>
                <p className="text-sm text-muted-foreground">
                  Multi-source environmental analysis with predictions
                </p>
              </div>
            </div>
            <Switch
              checked={settings.insightsEnabled}
              onCheckedChange={() => toggleSetting('insightsEnabled')}
            />
          </div>

          <Separator />

          {/* Smart Recommendations */}
          <div className="flex items-start justify-between py-4">
            <div className="flex items-start gap-3 flex-1">
              <Sparkles className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="text-sm mb-1">Smart Activity Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  AI-generated personalized activity suggestions
                </p>
              </div>
            </div>
            <Switch
              checked={settings.smartRecommendations}
              onCheckedChange={() => toggleSetting('smartRecommendations')}
            />
          </div>

          <Separator />

          {/* Photo Analysis */}
          <div className="flex items-start justify-between py-4">
            <div className="flex items-start gap-3 flex-1">
              <Camera className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="text-sm mb-1">Photo Verification</h4>
                <p className="text-sm text-muted-foreground">
                  AI analyzes photos to verify safety conditions
                </p>
              </div>
            </div>
            <Switch
              checked={settings.photoAnalysis}
              onCheckedChange={() => toggleSetting('photoAnalysis')}
            />
          </div>

          <Separator />

          {/* Personalized Alerts */}
          <div className="flex items-start justify-between py-4">
            <div className="flex items-start gap-3 flex-1">
              <Bell className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="text-sm mb-1">Personalized Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Get custom safety notifications based on your preferences
                </p>
                <Badge variant="outline" className="mt-1 text-xs">
                  Coming Soon
                </Badge>
              </div>
            </div>
            <Switch
              checked={settings.personalizedAlerts}
              onCheckedChange={() => toggleSetting('personalizedAlerts')}
              disabled
            />
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card className="p-6 mb-4">
          <h3 className="mb-4">Privacy & Data</h3>
          
          <div className="flex items-start justify-between py-4">
            <div className="flex items-start gap-3 flex-1">
              <Info className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="text-sm mb-1">Save Chat History</h4>
                <p className="text-sm text-muted-foreground">
                  Store conversations for future reference (logged-in users only)
                </p>
              </div>
            </div>
            <Switch
              checked={settings.saveHistory}
              onCheckedChange={() => toggleSetting('saveHistory')}
            />
          </div>
        </Card>

        {/* Information */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h4 className="text-sm mb-3 text-blue-900">ℹ️ About AI Features</h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>All AI features are powered by Google Gemini 2.0 Flash (Experimental)</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Your data is processed securely and not shared with third parties</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>AI recommendations are suggestions, not guarantees of safety</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Always use personal judgment when making safety decisions</span>
            </li>
          </ul>
          
          <Button variant="outline" className="w-full mt-4 text-blue-700 border-blue-300">
            Learn More About AI Features
          </Button>
        </Card>

        {/* Model Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Model: <strong>Gemini 2.0 Flash</strong> <span className="text-blue-600">(Experimental)</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Version: 2.0.0 • Last Updated: January 2025
          </p>
        </div>
      </div>
    </div>
  );
}
