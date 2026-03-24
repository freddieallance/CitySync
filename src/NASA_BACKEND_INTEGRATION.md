# 🔧 NASA API Backend Integration Guide

## Overview

NASA APIs are integrated **backend-only** - no UI pages for users. Your existing features (Weather Dashboard, Event Planner, etc.) can call NASA APIs internally to enhance their functionality.

---

## ✅ What's Set Up

### 1. Backend Endpoint (No User Auth Required)

**Endpoint:** `POST /make-server-0765a8f0/nasa/data`

**Authentication:** Uses environment variables
- `NASA_EARTHDATA_USERNAME` - Already configured ✅
- `NASA_EARTHDATA_PASSWORD` - Already configured ✅

**Available APIs:**
- `gesdisc` - High-resolution atmospheric data (MERRA-2)
- `giovanni` - Climate analysis & visualization
- `datarods` - Hydrology (precipitation, floods, soil moisture)
- `worldview` - Satellite imagery
- `cmr` - NASA dataset search

---

## 🎯 How to Use in Your Components

### Example 1: Enhance Weather Dashboard

Add NASA atmospheric data to your Weather Dashboard:

```typescript
// In WeatherDashboardPage.tsx
import { projectId } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0`;

// Fetch high-resolution atmospheric data
const fetchNASAAtmosphericData = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(`${API_BASE}/nasa/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api: 'gesdisc',
        latitude,
        longitude
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('NASA atmospheric data:', data);
      // Use this data to enhance your weather display
      return data;
    } else {
      console.error('NASA API error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch NASA data:', error);
    return null;
  }
};

// Call this in your useEffect
useEffect(() => {
  if (userLocation) {
    fetchNASAAtmosphericData(userLocation.latitude, userLocation.longitude)
      .then(nasaData => {
        if (nasaData) {
          // Merge NASA data with your existing weather data
          setEnhancedWeatherData(prev => ({
            ...prev,
            nasaAtmospheric: nasaData
          }));
        }
      });
  }
}, [userLocation]);
```

### Example 2: Enhance Event Planner with Historical Data

Add NASA climate analysis to event planning:

```typescript
// In EventPlannerPage.tsx

const fetchNASAClimateAnalysis = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(`${API_BASE}/nasa/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api: 'giovanni',
        latitude,
        longitude,
        params: {
          parameter: 'precipitation' // or other climate parameter
        }
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('NASA climate analysis:', data);
      // Use multi-year trends to improve probability predictions
      return data;
    }
  } catch (error) {
    console.error('Failed to fetch NASA climate data:', error);
  }
  return null;
};
```

### Example 3: Add Flood Risk to Conditions Map

Enhance your conditions map with NASA hydrology data:

```typescript
// In ConditionsMapPage.tsx

const fetchFloodRiskData = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(`${API_BASE}/nasa/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api: 'datarods',
        latitude,
        longitude
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('NASA hydrology data:', data);
      // Display flood risk, precipitation, soil moisture on your map
      return data;
    }
  } catch (error) {
    console.error('Failed to fetch NASA hydrology data:', error);
  }
  return null;
};
```

### Example 4: Get Satellite Imagery

Add satellite imagery URLs to your app:

```typescript
const fetchSatelliteImagery = async (latitude: number, longitude: number, date?: string) => {
  try {
    const response = await fetch(`${API_BASE}/nasa/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api: 'worldview',
        latitude,
        longitude,
        params: {
          date: date || new Date().toISOString().split('T')[0]
        }
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Satellite imagery available:', data);
      // data.baseUrl contains the imagery service URL
      return data;
    }
  } catch (error) {
    console.error('Failed to fetch satellite imagery:', error);
  }
  return null;
};
```

---

## 🔒 Security

### Credentials Stored Securely

Your NASA credentials are stored as **environment variables** in Supabase:
- ✅ Never exposed to frontend
- ✅ Never visible in client code
- ✅ Only accessible by backend
- ✅ Encrypted by Supabase

### No User Authentication Required

The `/nasa/data` endpoint:
- ✅ Works without user login
- ✅ No Authorization header needed
- ✅ All users can access (via your app features)
- ✅ NASA credentials are shared (backend-only)

---

## 📊 What Each API Provides

### GES DISC (Atmospheric Data)
```json
{
  "source": "GES DISC",
  "timestamp": "2025-10-04T12:00:00.000Z",
  "data": {
    "temperature": 28.5,
    "humidity": 75.2,
    "pressure": 1013.25,
    "wind_speed": 3.2,
    "visibility": 10.0
  }
}
```

**Use for:** Enhanced weather accuracy, atmospheric conditions

### Giovanni (Climate Analysis)
```json
{
  "source": "Giovanni",
  "timestamp": "2025-10-04T12:00:00.000Z",
  "data": {
    "parameter": "precipitation",
    "historical_trends": [...],
    "analysis": "..."
  }
}
```

**Use for:** Historical weather patterns, long-term predictions

### DataRods (Hydrology)
```json
{
  "source": "DataRods",
  "timestamp": "2025-10-04T12:00:00.000Z",
  "data": {
    "precipitation": 15.3,
    "soil_moisture": 0.25,
    "flood_risk": "low",
    "water_level": 2.1
  }
}
```

**Use for:** Flood warnings, water-related activities

### Worldview (Satellite Imagery)
```json
{
  "source": "Worldview",
  "available": true,
  "baseUrl": "https://gibs.earthdata.nasa.gov/",
  "date": "2025-10-04",
  "message": "Satellite imagery available"
}
```

**Use for:** Visual weather verification, cloud cover

### CMR (Dataset Search)
```json
{
  "source": "CMR",
  "datasets": [...],
  "count": 150
}
```

**Use for:** Finding specific NASA datasets for your location

---

## 🎯 Integration Strategies

### Strategy 1: Silent Enhancement

Fetch NASA data in the background and merge it with existing data:

```typescript
const [weatherData, setWeatherData] = useState(null);
const [nasaData, setNasaData] = useState(null);

