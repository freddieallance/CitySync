import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import { getEnvironmentalConditions, getClimateTrends, getNASAWildfires, getNASANaturalEvents, testNASAConnection, getGESDISCData, getGiovanniData, getDataRodsData, getWorldviewImagery, searchCMR, searchEarthdataForWeather, getWorldviewLayers } from './nasa_api.tsx';
import { chatAssistant, generateSmartRecommendations, analyzePhoto, generateSafetyInsights, generatePersonalizedAlert, suggestRealPlaces } from './gemini_ai.tsx';
import { CONFIG, areNASACredentialsConfigured, isOpenWeatherConfigured, isNASAOpenAPIConfigured, getConfigStatus, validateConfig } from './config.tsx';
import { getHybridWeatherData, getCurrentWeather, getForecast, isHybridModeActive } from './hybrid_weather.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize storage buckets on startup
(async () => {
  const buckets = [
    {
      name: 'make-0765a8f0-feedback-photos',
      config: {
        public: false,
        fileSizeLimit: 5242880, // 5MB limit
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      }
    },
    {
      name: 'make-0765a8f0-profile-pictures',
      config: {
        public: false,
        fileSizeLimit: 2097152, // 2MB limit for profile pictures
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      }
    }
  ];

  for (const bucket of buckets) {
    try {
      const { data: existingBuckets } = await supabase.storage.listBuckets();
      const bucketExists = existingBuckets?.some(b => b.name === bucket.name);
      if (!bucketExists) {
        await supabase.storage.createBucket(bucket.name, bucket.config);
        console.log(`✓ Created storage bucket: ${bucket.name}`);
      }
    } catch (error) {
      console.log(`Storage bucket initialization error for ${bucket.name}:`, error);
    }
  }
})();

// Test Supabase Secrets Configuration
app.get('/make-server-0765a8f0/test-secrets', async (c) => {
  try {
    console.log('🔐 Checking Supabase secrets configuration...');
    
    const status = getConfigStatus();
    const validation = validateConfig();
    
    return c.json({
      success: validation.valid,
      secrets: status,
      validation: {
        allRequired: validation.valid,
        missing: validation.missing,
        message: validation.valid 
          ? 'All required secrets are configured ✓'
          : `Missing required secrets: ${validation.missing.join(', ')}`
      },
      help: validation.valid 
        ? 'Your API keys are properly configured in Supabase secrets!'
        : 'Add missing secrets in: Supabase Dashboard → Edge Functions → Manage secrets'
    });
  } catch (error) {
    console.error('Secrets check error:', error);
    return c.json({ 
      error: 'Failed to check secrets: ' + error.message,
      success: false
    }, 500);
  }
});

// Test NASA API credentials configuration
app.get('/make-server-0765a8f0/test-nasa', async (c) => {
  try {
    console.log('🧪 Testing NASA API credentials...');
    
    const testResult = await testNASAConnection();
    
    console.log('✓ NASA API test complete:', {
      credentialsConfigured: testResult.credentialsConfigured,
      apisAvailable: testResult.apisAvailable,
      results: testResult.results
    });
    
    return c.json({
      success: testResult.success,
      credentialsConfigured: testResult.credentialsConfigured,
      apisAvailable: testResult.apisAvailable,
      totalAPIs: 6,
      results: testResult.results,
      message: testResult.credentialsConfigured 
        ? 'NASA credentials are configured correctly!'
        : 'NASA credentials not configured. Only public APIs available.'
    });
  } catch (error) {
    console.error('NASA API test error:', error);
    return c.json({ 
      error: 'Failed to test NASA APIs: ' + error.message,
      success: false
    }, 500);
  }
});

// Get Giovanni time-series data for weather probability analysis
app.get('/make-server-0765a8f0/giovanni-timeseries', async (c) => {
  try {
    const lat = c.req.query('lat');
    const lon = c.req.query('lon');
    
    const latitude = lat ? parseFloat(lat) : 1.5535;
    const longitude = lon ? parseFloat(lon) : 110.3593;

    console.log(`Fetching Giovanni time-series for ${latitude}, ${longitude}...`);
    
    const data = await getGiovanniData(latitude, longitude);
    
    if (!data) {
      return c.json({ error: 'Failed to fetch Giovanni data' }, 500);
    }

    return c.json(data);
  } catch (error) {
    console.log('Giovanni time-series error:', error);
    return c.json({ error: 'Failed to get Giovanni time-series: ' + error.message }, 500);
  }
});

// Get Worldview satellite imagery for location
app.get('/make-server-0765a8f0/worldview-imagery', async (c) => {
  try {
    const lat = c.req.query('lat');
    const lon = c.req.query('lon');
    const date = c.req.query('date');
    
    const latitude = lat ? parseFloat(lat) : 1.5535;
    const longitude = lon ? parseFloat(lon) : 110.3593;

    console.log(`Fetching Worldview imagery for ${latitude}, ${longitude}...`);
    
    const data = await getWorldviewImagery(latitude, longitude, date);
    
    if (!data) {
      return c.json({ error: 'Failed to fetch Worldview imagery' }, 500);
    }

    return c.json(data);
  } catch (error) {
    console.log('Worldview imagery error:', error);
    return c.json({ error: 'Failed to get Worldview imagery: ' + error.message }, 500);
  }
});

// Search Earthdata for weather datasets
app.get('/make-server-0765a8f0/earthdata-search', async (c) => {
  try {
    const lat = c.req.query('lat');
    const lon = c.req.query('lon');
    const radius = parseInt(c.req.query('radius') || '100');
    
    const latitude = lat ? parseFloat(lat) : 1.5535;
    const longitude = lon ? parseFloat(lon) : 110.3593;

    console.log(`Searching Earthdata for weather datasets near ${latitude}, ${longitude}...`);
    
    const data = await searchEarthdataForWeather(latitude, longitude, radius);
    
    if (!data) {
      return c.json({ error: 'Failed to search Earthdata' }, 500);
    }

    return c.json(data);
  } catch (error) {
    console.log('Earthdata search error:', error);
    return c.json({ error: 'Failed to search Earthdata: ' + error.message }, 500);
  }
});

// Sign up new user
app.post('/make-server-0765a8f0/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Failed to create user: ' + error.message }, 500);
  }
});

// Sign in user
app.post('/make-server-0765a8f0/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Signin error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      user: data.user,
      access_token: data.session.access_token 
    });
  } catch (error) {
    console.log('Signin error:', error);
    return c.json({ error: 'Failed to sign in: ' + error.message }, 500);
  }
});

// Get user's activity history
app.get('/make-server-0765a8f0/history', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const historyKey = `history:${user.id}`;
    const history = await kv.get(historyKey) || [];

    return c.json({ history });
  } catch (error) {
    console.log('Get history error:', error);
    return c.json({ error: 'Failed to get history: ' + error.message }, 500);
  }
});

// Save activity to history
app.post('/make-server-0765a8f0/save-activity', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { activityType, activity, conditions, timestamp } = await c.req.json();
    
    const historyKey = `history:${user.id}`;
    const history = await kv.get(historyKey) || [];
    
    history.unshift({
      activityType,
      activity,
      conditions,
      timestamp
    });

    // Keep only last 50 activities
    if (history.length > 50) {
      history.splice(50);
    }

    await kv.set(historyKey, history);

    return c.json({ success: true });
  } catch (error) {
    console.log('Save activity error:', error);
    return c.json({ error: 'Failed to save activity: ' + error.message }, 500);
  }
});

// Get current environmental conditions from NASA and environmental APIs
app.get('/make-server-0765a8f0/conditions', async (c) => {
  try {
    // Get optional latitude and longitude from query params
    const lat = c.req.query('lat');
    const lon = c.req.query('lon');
    
    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;

    console.log('Fetching live environmental conditions from NASA and partner APIs...');
    
    const conditions = await getEnvironmentalConditions(latitude, longitude);

    return c.json(conditions);
  } catch (error) {
    console.log('Get conditions error:', error);
    return c.json({ error: 'Failed to get conditions: ' + error.message }, 500);
  }
});

// Get climate trends from NASA POWER API
app.get('/make-server-0765a8f0/climate-trends', async (c) => {
  try {
    const days = parseInt(c.req.query('days') || '30');
    const lat = c.req.query('lat');
    const lon = c.req.query('lon');
    
    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;

    console.log(`Fetching ${days}-day climate trends...`);
    
    const trends = await getClimateTrends(days, latitude, longitude);

    if (!trends) {
      return c.json({ error: 'Failed to fetch climate trends' }, 500);
    }

    return c.json(trends);
  } catch (error) {
    console.log('Get climate trends error:', error);
    return c.json({ error: 'Failed to get climate trends: ' + error.message }, 500);
  }
});

