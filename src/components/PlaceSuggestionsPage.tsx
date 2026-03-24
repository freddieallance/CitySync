import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Star, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Loader2,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getConditions, saveActivity, getPlaceFeedback, rateFeedback } from '../lib/api';
import { getPlacesForActivity, getAIPlaceSuggestions, evaluatePlaceSafety, PlaceSuggestion, PlaceSafety } from '../lib/places';
import { LocationPicker } from './LocationPicker';
import { FeedbackDialog } from './FeedbackDialog';
import { UserBadge } from './UserBadge';

// Static image mapping for places
const PLACE_IMAGES: Record<string, string> = {
  'Bako National Park': 'https://images.unsplash.com/photo-1752995414113-c24537719387?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXRpb25hbCUyMHBhcmslMjBqdW5nbGV8ZW58MXx8fHwxNzU5NTE0MjI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Kuching Waterfront': 'https://images.unsplash.com/photo-1602869619923-6b3f93c392fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwd2F0ZXJmcm9udCUyMHN1bnNldHxlbnwxfHx8fDE3NTk1MTQyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Damai Beach': 'https://images.unsplash.com/photo-1665231342828-229205867d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHBhcmFkaXNlfGVufDF8fHx8MTc1OTUxNDIzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Sarawak Stadium': 'https://images.unsplash.com/photo-1565483276060-e6730c0cc6a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtfGVufDF8fHx8MTc1OTUxMzY4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Kubah National Park': 'https://images.unsplash.com/photo-1723784037687-edb3a4959c22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZhbGwlMjBqdW5nbGV8ZW58MXx8fHwxNzU5NTE0MjMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Santubong Mountain Trail': 'https://images.unsplash.com/photo-1663524963924-4d84fd7204b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyYWlsfGVufDF8fHx8MTc1OTUxNDIzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Esplanade Kuching': 'https://images.unsplash.com/photo-1542800952-e5471ed41326?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHBhcmt8ZW58MXx8fHwxNzU5NTE0MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Lundu Beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5keSUyMGJlYWNofGVufDF8fHx8MTc1OTUxNDIzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Vivacity Megamall': 'https://images.unsplash.com/photo-1694064500485-405140238c9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGwlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk0NDg3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Sarawak Museum': 'https://images.unsplash.com/photo-1491156855053-9cdff72c7f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk0ODI1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Celebrity Fitness': 'https://images.unsplash.com/photo-1672344048213-76b6e77304bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3ZWlnaHRzfGVufDF8fHx8MTc1OTUxNDIzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'The Spring Shopping Mall': 'https://images.unsplash.com/photo-1626446294875-794f1c8392f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBtYWxsfGVufDF8fHx8MTc1OTUxNDIzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Sarawak Art Museum': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBtdXNldW18ZW58MXx8fHwxNzU5NTE0MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Borneo Fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltfGVufDF8fHx8MTc1OTQ1MDk5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'MBO Cinemas': 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzU5NTE0MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Badminton Court Arena': 'https://images.unsplash.com/photo-1624024834874-2a1611305604?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjBpbmRvb3J8ZW58MXx8fHwxNzU5NTE0MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Black Bean Coffee': 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wfGVufDF8fHx8MTc1OTQzODA4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'Top Spot Food Court': 'https://images.unsplash.com/photo-1529686398651-b8112f4bb98c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbWFya2V0fGVufDF8fHx8MTc1OTUxNDI0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
};

interface PlaceSuggestionsPageProps {
  activityType: 'outdoor' | 'indoor';
  selectedActivity: string;
  onBack: () => void;
  accessToken?: string;
  userLocation?: { latitude: number; longitude: number; name?: string } | null;
  onLocationChange: (location: { latitude: number; longitude: number; name: string }) => void;
}