useEffect(() => {
  // Fetch both OpenWeather and NASA data
  Promise.all([
    fetchOpenWeatherData(),
    fetchNASAAtmosphericData()
  ]).then(([weather, nasa]) => {
    setWeatherData(weather);
    setNasaData(nasa);
  });
}, [location]);

// Display combined data without mentioning NASA
const enhancedData = {
  ...weatherData,
  // NASA provides more accurate values
  temperature: nasaData?.data?.temperature || weatherData?.temperature,
  humidity: nasaData?.data?.humidity || weatherData?.humidity
};
```

### Strategy 2: Additional Metrics

Add NASA-specific metrics to your dashboards:

```typescript
// Show flood risk from NASA DataRods
{nasaData?.data?.flood_risk && (
  <Alert>
    <AlertDescription>
      Flood Risk: {nasaData.data.flood_risk}
    </AlertDescription>
  </Alert>
)}
```

### Strategy 3: Validation

Use NASA data to validate other sources:

```typescript
const validateWeatherData = (openWeather, nasa) => {
  const tempDiff = Math.abs(openWeather.temp - nasa.data.temperature);
  
  if (tempDiff > 5) {
    console.warn('Large temperature discrepancy detected');
  }
  
  // Use NASA as authoritative source
  return nasa.data.temperature;
};
```

---

## 🧪 Testing

### Test the Endpoint

```javascript
// Open browser console and run:
const projectId = 'YOUR_PROJECT_ID';

fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0/nasa/data`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api: 'worldview',
    latitude: 1.5535,
    longitude: 110.3593
  })
})
.then(r => r.json())
.then(d => console.log('NASA Response:', d));
```

**Expected:** You should see NASA data returned!

---

## ❓ Troubleshooting

### Error: "NASA credentials not configured"

**Cause:** Environment variables not set  
**Solution:** 
1. Go to Supabase Dashboard
2. Edge Functions → Manage Secrets
3. Verify `NASA_EARTHDATA_USERNAME` and `NASA_EARTHDATA_PASSWORD` have values
4. If empty, enter your NASA credentials

### Error: "Invalid credentials"

**Cause:** Wrong NASA username/password  
**Solution:**
1. Test login at https://urs.earthdata.nasa.gov/
2. Update credentials in Supabase secrets

### No Error But No Data

**Cause:** NASA API may be slow or unavailable  
**Solution:**
1. Check backend logs in Supabase
2. Add timeout handling
3. Provide fallback to other data sources

---

## 📝 Best Practices

### 1. Don't Block UI on NASA Data

```typescript
// ❌ Bad - UI waits for NASA
const data = await fetchNASAData();
renderUI(data);

// ✅ Good - Show UI immediately, enhance later
renderUI(existingData);
fetchNASAData().then(nasa => updateUI(nasa));
```

### 2. Cache NASA Data

```typescript
// NASA data doesn't change frequently
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const getCachedNASAData = async (location) => {
  const cacheKey = `nasa_${location.lat}_${location.lon}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  
  const fresh = await fetchNASAData(location);
  localStorage.setItem(cacheKey, JSON.stringify({
    data: fresh,
    timestamp: Date.now()
  }));
  
  return fresh;
};
```

### 3. Handle Errors Gracefully

```typescript
const fetchNASADataSafe = async (location) => {
  try {
    const response = await fetch(`${API_BASE}/nasa/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api: 'gesdisc', ...location })
    });
    
    if (!response.ok) {
      console.warn('NASA API unavailable, using fallback data');
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('NASA API error:', error);
    return null; // Fail gracefully
  }
};
```

---

## 🎉 Summary

### What You Have

- ✅ Backend endpoint ready (`/nasa/data`)
- ✅ NASA credentials configured (environment variables)
- ✅ 5 NASA APIs available
- ✅ No user authentication required
- ✅ Secure (credentials never exposed)

### How to Use

1. Import `projectId` from `../utils/supabase/info`
2. Call `/nasa/data` endpoint with API type and coordinates
3. Get NASA data back
4. Use it to enhance your existing features
5. **No UI changes needed** - works behind the scenes!

### Next Steps

1. Pick a feature to enhance (Weather Dashboard recommended)
2. Add NASA data fetching in that component
3. Merge NASA data with existing data
4. Test and validate

---

**NASA APIs are ready to use in your backend!** 🚀

No UI pages. No user credentials. Just backend integration to power your existing features.