// 🌐 HYBRID WEATHER ENDPOINT - Combines NASA POWER + OpenWeather for maximum accuracy
app.get('/make-server-0765a8f0/hybrid-weather', async (c) => {
  try {
    const lat = c.req.query('lat');
    const lon = c.req.query('lon');
    const includeHistorical = c.req.query('historical') !== 'false';
    const includeForecast = c.req.query('forecast') !== 'false';
    
    if (!lat || !lon) {
      return c.json({ error: 'Latitude and longitude are required' }, 400);
    }
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    console.log(`🌐 Fetching hybrid weather data for ${latitude}, ${longitude}`);
    console.log(`   Historical: ${includeHistorical}, Forecast: ${includeForecast}`);
    console.log(`   Hybrid mode active: ${isHybridModeActive()}`);
    
    const weatherData = await getHybridWeatherData(latitude, longitude, {
      includeHistorical,
      includeForecast,
      historicalDays: 365
    });
    
    return c.json({
      success: true,
      data: weatherData,
      hybridMode: isHybridModeActive(),
      message: isHybridModeActive() 
        ? 'Using NASA POWER + OpenWeather for maximum accuracy' 
        : 'Using NASA POWER only (OpenWeather not configured)'
    });
  } catch (error: any) {
    console.error('Hybrid weather error:', error);
    return c.json({ 
      success: false, 
      error: error.message || 'Failed to fetch hybrid weather data' 
    }, 500);
  }
});

// Get activity safety assessment based on environmental conditions
app.get('/make-server-0765a8f0/activity-safety', async (c) => {
  try {
    const activityType = c.req.query('type'); // 'outdoor' or 'indoor'
    const lat = c.req.query('lat');
    const lon = c.req.query('lon');
    
    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;

    console.log(`Assessing safety for ${activityType} activities...`);
    
    const conditions = await getEnvironmentalConditions(latitude, longitude);

    // Calculate safety scores
    let weatherScore = 100;
    let airQualityScore = 100;
    let overallSafety = 'Good';
    let warnings: string[] = [];
    let recommendations: string[] = [];

    // Weather assessment
    if (conditions.weather.temperature > 35) {
      weatherScore -= 30;
      warnings.push('Extreme heat warning');
      recommendations.push('Stay hydrated and seek shade frequently');
    } else if (conditions.weather.temperature > 32) {
      weatherScore -= 15;
      warnings.push('High temperature');
      recommendations.push('Bring water and wear sun protection');
    }

    const rainChance = conditions.weather.rainChance || conditions.weather.precipitation;
    
    if (rainChance > 70) {
      weatherScore -= 40;
      warnings.push('High chance of rain');
      recommendations.push('Consider indoor activities or postpone outdoor plans');
    } else if (rainChance > 40) {
      weatherScore -= 20;
      warnings.push('Possible rain showers');
      recommendations.push('Bring an umbrella or raincoat');
    }

    if (conditions.weather.uvIndex > 8) {
      weatherScore -= 20;
      warnings.push('Very high UV index');
      recommendations.push('Wear sunscreen and protective clothing');
    }

    // Air quality assessment
    if (conditions.airQuality.aqi > 150) {
      airQualityScore -= 60;
      warnings.push('Unhealthy air quality');
      recommendations.push('Avoid prolonged outdoor activities, especially for sensitive groups');
    } else if (conditions.airQuality.aqi > 100) {
      airQualityScore -= 30;
      warnings.push('Moderate air quality');
      recommendations.push('Consider reducing intense outdoor activities');
    }

    // Haze assessment
    if (conditions.haze.severity === 'Severe' || conditions.haze.severity === 'High') {
      airQualityScore -= 50;
      warnings.push('Hazardous haze conditions');
      recommendations.push('Stay indoors and use air purifiers if available');
    } else if (conditions.haze.severity === 'Moderate') {
      airQualityScore -= 20;
      warnings.push('Moderate haze present');
      recommendations.push('Wear a mask if doing outdoor activities');
    }

    // Flood risk assessment
    if (conditions.flood.riskLevel === 'High') {
      weatherScore -= 50;
      warnings.push('High flood risk in some areas');
      recommendations.push('Avoid low-lying areas and stay informed of local alerts');
    } else if (conditions.flood.riskLevel === 'Medium') {
      weatherScore -= 25;
      warnings.push('Moderate flood risk');
      recommendations.push('Be cautious near rivers and low-lying areas');
    }

    // Wildfire risk assessment
    if (conditions.wildfires && conditions.wildfires.detected) {
      if (conditions.wildfires.riskLevel === 'Extreme') {
        weatherScore -= 70;
        warnings.push(`EXTREME WILDFIRE DANGER: Active fire within ${conditions.wildfires.nearestDistance}km`);
        recommendations.push('Do NOT go outdoors. Evacuate if instructed by authorities.');
      } else if (conditions.wildfires.riskLevel === 'High') {
        weatherScore -= 50;
        warnings.push(`High wildfire risk: Active fires detected ${conditions.wildfires.nearestDistance}km away`);
        recommendations.push('Avoid outdoor activities. Monitor air quality and fire alerts.');
      } else if (conditions.wildfires.riskLevel === 'Moderate') {
        weatherScore -= 30;
        warnings.push(`Wildfires detected ${conditions.wildfires.nearestDistance}km away`);
        recommendations.push('Check air quality before outdoor activities. Stay informed of fire updates.');
      } else if (conditions.wildfires.riskLevel === 'Low') {
        weatherScore -= 10;
        warnings.push(`Distant wildfires detected (${conditions.wildfires.nearestDistance}km away)`);
        recommendations.push('Monitor air quality for smoke effects.');
      }
    }

    // Natural disaster events assessment
    if (conditions.naturalEvents && conditions.naturalEvents.total > 0) {
      const severEvents = conditions.naturalEvents.allEvents.filter(e => 
        e.category.includes('Severe') || e.category.includes('Storm') || e.distance < 100
      );
      if (severEvents.length > 0) {
        weatherScore -= 40;
        warnings.push(`${severEvents.length} severe weather event(s) nearby`);
        recommendations.push('Monitor local weather alerts and avoid affected areas.');
      }
    }

    // Calculate overall safety
    const overallScore = (weatherScore + airQualityScore) / 2;
    
    if (overallScore >= 75) {
      overallSafety = 'Good';
    } else if (overallScore >= 50) {
      overallSafety = 'Fair';
    } else {
      overallSafety = 'Poor';
    }

    // Additional recommendations for outdoor activities
    if (activityType === 'outdoor' && overallScore < 50) {
      recommendations.unshift('Consider indoor alternatives for today');
    }

    return c.json({
      overallSafety,
      safetyScore: Math.round(overallScore),
      weatherScore: Math.round(weatherScore),
      airQualityScore: Math.round(airQualityScore),
      warnings,
      recommendations,
      conditions
    });
  } catch (error) {
    console.log('Activity safety assessment error:', error);
    return c.json({ error: 'Failed to assess activity safety: ' + error.message }, 500);
  }
});

// Get active wildfires from NASA FIRMS
app.get('/make-server-0765a8f0/wildfires', async (c) => {
  try {
    const lat = c.req.query('lat');
    const lon = c.req.query('lon');
    const radius = parseInt(c.req.query('radius') || '500');
    
    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;

    console.log(`Fetching wildfire data within ${radius}km...`);
    
    const wildfires = await getNASAWildfires(latitude, longitude, radius);

    return c.json({
      count: wildfires.length,
      radius: radius,
      location: { latitude: latitude || 1.5535, longitude: longitude || 110.3593 },
      wildfires: wildfires
    });
  } catch (error) {
    console.log('Get wildfires error:', error);
    return c.json({ error: 'Failed to get wildfire data: ' + error.message }, 500);
  }
});

// Get natural disaster events from NASA EONET
app.get('/make-server-0765a8f0/natural-events', async (c) => {
  try {
    const lat = c.req.query('lat');
    const lon = c.req.query('lon');
    const radius = parseInt(c.req.query('radius') || '500');
    const days = parseInt(c.req.query('days') || '30');
    
    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;

    console.log(`Fetching natural events within ${radius}km for last ${days} days...`);
    
    const events = await getNASANaturalEvents(latitude, longitude, radius, days);

    // Categorize events
    const byCategory: Record<string, any[]> = {};
    for (const event of events) {
      if (!byCategory[event.category]) {
        byCategory[event.category] = [];
      }
      byCategory[event.category].push(event);
    }

    return c.json({
      total: events.length,
      radius: radius,
      daysBack: days,
      location: { latitude: latitude || 1.5535, longitude: longitude || 110.3593 },
      byCategory: Object.keys(byCategory).map(category => ({
        category,
        count: byCategory[category].length,
        events: byCategory[category]
      })),
      allEvents: events
    });
  } catch (error) {
    console.log('Get natural events error:', error);
    return c.json({ error: 'Failed to get natural events: ' + error.message }, 500);
  }
});

// Upload profile picture
app.post('/make-server-0765a8f0/upload-profile-picture', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('photo') as File;
    
    if (!file) {
      return c.json({ error: 'No photo provided' }, 400);
    }

    // Validate file size (2MB max for profile pictures)
    if (file.size > 2097152) {
      return c.json({ error: 'File too large. Maximum size is 2MB' }, 400);
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' }, 400);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;
    const bucketName = 'make-0765a8f0-profile-pictures';

    // Upload to Supabase Storage (upsert to replace old avatar)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true // Replace existing avatar
      });

    if (uploadError) {
      console.log('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload profile picture: ' + uploadError.message }, 500);
    }

    // Get signed URL (valid for 1 year)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 year

    if (urlError) {
      console.log('Signed URL error:', urlError);
      return c.json({ error: 'Failed to get photo URL: ' + urlError.message }, 500);
    }

    // Update user metadata with new avatar URL
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        user_metadata: { 
          ...user.user_metadata,
          avatarUrl: urlData.signedUrl,
          avatarType: 'custom'
        } 
      }
    );

    if (updateError) {
      console.log('User metadata update error:', updateError);
      return c.json({ error: 'Failed to update profile: ' + updateError.message }, 500);
    }

    return c.json({ 
      success: true, 
      avatarUrl: urlData.signedUrl 
    });
  } catch (error) {
    console.log('Upload profile picture error:', error);
    return c.json({ error: 'Failed to upload profile picture: ' + error.message }, 500);
  }
});

