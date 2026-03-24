import { useState, useEffect } from "react";
import { WelcomePage } from "./components/WelcomePage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { RecommendationsPage } from "./components/RecommendationsPage";
import { PlaceSuggestionsPage } from "./components/PlaceSuggestionsPage";
import { ConditionsMapPage } from "./components/ConditionsMapPage";
import { HistoryPage } from "./components/HistoryPage";
import { UserProfilePage } from "./components/UserProfilePage";
import { NASACredentialsPage } from "./components/NASACredentialsPage";
import { NASAStatusPage } from "./components/NASAStatusPage";
import { EventPlannerPage } from "./components/EventPlannerPage";
import { WeatherDashboardPage } from "./components/WeatherDashboardPage";

type View = 'welcome' | 'login' | 'register' | 'recommendations' | 'places' | 'conditions' | 'history' | 'profile' | 'nasa-credentials' | 'nasa-status' | 'event-planner' | 'weather-map';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [activityType, setActivityType] = useState<'outdoor' | 'indoor'>('outdoor');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  // Default location: Kuching, Sarawak, Malaysia
  const DEFAULT_LOCATION = { 
    latitude: 1.5535, 
    longitude: 110.3593, 
    name: 'Kuching, Sarawak (Default)' 
  };

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; name?: string } | null>(DEFAULT_LOCATION);

  // Set document title
  useEffect(() => {
    document.title = 'CitySync - Smart Weather & Activity Planning';
  }, []);

  // Try to get user's location on app load (with graceful fallback)
  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.log('Geolocation not available, using default location');
      return;
    }

    // Check permissions if available
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        if (result.state === 'denied') {
          console.log('Geolocation permission denied, using default location');
          return;
        }
        
        if (result.state === 'granted' || result.state === 'prompt') {
          attemptGeolocation();
        }
      }).catch((err) => {
        // Permissions API not supported or error - try anyway
        console.log('Permissions API not supported, attempting geolocation anyway');
        attemptGeolocation();
      });
    } else {
      // No permissions API - try anyway
      attemptGeolocation();
    }

    function attemptGeolocation() {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('✓ GPS location obtained:', { latitude, longitude });
          
          // Try to get location name using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            const data = await response.json();
            const locationName = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Current Location';
            const country = data.address?.country || '';
            const fullName = country ? `${locationName}, ${country}` : locationName;
            
            setUserLocation({ latitude, longitude, name: fullName });
            console.log('✓ Location identified:', fullName);
          } catch (error) {
            console.log('Could not identify location name, using coordinates');
            setUserLocation({ latitude, longitude, name: 'Current Location' });
          }
        },
        (error) => {
          // Handle geolocation errors gracefully
          const errorMessages: { [key: number]: string } = {
            1: 'Permission denied - using default location',
            2: 'Position unavailable - using default location', 
            3: 'Timeout - using default location'
          };
          
          const message = error.code ? errorMessages[error.code] || 'Geolocation failed - using default location' : 'Geolocation unavailable - using default location';
          console.log(message);
          // Default location already set, no need to set again
        },
        { 
          enableHighAccuracy: false, 
          timeout: 5000, 
          maximumAge: 600000 
        }
      );
    }
  }, []);

  const handleLoginSuccess = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    setCurrentView('welcome');
  };

  const handleRegisterSuccess = () => {
    setCurrentView('login');
  };

  const handleSelectActivityType = (type: 'outdoor' | 'indoor') => {
    setActivityType(type);
    setCurrentView('recommendations');
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken('');
    setCurrentView('welcome');
  };

  const handleLocationChange = (newLocation: { latitude: number; longitude: number; name: string }) => {
    console.log('📍 Location changed to:', newLocation);
    setUserLocation(newLocation);
  };

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <WelcomePage
            userName={user?.user_metadata?.name}
            userAvatarUrl={user?.user_metadata?.avatarUrl}
            onSelectActivityType={handleSelectActivityType}
            onViewHistory={() => {
              if (user) {
                setCurrentView('history');
              } else {
                setCurrentView('login');
              }
            }}
            onLogout={handleLogout}
            userLocation={userLocation}
            onLogin={() => setCurrentView('login')}
            onViewProfile={() => {
              if (user) {
                setCurrentView('profile');
              } else {
                setCurrentView('login');
              }
            }}
            onViewNASACredentials={() => {
              if (user) {
                setCurrentView('nasa-credentials');
              } else {
                setCurrentView('login');
              }
            }}
            onViewNASAStatus={() => setCurrentView('nasa-status')}
            onViewEventPlanner={() => setCurrentView('event-planner')}
            onViewWeatherMap={() => setCurrentView('weather-map')}
          />
        );
      case 'login':
        return (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setCurrentView('register')}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      case 'recommendations':
        return (
          <RecommendationsPage
            activityType={activityType}
            onBack={() => setCurrentView('welcome')}
            onViewConditions={() => setCurrentView('conditions')}
            onSelectActivity={(activity) => {
              setSelectedActivity(activity);
              setCurrentView('places');
            }}
            accessToken={accessToken}
            userLocation={userLocation}
            onLocationChange={handleLocationChange}
          />
        );
      case 'places':
        return (
          <PlaceSuggestionsPage
            activityType={activityType}
            selectedActivity={selectedActivity}
            onBack={() => setCurrentView('recommendations')}
            accessToken={accessToken}
            userLocation={userLocation}
            onLocationChange={handleLocationChange}
          />
        );
      case 'conditions':
        return (
          <ConditionsMapPage
            onBack={() => setCurrentView('recommendations')}
            userLocation={userLocation}
            onLocationChange={handleLocationChange}
          />
        );
      case 'history':
        return (
          <HistoryPage
            accessToken={accessToken}
            onBack={() => setCurrentView('welcome')}
          />
        );
      case 'profile':
        return user ? (
          <UserProfilePage
            userId={user.id}
            userName={user.user_metadata?.name || 'User'}
            userAvatarUrl={user.user_metadata?.avatarUrl}
            accessToken={accessToken}
            onBack={() => setCurrentView('welcome')}
            onAvatarUpdated={(newAvatarUrl) => {
              // Update user object with new avatar
              setUser({
                ...user,
                user_metadata: {
                  ...user.user_metadata,
                  avatarUrl: newAvatarUrl
                }
              });
            }}
          />
        ) : (
          <WelcomePage
            userName={user?.user_metadata?.name}
            onSelectActivityType={handleSelectActivityType}
            onViewHistory={() => setCurrentView('history')}
            onLogout={handleLogout}
          />
        );
      case 'nasa-credentials':
        return user ? (
          <NASACredentialsPage
            accessToken={accessToken}
            onBack={() => setCurrentView('welcome')}
          />
        ) : (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setCurrentView('register')}
          />
        );
      case 'nasa-status':
        return (
          <NASAStatusPage
            onBack={() => setCurrentView('welcome')}
          />
        );
      case 'event-planner':
        return (
          <EventPlannerPage
            accessToken={accessToken}
            userLocation={userLocation}
            onLocationChange={handleLocationChange}
            onBack={() => setCurrentView('welcome')}
          />
        );
      case 'weather-map':
        return (
          <WeatherDashboardPage
            onBack={() => setCurrentView('welcome')}
            userLocation={userLocation}
            onLocationChange={handleLocationChange}
            accessToken={accessToken}
          />
        );
      default:
        return (
          <WelcomePage
            userName={user?.user_metadata?.name}
            onSelectActivityType={handleSelectActivityType}
            onViewHistory={() => setCurrentView('history')}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        {renderView()}
      </div>
    </div>
  );
}
