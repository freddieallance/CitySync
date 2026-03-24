export interface PlaceSuggestion {
  name: string;
  description: string;
  location: string;
  image: string;
  activityTypes: string[];
  distance: string;
  rating: number;
  type?: string;
  suitability?: string;
  isAIGenerated?: boolean;
}

export interface PlaceSafety {
  canVisit: boolean;
  safetyLevel: 'safe' | 'caution' | 'unsafe';
  recommendations: string[];
  warnings: string[];
}

export function getPlacesForActivity(
  activity: string, 
  activityType: 'outdoor' | 'indoor',
  locationName?: string
): PlaceSuggestion[] {
  if (activityType === 'outdoor') {
    return getOutdoorPlaces(activity, locationName);
  } else {
    return getIndoorPlaces(activity, locationName);
  }
}

// Fetch AI-generated real place suggestions
export async function getAIPlaceSuggestions(
  activity: string,
  activityType: 'outdoor' | 'indoor',
  location: { latitude: number; longitude: number; name?: string },
  weather?: any,
  nasaData?: any
): Promise<PlaceSuggestion[]> {
  try {
    // Dynamically import the Supabase info
    const { projectId, publicAnonKey } = await import('../utils/supabase/info');
    
    const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0/ai/suggest-places`;
    
    console.log('🤖 Calling AI place suggestions API:', apiUrl);
    console.log('Request payload:', {
      location: location.name || 'Current Location',
      latitude: location.latitude,
      longitude: location.longitude,
      activity,
      activityType
    });
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          location: location.name || 'Current Location',
          latitude: location.latitude,
          longitude: location.longitude,
          activity,
          activityType,
          weather,
          nasaData
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI place suggestions API error:', response.status, response.statusText, errorText);
        return [];
      }

      const data = await response.json();
      console.log('✅ AI place suggestions received:', data);
      
      // Transform AI suggestions to PlaceSuggestion format
      if (data.places && Array.isArray(data.places)) {
        const transformedPlaces = data.places.map((place: any) => ({
          name: place.name,
          description: place.description,
          location: place.location,
          image: place.type || 'location',
          activityTypes: [activity],
          distance: place.distance,
          rating: place.rating || 4.0,
          type: place.type,
          suitability: place.suitability,
          isAIGenerated: true
        }));
        
        console.log(`✅ Transformed ${transformedPlaces.length} AI places`);
        return transformedPlaces;
      }

      console.log('⚠️ No places in AI response');
      return [];
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('AI place suggestions timed out after 30 seconds');
      } else {
        throw fetchError;
      }
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch AI place suggestions:', error);
    return [];
  }
}

function getOutdoorPlaces(activity: string, locationName?: string): PlaceSuggestion[] {
  const baseLocation = locationName?.split(',')[0] || 'Your Area';
  
  // Generate location-adaptive places based on activity type
  const placeTemplates: Record<string, PlaceSuggestion[]> = {
    'Hiking': [
      {
        name: `${baseLocation} National Park`,
        description: 'Beautiful park with scenic trails and wildlife viewing opportunities',
        location: `${baseLocation}`,
        image: 'nature forest',
        activityTypes: ['Hiking'],
        distance: '15-25 km',
        rating: 4.7
      },
      {
        name: `${baseLocation} Mountain Trail`,
        description: 'Challenging mountain trail with panoramic views',
        location: `Near ${baseLocation}`,
        image: 'mountain trail',
        activityTypes: ['Hiking'],
        distance: '20-30 km',
        rating: 4.8
      },
      {
        name: `${baseLocation} Nature Reserve`,
        description: 'Protected area with diverse ecosystems and walking paths',
        location: `${baseLocation} Area`,
        image: 'waterfall nature',
        activityTypes: ['Hiking'],
        distance: '10-20 km',
        rating: 4.6
      }
    ],
    'Cycling': [
      {
        name: `${baseLocation} Waterfront`,
        description: 'Scenic riverside or coastal path perfect for cycling',
        location: `${baseLocation} Central`,
        image: 'waterfront sunset',
        activityTypes: ['Cycling', 'Jogging/Running'],
        distance: '2-5 km',
        rating: 4.5
      },
      {
        name: `${baseLocation} City Park`,
        description: 'Large urban park with dedicated cycling lanes',
        location: `${baseLocation}`,
        image: 'park outdoor',
        activityTypes: ['Cycling', 'Jogging/Running'],
        distance: '3-8 km',
        rating: 4.4
      },
      {
        name: `${baseLocation} Bike Trail`,
        description: 'Dedicated cycling trail through scenic areas',
        location: `${baseLocation} Outskirts`,
        image: 'nature path',
        activityTypes: ['Cycling'],
        distance: '10-15 km',
        rating: 4.6
      }
    ],
    'Jogging/Running': [
      {
        name: `${baseLocation} Waterfront Promenade`,
        description: 'Paved walkway ideal for morning and evening runs',
        location: `${baseLocation} Central`,
        image: 'waterfront sunset',
        activityTypes: ['Jogging/Running', 'Cycling'],
        distance: '1-3 km',
        rating: 4.5
      },
      {
        name: `${baseLocation} Sports Complex`,
        description: 'Modern facility with running track and outdoor fields',
        location: `${baseLocation}`,
        image: 'sports stadium',
        activityTypes: ['Jogging/Running', 'Outdoor Sports'],
        distance: '5-10 km',
        rating: 4.4
      },
      {
        name: `${baseLocation} Park Loop`,
        description: 'Popular public park with jogging paths',
        location: `${baseLocation}`,
        image: 'park outdoor',
        activityTypes: ['Jogging/Running'],
        distance: '2-6 km',
        rating: 4.3
      }
    ],
    'Beach Activities': [
      {
        name: `${baseLocation} Beach`,
        description: 'Sandy beach perfect for swimming and beach sports',
        location: `${baseLocation} Coast`,
        image: 'tropical beach',
        activityTypes: ['Beach Activities'],
        distance: '5-15 km',
        rating: 4.6
      },
      {
        name: `${baseLocation} Bay`,
        description: 'Protected bay area ideal for water activities',
        location: `${baseLocation}`,
        image: 'beach sunset',
        activityTypes: ['Beach Activities'],
        distance: '10-20 km',
        rating: 4.5
      },
      {
        name: `${baseLocation} Coastal Park`,
        description: 'Beachfront park with recreational facilities',
        location: `${baseLocation} Seafront`,
        image: 'beach park',
        activityTypes: ['Beach Activities'],
        distance: '8-18 km',
        rating: 4.4
      }
    ],
    'Outdoor Sports': [
      {
        name: `${baseLocation} Sports Complex`,
        description: 'Multi-purpose sports facility with various outdoor fields',
        location: `${baseLocation}`,
        image: 'sports stadium',
        activityTypes: ['Outdoor Sports'],
        distance: '5-10 km',
        rating: 4.5
      },
      {
        name: `${baseLocation} Recreation Center`,
        description: 'Community sports center with tennis, basketball courts',
        location: `${baseLocation} District`,
        image: 'sports field',
        activityTypes: ['Outdoor Sports'],
        distance: '3-8 km',
        rating: 4.3
      },
      {
        name: `${baseLocation} Athletic Park`,
        description: 'Open sports park with multiple activity zones',
        location: `${baseLocation}`,
        image: 'park outdoor',
        activityTypes: ['Outdoor Sports', 'Jogging/Running'],
        distance: '4-9 km',
        rating: 4.4
      }
    ]
  };

  return placeTemplates[activity] || [];
}

function getIndoorPlaces(activity: string, locationName?: string): PlaceSuggestion[] {
  const baseLocation = locationName?.split(',')[0] || 'Your Area';
  
  const placeTemplates: Record<string, PlaceSuggestion[]> = {
    'Shopping Mall': [
      {
        name: `${baseLocation} Mall`,
        description: 'Large shopping center with diverse retail stores and dining options',
        location: `${baseLocation} Central`,
        image: 'modern mall',
        activityTypes: ['Shopping Mall', 'Cafe/Restaurant'],
        distance: '2-8 km',
        rating: 4.5
      },
      {
        name: `${baseLocation} Megamall`,
        description: 'Premier shopping destination with premium brands',
        location: `${baseLocation}`,
        image: 'shopping center',
        activityTypes: ['Shopping Mall', 'Cafe/Restaurant', 'Cinema'],
        distance: '3-10 km',
        rating: 4.4
      },
      {
        name: `${baseLocation} Plaza`,
        description: 'Central shopping complex with entertainment facilities',
        location: `${baseLocation} Downtown`,
        image: 'urban mall',
        activityTypes: ['Shopping Mall', 'Cafe/Restaurant'],
        distance: '1-5 km',
        rating: 4.3
      }
    ],
    'Museum/Gallery': [
      {
        name: `${baseLocation} Museum`,
        description: 'Cultural museum showcasing local history and heritage',
        location: `${baseLocation} Central`,
        image: 'museum building',
        activityTypes: ['Museum/Gallery'],
        distance: '2-6 km',
        rating: 4.6
      },
      {
        name: `${baseLocation} Art Gallery`,
        description: 'Contemporary art gallery with rotating exhibitions',
        location: `${baseLocation}`,
        image: 'art gallery',
        activityTypes: ['Museum/Gallery'],
        distance: '3-7 km',
        rating: 4.5
      },
      {
        name: `${baseLocation} Heritage Center`,
        description: 'Interactive museum exploring local culture and traditions',
        location: `${baseLocation} District`,
        image: 'heritage building',
        activityTypes: ['Museum/Gallery'],
        distance: '4-8 km',
        rating: 4.4
      }
    ],
    'Gym/Fitness': [
      {
        name: `${baseLocation} Fitness Center`,
        description: 'Modern gym with cardio, weights, and group classes',
        location: `${baseLocation}`,
        image: 'gym equipment',
        activityTypes: ['Gym/Fitness'],
        distance: '2-8 km',
        rating: 4.5
      },
      {
        name: `${baseLocation} Sports Club`,
        description: 'Premium fitness facility with pool and spa',
        location: `${baseLocation} Central`,
        image: 'fitness center',
        activityTypes: ['Gym/Fitness', 'Indoor Sports'],
        distance: '3-9 km',
        rating: 4.6
      },
      {
        name: `${baseLocation} Wellness Gym`,
        description: 'Boutique gym with personal training services',
        location: `${baseLocation}`,
        image: 'modern gym',
        activityTypes: ['Gym/Fitness'],
        distance: '1-6 km',
        rating: 4.4
      }
    ],
    'Cinema': [
      {
        name: `${baseLocation} Cinemas`,
        description: 'Modern multiplex with latest movie releases',
        location: `${baseLocation} Mall`,
        image: 'cinema screen',
        activityTypes: ['Cinema'],
        distance: '2-7 km',
        rating: 4.5
      },
      {
        name: `${baseLocation} Filmhouse`,
        description: 'Premium cinema experience with luxury seating',
        location: `${baseLocation} Central`,
        image: 'movie theater',
        activityTypes: ['Cinema'],
        distance: '3-8 km',
        rating: 4.6
      }
    ],
    'Indoor Sports': [
      {
        name: `${baseLocation} Sports Arena`,
        description: 'Indoor sports complex with badminton, basketball courts',
        location: `${baseLocation}`,
        image: 'badminton court',
        activityTypes: ['Indoor Sports'],
        distance: '4-10 km',
        rating: 4.4
      },
      {
        name: `${baseLocation} Recreation Center`,
        description: 'Community sports facility with various indoor activities',
        location: `${baseLocation} District`,
        image: 'sports hall',
        activityTypes: ['Indoor Sports', 'Gym/Fitness'],
        distance: '3-9 km',
        rating: 4.3
      },
      {
        name: `${baseLocation} Badminton Hall`,
        description: 'Dedicated indoor badminton facility',
        location: `${baseLocation}`,
        image: 'indoor court',
        activityTypes: ['Indoor Sports'],
        distance: '2-7 km',
        rating: 4.5
      }
    ],
    'Cafe/Restaurant': [
      {
        name: `${baseLocation} Café District`,
        description: 'Trendy cafe area with specialty coffee and pastries',
        location: `${baseLocation} Central`,
        image: 'coffee cafe',
        activityTypes: ['Cafe/Restaurant'],
        distance: '1-4 km',
        rating: 4.7
      },
      {
        name: `${baseLocation} Food Hall`,
        description: 'Food court with diverse local and international cuisines',
        location: `${baseLocation}`,
        image: 'restaurant food',
        activityTypes: ['Cafe/Restaurant'],
        distance: '2-6 km',
        rating: 4.6
      },
      {
        name: `${baseLocation} Dining Street`,
        description: 'Popular dining area with various restaurant options',
        location: `${baseLocation} Downtown`,
        image: 'urban dining',
        activityTypes: ['Cafe/Restaurant'],
        distance: '1-5 km',
        rating: 4.5
      }
    ]
  };

  return placeTemplates[activity] || [];
}

export function evaluatePlaceSafety(place: PlaceSuggestion, conditions: any): PlaceSafety {
  const { weather, airQuality, flood, haze } = conditions;
  
  // Check if place is in flood or haze affected area
  const inFloodZone = flood.affectedAreas.some((area: string) => 
    place.location.includes(area)
  );
  const inHazeZone = haze.affectedAreas.some((area: string) => 
    place.location.includes(area)
  );

  const recommendations: string[] = [];
  const warnings: string[] = [];
  let safetyLevel: 'safe' | 'caution' | 'unsafe' = 'safe';
  let canVisit = true;

  // Indoor places - generally safer but check for severe conditions
  if (place.activityTypes.some(type => 
    ['Shopping Mall', 'Museum/Gallery', 'Gym/Fitness', 'Cinema', 'Cafe/Restaurant', 'Indoor Sports'].includes(type)
  )) {
    if (inFloodZone && flood.riskLevel === 'High') {
      safetyLevel = 'unsafe';
      canVisit = false;
      warnings.push('⛔ Area is at high flood risk - avoid traveling to this location');
      warnings.push('Stay indoors in your current location');
    } else if (inFloodZone) {
      safetyLevel = 'caution';
      recommendations.push('⚠️ Monitor flood warnings before traveling');
      recommendations.push('Use elevated routes and avoid low-lying areas');
    }
    
    const rainChance = weather.rainChance || weather.precipitation;
    
    if (rainChance > 70) {
      safetyLevel = safetyLevel === 'unsafe' ? 'unsafe' : 'caution';
      recommendations.push('🌧️ Heavy rain expected - plan for delays');
      recommendations.push('Bring umbrella and wear waterproof shoes');
    }

    if (safetyLevel === 'safe') {
      recommendations.push('✅ Safe to visit - indoor location protected from weather');
    }

    return { canVisit, safetyLevel, recommendations, warnings };
  }

  // Outdoor places - more conditions to check
  
  const rainChance = weather.rainChance || weather.precipitation;
  const temp = weather.temperature;
  const aqi = airQuality.aqi;

  // Severe weather conditions
  if (rainChance > 80) {
    safetyLevel = 'unsafe';
    canVisit = false;
    warnings.push('⛔ Heavy rainstorms expected - not safe for outdoor activities');
    warnings.push('Stay indoors until weather improves');
  } else if (rainChance > 60) {
    safetyLevel = 'caution';
    recommendations.push('🌧️ Moderate rain likely - bring raincoat and waterproof gear');
    recommendations.push('Check weather updates before departure');
  } else if (rainChance > 30) {
    safetyLevel = 'caution';
    recommendations.push('☔ Light rain possible - carry an umbrella');
  }

  // Temperature checks
  if (temp > 35) {
    safetyLevel = safetyLevel === 'unsafe' ? 'unsafe' : 'caution';
    recommendations.push('🌡️ High temperature - stay hydrated and wear sunscreen');
    recommendations.push('Avoid outdoor activities during peak sun hours (11am-3pm)');
  } else if (temp < 5) {
    safetyLevel = safetyLevel === 'unsafe' ? 'unsafe' : 'caution';
    recommendations.push('🧥 Cold weather - dress warmly in layers');
  }

  // Air quality
  if (aqi > 150 || (inHazeZone && haze.severity === 'Severe')) {
    safetyLevel = 'unsafe';
    canVisit = false;
    warnings.push('⛔ Poor air quality - outdoor activities not recommended');
    warnings.push('Stay indoors and use air purifiers');
  } else if (aqi > 100 || (inHazeZone && haze.severity === 'Moderate')) {
    safetyLevel = safetyLevel === 'unsafe' ? 'unsafe' : 'caution';
    recommendations.push('😷 Moderate air quality - wear a mask for outdoor activities');
    recommendations.push('Limit duration of outdoor activities');
  }

  // Flood risk
  if (inFloodZone && flood.riskLevel === 'High') {
    safetyLevel = 'unsafe';
    canVisit = false;
    warnings.push('⛔ Area at high flood risk - do not visit');
    warnings.push('Choose alternative locations on higher ground');
  } else if (inFloodZone) {
    safetyLevel = safetyLevel === 'unsafe' ? 'unsafe' : 'caution';
    recommendations.push('⚠️ Area may be affected by flooding - stay alert');
    recommendations.push('Avoid low-lying areas and water bodies');
  }

  // All clear
  if (safetyLevel === 'safe') {
    recommendations.push('✅ Good conditions for outdoor activities');
    recommendations.push('Have a great time!');
  }

  return { canVisit, safetyLevel, recommendations, warnings };
}