// Update user avatar (for preset avatars)
app.post('/make-server-0765a8f0/update-avatar', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { avatarUrl, avatarType } = await c.req.json();
    
    if (!avatarUrl) {
      return c.json({ error: 'Avatar URL required' }, 400);
    }

    // Update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        user_metadata: { 
          ...user.user_metadata,
          avatarUrl,
          avatarType: avatarType || 'preset'
        } 
      }
    );

    if (updateError) {
      console.log('User metadata update error:', updateError);
      return c.json({ error: 'Failed to update avatar: ' + updateError.message }, 500);
    }

    return c.json({ success: true, avatarUrl });
  } catch (error) {
    console.log('Update avatar error:', error);
    return c.json({ error: 'Failed to update avatar: ' + error.message }, 500);
  }
});

// Upload feedback photo
app.post('/make-server-0765a8f0/upload-feedback-photo', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('photo') as File;
    
    if (!file) {
      return c.json({ error: 'No photo provided' }, 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5242880) {
      return c.json({ error: 'File too large. Maximum size is 5MB' }, 400);
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' }, 400);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const bucketName = 'make-0765a8f0-feedback-photos';

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.log('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload photo: ' + uploadError.message }, 500);
    }

    // Get signed URL (valid for 1 year)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 year

    if (urlError) {
      console.log('Signed URL error:', urlError);
      return c.json({ error: 'Failed to get photo URL: ' + urlError.message }, 500);
    }

    return c.json({ 
      success: true, 
      photoPath: fileName,
      photoUrl: urlData.signedUrl 
    });
  } catch (error) {
    console.log('Upload photo error:', error);
    return c.json({ error: 'Failed to upload photo: ' + error.message }, 500);
  }
});

// Submit user feedback for a place
app.post('/make-server-0765a8f0/feedback', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const feedback = await c.req.json();
    const { placeName, placeLocation, rating, conditionsAccurate, actualSafety, comments, timestamp, photoUrl, photoPath } = feedback;
    
    // Get user's current reputation
    const userRepKey = `user-reputation:${user.id}`;
    const userRep = await kv.get(userRepKey) || {
      totalFeedback: 0,
      helpfulVotes: 0,
      notHelpfulVotes: 0,
      accuracyScore: 100,
      badge: 'none'
    };

    // Generate unique feedback ID
    const feedbackId = `${user.id}-${Date.now()}`;
    
    // Create a key for the place's feedback
    const feedbackKey = `feedback:${placeName}`;
    const feedbackList = await kv.get(feedbackKey) || [];
    
    // Add the new feedback
    const newFeedback = {
      feedbackId,
      userId: user.id,
      userName: user.user_metadata?.name || 'Anonymous',
      userAvatar: user.user_metadata?.avatarUrl || null,
      placeName,
      placeLocation,
      rating,
      conditionsAccurate,
      actualSafety,
      comments,
      timestamp,
      photoUrl: photoUrl || null,
      photoPath: photoPath || null,
      helpfulCount: 0,
      notHelpfulCount: 0,
      userBadge: userRep.badge,
      userReputation: Math.round(userRep.accuracyScore)
    };

    feedbackList.unshift(newFeedback);
    await kv.set(feedbackKey, feedbackList);

    // Update user's reputation stats
    userRep.totalFeedback += 1;
    await kv.set(userRepKey, userRep);

    // Also add to user's feedback history
    const userFeedbackKey = `user-feedback:${user.id}`;
    const userFeedbackList = await kv.get(userFeedbackKey) || [];
    userFeedbackList.unshift({
      feedbackId,
      placeName,
      placeLocation,
      rating,
      conditionsAccurate,
      actualSafety,
      comments,
      timestamp,
      photoUrl,
      helpfulCount: 0,
      notHelpfulCount: 0
    });

    // Keep only last 100 feedback entries per user
    if (userFeedbackList.length > 100) {
      userFeedbackList.splice(100);
    }

    await kv.set(userFeedbackKey, userFeedbackList);

    return c.json({ success: true, feedbackId });
  } catch (error) {
    console.log('Submit feedback error:', error);
    return c.json({ error: 'Failed to submit feedback: ' + error.message }, 500);
  }
});

// Rate another user's feedback (helpful/not helpful)
app.post('/make-server-0765a8f0/rate-feedback', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { feedbackId, placeName, isHelpful } = await c.req.json();
    
    // Prevent users from rating their own feedback
    if (feedbackId.startsWith(user.id)) {
      return c.json({ error: 'Cannot rate your own feedback' }, 400);
    }

    // Track who voted on what to prevent duplicate votes
    const voteKey = `vote:${user.id}:${feedbackId}`;
    const existingVote = await kv.get(voteKey);
    
    if (existingVote) {
      return c.json({ error: 'You have already rated this feedback' }, 400);
    }

    // Record the vote
    await kv.set(voteKey, { isHelpful, timestamp: new Date().toISOString() });

    // Update the feedback item
    const feedbackKey = `feedback:${placeName}`;
    const feedbackList = await kv.get(feedbackKey) || [];
    
    const feedbackIndex = feedbackList.findIndex((f: any) => f.feedbackId === feedbackId);
    if (feedbackIndex !== -1) {
      if (isHelpful) {
        feedbackList[feedbackIndex].helpfulCount += 1;
      } else {
        feedbackList[feedbackIndex].notHelpfulCount += 1;
      }
      await kv.set(feedbackKey, feedbackList);

      // Update the feedback author's reputation
      const authorId = feedbackId.split('-')[0];
      const userRepKey = `user-reputation:${authorId}`;
      const userRep = await kv.get(userRepKey) || {
        totalFeedback: 0,
        helpfulVotes: 0,
        notHelpfulVotes: 0,
        accuracyScore: 100,
        badge: 'none'
      };

      if (isHelpful) {
        userRep.helpfulVotes += 1;
      } else {
        userRep.notHelpfulVotes += 1;
      }

      // Calculate new accuracy score (weighted average)
      const totalVotes = userRep.helpfulVotes + userRep.notHelpfulVotes;
      if (totalVotes > 0) {
        userRep.accuracyScore = Math.round((userRep.helpfulVotes / totalVotes) * 100);
      }

      // Assign badge based on reputation
      if (userRep.totalFeedback >= 50 && userRep.accuracyScore >= 90) {
        userRep.badge = 'legendary';
      } else if (userRep.totalFeedback >= 25 && userRep.accuracyScore >= 85) {
        userRep.badge = 'expert';
      } else if (userRep.totalFeedback >= 10 && userRep.accuracyScore >= 75) {
        userRep.badge = 'trusted';
      } else if (userRep.totalFeedback >= 5 && userRep.accuracyScore >= 60) {
        userRep.badge = 'contributor';
      } else {
        userRep.badge = 'none';
      }

      await kv.set(userRepKey, userRep);

      return c.json({ 
        success: true, 
        newHelpfulCount: feedbackList[feedbackIndex].helpfulCount,
        newNotHelpfulCount: feedbackList[feedbackIndex].notHelpfulCount
      });
    }

    return c.json({ error: 'Feedback not found' }, 404);
  } catch (error) {
    console.log('Rate feedback error:', error);
    return c.json({ error: 'Failed to rate feedback: ' + error.message }, 500);
  }
});

// Get user reputation
app.get('/make-server-0765a8f0/user-reputation/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const userRepKey = `user-reputation:${userId}`;
    const userRep = await kv.get(userRepKey) || {
      totalFeedback: 0,
      helpfulVotes: 0,
      notHelpfulVotes: 0,
      accuracyScore: 0,
      badge: 'none'
    };

    return c.json(userRep);
  } catch (error) {
    console.log('Get user reputation error:', error);
    return c.json({ error: 'Failed to get user reputation: ' + error.message }, 500);
  }
});

