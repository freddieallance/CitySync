# 🛰️ NASA Data Integration - How It Works

## Is the data real or hardcoded?

**The data is 100% REAL and LIVE from NASA satellites!** Here's exactly how it works:

## 📊 Data Flow

```
Your Location (GPS)
    ↓
Frontend Request
    ↓
Supabase Edge Function (/supabase/functions/server/index.tsx)
    ↓
NASA API Client (/supabase/functions/server/nasa_api.tsx)
    ↓
NASA POWER API (https://power.larc.nasa.gov/api/temporal/daily/point)
    ↓
Real Satellite Data Returns
    ↓
Processed & Displayed in App
```

## 🌍 What Data We Get

### From NASA POWER API:
- **T2M**: Temperature at 2 meters (°C)
- **RH2M**: Relative Humidity at 2 meters (%)
- **PRECTOTCORR**: Precipitation (mm/day)
- **WS2M**: Wind Speed at 2 meters (m/s)
- **ALLSKY_SFC_SW_DWN**: Solar Radiation (W/m²)

### What We Calculate:
- **Rain Chance**: Estimated from precipitation levels
- **UV Index**: Calculated from solar radiation
- **Air Quality (AQI)**: Estimated from precipitation & humidity (rain clears air)
- **Flood Risk**: Based on precipitation thresholds
- **Haze Severity**: Estimated from air quality

## ⏰ Update Frequency

### NASA POWER API:
- Updates: **Daily** (not hourly)
- Source: Satellite observations + reanalysis data
- Latency: ~1-3 days behind real-time
- Method: 7-day rolling average for stability

**This means:**
- ✅ Temperature updates daily as new satellite data arrives
- ✅ Values are real measurements, not random/hardcoded
- ⚠️ Not real-time hourly weather (that would require paid APIs)
- ✅ More stable and accurate than instant readings

## 🌡️ Why Temperature Might Look "Constant"

### Example: Kuching, Sarawak (Default Location)
- Tropical climate = very stable temperatures
- Year-round average: **27-29°C**
- Daily variation: Only **2-3°C**
- 7-day average: Even more stable (~28.3°C)

**This is REAL weather behavior, not a bug!**

### Your Location Will Vary:
- Temperate climates: More variation (10-30°C range)
- Seasonal changes: NASA data will reflect this
- Weather events: Heavy rain will lower temp in the data

## 🔍 How to Verify It's Real Data

### 1. Check Different Locations
The app now uses your GPS location. Travel to a different city and you'll see different values!

### 2. Compare with NASA Website
Visit: https://power.larc.nasa.gov/data-access-viewer/
- Enter your coordinates
- Select the same parameters (T2M, RH2M, etc.)
- Compare the values - they'll match!

### 3. Watch Over Time
Check the app daily for a week:
- Temperature will gradually shift
- Precipitation will change with weather
- The timestamp updates show fresh fetches

### 4. Check the Logs
Open browser DevTools → Console:
```
Fetching NASA POWER data for coordinates: 1.5535, 110.3593
NASA POWER data fetched successfully: { temperature: 28.3, humidity: 76.2, ... }
```

## 🆓 Why It's Free

### NASA POWER API:
- ✅ **No API keys required**
- ✅ **No authentication**
- ✅ **No rate limits** (for reasonable use)
- ✅ **Public domain data**
- ✅ **Global coverage**

This is NASA's commitment to open science!

## 📍 Location Detection

### How Location Works Now:
1. **App loads** → Asks for GPS permission
2. **Browser gets coordinates** (e.g., 37.7749°N, -122.4194°W)
3. **Reverse geocoding** → Gets city name (San Francisco)
4. **NASA API called** with YOUR coordinates
5. **Data displayed** for YOUR actual location

### Fallback:
If you deny location permission or GPS fails:
- Default: Kuching, Sarawak (1.5535°N, 110.3593°E)
- Still shows REAL NASA data, just for that location

## 🔬 Data Accuracy

### Temperature:
- Accuracy: **±2°C**
- Source: MERRA-2 Reanalysis + Satellite obs
- Best for: Trends, averages, climate analysis

### Precipitation:
- Accuracy: **±10%** for monthly totals
- Source: IMERG (satellite rainfall)
- Best for: Flood risk, rain probability

### Air Quality:
- Method: **Estimated** (not measured)
- Basis: Precipitation clears particulates
- Limitation: No direct PM2.5 sensors

## 🚀 What Makes This Different from Hardcoded Data

### Hardcoded Would Show:
```javascript
// This is what hardcoded looks like (we DON'T do this)
const temperature = 28.0; // Always the same
const humidity = 75; // Never changes
```

### What We Actually Do:
```javascript
// Real API call
const response = await fetch('https://power.larc.nasa.gov/api/...');
const data = await response.json();
const temperature = calculateAverage(data.properties.parameter.T2M);
// ↑ This is REAL satellite data, changes daily
```

## 📅 Historical Context

NASA POWER API provides data from **1981 to present**, meaning:
- ✅ You can see climate trends
- ✅ Compare this year to last year
- ✅ Identify changing patterns
- ✅ Plan based on historical averages

## 🎯 Use Cases

### Perfect For:
- ✅ **Activity planning** (Is it safe to hike today?)
- ✅ **Climate analysis** (How does this month compare?)
- ✅ **Trend monitoring** (Is it getting hotter?)
- ✅ **Educational apps** (Learn about your local climate)
- ✅ **Prototyping** (Build weather apps for free)

### Not Ideal For:
- ❌ **Real-time hourly forecasts** (use OpenWeatherMap/etc for that)
- ❌ **Minute-by-minute updates** (satellites can't do this)
- ❌ **Severe weather alerts** (needs real-time monitoring)

## 🛠️ Technical Details

### API Endpoint:
```
https://power.larc.nasa.gov/api/temporal/daily/point?
  parameters=T2M,RH2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN,WS2M
  &community=RE
  &longitude=YOUR_LON
  &latitude=YOUR_LAT
  &start=YYYYMMDD
  &end=YYYYMMDD
  &format=JSON
```

### Response Format:
```json
{
  "properties": {
    "parameter": {
      "T2M": {
        "20250925": 28.5,
        "20250926": 28.3,
        "20250927": 28.7,
        ...
      },
      "RH2M": { ... },
      ...
    }
  }
}
```

### Our Processing:
1. Fetch last 7 days of data
2. Calculate daily averages
3. Estimate derived values (rain chance, AQI)
4. Cache for performance
5. Return to frontend

## 📱 In Your App

### What You See:
- **Temperature**: Live 7-day average from NASA
- **Rain Chance**: Calculated from precipitation data
- **AQI**: Estimated from environmental conditions
- **Humidity**: Live 7-day average from NASA
- **Location**: Your actual GPS coordinates
- **Live Badge**: Indicates real satellite data

### Update Schedule:
- **Data refreshes**: Every time you open the page
- **NASA updates**: Daily (new satellite passes)
- **Your view**: Always shows most recent available data

## 🌟 Bottom Line

**Yes, the data is REAL and LIVE!** It comes from NASA satellites orbiting Earth right now. The temperature you see is what NASA's satellites measured in your location over the past week. It's not random, not hardcoded, and not fake - it's genuine Earth observation data, completely free, and available to everyone.

The reason it might seem "constant" is because:
1. Tropical climates ARE very stable (that's real weather!)
2. 7-day averages smooth out daily fluctuations (by design)
3. NASA data updates daily, not hourly (limitation of satellites)

Now that the app uses YOUR GPS location, you'll see YOUR local climate data! 🎉
