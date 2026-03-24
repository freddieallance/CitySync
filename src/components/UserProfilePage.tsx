import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowLeft, User, Star, ThumbsUp, TrendingUp, Award, Loader2, Camera } from 'lucide-react';
import { getUserReputation } from '../lib/api';
import { UserBadge } from './UserBadge';
import { AvatarSelector } from './AvatarSelector';

interface UserProfilePageProps {
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  accessToken: string;
  onBack: () => void;
  onAvatarUpdated?: (newAvatarUrl: string) => void;
}

export function UserProfilePage({ userId, userName, userAvatarUrl, accessToken, onBack, onAvatarUpdated }: UserProfilePageProps) {
  const [reputation, setReputation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarSelectorOpen, setAvatarSelectorOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(userAvatarUrl);

  useEffect(() => {
    loadReputation();
  }, [userId]);

  useEffect(() => {
    setCurrentAvatar(userAvatarUrl);
  }, [userAvatarUrl]);

  const loadReputation = async () => {
    try {
      setLoading(true);
      const data = await getUserReputation(userId);
      setReputation(data);
    } catch (error) {
      console.error('Failed to load reputation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setCurrentAvatar(newAvatarUrl);
    if (onAvatarUpdated) {
      onAvatarUpdated(newAvatarUrl);
    }
  };

  const getNextBadgeInfo = () => {
    if (!reputation) return null;

    const { totalFeedback, accuracyScore, badge } = reputation;

    if (badge === 'legendary') {
      return { name: 'Legendary', progress: 100, message: 'You\'ve reached the highest rank!' };
    }

    if (badge === 'expert') {
      return {
        name: 'Legendary Reviewer',
        progress: Math.min(100, (totalFeedback / 50) * 100),
        message: `${50 - totalFeedback} more reviews with 90%+ accuracy needed`
      };
    }

    if (badge === 'trusted') {
      return {
        name: 'Expert',
        progress: Math.min(100, (totalFeedback / 25) * 100),
        message: `${25 - totalFeedback} more reviews with 85%+ accuracy needed`
      };
    }

    if (badge === 'contributor') {
      return {
        name: 'Trusted Reviewer',
        progress: Math.min(100, (totalFeedback / 10) * 100),
        message: `${10 - totalFeedback} more reviews with 75%+ accuracy needed`
      };
    }

    return {
      name: 'Contributor',
      progress: Math.min(100, (totalFeedback / 5) * 100),
      message: `${5 - totalFeedback} more reviews with 60%+ accuracy needed`
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const nextBadge = getNextBadgeInfo();

  return (
    <div className="min-h-screen p-4">
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1>User Profile</h1>
            <p className="text-sm text-muted-foreground">{userName}</p>
          </div>
        </div>

        {/* Current Badge */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={currentAvatar} alt={userName} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => setAvatarSelectorOpen(true)}
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>
            <CardTitle>{userName}</CardTitle>
            <CardDescription className="flex justify-center mt-2">
              <UserBadge badge={reputation?.badge || 'none'} />
            </CardDescription>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setAvatarSelectorOpen(true)}
            >
              <Camera className="mr-2 h-4 w-4" />
              Change Avatar
            </Button>
          </CardHeader>
        </Card>

        {/* Avatar Selector Dialog */}
        <AvatarSelector
          open={avatarSelectorOpen}
          onOpenChange={setAvatarSelectorOpen}
          currentAvatarUrl={currentAvatar}
          accessToken={accessToken}
          onAvatarUpdated={handleAvatarUpdate}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl">{reputation?.totalFeedback || 0}</p>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl">{reputation?.helpfulVotes || 0}</p>
              <p className="text-xs text-muted-foreground">Helpful</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-purple-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl">{reputation?.accuracyScore || 0}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Award className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl">{reputation?.badge !== 'none' ? '1' : '0'}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </CardContent>
          </Card>
        </div>

        {/* Next Badge Progress */}
        {nextBadge && reputation?.badge !== 'legendary' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Badge: {nextBadge.name}</CardTitle>
              <CardDescription>{nextBadge.message}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={nextBadge.progress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {Math.round(nextBadge.progress)}% complete
              </p>
            </CardContent>
          </Card>
        )}

        {/* Badge Guide */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Badge System</CardTitle>
            <CardDescription>Earn badges by providing accurate and helpful feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <UserBadge badge="contributor" showLabel={true} />
              <span className="text-xs text-muted-foreground">5+ reviews, 60%+ accuracy</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <UserBadge badge="trusted" showLabel={true} />
              <span className="text-xs text-muted-foreground">10+ reviews, 75%+ accuracy</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <UserBadge badge="expert" showLabel={true} />
              <span className="text-xs text-muted-foreground">25+ reviews, 85%+ accuracy</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <UserBadge badge="legendary" showLabel={true} />
              <span className="text-xs text-muted-foreground">50+ reviews, 90%+ accuracy</span>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-blue-600">💡</div>
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-2">How to increase your accuracy score:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Provide honest and detailed feedback</li>
                  <li>• Add photos of current conditions</li>
                  <li>• Report safety issues accurately</li>
                  <li>• Other users vote on your feedback's helpfulness</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