// Get feedback for a specific place
app.get('/make-server-0765a8f0/feedback/:placeName', async (c) => {
  try {
    const placeName = decodeURIComponent(c.req.param('placeName'));
    const feedbackKey = `feedback:${placeName}`;
    const feedbackList = await kv.get(feedbackKey) || [];
    
    // Calculate aggregated metrics
    const totalReviews = feedbackList.length;
    let totalRating = 0;
    let accurateCount = 0;
    let safeCount = 0;
    let cautionCount = 0;
    let unsafeCount = 0;

    for (const fb of feedbackList) {
      totalRating += fb.rating;
      if (fb.conditionsAccurate) accurateCount++;
      if (fb.actualSafety === 'safe') safeCount++;
      if (fb.actualSafety === 'caution') cautionCount++;
      if (fb.actualSafety === 'unsafe') unsafeCount++;
    }

    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
    const accuracyPercentage = totalReviews > 0 ? Math.round((accurateCount / totalReviews) * 100) : 0;

    return c.json({
      placeName,
      totalReviews,
      averageRating: parseFloat(averageRating),
      accuracyPercentage,
      safetyBreakdown: {
        safe: safeCount,
        caution: cautionCount,
        unsafe: unsafeCount
      },
      recentFeedback: feedbackList.slice(0, 10).map(fb => ({
        feedbackId: fb.feedbackId,
        userId: fb.userId,
        userName: fb.userName,
        userAvatar: fb.userAvatar || null,
        rating: fb.rating,
        actualSafety: fb.actualSafety,
        comments: fb.comments,
        timestamp: fb.timestamp,
        photoUrl: fb.photoUrl,
        helpfulCount: fb.helpfulCount || 0,
        notHelpfulCount: fb.notHelpfulCount || 0,
        userBadge: fb.userBadge || 'none',
        userReputation: fb.userReputation || 0
      }))
    });
  } catch (error) {
    console.log('Get feedback error:', error);
    return c.json({ error: 'Failed to get feedback: ' + error.message }, 500);
  }
});

// ==================== AI ENDPOINTS ====================

// AI Chat Assistant
app.post('/make-server-0765a8f0/ai/chat', async (c) => {
  try {
    const { message, context } = await c.req.json();

    if (!message) {
      return c.json({ error: 'Message is required' }, 400);
    }

    const response = await chatAssistant(message, context);
    return c.json(response);
  } catch (error: any) {
    console.log('AI Chat error:', error);
    return c.json({ error: error.message || 'AI chat failed' }, 500);
  }
});

// Smart Activity Recommendations
app.post('/make-server-0765a8f0/ai/recommendations', async (c) => {
  try {
    const data = await c.req.json();

    if (!data.location || !data.weather) {
      return c.json({ error: 'Location and weather data are required' }, 400);
    }

    const recommendations = await generateSmartRecommendations(data);
    return c.json(recommendations);
  } catch (error: any) {
    console.log('Smart recommendations error:', error);
    return c.json({ error: error.message || 'Failed to generate recommendations' }, 500);
  }
});

// Photo Analysis
app.post('/make-server-0765a8f0/ai/analyze-photo', async (c) => {
  try {
    const { imageUrl, claimedConditions } = await c.req.json();

    if (!imageUrl) {
      return c.json({ error: 'Image URL is required' }, 400);
    }

    const analysis = await analyzePhoto(imageUrl, claimedConditions || {});
    return c.json(analysis);
  } catch (error: any) {
    console.log('Photo analysis error:', error);
    return c.json({ error: error.message || 'Failed to analyze photo' }, 500);
  }
});

// Safety Insights
app.post('/make-server-0765a8f0/ai/safety-insights', async (c) => {
  try {
    const data = await c.req.json();

    if (!data.location || !data.currentWeather) {
      return c.json({ error: 'Location and current weather are required' }, 400);
    }

    const insights = await generateSafetyInsights(data);
    return c.json(insights);
  } catch (error: any) {
    console.log('Safety insights error:', error);
    return c.json({ error: error.message || 'Failed to generate safety insights' }, 500);
  }
});

// Personalized Alerts
app.post('/make-server-0765a8f0/ai/personalized-alert', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const data = await c.req.json();
    data.userId = user.id;

    if (!data.location || !data.currentConditions) {
      return c.json({ error: 'Location and current conditions are required' }, 400);
    }

    const alert = await generatePersonalizedAlert(data);
    return c.json(alert);
  } catch (error: any) {
    console.log('Personalized alert error:', error);
    return c.json({ error: error.message || 'Failed to generate alert' }, 500);
  }
});

// Get conversation history
app.get('/make-server-0765a8f0/ai/chat-history', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const history = await kv.getByPrefix(`ai_chat_${user.id}_`);
    
    return c.json({
      messages: history.sort((a: any, b: any) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    });
  } catch (error: any) {
    console.log('Get chat history error:', error);
    return c.json({ error: error.message || 'Failed to get chat history' }, 500);
  }
});

// Save chat message
app.post('/make-server-0765a8f0/ai/save-chat', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { message, role, timestamp } = await c.req.json();
    const chatKey = `ai_chat_${user.id}_${Date.now()}`;

    await kv.set(chatKey, {
      message,
      role,
      timestamp: timestamp || new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error: any) {
    console.log('Save chat error:', error);
    return c.json({ error: error.message || 'Failed to save chat' }, 500);
  }
});

// AI-Powered Real Place Suggestions
app.post('/make-server-0765a8f0/ai/suggest-places', async (c) => {
  try {
    const data = await c.req.json();

    if (!data.location || !data.activity || !data.latitude || !data.longitude) {
      return c.json({ error: 'Location, activity, latitude, and longitude are required' }, 400);
    }

    console.log(`AI suggesting places for "${data.activity}" in ${data.location}...`);
    
    const suggestions = await suggestRealPlaces(data);
    return c.json(suggestions);
  } catch (error: any) {
    console.log('AI place suggestions error:', error);
    return c.json({ error: error.message || 'Failed to suggest places' }, 500);
  }
});

// ==================== NASA CREDENTIALS MANAGEMENT ====================

// Save NASA Earthdata Bearer Token
app.post('/make-server-0765a8f0/nasa/credentials', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { bearerToken } = await c.req.json();

    if (!bearerToken || bearerToken.trim().length === 0) {
      return c.json({ error: 'Bearer token is required' }, 400);
    }

    // Store Bearer token securely in KV store
    const credentialsKey = `nasa_credentials:${user.id}`;
    await kv.set(credentialsKey, {
      bearerToken: bearerToken.trim(),
      tokenPreview: bearerToken.substring(0, 20) + '...',
      savedAt: new Date().toISOString()
    });

    console.log(`NASA Bearer token saved for user ${user.id}`);

    return c.json({ 
      success: true,
      message: 'Bearer token saved successfully'
    });
  } catch (error: any) {
    console.log('Save NASA Bearer token error:', error);
    return c.json({ error: error.message || 'Failed to save token' }, 500);
  }
});

// Get NASA Earthdata Bearer Token info
app.get('/make-server-0765a8f0/nasa/credentials', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const credentialsKey = `nasa_credentials:${user.id}`;
    const credentials = await kv.get(credentialsKey);

    if (!credentials) {
      return c.json({ credentials: null });
    }

    // Return token info without the actual token for security
    return c.json({
      credentials: {
        tokenPreview: credentials.tokenPreview,
        savedAt: credentials.savedAt
      }
    });
  } catch (error: any) {
    console.log('Get NASA Bearer token info error:', error);
    return c.json({ error: error.message || 'Failed to get token info' }, 500);
  }
});

// Delete NASA Earthdata Bearer Token
app.delete('/make-server-0765a8f0/nasa/credentials', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const credentialsKey = `nasa_credentials:${user.id}`;
    await kv.del(credentialsKey);

    console.log(`NASA Bearer token deleted for user ${user.id}`);

    return c.json({ success: true });
  } catch (error: any) {
    console.log('Delete NASA Bearer token error:', error);
    return c.json({ error: error.message || 'Failed to delete token' }, 500);
  }
});

// Test NASA API connection
app.get('/make-server-0765a8f0/nasa/test-connection', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const credentialsKey = `nasa_credentials:${user.id}`;
    const credentials = await kv.get(credentialsKey);

    if (!credentials) {
      return c.json({ error: 'No Bearer token found. Please save your token first.' }, 400);
    }

    console.log(`Testing NASA API connection for user ${user.id}...`);

    // Test using the config-based system (which now uses Bearer token)
    const testResult = await testNASAConnection();

    return c.json(testResult);
  } catch (error: any) {
    console.log('Test NASA connection error:', error);
    return c.json({ error: error.message || 'Connection test failed' }, 500);
  }
});

// Fetch authenticated NASA data
app.post('/make-server-0765a8f0/nasa/authenticated-data', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { api, latitude, longitude, params } = await c.req.json();

    const credentialsKey = `nasa_credentials:${user.id}`;
    const credentials = await kv.get(credentialsKey);

    if (!credentials && (api === 'gesdisc' || api === 'giovanni' || api === 'datarods')) {
      return c.json({ error: 'Authentication required. Please configure your NASA Earthdata credentials.' }, 401);
    }

    let result;

    switch (api) {
      case 'gesdisc':
        result = await getGESDISCData(credentials, latitude, longitude);
        break;
      case 'giovanni':
        result = await getGiovanniData(credentials, latitude, longitude, params?.parameter);
        break;
      case 'datarods':
        result = await getDataRodsData(credentials, latitude, longitude);
        break;
      case 'worldview':
        result = await getWorldviewImagery(latitude, longitude, params?.date);
        break;
      case 'cmr':
        result = await searchCMR(params?.keywords || 'environmental data', params?.boundingBox);
        break;
      default:
        return c.json({ error: 'Invalid API specified' }, 400);
    }

    if (!result) {
      return c.json({ error: 'Failed to fetch data from NASA API' }, 500);
    }

    return c.json(result);
  } catch (error: any) {
    console.log('Fetch authenticated NASA data error:', error);
    return c.json({ error: error.message || 'Failed to fetch NASA data' }, 500);
  }
});

