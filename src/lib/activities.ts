export interface ActivitySuggestion {
  name: string;
  description: string;
  icon: string;
  suitability: 'excellent' | 'good' | 'fair' | 'poor';
  reason: string;
}

export function getOutdoorActivities(conditions: any): ActivitySuggestion[] {
  const { weather, airQuality, flood, haze } = conditions;
  const activities: ActivitySuggestion[] = [];

  // Hiking
  let hikingSuitability: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
  let hikingReason = 'Perfect weather conditions';
  
  const rainChance = weather.rainChance || weather.precipitation;
  
  if (rainChance > 60) {
    hikingSuitability = 'poor';
    hikingReason = 'High chance of rain';
  } else if (airQuality.aqi > 100) {
    hikingSuitability = 'poor';
    hikingReason = 'Poor air quality';
  } else if (weather.temperature > 35) {
    hikingSuitability = 'fair';
    hikingReason = 'Very hot weather';
  } else if (rainChance > 30) {
    hikingSuitability = 'fair';
    hikingReason = 'Some chance of rain';
  }

  activities.push({
    name: 'Hiking',
    description: 'Explore nature trails and mountains',
    icon: '🥾',
    suitability: hikingSuitability,
    reason: hikingReason
  });

  // Beach/Water Activities
  let beachSuitability: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
  let beachReason = 'Great beach weather';
  
  if (rainChance > 50) {
    beachSuitability = 'poor';
    beachReason = 'Rain expected';
  } else if (weather.uvIndex > 9) {
    beachSuitability = 'fair';
    beachReason = 'Very high UV index - use sunscreen';
  } else if (weather.windSpeed > 25) {
    beachSuitability = 'fair';
    beachReason = 'Windy conditions';
  }

  activities.push({
    name: 'Beach Activities',
    description: 'Swimming, surfing, or beach sports',
    icon: '🏖️',
    suitability: beachSuitability,
    reason: beachReason
  });

  // Cycling
  let cyclingSuitability: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
  let cyclingReason = 'Ideal cycling conditions';
  
  if (rainChance > 50) {
    cyclingSuitability = 'poor';
    cyclingReason = 'Rain likely - wet roads unsafe';
  } else if (airQuality.aqi > 100) {
    cyclingSuitability = 'poor';
    cyclingReason = 'Poor air quality';
  } else if (weather.temperature > 33) {
    cyclingSuitability = 'fair';
    cyclingReason = 'Hot weather - stay hydrated';
  }

  activities.push({
    name: 'Cycling',
    description: 'Bike rides around the city or trails',
    icon: '🚴',
    suitability: cyclingSuitability,
    reason: cyclingReason
  });

  // Outdoor Sports
  let sportsSuitability: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
  let sportsReason = 'Good weather for sports';
  
  if (rainChance > 40) {
    sportsSuitability = 'poor';
    sportsReason = 'Rain will affect play';
  } else if (weather.temperature > 34) {
    sportsSuitability = 'fair';
    sportsReason = 'Very hot - take breaks';
  }

  activities.push({
    name: 'Outdoor Sports',
    description: 'Football, basketball, tennis',
    icon: '⚽',
    suitability: sportsSuitability,
    reason: sportsReason
  });

  // Jogging/Running
  let joggingSuitability: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
  let joggingReason = 'Perfect for a run';
  
  if (airQuality.aqi > 100) {
    joggingSuitability = 'poor';
    joggingReason = 'Poor air quality';
  } else if (rainChance > 50) {
    joggingSuitability = 'poor';
    joggingReason = 'Rain expected';
  } else if (weather.temperature > 32 || weather.humidity > 85) {
    joggingSuitability = 'fair';
    joggingReason = 'Hot and humid';
  }

  activities.push({
    name: 'Jogging/Running',
    description: 'Morning or evening runs',
    icon: '🏃',
    suitability: joggingSuitability,
    reason: joggingReason
  });

  return activities;
}

export function getIndoorActivities(conditions: any): ActivitySuggestion[] {
  const { weather, airQuality } = conditions;
  const activities: ActivitySuggestion[] = [];

  const rainChance = weather.rainChance || weather.precipitation;

  // Shopping Mall
  activities.push({
    name: 'Shopping Mall',
    description: 'Visit malls and shopping centers',
    icon: '🛍️',
    suitability: rainChance > 50 || airQuality.aqi > 100 ? 'excellent' : 'good',
    reason: rainChance > 50 ? 'Perfect indoor activity during rain' : 'Good indoor option'
  });

  // Museum/Gallery
  activities.push({
    name: 'Museum/Gallery',
    description: 'Explore cultural and art exhibitions',
    icon: '🎨',
    suitability: 'excellent',
    reason: 'Always a good time for culture'
  });

  // Gym/Fitness
  activities.push({
    name: 'Gym/Fitness',
    description: 'Indoor workout and fitness classes',
    icon: '💪',
    suitability: rainChance > 40 || airQuality.aqi > 100 ? 'excellent' : 'good',
    reason: rainChance > 40 ? 'Great alternative to outdoor exercise' : 'Stay active indoors'
  });

  // Cinema
  activities.push({
    name: 'Cinema',
    description: 'Watch latest movies',
    icon: '🎬',
    suitability: 'excellent',
    reason: 'Enjoy entertainment indoors'
  });

  // Cafe/Restaurant
  activities.push({
    name: 'Cafe/Restaurant',
    description: 'Dine and socialize',
    icon: '☕',
    suitability: 'excellent',
    reason: 'Perfect for any weather'
  });

  // Indoor Sports
  activities.push({
    name: 'Indoor Sports',
    description: 'Badminton, bowling, swimming pool',
    icon: '🏸',
    suitability: 'good',
    reason: 'Stay active regardless of weather'
  });

  return activities;
}
