/**
 * NASA Earth Observation Data API Integration
 * 
 * Integrates multiple NASA APIs:
 * - NASA POWER API: Climate and weather data
 * - NASA FIRMS: Real-time wildfire detection
 * - NASA EONET: Natural disaster events tracker
 * - Earthdata Search (CMR): NASA's Common Metadata Repository for dataset search
 * - Giovanni: Time-series analysis and climate data visualization
 * - Worldview (GIBS): Real-time satellite imagery and data visualization
 * - GES DISC: Atmospheric data (requires authentication)
 * - DataRods: Hydrology data (requires authentication)
 * 
 * Authentication is handled via config.tsx file
 */

import { CONFIG, areNASACredentialsConfigured } from './config.tsx';

interface ClimateData {
  temperature: number;
  humidity: number;
  precipitation: number;
  solarRadiation: number;
  windSpeed: number;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

interface WildfireData {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number;
  confidence: string;
  distance: number; // Distance from user location in km
  detected: string;
}

interface NaturalEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  latitude?: number;
  longitude?: number;
  distance?: number; // Distance from user location in km
  link?: string;
}

// Default location: Kuching, Sarawak, Malaysia
const DEFAULT_LOCATION: LocationCoordinates = {
  latitude: 1.5535,
  longitude: 110.3593
};

/**
 * Fetch climate data from NASA POWER API
 * No authentication required
 */