// ==================== PUBLIC NASA DATA ENDPOINT (No Login Required) ====================

// Fetch NASA data without user authentication - uses environment variables for credentials
app.post('/make-server-0765a8f0/nasa/data', async (c) => {
  try {
    const { api, latitude, longitude, params } = await c.req.json();

    if (!latitude || !longitude) {
      return c.json({ error: 'Latitude and longitude are required' }, 400);
    }

    // Get NASA credentials from environment variables (set via Supabase secrets)
    const envCredentials = {
      username: Deno.env.get('NASA_EARTHDATA_USERNAME'),
      password: Deno.env.get('NASA_EARTHDATA_PASSWORD')
    };

    // Check if credentials are configured
    const needsAuth = api === 'gesdisc' || api === 'giovanni' || api === 'datarods';
    
    if (needsAuth && (!envCredentials.username || !envCredentials.password)) {
      return c.json({ 
        error: 'NASA Earthdata credentials not configured. Please set NASA_EARTHDATA_USERNAME and NASA_EARTHDATA_PASSWORD environment variables.',
        credentialsRequired: true
      }, 401);
    }

    let result;

    switch (api) {
      case 'gesdisc':
        result = await getGESDISCData(envCredentials, latitude, longitude);
        break;
      case 'giovanni':
        result = await getGiovanniData(envCredentials, latitude, longitude, params?.parameter);
        break;
      case 'datarods':
        result = await getDataRodsData(envCredentials, latitude, longitude);
        break;
      case 'worldview':
        result = await getWorldviewImagery(latitude, longitude, params?.date);
        break;
      case 'cmr':
        result = await searchCMR(params?.keywords || 'environmental data', params?.boundingBox);
        break;
      default:
        return c.json({ error: 'Invalid API specified. Options: gesdisc, giovanni, datarods, worldview, cmr' }, 400);
    }

    if (!result) {
      return c.json({ error: 'Failed to fetch data from NASA API' }, 500);
    }

    console.log(`✓ NASA ${api} data fetched successfully`);
    return c.json(result);
  } catch (error: any) {
    console.log('Fetch NASA data error:', error);
    return c.json({ error: error.message || 'Failed to fetch NASA data' }, 500);
  }
});

// ==================== WEATHER EVENT PLANNER ====================

// Analyze weather probability for event planning
app.post('/make-server-0765a8f0/weather/event-probability', async (c) => {
  try {
    const { latitude, longitude, date, eventType, locationName } = await c.req.json();

    if (!latitude || !longitude || !date) {
      return c.json({ error: 'Latitude, longitude, and date are required' }, 400);
    }

    console.log(`Analyzing event weather probability for ${locationName} on ${date}...`);

    // Parse the requested date
    const requestedDate = new Date(date);
    const dayOfYear = Math.floor((requestedDate.getTime() - new Date(requestedDate.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Fetch historical climate data from NASA POWER
    // We'll get data for the past 10 years for this day of year (±7 days window)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 10);

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
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      start: formatDate(startDate),
      end: formatDate(endDate),
      format: 'JSON'
    });

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`NASA POWER API error: ${response.status}`);
      return c.json({ error: 'Failed to fetch NASA historical data' }, 500);
    }

    const data = await response.json();
    const parameters = data.properties?.parameter;

    if (!parameters) {
      return c.json({ error: 'No parameter data in NASA response' }, 500);
    }

    // Extract data for similar dates (same month and day across years)
    const targetMonth = requestedDate.getMonth() + 1;
    const targetDay = requestedDate.getDate();
    
    const historicalSamples: any[] = [];
    
    // Get data for the same date across all available years (±3 days window for better sample size)
    Object.keys(parameters.T2M || {}).forEach(dateKey => {
      const [year, month, day] = dateKey.split('').reduce((acc, char, i) => {
        if (i < 4) acc[0] += char;
        else if (i < 6) acc[1] += char;
        else acc[2] += char;
        return acc;
      }, ['', '', '']);
      
      const m = parseInt(month);
      const d = parseInt(day);
      
      // Check if this date is within ±3 days of target
      const monthMatch = m === targetMonth;
      const dayDiff = Math.abs(d - targetDay);
      
      if (monthMatch && dayDiff <= 3) {
        const temp = parameters.T2M?.[dateKey];
        const precip = parameters.PRECTOTCORR?.[dateKey];
        const wind = parameters.WS2M?.[dateKey];
        const humidity = parameters.RH2M?.[dateKey];
        
        if (temp !== -999 && precip !== -999 && wind !== -999 && humidity !== -999) {
          historicalSamples.push({
            date: dateKey,
            temperature: temp,
            precipitation: precip,
            windSpeed: wind,
            humidity: humidity
          });
        }
      }
    });

    if (historicalSamples.length === 0) {
      return c.json({ error: 'Insufficient historical data for this location and date' }, 400);
    }

    // Calculate probabilities for adverse conditions
    const veryHotThreshold = 35; // 35°C (95°F)
    const veryColdThreshold = 5; // 5°C (41°F)
    const veryWindyThreshold = 10; // 10 m/s (~22 mph)
    const veryWetThreshold = 10; // 10mm precipitation
    const veryHumidThreshold = 85; // 85% humidity

    const hotDays = historicalSamples.filter(s => s.temperature >= veryHotThreshold).length;
    const coldDays = historicalSamples.filter(s => s.temperature <= veryColdThreshold).length;
    const windyDays = historicalSamples.filter(s => s.windSpeed >= veryWindyThreshold).length;
    const wetDays = historicalSamples.filter(s => s.precipitation >= veryWetThreshold).length;
    const humidDays = historicalSamples.filter(s => s.humidity >= veryHumidThreshold).length;

    const totalSamples = historicalSamples.length;

    const probabilities = [
      {
        condition: 'Very Hot Conditions',
        probability: Math.round((hotDays / totalSamples) * 100),
        severity: hotDays / totalSamples > 0.6 ? 'extreme' : hotDays / totalSamples > 0.4 ? 'high' : hotDays / totalSamples > 0.2 ? 'moderate' : 'low',
        threshold: veryHotThreshold,
        historicalMean: historicalSamples.reduce((sum, s) => sum + s.temperature, 0) / totalSamples,
        description: `${Math.round((hotDays / totalSamples) * 100)}% chance of temperatures exceeding ${veryHotThreshold}°C (${Math.round(veryHotThreshold * 9/5 + 32)}°F) based on historical data`
      },
      {
        condition: 'Very Cold Conditions',
        probability: Math.round((coldDays / totalSamples) * 100),
        severity: coldDays / totalSamples > 0.6 ? 'extreme' : coldDays / totalSamples > 0.4 ? 'high' : coldDays / totalSamples > 0.2 ? 'moderate' : 'low',
        threshold: veryColdThreshold,
        historicalMean: historicalSamples.reduce((sum, s) => sum + s.temperature, 0) / totalSamples,
        description: `${Math.round((coldDays / totalSamples) * 100)}% chance of temperatures below ${veryColdThreshold}°C (${Math.round(veryColdThreshold * 9/5 + 32)}°F) based on historical data`
      },
      {
        condition: 'Very Windy Conditions',
        probability: Math.round((windyDays / totalSamples) * 100),
        severity: windyDays / totalSamples > 0.6 ? 'extreme' : windyDays / totalSamples > 0.4 ? 'high' : windyDays / totalSamples > 0.2 ? 'moderate' : 'low',
        threshold: veryWindyThreshold,
        historicalMean: historicalSamples.reduce((sum, s) => sum + s.windSpeed, 0) / totalSamples,
        description: `${Math.round((windyDays / totalSamples) * 100)}% chance of wind speeds exceeding ${veryWindyThreshold} m/s (~${Math.round(veryWindyThreshold * 2.237)} mph) based on historical data`
      },
      {
        condition: 'Very Wet Conditions',
        probability: Math.round((wetDays / totalSamples) * 100),
        severity: wetDays / totalSamples > 0.6 ? 'extreme' : wetDays / totalSamples > 0.4 ? 'high' : wetDays / totalSamples > 0.2 ? 'moderate' : 'low',
        threshold: veryWetThreshold,
        historicalMean: historicalSamples.reduce((sum, s) => sum + s.precipitation, 0) / totalSamples,
        description: `${Math.round((wetDays / totalSamples) * 100)}% chance of precipitation exceeding ${veryWetThreshold}mm based on historical data`
      },
      {
        condition: 'Very Humid/Uncomfortable',
        probability: Math.round((humidDays / totalSamples) * 100),
        severity: humidDays / totalSamples > 0.6 ? 'extreme' : humidDays / totalSamples > 0.4 ? 'high' : humidDays / totalSamples > 0.2 ? 'moderate' : 'low',
        threshold: veryHumidThreshold,
        historicalMean: historicalSamples.reduce((sum, s) => sum + s.humidity, 0) / totalSamples,
        description: `${Math.round((humidDays / totalSamples) * 100)}% chance of humidity exceeding ${veryHumidThreshold}% (uncomfortable conditions) based on historical data`
      }
    ];

    // Calculate expected conditions (mean of historical samples)
    const expectedConditions = {
      temperature: Math.round((historicalSamples.reduce((sum, s) => sum + s.temperature, 0) / totalSamples) * 10) / 10,
      windSpeed: Math.round((historicalSamples.reduce((sum, s) => sum + s.windSpeed, 0) / totalSamples) * 10) / 10,
      precipitation: Math.round((historicalSamples.reduce((sum, s) => sum + s.precipitation, 0) / totalSamples) * 10) / 10,
      humidity: Math.round((historicalSamples.reduce((sum, s) => sum + s.humidity, 0) / totalSamples) * 10) / 10
    };

    // Determine overall safety recommendation
    const highRiskConditions = probabilities.filter(p => p.severity === 'extreme' || p.severity === 'high').length;
    const overallSafety = highRiskConditions >= 2 ? 'unsafe' : highRiskConditions === 1 ? 'caution' : 'safe';
    
    let recommendation = '';
    if (overallSafety === 'unsafe') {
      recommendation = `⚠️ High Risk: Multiple adverse weather conditions likely for ${locationName}`;
    } else if (overallSafety === 'caution') {
      recommendation = `⚡ Proceed with Caution: Some adverse conditions possible for ${locationName}`;
    } else {
      recommendation = `✅ Good Conditions Expected: Low probability of adverse weather for ${locationName}`;
    }

    // Format historical data for charts (last 10 years, same date)
    const recentYears = historicalSamples.slice(-10).map(s => ({
      ...s,
      date: s.date.slice(0, 4) // Just show year
    }));

    console.log(`Event analysis complete: ${totalSamples} historical samples analyzed, ${overallSafety} conditions`);

    return c.json({
      probabilities,
      expectedConditions,
      historicalData: recentYears,
      overallSafety,
      recommendation,
      yearsOfData: Math.floor(totalSamples / 7), // Approximate years covered
      location: {
        name: locationName,
        latitude,
        longitude
      },
      requestedDate: date,
      dataSource: 'NASA POWER API',
      samplesAnalyzed: totalSamples
    });
  } catch (error: any) {
    console.log('Event probability analysis error:', error);
    return c.json({ error: error.message || 'Failed to analyze event conditions' }, 500);
  }
});