export function PlaceSuggestionsPage({ 
  activityType, 
  selectedActivity, 
  onBack,
  accessToken,
  userLocation,
  onLocationChange
}: PlaceSuggestionsPageProps) {
  const [conditions, setConditions] = useState<any>(null);
  const [places, setPlaces] = useState<PlaceSuggestion[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null);
  const [placeSafety, setPlaceSafety] = useState<PlaceSafety | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [placeFeedback, setPlaceFeedback] = useState<any>(null);
  const [useAI, setUseAI] = useState(true);
  const [aiStatus, setAIStatus] = useState<'loading' | 'success' | 'fallback'>('loading');

  useEffect(() => {
    // userLocation should always be set (either GPS or default)
    loadPlacesAndConditions();
  }, [selectedActivity, userLocation]);

  const loadPlacesAndConditions = async () => {
    try {
      setLoading(true);
      setAIStatus('loading');
      
      // Load conditions
      const conditionsData = await getConditions(userLocation?.latitude, userLocation?.longitude);
      setConditions(conditionsData);
      
      // Try AI-powered place suggestions first
      if (useAI && userLocation) {
        console.log('🤖 Requesting AI place suggestions...');
        const aiPlaces = await getAIPlaceSuggestions(
          selectedActivity,
          activityType,
          userLocation,
          conditionsData?.weather,
          conditionsData?.nasa
        );
        
        if (aiPlaces && aiPlaces.length > 0) {
          console.log(`✅ AI found ${aiPlaces.length} real places`);
          setPlaces(aiPlaces);
          setAIStatus('success');
        } else {
          console.log('⚠️ AI returned no places, using fallback templates');
          const fallbackPlaces = getPlacesForActivity(selectedActivity, activityType, userLocation?.name);
          setPlaces(fallbackPlaces);
          setAIStatus('fallback');
        }
      } else {
        // Fallback to template-based places
        const placesData = getPlacesForActivity(selectedActivity, activityType, userLocation?.name);
        setPlaces(placesData);
        setAIStatus('fallback');
      }

    } catch (error) {
      console.error('Failed to load places and conditions:', error);
      // Use fallback on error
      try {
        const fallbackPlaces = getPlacesForActivity(selectedActivity, activityType, userLocation?.name);
        setPlaces(fallbackPlaces);
        setAIStatus('fallback');
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlace = async (place: PlaceSuggestion) => {
    setSelectedPlace(place);
    
    // Evaluate safety for this place
    const safety = evaluatePlaceSafety(place, conditions);
    setPlaceSafety(safety);

    // Load feedback for this place
    loadPlaceFeedback(place.name);

    // Save to history if user is logged in
    if (accessToken) {
      try {
        await saveActivity(
          accessToken, 
          activityType, 
          `${selectedActivity} at ${place.name}`, 
          conditions
        );
      } catch (error) {
        console.error('Failed to save activity:', error);
      }
    }
  };

  const loadPlaceFeedback = async (placeName: string) => {
    try {
      const feedback = await getPlaceFeedback(placeName);
      setPlaceFeedback(feedback);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      setPlaceFeedback(null);
    }
  };

  const handleFeedbackSubmitted = () => {
    // Reload feedback after submission
    if (selectedPlace) {
      loadPlaceFeedback(selectedPlace.name);
    }
  };

  const getSafetyBadgeColor = (level: string) => {
    switch (level) {
      case 'safe':
        return 'bg-green-600';
      case 'caution':
        return 'bg-yellow-600';
      case 'unsafe':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getSafetyIcon = (level: string) => {
    switch (level) {
      case 'safe':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'caution':
        return <AlertTriangle className="h-5 w-5" />;
      case 'unsafe':
        return <XCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getPlaceImageUrl = (place: PlaceSuggestion): string | undefined => {
    // Check if we have a pre-mapped image
    if (PLACE_IMAGES[place.name]) {
      return PLACE_IMAGES[place.name];
    }
    
    // For AI places without images, return undefined - we'll use a placeholder
    return undefined;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Finding places for you...</p>
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
            <div className="flex items-center gap-2">
              <h1>Suggested Places</h1>
              {aiStatus === 'success' && (
                <Badge variant="secondary" className="gap-1">
                  🤖 AI
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              For {selectedActivity} • {places.length} places found
              {aiStatus === 'success' && ' • Real locations powered by AI'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUseAI(!useAI);
                loadPlacesAndConditions();
              }}
              className="whitespace-nowrap"
            >
              {useAI ? '🤖 AI Mode' : '📋 Templates'}
            </Button>
            <LocationPicker 
              currentLocation={userLocation}
              onLocationChange={onLocationChange}
            />
          </div>
        </div>

        {/* AI Info Banner */}
        {aiStatus === 'success' && (
          <Alert className="mb-4 bg-purple-50 border-purple-200">
            <AlertDescription className="text-purple-900">
              🤖 <strong>AI-Powered Results:</strong> These are real places in {userLocation?.name || 'your area'} suggested by our AI based on your activity preferences and current conditions.
            </AlertDescription>
          </Alert>
        )}

        {/* Places Grid */}
        {!selectedPlace ? (
          <div className="grid gap-4 md:grid-cols-2">
            {places.map((place) => {
              const safety = evaluatePlaceSafety(place, conditions);
              
              return (
                <Card 
                  key={place.name}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleSelectPlace(place)}
                >
                  {/* Place Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                    {getPlaceImageUrl(place) ? (
                      <ImageWithFallback
                        src={getPlaceImageUrl(place)!}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="h-16 w-16 text-indigo-300" />
                      </div>
                    )}
                    <div className={`absolute top-3 right-3 ${getSafetyBadgeColor(safety.safetyLevel)} text-white px-3 py-1 rounded-full text-sm flex items-center gap-1.5`}>
                      {getSafetyIcon(safety.safetyLevel)}
                      <span className="capitalize">{safety.safetyLevel}</span>
                    </div>
                    {place.isAIGenerated && (
                      <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        🤖 AI
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span>{place.name}</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{place.rating}</span>
                      </div>
                    </CardTitle>
                    <CardDescription>{place.description}</CardDescription>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <MapPin className="h-3 w-3" />
                      <span>{place.location}</span>
                      <span>• {place.distance}</span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Button variant="outline" className="w-full group">
                      View Details & Safety Info
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Selected Place Detail View */
          <div className="space-y-6">
            {/* Place Header Card */}
            <Card className="overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
                {getPlaceImageUrl(selectedPlace) ? (
                  <ImageWithFallback
                    src={getPlaceImageUrl(selectedPlace)!}
                    alt={selectedPlace.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="h-24 w-24 text-indigo-300" />
                  </div>
                )}
                {selectedPlace.isAIGenerated && (
                  <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                    🤖 AI-Discovered Location
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{selectedPlace.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {selectedPlace.description}
                    </CardDescription>
                    {selectedPlace.suitability && (
                      <div className="mt-2 p-2 bg-purple-50 rounded text-sm text-purple-900">
                        💡 {selectedPlace.suitability}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedPlace.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span>{selectedPlace.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Navigation className="h-4 w-4" />
                      <span>{selectedPlace.distance}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Safety Assessment */}
            {placeSafety && (
              <>
                {/* Overall Safety Status */}
                <div className={`relative w-full rounded-lg border px-4 py-3 ${
                  placeSafety.canVisit ? 'bg-card text-card-foreground' : 'text-destructive bg-card border-destructive/50'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getSafetyBadgeColor(placeSafety.safetyLevel)} text-white flex-shrink-0 mt-0.5`}>
                      {getSafetyIcon(placeSafety.safetyLevel)}
                    </div>
                    <div className="flex-1">
                      <h5 className="mb-1">
                        {placeSafety.canVisit 
                          ? placeSafety.safetyLevel === 'safe' 
                            ? '✅ Safe to Visit'
                            : '⚠️ Caution Required'
                          : '⛔ Do Not Proceed'
                        }
                      </h5>
                      <p className={`text-sm ${placeSafety.canVisit ? 'text-muted-foreground' : 'text-destructive/90'}`}>
                        {placeSafety.canVisit
                          ? placeSafety.safetyLevel === 'safe'
                            ? 'Conditions are favorable for your visit'
                            : 'You can visit but precautions are necessary'
                          : 'Current conditions make it unsafe to visit this location'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warnings (if unsafe) */}
                {placeSafety.warnings.length > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-900 flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        Critical Warnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {placeSafety.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start gap-2 text-red-900">
                            <span className="text-lg leading-none mt-0.5">⛔</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {placeSafety.recommendations.length > 0 && (
                  <Card className={placeSafety.safetyLevel === 'caution' ? 'border-yellow-200 bg-yellow-50' : ''}>
                    <CardHeader>
                      <CardTitle className={placeSafety.safetyLevel === 'caution' ? 'text-yellow-900' : ''}>
                        {placeSafety.canVisit ? 'Safety Recommendations' : 'Alternative Suggestions'}
                      </CardTitle>
                      <CardDescription className={placeSafety.safetyLevel === 'caution' ? 'text-yellow-800' : ''}>
                        {placeSafety.canVisit 
                          ? 'Follow these recommendations for a safe visit'
                          : 'Consider these alternatives instead'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {placeSafety.recommendations.map((rec, index) => (
                          <li 
                            key={index} 
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              placeSafety.safetyLevel === 'caution' ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <span className="text-lg leading-none mt-0.5">
                              {rec.startsWith('✅') ? '✅' : 
                               rec.startsWith('⚠️') ? '⚠️' :
                               rec.startsWith('🌧️') ? '🌧️' :
                               rec.startsWith('☀️') ? '☀️' :
                               rec.startsWith('🌡️') ? '🌡️' :
                               rec.startsWith('💧') ? '💧' :
                               rec.startsWith('����') ? '😷' :
                               rec.startsWith('🌫️') ? '🌫️' :
                               rec.startsWith('💨') ? '💨' :
                               rec.startsWith('💦') ? '💦' :
                               rec.startsWith('☁️') ? '☁️' :
                               '•'}
                            </span>
                            <span className="flex-1">{rec.replace(/^[✅⚠️🌧️☀️🌡️💧😷🌫️💨💦☁️]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Current Conditions Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Conditions</CardTitle>
                    <CardDescription>Environmental data for this location</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Temperature</p>
                        <p>{conditions.weather.temperature}°C</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Rain Chance</p>
                        <p>{conditions.weather.rainChance}%</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Humidity</p>
                        <p>{conditions.weather.humidity}%</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">UV Index</p>
                        <p>{conditions.weather.uvIndex}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Air Quality</p>
                        <p>AQI {conditions.airQuality.aqi}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Wind</p>
                        <p>{conditions.weather.windSpeed} km/h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* User Feedback Section */}
            {placeFeedback && placeFeedback.totalReviews > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Community Feedback</CardTitle>
                  <CardDescription>
                    Based on {placeFeedback.totalReviews} review{placeFeedback.totalReviews !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Average Rating */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                          <span className="text-2xl">{placeFeedback.averageRating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Average</p>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="p-2 bg-green-50 rounded">
                          <p>{placeFeedback.safetyBreakdown.safe}</p>
                          <p className="text-xs text-muted-foreground">Safe</p>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded">
                          <p>{placeFeedback.safetyBreakdown.caution}</p>
                          <p className="text-xs text-muted-foreground">Caution</p>
                        </div>
                        <div className="p-2 bg-red-50 rounded">
                          <p>{placeFeedback.safetyBreakdown.unsafe}</p>
                          <p className="text-xs text-muted-foreground">Unsafe</p>
                        </div>
                      </div>
                    </div>

                    {/* Accuracy Percentage */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prediction Accuracy</span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {placeFeedback.accuracyPercentage}%
                      </span>
                    </div>

                    {/* Recent Reviews */}
                    {placeFeedback.recentFeedback.length > 0 && (
                      <div className="border-t pt-4">
                        <p className="text-sm mb-3">Recent Reviews:</p>
                        <div className="space-y-4">
                          {placeFeedback.recentFeedback.slice(0, 5).map((feedback: any) => (
                            <div key={feedback.feedbackId} className="bg-gray-50 p-3 rounded-lg space-y-2">
                              {/* User Info */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={feedback.userAvatar} alt={feedback.userName} />
                                    <AvatarFallback className="text-xs">
                                      {feedback.userName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{feedback.userName}</span>
                                    {feedback.userBadge && feedback.userBadge !== 'none' && (
                                      <UserBadge badge={feedback.userBadge} showLabel={false} />
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{feedback.rating}/5</span>
                                </div>
                              </div>

                              {/* Photo */}
                              {feedback.photoUrl && (
                                <img 
                                  src={feedback.photoUrl} 
                                  alt="User photo" 
                                  className="w-full h-32 object-cover rounded"
                                />
                              )}

                              {/* Safety Badge */}
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline"
                                  className={
                                    feedback.actualSafety === 'safe' 
                                      ? 'bg-green-100 text-green-700 border-green-300'
                                      : feedback.actualSafety === 'caution'
                                      ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                      : 'bg-red-100 text-red-700 border-red-300'
                                  }
                                >
                                  {feedback.actualSafety === 'safe' && 'Safe'}
                                  {feedback.actualSafety === 'caution' && 'Caution'}
                                  {feedback.actualSafety === 'unsafe' && 'Unsafe'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(feedback.timestamp).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Comments */}
                              {feedback.comments && (
                                <p className="text-sm text-muted-foreground">{feedback.comments}</p>
                              )}

                              {/* Rating Buttons */}
                              {accessToken && (
                                <div className="flex items-center gap-2 pt-2 border-t">
                                  <span className="text-xs text-muted-foreground">Was this helpful?</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 gap-1"
                                    onClick={async () => {
                                      try {
                                        await rateFeedback(accessToken, feedback.feedbackId, placeName, true);
                                        loadPlaceFeedback(placeName);
                                      } catch (error: any) {
                                        console.error('Rating error:', error);
                                      }
                                    }}
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    <span className="text-xs">{feedback.helpfulCount || 0}</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 gap-1"
                                    onClick={async () => {
                                      try {
                                        await rateFeedback(accessToken, feedback.feedbackId, placeName, false);
                                        loadPlaceFeedback(placeName);
                                      } catch (error: any) {
                                        console.error('Rating error:', error);
                                      }
                                    }}
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                    <span className="text-xs">{feedback.notHelpfulCount || 0}</span>
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="grid gap-3">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedPlace(null);
                    setPlaceSafety(null);
                    setPlaceFeedback(null);
                  }}
                >
                  View Other Places
                </Button>
                {placeSafety?.canVisit && (
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      // Open Google Maps with directions to the place
                      const destination = encodeURIComponent(selectedPlace.name + ', ' + selectedPlace.location);
                      const origin = userLocation 
                        ? `${userLocation.latitude},${userLocation.longitude}`
                        : '';
                      
                      // Construct Google Maps URL for directions
                      const mapsUrl = origin 
                        ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
                        : `https://www.google.com/maps/search/?api=1&query=${destination}`;
                      
                      // Open in new tab
                      window.open(mapsUrl, '_blank');
                    }}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                )}
              </div>
              
              {/* Feedback Button */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  if (!accessToken) {
                    alert('Please login to share feedback');
                    return;
                  }
                  setFeedbackDialogOpen(true);
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {accessToken ? 'Share Your Experience' : 'Login to Share Feedback'}
              </Button>
            </div>
          </div>
        )}

        {places.length === 0 && !loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No places found for this activity</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Feedback Dialog */}
      {selectedPlace && (
        <FeedbackDialog
          open={feedbackDialogOpen}
          onOpenChange={setFeedbackDialogOpen}
          placeName={selectedPlace.name}
          placeLocation={selectedPlace.location}
          accessToken={accessToken}
          onFeedbackSubmitted={handleFeedbackSubmitted}
        />
      )}
    </div>
  );
}
