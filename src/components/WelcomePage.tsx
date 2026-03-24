import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar, Sun, Home, Map, History, User, LogOut, MapPin, LogIn, CloudRain } from 'lucide-react';

interface WelcomePageProps {
  userName?: string;
  userAvatarUrl?: string;
  onSelectActivityType: (type: 'outdoor' | 'indoor') => void;
  onViewHistory: () => void;
  onLogout: () => void;
  onViewWildfires?: () => void;
  userLocation?: { latitude: number; longitude: number; name?: string } | null;
  onLogin?: () => void;
  onViewProfile?: () => void;
  onViewNASACredentials?: () => void;
  onViewNASAStatus?: () => void;
  onViewEventPlanner?: () => void;
  onViewWeatherMap?: () => void;
}

export function WelcomePage({ userName, userAvatarUrl, onSelectActivityType, onViewHistory, onLogout, userLocation, onLogin, onViewProfile, onViewEventPlanner, onViewWeatherMap, onViewNASAStatus }: WelcomePageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Compact Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-10">
        <div className="px-4 py-2.5">
          <div className="flex justify-between items-center">
            {/* Logo and Location */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
                <CloudRain className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-blue-900 leading-tight text-base">CitySync</h1>
                {userLocation && (
                  <p className="text-xs text-blue-600 flex items-center gap-1 leading-none mt-0.5 truncate">
                    <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                    <span className="truncate">{userLocation.name || 'Current Location'}</span>
                  </p>
                )}
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-1.5">
              {userName ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-600 hover:bg-blue-50 rounded-lg h-8 w-8" 
                    onClick={onViewHistory}
                    title="History"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  {userAvatarUrl ? (
                    <Avatar 
                      className="w-8 h-8 border-2 border-blue-200 cursor-pointer hover:border-blue-400 transition-colors" 
                      onClick={onViewProfile}
                    >
                      <AvatarImage src={userAvatarUrl} alt={userName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-blue-600 hover:bg-blue-50 rounded-lg h-8 w-8" 
                      onClick={onViewProfile}
                      title="Profile"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-600 hover:bg-blue-50 rounded-lg h-8 w-8" 
                    onClick={onLogout}
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={onLogin || onViewHistory} 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-sm rounded-lg h-8 px-3 text-xs"
                >
                  <LogIn className="mr-1.5 h-3.5 w-3.5" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="flex-1 flex flex-col px-4 py-5 max-w-md mx-auto w-full">
        
        {/* Compact Hero */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-3 shadow-lg">
            <CloudRain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-blue-900 mb-1.5 text-lg">
            Weather-Smart Decisions
          </h2>
          <p className="text-blue-700 text-xs leading-relaxed">
            Plan with NASA data & AI insights
          </p>
        </div>

        {/* Weather Dashboard - Compact */}
        {onViewWeatherMap && (
          <Card 
            className="group cursor-pointer hover:shadow-xl active:scale-[0.98] transition-all duration-200 border-0 bg-white/70 backdrop-blur-sm overflow-hidden mb-3" 
            onClick={onViewWeatherMap}
          >
            <CardContent className="py-4 px-5">
              <div className="flex items-center gap-3.5">
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Map className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                </div>
                
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-blue-900 mb-0.5 text-sm">Weather Dashboard</h3>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    Analysis, trends & data export
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan Events - Full Width */}
        {onViewEventPlanner && (
          <Card 
            className="group cursor-pointer hover:shadow-xl active:scale-[0.98] transition-all duration-200 border-0 bg-white/90 backdrop-blur-sm overflow-hidden mb-3" 
            onClick={onViewEventPlanner}
          >
            <CardContent className="py-5 px-5">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Calendar className="h-7 w-7 text-white" strokeWidth={2} />
                  </div>
                </div>
                
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-blue-900 mb-1 text-base">Plan Future Events</h3>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    Check weather probability using 10+ years of data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activities - Outdoor & Indoor Split */}
        <Card 
          className="border-0 bg-white/90 backdrop-blur-sm overflow-hidden mb-3"
        >
          <CardContent className="py-5 px-5">
            <div className="space-y-3.5">
              {/* Heading */}
              <div className="text-center">
                <h3 className="text-blue-900 mb-1 text-base">Find Activities Today</h3>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Get recommendations based on current weather
                </p>
              </div>

              {/* Split Buttons */}
              <div className="flex gap-2.5">
                {/* Outdoor Button */}
                <button
                  onClick={() => onSelectActivityType('outdoor')}
                  className="group flex-1 relative overflow-hidden rounded-xl transition-all duration-200 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 py-4 px-3 rounded-xl shadow-lg">
                    <Sun className="h-8 w-8 text-white mx-auto mb-2" strokeWidth={2} />
                    <p className="text-white text-sm font-medium">Outdoor</p>
                  </div>
                </button>

                {/* Indoor Button */}
                <button
                  onClick={() => onSelectActivityType('indoor')}
                  className="group flex-1 relative overflow-hidden rounded-xl transition-all duration-200 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 py-4 px-3 rounded-xl shadow-lg">
                    <Home className="h-8 w-8 text-white mx-auto mb-2" strokeWidth={2} />
                    <p className="text-white text-sm font-medium">Indoor</p>
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spacer */}
        <div className="flex-1 min-h-4"></div>

        {/* Footer Info */}
        <div className="text-center pb-2 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-blue-100">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-blue-700">
              Powered by NASA & AI
            </p>
          </div>
          
          {/* NASA API Status Button */}
          {onViewNASAStatus && (
            <button
              onClick={onViewNASAStatus}
              className="text-xs text-blue-600 hover:text-blue-800 underline opacity-60 hover:opacity-100 transition-opacity"
            >
              🛰️ View NASA API Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