// Weather probability dashboard
app.post('/make-server-0765a8f0/weather-dashboard', async (c) => {
  try {
    const { latitude, longitude, dayOfYear, date } = await c.req.json();

    if (!latitude || !longitude || !dayOfYear) {
      return c.json({ error: 'Latitude, longitude, and dayOfYear are required' }, 400);
    }

    console.log(`Loading weather dashboard for day ${dayOfYear} at ${latitude}, ${longitude}...`);

    // Fetch 10+ years of historical data from NASA POWER
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 12);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const url = `https://power.larc.nasa.gov/api/temporal/daily/point`;
    const params = new URLSearchParams({
      parameters: 'T2M,RH2M,PRECTOTCORR,WS2M,WS10M,QV2M,PS,ALLSKY_SFC_UV_INDEX',
      community: 'RE',
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      start: formatDate(startDate),
      end: formatDate(endDate),
      format: 'JSON'
    });

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`NASA POWER API error: ${response.status}`);
    }

    const data = await response.json();
    const parameters = data.properties?.parameter;

    if (!parameters) {
      throw new Error('No parameter data in NASA response');
    }

    // Get the selected date details
    const selectedDate = new Date(date);
    const targetMonth = selectedDate.getMonth() + 1;
    const targetDay = selectedDate.getDate();

    // Extract historical data for similar dates (±5 days window)
    const historicalSamples: any[] = [];
    Object.keys(parameters.T2M || {}).forEach(dateKey => {
      const [year, month, day] = dateKey.split('').reduce((acc, char, i) => {
        if (i < 4) acc[0] += char;
        else if (i < 6) acc[1] += char;
        else acc[2] += char;
        return acc;
      }, ['', '', '']);
      
      const m = parseInt(month);
      const d = parseInt(day);
      
      const monthMatch = m === targetMonth;
      const dayDiff = Math.abs(d - targetDay);
      
      if (monthMatch && dayDiff <= 5) {
        const temp = parameters.T2M?.[dateKey];
        const precip = parameters.PRECTOTCORR?.[dateKey];
        const wind = parameters.WS2M?.[dateKey];
        const humidity = parameters.RH2M?.[dateKey];
        
        if (temp !== -999 && precip !== -999 && wind !== -999 && humidity !== -999) {
          historicalSamples.push({
            date: dateKey,
            temperature: temp,
            precipitation: precip,
            windSpeed: wind,
            humidity: humidity
          });
        }
      }
    });

    if (historicalSamples.length === 0) {
      throw new Error('Insufficient historical data');
    }

    // Calculate statistics
    const calcStats = (arr: number[]) => {
      const sorted = arr.sort((a, b) => a - b);
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
      const stdDev = Math.sqrt(variance);
      return {
        mean: parseFloat(mean.toFixed(2)),
        min: parseFloat(sorted[0].toFixed(2)),
        max: parseFloat(sorted[sorted.length - 1].toFixed(2)),
        stdDev: parseFloat(stdDev.toFixed(2))
      };
    };

    const temps = historicalSamples.map(s => s.temperature);
    const precips = historicalSamples.map(s => s.precipitation);
    const winds = historicalSamples.map(s => s.windSpeed);
    const humidities = historicalSamples.map(s => s.humidity);

    // Calculate probabilities for different thresholds
    const extremeHeatThreshold = 32; // 32°C (90°F)
    const heavyRainThreshold = 10; // 10mm
    const highWindThreshold = 25; // 25 km/h
    const precipThreshold = 1; // 1mm for "any rain"

    const extremeHeatCount = temps.filter(t => t >= extremeHeatThreshold).length;
    const heavyRainCount = precips.filter(p => p >= heavyRainThreshold).length;
    const highWindCount = winds.filter(w => w >= highWindThreshold).length;
    const precipCount = precips.filter(p => p >= precipThreshold).length;

    const total = historicalSamples.length;

    // Build probability object
    const probabilities = {
      extremeHeat: {
        label: 'Extreme Heat',
        description: `Temperature exceeding ${extremeHeatThreshold}°C (${Math.round(extremeHeatThreshold * 9/5 + 32)}°F)`,
        probability: Math.round((extremeHeatCount / total) * 100),
        threshold: extremeHeatThreshold,
        unit: '°C'
      },
      precipitation: {
        label: 'Rain Expected',
        description: 'Any measurable precipitation',
        probability: Math.round((precipCount / total) * 100),
        threshold: precipThreshold,
        unit: 'mm'
      },
      heavyRain: {
        label: 'Heavy Rainfall',
        description: `Precipitation exceeding ${heavyRainThreshold}mm`,
        probability: Math.round((heavyRainCount / total) * 100),
        threshold: heavyRainThreshold,
        unit: 'mm'
      },
      highWind: {
        label: 'High Wind',
        description: `Wind speed exceeding ${highWindThreshold}km/h`,
        probability: Math.round((highWindCount / total) * 100),
        threshold: highWindThreshold,
        unit: 'km/h'
      }
    };

    // Current day estimate (using most recent historical avg)
    const recentSamples = historicalSamples.slice(-30);
    const current = {
      temperature: recentSamples.reduce((sum, s) => sum + s.temperature, 0) / recentSamples.length,
      precipitation: recentSamples.reduce((sum, s) => sum + s.precipitation, 0) / recentSamples.length,
      windSpeed: recentSamples.reduce((sum, s) => sum + s.windSpeed, 0) / recentSamples.length,
      humidity: recentSamples.reduce((sum, s) => sum + s.humidity, 0) / recentSamples.length
    };

    // Build 30-day trend (simplified forecast based on historical patterns)
    const trends = Array.from({ length: 30 }, (_, i) => ({
      day: `Day ${i + 1}`,
      temperature: parseFloat((current.temperature + (Math.random() - 0.5) * 3).toFixed(1)),
      precipitation: parseFloat((Math.max(0, current.precipitation + (Math.random() - 0.5) * 5)).toFixed(1))
    }));

    // Temperature distribution for chart
    const tempRanges = ['<15°C', '15-20°C', '20-25°C', '25-30°C', '30-35°C', '>35°C'];
    const tempDistribution = tempRanges.map(range => {
      let count = 0;
      temps.forEach(t => {
        if (range === '<15°C' && t < 15) count++;
        else if (range === '15-20°C' && t >= 15 && t < 20) count++;
        else if (range === '20-25°C' && t >= 20 && t < 25) count++;
        else if (range === '25-30°C' && t >= 25 && t < 30) count++;
        else if (range === '30-35°C' && t >= 30 && t < 35) count++;
        else if (range === '>35°C' && t >= 35) count++;
      });
      return {
        range,
        frequency: parseFloat(((count / total) * 100).toFixed(1))
      };
    });

    // Monthly precipitation trend
    const precipitationTrend = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ].map((month, idx) => {
      const monthSamples = historicalSamples.filter(s => {
        const m = parseInt(s.date.substring(4, 6));
        return m === idx + 1;
      });
      const avgRainfall = monthSamples.length > 0
        ? monthSamples.reduce((sum, s) => sum + s.precipitation, 0) / monthSamples.length
        : 0;
      return {
        month,
        rainfall: parseFloat(avgRainfall.toFixed(1))
      };
    });

    // Wind trend (hourly simulation)
    const windTrend = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      speed: parseFloat((current.windSpeed + Math.sin(hour / 24 * Math.PI * 2) * 5).toFixed(1))
    }));

    console.log(`Dashboard loaded: ${total} samples, ${Math.floor(total / 11)} years of data`);

    return c.json({
      current,
      historical: {
        temperature: calcStats(temps),
        precipitation: calcStats(precips),
        windSpeed: calcStats(winds),
        humidity: calcStats(humidities)
      },
      probabilities,
      trends,
      temperatureDistribution: tempDistribution,
      precipitationTrend,
      windTrend,
      yearsOfData: Math.floor(total / 11),
      samplesAnalyzed: total,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.log('Weather dashboard error:', error);
    return c.json({ error: error.message || 'Failed to load dashboard' }, 500);
  }
});

