import { Badge } from './ui/badge';
import { Shield, Award, Star, Trophy, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface UserBadgeProps {
  badge: 'none' | 'contributor' | 'trusted' | 'expert' | 'legendary';
  className?: string;
  showLabel?: boolean;
}

const BADGE_CONFIG = {
  none: {
    icon: User,
    label: 'New User',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    description: 'Start contributing feedback to earn badges!',
    iconColor: 'text-gray-500'
  },
  contributor: {
    icon: Star,
    label: 'Contributor',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: '5+ reviews with 60%+ accuracy',
    iconColor: 'text-blue-600'
  },
  trusted: {
    icon: Shield,
    label: 'Trusted Reviewer',
    color: 'bg-green-100 text-green-700 border-green-300',
    description: '10+ reviews with 75%+ accuracy',
    iconColor: 'text-green-600'
  },
  expert: {
    icon: Award,
    label: 'Expert',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    description: '25+ reviews with 85%+ accuracy',
    iconColor: 'text-purple-600'
  },
  legendary: {
    icon: Trophy,
    label: 'Legendary Reviewer',
    color: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-yellow-400',
    description: '50+ reviews with 90%+ accuracy',
    iconColor: 'text-yellow-600'
  }
};

export function UserBadge({ badge, className = '', showLabel = true }: UserBadgeProps) {
  const config = BADGE_CONFIG[badge];
  const Icon = config.icon;

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex">
              <Icon className={`h-4 w-4 ${config.iconColor}`} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{config.label}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`${config.color} ${className} flex items-center gap-1 cursor-help`}
          >
            <Icon className="h-3 w-3" />
            <span className="text-xs">{config.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