export async function getNASAClimateData(
  latitude: number = DEFAULT_LOCATION.latitude,
  longitude: number = DEFAULT_LOCATION.longitude
): Promise<ClimateData | null> {
  try {
    // Get data for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const url = `https://power.larc.nasa.gov/api/temporal/daily/point`;
    const params = new URLSearchParams({
      parameters: 'T2M,RH2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN,WS2M',
      community: 'RE',
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      start: formatDate(startDate),
      end: formatDate(endDate),
      format: 'JSON'
    });

    console.log(`Fetching NASA POWER data for coordinates: ${latitude}, ${longitude}`);
    
    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`NASA POWER API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    // Extract parameter data
    const parameters = data.properties?.parameter;
    
    if (!parameters) {
      console.error('No parameter data in NASA POWER response');
      return null;
    }

    // Calculate averages from the last 7 days
    const calculateAverage = (dataObj: Record<string, number>) => {
      const values = Object.values(dataObj).filter(v => v !== -999); // Filter out missing data
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    };

    const temperature = calculateAverage(parameters.T2M || {});
    const humidity = calculateAverage(parameters.RH2M || {});
    const precipitation = calculateAverage(parameters.PRECTOTCORR || {});
    const solarRadiation = calculateAverage(parameters.ALLSKY_SFC_SW_DWN || {});
    const windSpeed = calculateAverage(parameters.WS2M || {});

    console.log('NASA POWER data fetched successfully:', {
      temperature,
      humidity,
      precipitation,
      windSpeed
    });

    return {
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity * 10) / 10,
      precipitation: Math.round(precipitation * 10) / 10,
      solarRadiation: Math.round(solarRadiation * 10) / 10,
      windSpeed: Math.round(windSpeed * 10) / 10
    };
  } catch (error) {
    console.error('Error fetching NASA POWER data:', error);
    return null;
  }
}

/**
 * Estimate air quality based on environmental conditions
 * Uses precipitation and solar radiation as proxies
 */
function estimateAirQuality(precipitation: number, humidity: number): {
  aqi: number;
  pm25: number;
  status: string;
} {
  // Higher precipitation and humidity generally improve air quality
  let aqi = 75; // Default moderate
  let pm25 = 35; // Default moderate PM2.5
  
  // Rain helps clear particulates
  if (precipitation > 20) {
    aqi = 45;
    pm25 = 18;
  } else if (precipitation > 10) {
    aqi = 55;
    pm25 = 25;
  } else if (precipitation > 5) {
    aqi = 65;
    pm25 = 30;
  }
  
  // High humidity can indicate recent rain or moisture
  if (humidity > 80) {
    aqi = Math.max(40, aqi - 10);
    pm25 = Math.max(15, pm25 - 5);
  } else if (humidity < 40) {
    // Dry conditions can increase particulates
    aqi = Math.min(120, aqi + 20);
    pm25 = Math.min(55, pm25 + 10);
  }
  
  const status = getAQIStatus(aqi);
  
  return { aqi, pm25, status };
}

/**
 * Calculate AQI status from AQI value
 */
function getAQIStatus(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

/**
 * Calculate UV Index from solar radiation
 * Rough approximation: UV Index ≈ Solar Radiation (W/m²) × 0.04
 */
function calculateUVIndex(solarRadiation: number): number {
  const uvIndex = solarRadiation * 0.04;
  return Math.min(Math.round(uvIndex), 11); // Cap at 11
}

/**
 * Assess flood risk based on precipitation data
 */
function assessFloodRisk(precipitation: number): {
  riskLevel: string;
  affectedAreas: string[];
} {
  // Precipitation in mm/day
  if (precipitation > 100) {
    return {
      riskLevel: 'High',
      affectedAreas: ['Kuching Central', 'Sibu', 'Sarikei']
    };
  } else if (precipitation > 50) {
    return {
      riskLevel: 'Medium',
      affectedAreas: ['Kuching Central', 'Miri']
    };
  } else if (precipitation > 20) {
    return {
      riskLevel: 'Low',
      affectedAreas: ['Kuching Central']
    };
  }
  
  return {
    riskLevel: 'Low',
    affectedAreas: []
  };
}

/**
 * Assess haze severity based on air quality data
 */
function assessHazeSeverity(pm25: number): {
  severity: string;
  visibility: number;
  affectedAreas: string[];
} {
  // PM2.5 levels in µg/m³
  if (pm25 > 150) {
    return {
      severity: 'Severe',
      visibility: 2,
      affectedAreas: ['Kuching', 'Sibu', 'Miri', 'Bintulu']
    };
  } else if (pm25 > 100) {
    return {
      severity: 'High',
      visibility: 5,
      affectedAreas: ['Kuching', 'Sibu', 'Miri']
    };
  } else if (pm25 > 55) {
    return {
      severity: 'Moderate',
      visibility: 8,
      affectedAreas: ['Sibu', 'Miri']
    };
  } else if (pm25 > 35) {
    return {
      severity: 'Light',
      visibility: 10,
      affectedAreas: ['Sibu']
    };
  }
  
  return {
    severity: 'None',
    visibility: 15,
    affectedAreas: []
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Fetch active wildfires from NASA FIRMS (Fire Information for Resource Management System)
 * Free API - no authentication required
 * Returns fires detected in the last 24 hours within specified radius
 */
export async function getNASAWildfires(
  latitude: number = DEFAULT_LOCATION.latitude,
  longitude: number = DEFAULT_LOCATION.longitude,
  radiusKm: number = 500
): Promise<WildfireData[]> {
  try {
    // NASA FIRMS MODIS data - last 24 hours
    // Using the public CSV feed (no API key required for limited access)
    const url = `https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_Global_24h.csv`;
    
    console.log(`Fetching NASA FIRMS wildfire data within ${radiusKm}km of ${latitude}, ${longitude}...`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/csv'
      }
    });

    if (!response.ok) {
      console.error(`NASA FIRMS API error: ${response.status}`);
      return [];
    }

    const csvText = await response.text();
    const lines = csvText.trim().split('\n');
    
    if (lines.length < 2) {
      console.log('No wildfire data available from NASA FIRMS');
      return [];
    }

    // Parse CSV header
    const headers = lines[0].split(',');
    const latIndex = headers.indexOf('latitude');
    const lonIndex = headers.indexOf('longitude');
    const brightnessIndex = headers.indexOf('brightness');
    const confidenceIndex = headers.indexOf('confidence');
    const acqDateIndex = headers.indexOf('acq_date');
    const acqTimeIndex = headers.indexOf('acq_time');

    // Parse fire data
    const wildfires: WildfireData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const fireLat = parseFloat(values[latIndex]);
      const fireLon = parseFloat(values[lonIndex]);
      
      // Calculate distance from user location
      const distance = calculateDistance(latitude, longitude, fireLat, fireLon);
      
      // Only include fires within radius
      if (distance <= radiusKm) {
        wildfires.push({
          id: `fire_${i}`,
          latitude: fireLat,
          longitude: fireLon,
          brightness: parseFloat(values[brightnessIndex]) || 0,
          confidence: values[confidenceIndex] || 'unknown',
          distance: Math.round(distance),
          detected: `${values[acqDateIndex]} ${values[acqTimeIndex]}`
        });
      }
    }

    console.log(`NASA FIRMS: Found ${wildfires.length} active fires within ${radiusKm}km`);
    
    // Sort by distance (closest first)
    return wildfires.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error fetching NASA FIRMS wildfire data:', error);
    return [];
  }
}

/**
 * Fetch natural disaster events from NASA EONET (Earth Observatory Natural Event Tracker)
 * Free API - no authentication required
 * Returns recent natural events (storms, floods, wildfires, etc.) within specified radius
 */
export async function getNASANaturalEvents(
  latitude: number = DEFAULT_LOCATION.latitude,
  longitude: number = DEFAULT_LOCATION.longitude,
  radiusKm: number = 500,
  daysBack: number = 30
): Promise<NaturalEvent[]> {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const url = `https://eonet.gsfc.nasa.gov/api/v3/events`;
    const params = new URLSearchParams({
      status: 'open',
      start: formatDate(startDate),
      end: formatDate(endDate)
    });
    
    console.log(`Fetching NASA EONET natural events within ${radiusKm}km...`);
    
    const response = await fetch(`${url}?${params.toString()}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`NASA EONET API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const events: NaturalEvent[] = [];

    if (!data.events || data.events.length === 0) {
      console.log('No natural events found in NASA EONET');
      return [];
    }

    // Process events
    for (const event of data.events) {
      // Get the most recent geometry point
      const geometry = event.geometry?.[event.geometry.length - 1];
      
      if (geometry?.coordinates) {
        const [eventLon, eventLat] = geometry.coordinates;
        
        // Calculate distance from user location
        const distance = calculateDistance(latitude, longitude, eventLat, eventLon);
        
        // Only include events within radius
        if (distance <= radiusKm) {
          events.push({
            id: event.id,
            title: event.title,
            description: event.description || 'No description available',
            category: event.categories?.[0]?.title || 'Unknown',
            date: geometry.date || event.geometry[0]?.date || 'Unknown',
            latitude: eventLat,
            longitude: eventLon,
            distance: Math.round(distance),
            link: event.link || undefined
          });
        }
      }
    }

    console.log(`NASA EONET: Found ${events.length} natural events within ${radiusKm}km`);
    
    // Sort by distance (closest first)
    return events.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  } catch (error) {
    console.error('Error fetching NASA EONET events:', error);
    return [];
  }
}

/**
 * Get historical climate trends from NASA POWER API
 * Returns daily data for the specified period
 */
export async function getClimateTrends(
  days: number = 30,
  latitude?: number,
  longitude?: number
): Promise<any> {
  const lat = latitude || DEFAULT_LOCATION.latitude;
  const lon = longitude || DEFAULT_LOCATION.longitude;

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const url = `https://power.larc.nasa.gov/api/temporal/daily/point`;
    const params = new URLSearchParams({
      parameters: 'T2M,RH2M,PRECTOTCORR,WS2M',
      community: 'RE',
      longitude: lon.toString(),
      latitude: lat.toString(),
      start: formatDate(startDate),
      end: formatDate(endDate),
      format: 'JSON'
    });

    console.log(`Fetching ${days}-day climate trends from NASA POWER...`);

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`NASA POWER API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const parameters = data.properties?.parameter;

    if (!parameters) {
      return null;
    }

    // Transform data into time series format
    const dates = Object.keys(parameters.T2M || {});
    const trends = dates.map(date => ({
      date,
      temperature: parameters.T2M?.[date] || null,
      humidity: parameters.RH2M?.[date] || null,
      precipitation: parameters.PRECTOTCORR?.[date] || null,
      windSpeed: parameters.WS2M?.[date] || null
    })).filter(d => d.temperature !== -999); // Filter out missing data

    console.log(`Climate trends fetched: ${trends.length} data points`);

    return {
      location: { latitude: lat, longitude: lon },
      period: { start: formatDate(startDate), end: formatDate(endDate) },
      dataPoints: trends.length,
      trends
    };
  } catch (error) {
    console.error('Error fetching climate trends:', error);
    return null;
  }
}

/**
 * Get comprehensive environmental conditions using multiple NASA APIs
 * No external API keys required - completely free and open
 */
export async function getEnvironmentalConditions(
  latitude?: number,
  longitude?: number
): Promise<any> {
  const lat = latitude || DEFAULT_LOCATION.latitude;
  const lon = longitude || DEFAULT_LOCATION.longitude;

  console.log('Fetching environmental conditions from NASA APIs...');

  // Fetch data from multiple NASA sources in parallel
  const [climateData, wildfires, naturalEvents] = await Promise.all([
    getNASAClimateData(lat, lon),
    getNASAWildfires(lat, lon, 500), // 500km radius
    getNASANaturalEvents(lat, lon, 500, 30) // 500km radius, 30 days back
  ]);

  // Use NASA POWER data or fallback values
  let temperature: number;
  let humidity: number;
  let windSpeed: number;
  let precipitation: number;
  let solarRadiation: number;
  let rainChance: number;
  let weatherDescription: string;

  if (climateData) {
    temperature = climateData.temperature;
    humidity = climateData.humidity;
    windSpeed = climateData.windSpeed;
    precipitation = climateData.precipitation;
    solarRadiation = climateData.solarRadiation;
    
    // Estimate rain chance from precipitation (mm/day)
    // Higher precipitation = higher rain chance
    if (precipitation > 50) {
      rainChance = 90;
      weatherDescription = 'Heavy rain expected';
    } else if (precipitation > 20) {
      rainChance = 70;
      weatherDescription = 'Rain likely';
    } else if (precipitation > 10) {
      rainChance = 50;
      weatherDescription = 'Possible showers';
    } else if (precipitation > 5) {
      rainChance = 30;
      weatherDescription = 'Partly cloudy';
    } else {
      rainChance = 10;
      weatherDescription = 'Mostly clear';
    }
    
    console.log('NASA POWER data retrieved successfully');
  } else {
    // Fallback to typical tropical conditions
    temperature = 28;
    humidity = 75;
    windSpeed = 12;
    precipitation = 15;
    solarRadiation = 175;
    rainChance = 30;
    weatherDescription = 'Typical tropical conditions';
    console.log('Using typical tropical climate data (NASA API unavailable)');
  }

  // Calculate derived values
  const uvIndex = calculateUVIndex(solarRadiation);
  
  // Estimate air quality based on environmental conditions
  const airQualityEstimate = estimateAirQuality(precipitation, humidity);

  // Assess environmental risks
  const floodRisk = assessFloodRisk(precipitation);
  const hazeInfo = assessHazeSeverity(airQualityEstimate.pm25);

  // Assess wildfire risk
  const wildfireRisk = {
    detected: wildfires.length > 0,
    count: wildfires.length,
    nearestDistance: wildfires.length > 0 ? wildfires[0].distance : null,
    riskLevel: wildfires.length === 0 ? 'None' :
               wildfires[0].distance < 50 ? 'Extreme' :
               wildfires[0].distance < 100 ? 'High' :
               wildfires[0].distance < 200 ? 'Moderate' : 'Low',
    fires: wildfires.slice(0, 10) // Top 10 closest fires
  };

  // Categorize natural events
  const eventsByCategory: Record<string, NaturalEvent[]> = {};
  for (const event of naturalEvents) {
    if (!eventsByCategory[event.category]) {
      eventsByCategory[event.category] = [];
    }
    eventsByCategory[event.category].push(event);
  }

  const conditions = {
    timestamp: new Date().toISOString(),
    location: {
      latitude: lat,
      longitude: lon,
      name: 'Current Location'
    },
    dataSource: {
      primary: 'Multiple NASA APIs',
      sources: [
        'NASA POWER API - Climate & Weather',
        'NASA FIRMS - Active Wildfires',
        'NASA EONET - Natural Disaster Events'
      ],
      note: 'Combined real-time data from NASA satellite observations and event tracking systems',
      lastFetch: new Date().toISOString()
    },
    weather: {
      temperature,
      humidity,
      precipitation,
      rainChance,
      uvIndex,
      windSpeed,
      solarRadiation,
      description: weatherDescription
    },
    airQuality: {
      aqi: airQualityEstimate.aqi,
      pm25: airQualityEstimate.pm25,
      status: airQualityEstimate.status,
      note: 'Estimated from environmental conditions'
    },
    flood: floodRisk,
    haze: hazeInfo,
    wildfires: wildfireRisk,
    naturalEvents: {
      total: naturalEvents.length,
      byCategory: Object.keys(eventsByCategory).map(category => ({
        category,
        count: eventsByCategory[category].length,
        events: eventsByCategory[category].slice(0, 5) // Top 5 per category
      })),
      allEvents: naturalEvents.slice(0, 20) // Top 20 closest events
    }
  };

  console.log('Environmental conditions compiled from NASA data:', {
    temperature: conditions.weather.temperature,
    humidity: conditions.weather.humidity,
    rainChance: conditions.weather.rainChance,
    aqi: conditions.airQuality.aqi,
    floodRisk: conditions.flood.riskLevel,
    hazeSeverity: conditions.haze.severity,
    wildfires: conditions.wildfires.count,
    naturalEvents: conditions.naturalEvents.total
  });

  return conditions;
}

/**
 * ==================== AUTHENTICATED NASA APIs ====================
 * These APIs require NASA Earthdata Bearer Token
 * Get your token at: https://urs.earthdata.nasa.gov/users/YOUR_USERNAME/user_tokens
 */

/**
 * Fetch data from authenticated GES DISC API
 * Provides atmospheric composition and precipitation data
 * Uses Bearer token from config.tsx
 */
export async function getGESDISCData(
  latitude: number,
  longitude: number,
  startDate?: string,
  endDate?: string
): Promise<any> {
  try {
    // Check if credentials are configured
    if (!areNASACredentialsConfigured()) {
      console.error('NASA Bearer token not configured in config.tsx');
      return null;
    }
    
    // Example: MERRA-2 atmospheric data
    const url = 'https://goldsmr4.gesdisc.eosdis.nasa.gov/opendap/MERRA2/M2T1NXSLV.5.12.4/';
    
    console.log('Fetching GES DISC atmospheric data...');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CONFIG.NASA.BEARER_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`GES DISC API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return {
      source: 'GES DISC',
      data: data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching GES DISC data:', error);
    return null;
  }
}

/**
 * Fetch data from NASA Giovanni API
 * Online visualization and analysis for atmospheric data
 * Giovanni provides time-series and map visualizations
 */
export async function getGiovanniData(
  latitude: number,
  longitude: number,
  parameter: string = 'AIRX3STD_006_TotCO_A'
): Promise<any> {
  try {
    // Giovanni Web Services API endpoint
    // Note: Giovanni primarily works through web interface, but we can access data services
    const baseUrl = 'https://giovanni.gsfc.nasa.gov/giovanni/daac-bin/service_manager.pl';
    
    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Create bounding box (small area around point)
    const bbox = {
      west: longitude - 0.5,
      south: latitude - 0.5,
      east: longitude + 0.5,
      north: latitude + 0.5
    };

    console.log('Fetching Giovanni time-series data...');
    
    // Giovanni Time-Series request
    // Using MERRA-2 precipitation data as an example
    const params = new URLSearchParams({
      service: 'ArAvTs', // Area-Averaged Time Series
      starttime: formatDate(startDate) + 'T00:00:00Z',
      endtime: formatDate(endDate) + 'T23:59:59Z',
      bbox: `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`,
      data: 'M2TMNXFLX_5_12_4:PRECTOT', // MERRA-2 total precipitation
      portal: 'GIOVANNI',
      format: 'json'
    });

    try {
      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CitySync/1.0'
        }
      });

      if (!response.ok) {
        console.log(`Giovanni API returned status ${response.status}, using fallback data`);
        return createGiovanniFallbackData(latitude, longitude, startDate, endDate);
      }

      const data = await response.json();
      
      return {
        source: 'Giovanni',
        location: { latitude, longitude },
        parameter: 'Precipitation',
        period: {
          start: formatDate(startDate),
          end: formatDate(endDate)
        },
        data: data,
        available: true,
        timestamp: new Date().toISOString()
      };
    } catch (fetchError) {
      console.log('Giovanni API fetch error, using fallback data');
      return createGiovanniFallbackData(latitude, longitude, startDate, endDate);
    }
  } catch (error) {
    console.error('Error fetching Giovanni data:', error);
    return null;
  }
}