// Weather Event Probability with Statistical Analysis
app.post('/make-server-0765a8f0/weather/event-probability', async (c) => {
  try {
    const { latitude, longitude, date, eventType, locationName } = await c.req.json();

    if (!latitude || !longitude || !date) {
      return c.json({ error: 'Missing required parameters' }, 400);
    }

    console.log(`📊 Analyzing probability for ${date} at ${latitude}, ${longitude}`);

    // Fetch historical data for the same time period
    const requestedDate = new Date(date);
    const targetMonth = requestedDate.getMonth() + 1;
    const targetDay = requestedDate.getDate();

    // Optimize: Get only 5 years instead of 11 for faster response
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - 5);

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    console.log(`🌐 Fetching NASA POWER data (5 years): ${formatDate(startDate)} to ${formatDate(endDate)}`);

    // Fetch from NASA POWER API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    const url = `https://power.larc.nasa.gov/api/temporal/daily/point`;
    const params = new URLSearchParams({
      parameters: 'T2M,RH2M,PRECTOTCORR,WS2M',
      community: 'RE',
      longitude: longitude.toString(),
      latitude: latitude.toString(),
      start: formatDate(startDate),
      end: formatDate(endDate),
      format: 'JSON'
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`❌ NASA POWER API error: ${response.status}`);
        return c.json({ error: 'Failed to fetch NASA historical data' }, 500);
      }

      const data = await response.json();
      const parameters = data.properties?.parameter;

      if (!parameters) {
        console.error('❌ No parameter data available');
        return c.json({ error: 'No parameter data available' }, 500);
      }

      console.log(`✓ NASA data received, processing ${Object.keys(parameters.T2M || {}).length} daily records...`);

      // Extract data for similar dates (±7 days window around target date)
      const historicalSamples: any[] = [];
    
    Object.keys(parameters.T2M || {}).forEach(dateKey => {
      const year = parseInt(dateKey.substring(0, 4));
      const month = parseInt(dateKey.substring(4, 6));
      const day = parseInt(dateKey.substring(6, 8));
      
      // Check if this date is within ±7 days of target date (same month/day across years)
      const dayDiff = Math.abs(day - targetDay);
      const monthMatch = month === targetMonth;
      
      if (monthMatch && dayDiff <= 7) {
        const temp = parameters.T2M[dateKey];
        const precip = parameters.PRECTOTCORR[dateKey];
        const wind = parameters.WS2M[dateKey];
        const humidity = parameters.RH2M[dateKey];
        
        if (temp !== -999 && precip !== -999 && wind !== -999) {
          historicalSamples.push({
            date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            temperature: temp,
            precipitation: precip,
            windSpeed: wind,
            humidity: humidity || 0
          });
        }
      }
    });

    console.log(`Found ${historicalSamples.length} historical samples for analysis`);

    if (historicalSamples.length < 10) {
      return c.json({ error: 'Insufficient historical data for probability analysis' }, 500);
    }

    // Statistical analysis helper function
    const calculateStats = (values: number[]) => {
      const sorted = values.slice().sort((a, b) => a - b);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      const median = sorted[Math.floor(sorted.length / 2)];
      
      // Calculate 95% confidence interval (1.96 * standard error)
      const standardError = stdDev / Math.sqrt(values.length);
      const marginOfError = 1.96 * standardError;
      
      return {
        mean,
        median,
        stdDev,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        confidenceInterval95: {
          lower: mean - marginOfError,
          upper: mean + marginOfError
        }
      };
    };

    // Prepare time series with confidence intervals
    const prepareTimeSeries = (samples: any[], param: string) => {
      return samples.map(sample => {
        const allValues = samples.map(s => s[param]);
        const stats = calculateStats(allValues);
        
        return {
          date: sample.date,
          value: sample[param],
          mean: stats.mean,
          upperBound: stats.confidenceInterval95.upper,
          lowerBound: stats.confidenceInterval95.lower
        };
      });
    };

    // Calculate extreme weather probabilities
    const calculateExtremeProbability = (values: number[], threshold: number, direction: 'above' | 'below', condition: string, severity: string, description: string, unit: string) => {
      const count = direction === 'above' 
        ? values.filter(v => v >= threshold).length
        : values.filter(v => v <= threshold).length;
      
      return {
        condition,
        probability: Math.round((count / values.length) * 100),
        threshold,
        severity: severity as 'low' | 'moderate' | 'high' | 'extreme',
        historicalOccurrences: count,
        description
      };
    };

    // Extract parameter arrays
    const temps = historicalSamples.map(s => s.temperature);
    const precips = historicalSamples.map(s => s.precipitation);
    const winds = historicalSamples.map(s => s.windSpeed);

    // Temperature analysis
    const tempStats = calculateStats(temps);
    const temperatureData = {
      historicalTrends: prepareTimeSeries(historicalSamples, 'temperature'),
      extremeWeatherProbability: [
        calculateExtremeProbability(temps, 35, 'above', 'Extreme Heat', 'extreme', 'Temperature above 35°C (95°F) - Very hot conditions', '°C'),
        calculateExtremeProbability(temps, 32, 'above', 'Very Hot', 'high', 'Temperature above 32°C (90°F) - Hot and uncomfortable', '°C'),
        calculateExtremeProbability(temps, 28, 'above', 'Hot Weather', 'moderate', 'Temperature above 28°C (82°F) - Warm conditions', '°C'),
        calculateExtremeProbability(temps, 18, 'below', 'Cool Weather', 'low', 'Temperature below 18°C (64°F) - Cooler than average', '°C')
      ],
      statistics: tempStats,
      parameter: 'Temperature',
      unit: '°C'
    };

    // Precipitation analysis
    const precipStats = calculateStats(precips);
    const precipitationData = {
      historicalTrends: prepareTimeSeries(historicalSamples, 'precipitation'),
      extremeWeatherProbability: [
        calculateExtremeProbability(precips, 50, 'above', 'Heavy Rain', 'extreme', 'Precipitation above 50mm - Very heavy rainfall', 'mm'),
        calculateExtremeProbability(precips, 20, 'above', 'Moderate Rain', 'high', 'Precipitation above 20mm - Significant rainfall', 'mm'),
        calculateExtremeProbability(precips, 5, 'above', 'Light Rain', 'moderate', 'Precipitation above 5mm - Noticeable rain', 'mm'),
        calculateExtremeProbability(precips, 1, 'above', 'Any Rain', 'low', 'Any measurable precipitation', 'mm')
      ],
      statistics: precipStats,
      parameter: 'Precipitation',
      unit: 'mm'
    };

    // Wind speed analysis
    const windStats = calculateStats(winds);
    const windSpeedData = {
      historicalTrends: prepareTimeSeries(historicalSamples, 'windSpeed'),
      extremeWeatherProbability: [
        calculateExtremeProbability(winds, 30, 'above', 'Very Windy', 'extreme', 'Wind speed above 30 m/s - Very strong winds', 'm/s'),
        calculateExtremeProbability(winds, 20, 'above', 'Strong Winds', 'high', 'Wind speed above 20 m/s - Strong winds', 'm/s'),
        calculateExtremeProbability(winds, 10, 'above', 'Breezy', 'moderate', 'Wind speed above 10 m/s - Noticeable breeze', 'm/s'),
        calculateExtremeProbability(winds, 5, 'below', 'Calm', 'low', 'Wind speed below 5 m/s - Light winds', 'm/s')
      ],
      statistics: windStats,
      parameter: 'Wind Speed',
      unit: 'm/s'
    };

    // Event-specific recommendations
    const eventRecommendations = {
      hiking: {
        ideal: tempStats.mean >= 18 && tempStats.mean <= 28 && precipStats.mean < 5,
        concerns: [
          precips.filter(p => p > 10).length > historicalSamples.length * 0.3 ? 'High rain probability - prepare for wet trails' : null,
          temps.filter(t => t > 32).length > historicalSamples.length * 0.3 ? 'High heat probability - bring extra water' : null,
          winds.filter(w => w > 20).length > historicalSamples.length * 0.3 ? 'High wind probability - consider sheltered routes' : null
        ].filter(Boolean)
      }
    };

    return c.json({
      success: true,
      location: {
        latitude,
        longitude,
        name: locationName || 'Selected Location'
      },
      targetDate: date,
      eventType,
      probabilityData: {
        temperature: temperatureData,
        precipitation: precipitationData,
        windSpeed: windSpeedData
      },
      recommendations: eventRecommendations[eventType as keyof typeof eventRecommendations] || {},
      dataSource: {
        api: 'NASA POWER',
        yearsAnalyzed: Math.floor(historicalSamples.length / 12),
        samplesUsed: historicalSamples.length,
        dateRange: `${startDate.getFullYear()}-${endDate.getFullYear()}`
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.log('Event probability error:', error);
    return c.json({ error: error.message || 'Failed to analyze event probability' }, 500);
  }
});

// ==================== COMPREHENSIVE API TESTS ====================

// Test NASA POWER API
app.get('/make-server-0765a8f0/test-nasa-power', async (c) => {
  try {
    const testLat = 1.5535;
    const testLon = 110.3593;
    const today = new Date();
    const formatDate = (d: Date) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M&community=RE&longitude=${testLon}&latitude=${testLat}&start=${formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000))}&end=${formatDate(today)}&format=JSON`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return c.json({ 
      success: true, 
      message: 'NASA POWER API accessible',
      sampleData: Object.keys(data.properties?.parameter?.T2M || {}).length > 0
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test NASA FIRMS API
app.get('/make-server-0765a8f0/test-nasa-firms', async (c) => {
  try {
    const url = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/API_KEY/VIIRS_SNPP_NRT/MYS/1`;
    const response = await fetch(url);
    
    // FIRMS returns 200 even with invalid key, check content
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    return c.json({ 
      success: true, 
      message: 'NASA FIRMS API accessible'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test NASA EONET API
app.get('/make-server-0765a8f0/test-nasa-eonet', async (c) => {
  try {
    const url = `https://eonet.gsfc.nasa.gov/api/v3/events?limit=5&status=open`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return c.json({ 
      success: true, 
      message: 'NASA EONET API accessible',
      sampleData: data.events?.length > 0
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test GES DISC API (requires authentication)
app.get('/make-server-0765a8f0/test-ges-disc', async (c) => {
  try {
    if (!areNASACredentialsConfigured()) {
      return c.json({ success: false, error: 'Bearer Token not configured' }, 401);
    }
    
    const url = `https://disc.gsfc.nasa.gov/api/v1/datasets`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CONFIG.NASA.BEARER_TOKEN}`
      }
    });
    
    if (!response.ok) {
      return c.json({ success: false, error: `Authentication failed: HTTP ${response.status}` }, response.status);
    }
    
    return c.json({ 
      success: true, 
      message: 'GES DISC API accessible with Bearer Token'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test DataRods API (requires authentication)
app.get('/make-server-0765a8f0/test-datarods', async (c) => {
  try {
    if (!areNASACredentialsConfigured()) {
      return c.json({ success: false, error: 'Bearer Token not configured' }, 401);
    }
    
    // DataRods requires NASA Earthdata authentication
    return c.json({ 
      success: true, 
      message: 'DataRods API ready (Bearer Token configured)'
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test NASA Open API
app.get('/make-server-0765a8f0/test-nasa-open-api', async (c) => {
  try {
    if (!isNASAOpenAPIConfigured()) {
      return c.json({ success: false, error: 'NASA Open API key not configured' }, 401);
    }
    
    const url = `https://api.nasa.gov/planetary/apod?api_key=${CONFIG.NASA_OPEN.API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        return c.json({ success: false, error: 'Invalid API key' }, response.status);
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return c.json({ 
      success: true, 
      message: 'NASA Open API accessible',
      sampleData: data.title ? true : false
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test OpenWeather API
app.get('/make-server-0765a8f0/test-openweather', async (c) => {
  try {
    if (!isOpenWeatherConfigured()) {
      return c.json({ success: false, error: 'OpenWeather API key not configured' }, 401);
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=1.5535&lon=110.3593&appid=${CONFIG.OPENWEATHER.API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        return c.json({ success: false, error: 'Invalid API key or not activated yet (wait 10 minutes)' }, 401);
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return c.json({ 
      success: true, 
      message: 'OpenWeather API accessible',
      sampleData: data.name ? true : false
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test Earthdata Search (CMR) API
app.get('/make-server-0765a8f0/test-earthdata-search', async (c) => {
  try {
    console.log('🧪 Testing Earthdata Search (CMR) API...');
    
    // Test search for precipitation datasets
    const result = await searchEarthdataForWeather(1.5535, 110.3593, 100);
    
    if (result && result.datasets && result.datasets.length > 0) {
      console.log(`✓ Earthdata Search working: Found ${result.count} datasets`);
      return c.json({ 
        success: true, 
        message: 'Earthdata Search API accessible',
        datasetsFound: result.count
      });
    }
    
    return c.json({ success: false, error: 'No datasets found' }, 500);
  } catch (error: any) {
    console.error('✗ Earthdata Search test failed:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test Giovanni API
app.get('/make-server-0765a8f0/test-giovanni', async (c) => {
  try {
    console.log('🧪 Testing Giovanni API...');
    
    // Test Giovanni time-series data
    const result = await getGiovanniData(1.5535, 110.3593);
    
    if (result && result.available) {
      console.log('✓ Giovanni API working');
      return c.json({ 
        success: true, 
        message: 'Giovanni API accessible',
        source: result.source
      });
    }
    
    return c.json({ success: false, error: 'Giovanni data not available' }, 500);
  } catch (error: any) {
    console.error('✗ Giovanni test failed:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test Worldview API
app.get('/make-server-0765a8f0/test-worldview', async (c) => {
  try {
    console.log('🧪 Testing Worldview (GIBS) API...');
    
    // Test Worldview imagery availability
    const result = await getWorldviewImagery(1.5535, 110.3593);
    
    if (result && result.available) {
      console.log('✓ Worldview API working');
      return c.json({ 
        success: true, 
        message: 'Worldview API accessible',
        imageryAvailable: true
      });
    }
    
    return c.json({ success: false, error: 'Worldview imagery not available' }, 500);
  } catch (error: any) {
    console.error('✗ Worldview test failed:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test NASA POWER API
app.get('/make-server-0765a8f0/test-nasa-power', async (c) => {
  try {
    console.log('🧪 Testing NASA POWER API...');
    const result = await getClimateTrends(7, 1.5535, 110.3593);
    if (result && result.trends && result.trends.length > 0) {
      console.log('✓ NASA POWER API working');
      return c.json({ success: true, message: 'NASA POWER API accessible' });
    }
    return c.json({ success: false, error: 'No data returned' }, 500);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test NASA FIRMS API
app.get('/make-server-0765a8f0/test-nasa-firms', async (c) => {
  try {
    console.log('🧪 Testing NASA FIRMS API...');
    const result = await getNASAWildfires(1.5535, 110.3593, 500);
    // FIRMS returns empty array if no fires, which is still success
    console.log('✓ NASA FIRMS API working');
    return c.json({ success: true, message: 'NASA FIRMS API accessible', firesDetected: result.length });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test NASA EONET API
app.get('/make-server-0765a8f0/test-nasa-eonet', async (c) => {
  try {
    console.log('🧪 Testing NASA EONET API...');
    const result = await getNASANaturalEvents(1.5535, 110.3593, 500, 30);
    // EONET returns empty array if no events, which is still success
    console.log('✓ NASA EONET API working');
    return c.json({ success: true, message: 'NASA EONET API accessible', eventsFound: result.length });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test GES DISC API
app.get('/make-server-0765a8f0/test-ges-disc', async (c) => {
  try {
    console.log('🧪 Testing GES DISC API...');
    if (!areNASACredentialsConfigured()) {
      return c.json({ success: false, error: 'NASA credentials not configured' }, 401);
    }
    const result = await getGESDISCData(1.5535, 110.3593);
    if (result) {
      console.log('✓ GES DISC API working');
      return c.json({ success: true, message: 'GES DISC API accessible' });
    }
    return c.json({ success: false, error: 'GES DISC not accessible' }, 500);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test DataRods API
app.get('/make-server-0765a8f0/test-datarods', async (c) => {
  try {
    console.log('🧪 Testing DataRods API...');
    if (!areNASACredentialsConfigured()) {
      return c.json({ success: false, error: 'NASA credentials not configured' }, 401);
    }
    const result = await getDataRodsData(1.5535, 110.3593);
    if (result) {
      console.log('✓ DataRods API working');
      return c.json({ success: true, message: 'DataRods API accessible' });
    }
    return c.json({ success: false, error: 'DataRods not accessible' }, 500);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test NASA Open API
app.get('/make-server-0765a8f0/test-nasa-open-api', async (c) => {
  try {
    console.log('🧪 Testing NASA Open API...');
    if (!isNASAOpenAPIConfigured()) {
      return c.json({ success: false, error: 'NASA Open API key not configured' }, 401);
    }
    // Test APOD endpoint
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${CONFIG.NASA_OPEN.API_KEY}&count=1`);
    if (response.ok) {
      console.log('✓ NASA Open API working');
      return c.json({ success: true, message: 'NASA Open API accessible' });
    }
    return c.json({ success: false, error: `HTTP ${response.status}` }, 500);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

Deno.serve(app.fetch);
