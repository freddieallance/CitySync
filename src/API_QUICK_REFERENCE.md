# NASA APIs Quick Reference Guide 🚀

## Your 10 Integrated APIs

### 🟢 PUBLIC NASA APIS (No Auth Required)

#### 1. **NASA POWER** - Climate & Weather Data
```
Endpoint: /climate-trends?days=30&lat=1.5&lon=110.3
Test: /test-nasa-power
Features: Temperature, Precipitation, Wind, Humidity, Solar Radiation
```

#### 2. **NASA FIRMS** - Wildfire Detection
```
Endpoint: /wildfires?lat=1.5&lon=110.3&radius=500
Test: /test-nasa-firms
Features: Active fires within radius, heat anomalies, satellite detection
```

#### 3. **NASA EONET** - Natural Disaster Events
```
Endpoint: /natural-events?lat=1.5&lon=110.3&radius=500&days=30
Test: /test-nasa-eonet
Features: Storms, floods, earthquakes, volcanoes, severe weather
```

#### 4. **Earthdata Search (CMR)** ⭐ NEW
```
Endpoint: /earthdata-search?lat=1.5&lon=110.3&radius=100
Test: /test-earthdata-search
Features: Weather datasets, climate collections, data discovery
```

#### 5. **Giovanni** ⭐ NEW
```
Endpoint: /giovanni-timeseries?lat=1.5&lon=110.3
Test: /test-giovanni
Features: Time-series analysis, probability calculations, climate trends
```

#### 6. **Worldview (GIBS)** ⭐ NEW
```
Endpoint: /worldview-imagery?lat=1.5&lon=110.3&date=2025-01-10
Test: /test-worldview
Features: Satellite imagery, cloud cover, true-color Earth view
```

---

### 🟡 AUTHENTICATED APIS (NASA Bearer Token Required)

#### 7. **GES DISC** - Earth Science Datasets
```
Test: /test-ges-disc
Status: Requires NASA Earthdata Bearer Token in backend config
```

#### 8. **DataRods** - Hydrology Data
```
Test: /test-datarods
Status: Requires NASA Earthdata Bearer Token in backend config
```

---

### 🟣 EXTERNAL APIS (API Keys in Backend)

#### 9. **NASA Open API** - Space Exploration
```
Test: /test-nasa-open-api
Status: Requires NASA API key (get free at api.nasa.gov)
Features: APOD, Mars Rovers, Asteroids, Space Events
```

#### 10. **OpenWeather** - Real-Time Weather
```
Test: /test-openweather
Status: Requires OpenWeather API key
Features: Current weather, forecasts, weather alerts
```

---

## Quick Integration Examples

### Get Weather Probability Data (Giovanni)
```javascript
const response = await fetch(
  `${API_BASE}/giovanni-timeseries?lat=1.5535&lon=110.3593`
);
const data = await response.json();

// Use data.timeSeries for probability calculations
// data.statistics contains averages and trends
```

### Get Satellite Imagery (Worldview)
```javascript
const response = await fetch(
  `${API_BASE}/worldview-imagery?lat=1.5535&lon=110.3593&date=2025-01-10`
);
const imagery = await response.json();

// imagery.tileService.sampleTileUrl - direct link to satellite image
// imagery.capabilities.availableLayers - list of available layers
```

### Search for Weather Datasets (Earthdata)
```javascript
const response = await fetch(
  `${API_BASE}/earthdata-search?lat=1.5535&lon=110.3593&radius=100`
);
const datasets = await response.json();

// datasets.datasets[] - array of available NASA datasets
// datasets.count - total number of datasets found
```

---

## API Status Check

Visit the **NASA Status Page** in your app to see real-time status of all 10 APIs.

Each API is tested automatically and shows:
- ✅ Working - API is accessible and returning data
- ❌ Failed - API encountered an error
- ⏳ Checking - Currently testing the API

---

## Base URL

All endpoints use the base URL:
```
https://{your-project-id}.supabase.co/functions/v1/make-server-0765a8f0
```

Add `/endpoint-name` to access specific APIs.

---

## Common Parameters

- `lat` - Latitude (decimal degrees)
- `lon` - Longitude (decimal degrees)
- `radius` - Search radius in kilometers
- `days` - Number of days for historical data
- `date` - Date in YYYY-MM-DD format

---

## Need Help?

Check these documentation files:
- `/NASA_EARTH_OBSERVATION_APIS.md` - Full implementation guide
- `/API_INTEGRATION_GUIDE.md` - How to integrate APIs
- `/WHERE_TO_PUT_API_KEYS.md` - API key configuration

---

## API Summary Table

| API | Type | Auth Required | Status | Use Case |
|-----|------|---------------|--------|----------|
| NASA POWER | Public | ❌ No | ✅ Working | Historical climate data |
| NASA FIRMS | Public | ❌ No | ✅ Working | Wildfire detection |
| NASA EONET | Public | ❌ No | ✅ Working | Natural disasters |
| **Earthdata Search** | Public | ❌ No | ✅ Working | **Dataset discovery** |
| **Giovanni** | Public | ❌ No | ✅ Working | **Probability analysis** |
| **Worldview** | Public | ❌ No | ✅ Working | **Satellite imagery** |
| GES DISC | Auth | ⚠️ Optional | ⏸️ Requires setup | Advanced datasets |
| DataRods | Auth | ⚠️ Optional | ⏸️ Requires setup | Hydrology data |
| NASA Open API | External | ⚠️ Optional | ⏸️ Requires key | Space exploration |
| OpenWeather | External | ⚠️ Optional | ⏸️ Requires key | Real-time weather |

**Legend:**
- ✅ Working - Fully operational
- ⏸️ Requires setup - Needs API key/token
- ⚠️ Optional - Not required for core features

---

**Your app has 6 working NASA APIs out of the box! 🎉**