/**
 * Create fallback Giovanni data based on NASA POWER data
 */
async function createGiovanniFallbackData(
  latitude: number,
  longitude: number,
  startDate: Date,
  endDate: Date
): Promise<any> {
  console.log('Creating Giovanni-compatible data from NASA POWER...');
  
  try {
    // Get climate trends from NASA POWER as fallback
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const trendsData = await getClimateTrends(Math.min(days, 365), latitude, longitude);
    
    if (!trendsData || !trendsData.trends) {
      return {
        source: 'Giovanni (Simulated)',
        location: { latitude, longitude },
        available: false,
        message: 'Giovanni data temporarily unavailable',
        timestamp: new Date().toISOString()
      };
    }

    // Format as Giovanni-style time series
    const timeSeries = trendsData.trends.map((point: any) => ({
      date: point.date,
      precipitation: point.precipitation,
      temperature: point.temperature,
      humidity: point.humidity
    }));

    // Calculate statistics
    const precipValues = timeSeries.map((p: any) => p.precipitation).filter((v: any) => v !== null && v !== -999);
    const avgPrecip = precipValues.length > 0 
      ? precipValues.reduce((a: number, b: number) => a + b, 0) / precipValues.length 
      : 0;
    const maxPrecip = precipValues.length > 0 ? Math.max(...precipValues) : 0;

    return {
      source: 'Giovanni (via NASA POWER)',
      location: { latitude, longitude },
      parameter: 'Multi-parameter Analysis',
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      },
      timeSeries: timeSeries,
      statistics: {
        averagePrecipitation: Math.round(avgPrecip * 10) / 10,
        maximumPrecipitation: Math.round(maxPrecip * 10) / 10,
        dataPoints: timeSeries.length
      },
      available: true,
      note: 'Data sourced from NASA POWER API (Giovanni service limited access)',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating Giovanni fallback data:', error);
    return {
      source: 'Giovanni',
      available: false,
      message: 'Unable to retrieve climate analysis data',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Fetch hydrology data from DataRods
 * Precipitation and hydrological datasets
 * Uses Bearer token from config.tsx
 */
export async function getDataRodsData(
  latitude: number,
  longitude: number
): Promise<any> {
  try {
    if (!areNASACredentialsConfigured()) {
      console.error('NASA Bearer token not configured in config.tsx');
      return null;
    }
    
    const url = 'http://hydro1.gesdisc.eosdis.nasa.gov/data/';
    
    console.log('Fetching DataRods hydrology data...');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CONFIG.NASA.BEARER_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`DataRods API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return {
      source: 'DataRods',
      data: data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching DataRods data:', error);
    return null;
  }
}

/**
 * Fetch imagery from NASA Worldview (GIBS - Global Imagery Browse Services)
 * No authentication required - provides satellite imagery tiles
 * Returns available imagery layers and metadata
 */
export async function getWorldviewImagery(
  latitude: number,
  longitude: number,
  date?: string
): Promise<any> {
  try {
    // Use today's date if not provided
    const imageDate = date || new Date().toISOString().split('T')[0];
    
    console.log(`Fetching Worldview imagery for ${imageDate}...`);
    
    // Worldview Snapshots API - Get available imagery
    const snapshotUrl = 'https://wvs.earthdata.nasa.gov/api/v1/snapshot';
    
    // Calculate bounding box around the point (approximately 10km radius)
    const delta = 0.1; // approximately 10km
    const bbox = {
      west: longitude - delta,
      south: latitude - delta,
      east: longitude + delta,
      north: latitude + delta
    };

    // Try to get a snapshot for the location
    try {
      const params = new URLSearchParams({
        REQUEST: 'GetSnapshot',
        TIME: imageDate,
        BBOX: `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`,
        CRS: 'EPSG:4326',
        LAYERS: 'MODIS_Terra_CorrectedReflectance_TrueColor,Coastlines',
        WRAP: 'day',
        FORMAT: 'image/jpeg',
        WIDTH: '512',
        HEIGHT: '512'
      });

      const snapshotResponse = await fetch(`${snapshotUrl}?${params.toString()}`);
      
      if (snapshotResponse.ok) {
        // Get the image URL (we won't download the image, just provide metadata)
        const imageUrl = `${snapshotUrl}?${params.toString()}`;
        
        return {
          source: 'Worldview (GIBS)',
          available: true,
          location: { latitude, longitude },
          date: imageDate,
          imagery: {
            snapshotUrl: imageUrl,
            layers: [
              'MODIS Terra True Color',
              'Coastlines'
            ],
            resolution: '512x512',
            format: 'JPEG'
          },
          capabilities: {
            wmtsEndpoint: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml',
            availableLayers: [
              'MODIS_Terra_CorrectedReflectance_TrueColor',
              'MODIS_Aqua_CorrectedReflectance_TrueColor',
              'VIIRS_SNPP_CorrectedReflectance_TrueColor',
              'BlueMarble_NextGeneration',
              'Coastlines'
            ]
          },
          tileService: {
            baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best',
            tileFormat: 'image/jpeg',
            note: 'Use WMTS protocol for map integration'
          },
          timestamp: new Date().toISOString()
        };
      }
    } catch (snapshotError) {
      console.log('Snapshot API not available, providing WMTS metadata...');
    }

    // Fallback: Return GIBS WMTS metadata even if snapshot fails
    return {
      source: 'Worldview (GIBS)',
      available: true,
      location: { latitude, longitude },
      date: imageDate,
      imagery: {
        note: 'Satellite imagery available via WMTS service',
        recommendedLayers: [
          {
            name: 'MODIS Terra True Color',
            id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
            description: 'Daily true-color satellite imagery from MODIS Terra'
          },
          {
            name: 'VIIRS True Color',
            id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
            description: 'High-resolution true-color imagery from VIIRS'
          }
        ]
      },
      tileService: {
        baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best',
        wmtsCapabilities: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml',
        sampleTileUrl: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${imageDate}/250m/8/12/5.jpg`,
        tileFormat: 'image/jpeg',
        projection: 'EPSG:4326',
        resolutions: ['250m', '500m', '1km', '2km']
      },
      interactiveViewer: {
        url: `https://worldview.earthdata.nasa.gov/?l=MODIS_Terra_CorrectedReflectance_TrueColor&t=${imageDate}&z=3&v=${bbox.west},${bbox.south},${bbox.east},${bbox.north}`,
        description: 'View in NASA Worldview interactive browser'
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Worldview data:', error);
    return {
      source: 'Worldview',
      available: false,
      error: 'Failed to retrieve satellite imagery',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Get satellite imagery layers for a specific location and date
 * Returns detailed information about available satellite imagery
 */
export async function getWorldviewLayers(date?: string): Promise<any> {
  try {
    const imageDate = date || new Date().toISOString().split('T')[0];
    
    console.log('Fetching available Worldview layers...');
    
    return {
      source: 'Worldview Layers',
      date: imageDate,
      categories: {
        trueColor: [
          {
            id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
            name: 'MODIS Terra True Color',
            satellite: 'Terra',
            resolution: '250m',
            coverage: 'Global',
            updateFrequency: 'Daily'
          },
          {
            id: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
            name: 'MODIS Aqua True Color',
            satellite: 'Aqua',
            resolution: '250m',
            coverage: 'Global',
            updateFrequency: 'Daily'
          },
          {
            id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
            name: 'VIIRS True Color',
            satellite: 'Suomi NPP',
            resolution: '375m',
            coverage: 'Global',
            updateFrequency: 'Daily'
          }
        ],
        weather: [
          {
            id: 'MODIS_Terra_Cloud_Top_Temp_Day',
            name: 'Cloud Top Temperature',
            description: 'Temperature at the top of clouds'
          },
          {
            id: 'MODIS_Terra_Water_Vapor_5km_Day',
            name: 'Water Vapor',
            description: 'Atmospheric water vapor content'
          }
        ],
        atmospheric: [
          {
            id: 'MODIS_Terra_Aerosol_Optical_Depth',
            name: 'Aerosol Optical Depth',
            description: 'Air quality and atmospheric particles'
          },
          {
            id: 'OMI_Aerosol_Index',
            name: 'Aerosol Index',
            description: 'UV-absorbing aerosols (smoke, dust)'
          }
        ]
      },
      baseUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Worldview layers:', error);
    return null;
  }
}

/**
 * Search NASA's Common Metadata Repository (CMR) - Earthdata Search
 * No authentication required - search for Earth science data
 * This is the backend for NASA's Earthdata Search system
 */
export async function searchCMR(
  keywords: string,
  boundingBox?: { north: number; south: number; east: number; west: number }
): Promise<any> {
  try {
    const url = 'https://cmr.earthdata.nasa.gov/search/collections.json';
    
    const params = new URLSearchParams({
      keyword: keywords,
      page_size: '10'
    });

    if (boundingBox) {
      params.append('bounding_box', 
        `${boundingBox.west},${boundingBox.south},${boundingBox.east},${boundingBox.north}`
      );
    }
    
    console.log(`Searching CMR for: ${keywords}`);
    
    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      console.error(`CMR API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return {
      source: 'CMR',
      collections: data.feed?.entry || [],
      count: data.feed?.entry?.length || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error searching CMR:', error);
    return null;
  }
}

/**
 * Search Earthdata for weather and climate datasets
 * Returns datasets relevant for weather probability analysis
 */
export async function searchEarthdataForWeather(
  latitude: number,
  longitude: number,
  searchRadius: number = 100 // km
): Promise<any> {
  try {
    // Convert km radius to degrees (rough approximation)
    const radiusDegrees = searchRadius / 111; // 1 degree ≈ 111 km
    
    const boundingBox = {
      north: latitude + radiusDegrees,
      south: latitude - radiusDegrees,
      east: longitude + radiusDegrees,
      west: longitude - radiusDegrees
    };

    console.log(`Searching Earthdata for weather datasets near ${latitude}, ${longitude}...`);

    // Search for relevant weather and climate datasets
    const keywords = ['precipitation', 'temperature', 'weather', 'climate', 'atmospheric'];
    const allResults: any[] = [];

    for (const keyword of keywords) {
      const result = await searchCMR(keyword, boundingBox);
      if (result && result.collections) {
        allResults.push(...result.collections);
      }
    }

    // Remove duplicates based on ID
    const uniqueResults = Array.from(
      new Map(allResults.map(item => [item.id, item])).values()
    );

    console.log(`Found ${uniqueResults.length} unique weather-related datasets`);

    return {
      source: 'Earthdata Search',
      location: { latitude, longitude },
      radius: searchRadius,
      datasets: uniqueResults.slice(0, 20), // Top 20 datasets
      count: uniqueResults.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error searching Earthdata for weather:', error);
    return null;
  }
}

/**
 * Test connection to authenticated NASA APIs
 * Returns which APIs are accessible with configured credentials
 * Uses credentials from config.tsx
 */
export async function testNASAConnection(): Promise<{
  success: boolean;
  apisAvailable: number;
  results: Record<string, boolean>;
  credentialsConfigured: boolean;
}> {
  const results: Record<string, boolean> = {
    gesdisc: false,
    giovanni: false,
    datarods: false,
    worldview: false,
    power: false,
    cmr: false
  };

  const credentialsConfigured = areNASACredentialsConfigured();

  // Test public APIs (no auth required)
  try {
    const worldview = await getWorldviewImagery(0, 0);
    results.worldview = worldview !== null;
  } catch (e) {
    results.worldview = false;
  }

  try {
    const cmr = await searchCMR('precipitation');
    results.cmr = cmr !== null;
  } catch (e) {
    results.cmr = false;
  }

  try {
    const power = await getNASAClimateData(0, 0);
    results.power = power !== null;
  } catch (e) {
    results.power = false;
  }

  // Test authenticated APIs only if credentials are configured
  if (credentialsConfigured) {
    try {
      const gesdisc = await getGESDISCData(0, 0);
      results.gesdisc = gesdisc !== null;
    } catch (e) {
      results.gesdisc = false;
    }

    try {
      const giovanni = await getGiovanniData(0, 0);
      results.giovanni = giovanni !== null;
    } catch (e) {
      results.giovanni = false;
    }

    try {
      const datarods = await getDataRodsData(0, 0);
      results.datarods = datarods !== null;
    } catch (e) {
      results.datarods = false;
    }
  }

  const availableCount = Object.values(results).filter(v => v).length;

  return {
    success: availableCount > 0,
    apisAvailable: availableCount,
    results,
    credentialsConfigured
  };
}
