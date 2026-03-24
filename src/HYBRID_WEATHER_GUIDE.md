# 🌐 Hybrid Weather API Guide

## ✅ **Hybrid Mode Now Active!**

Your CitySync app now combines **NASA POWER API** and **OpenWeather API** for the most accurate weather data possible!

---

## 🎯 **How It Works**

### **The Best of Both Worlds:**

```
┌─────────────────────────────────────────────────────────┐
│                  HYBRID WEATHER SYSTEM                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🛰️ NASA POWER API                                     │
│  ├─ 40+ years of historical satellite data             │
│  ├─ Climate trends and patterns                        │
│  ├─ Statistical probability analysis                   │
│  └─ Global coverage, highly accurate                   │
│                                                         │
│  🌤️ OpenWeather API                                    │
│  ├─ Real-time current conditions                       │
│  ├─ 5-day hourly forecasts                            │
│  ├─ Weather alerts and warnings                        │
│  └─ Minute-by-minute precipitation                     │
│                                                         │
│  🎯 COMBINED RESULT                                     │
│  ├─ Most accurate current conditions (OpenWeather)     │
│  ├─ Best historical context (NASA POWER)               │
│  ├─ Superior probability predictions (Both)            │
│  └─ Real-time alerts (OpenWeather)                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 **What Each API Provides**

### 🛰️ **NASA POWER API**

**Strengths:**
- ✅ 40+ years of historical data
- ✅ Global satellite coverage
- ✅ Climate trends and long-term patterns
- ✅ Statistical analysis and probabilities
- ✅ Completely free, no limits

**Used For:**
- Historical temperature/precipitation statistics
- Climate probability analysis
- Long-term trend detection
- Fallback for current conditions

**Example Data:**
```json
{
  "historical": {
    "temperatureStats": {
      "mean": 27.5,
      "min": 22.1,
      "max": 33.8,
      "stdDev": 2.3
    },
    "precipitationStats": {
      "mean": 5.2,
      "max": 45.3,
      "daysWithRain": 145
    },
    "sampleSize": 365
  }
}
```

### 🌤️ **OpenWeather API**

**Strengths:**
- ✅ Real-time current conditions (updated every 10 min)
- ✅ 5-day/3-hour forecasts
- ✅ Feels-like temperature
- ✅ Cloud cover and visibility
- ✅ Weather alerts

**Used For:**
- Current temperature, humidity, pressure
- Short-term forecasts (next 5 days)
- Weather descriptions and icons
- Real-time precipitation

**Example Data:**
```json
{
  "current": {
    "temperature": 28.5,
    "feelsLike": 32.1,
    "humidity": 78,
    "windSpeed": 12.5,
    "description": "scattered clouds",
    "icon": "03d",
    "source": "openweather"
  }
}
```

---

## 🚀 **Using the Hybrid API**

### **New Endpoint:**

```
GET /make-server-0765a8f0/hybrid-weather
```

### **Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `lat` | number | ✅ Yes | - | Latitude (-90 to 90) |
| `lon` | number | ✅ Yes | - | Longitude (-180 to 180) |
| `historical` | boolean | No | `true` | Include NASA historical data |
| `forecast` | boolean | No | `true` | Include OpenWeather forecast |

### **Example Request:**

```javascript
// Full hybrid data (current + historical + forecast)
const response = await fetch(
  `${API_BASE}/hybrid-weather?lat=1.5535&lon=110.3593`
);

// Current conditions only (fastest)
const response = await fetch(
  `${API_BASE}/hybrid-weather?lat=1.5535&lon=110.3593&historical=false&forecast=false`
);

// Historical analysis only
const response = await fetch(
  `${API_BASE}/hybrid-weather?lat=1.5535&lon=110.3593&forecast=false`
);
```

### **Example Response:**

```json
{
  "success": true,
  "hybridMode": true,
  "message": "Using NASA POWER + OpenWeather for maximum accuracy",
  "data": {
    "current": {
      "temperature": 28.5,
      "feelsLike": 32.1,
      "humidity": 78,
      "pressure": 1012,
      "windSpeed": 12.5,
      "windDirection": 180,
      "precipitation": 0,
      "uvIndex": 7,
      "cloudCover": 45,
      "visibility": 10,
      "description": "scattered clouds",
      "icon": "03d",
      "source": "openweather",
      "timestamp": 1704902400
    },
    "forecast": {
      "hourly": [
        {
          "timestamp": 1704906000,
          "temperature": 28.2,
          "precipitation": 0.2,
          "windSpeed": 11.8,
          "description": "light rain",
          "icon": "10d"
        }
        // ... next 7 hours
      ],
      "daily": [
        {
          "date": "2025-01-11",
          "tempMin": 24.5,
          "tempMax": 31.2,
          "precipitation": 5.3,
          "description": "moderate rain",
          "icon": "10d"
        }
        // ... next 4 days
      ]
    },
    "historical": {
      "temperatureStats": {
        "mean": 27.8,
        "min": 22.3,
        "max": 33.5,
        "stdDev": 2.1
      },
      "precipitationStats": {
        "mean": 6.2,
        "max": 52.1,
        "daysWithRain": 156
      },
      "windStats": {
        "mean": 8.5,
        "min": 0.2,
        "max": 28.3,
        "stdDev": 4.2
      },
      "sampleSize": 365
    },
    "probabilities": {
      "rain": 65,
      "heavyRain": 35,
      "extremeHeat": 10,
      "highWind": 20,
      "confidence": 90
    },
    "alerts": [
      {
        "event": "Heavy Rain Warning",
        "severity": "Moderate",
        "description": "Expect heavy rainfall in the next 6 hours",
        "start": 1704910800,
        "end": 1704932400
      }
    ]
  }
}
```

---

## 🎯 **Smart Fallback System**

The hybrid system automatically handles API availability:

### **Scenario 1: Both APIs Available** ✅
```
Current Conditions: OpenWeather (most accurate, real-time)
Forecasts: OpenWeather (5-day hourly)
Historical Data: NASA POWER (40+ years)
Probabilities: Combined (90% confidence)
```

### **Scenario 2: OpenWeather Down** ⚠️
```
Current Conditions: NASA POWER (latest satellite data)
Forecasts: NASA-based estimates
Historical Data: NASA POWER (40+ years)
Probabilities: NASA only (70% confidence)
```

### **Scenario 3: NASA POWER Down** ⚠️
```
Current Conditions: OpenWeather (real-time)
Forecasts: OpenWeather (5-day)
Historical Data: Limited (OpenWeather only provides 5 days)
Probabilities: Forecast-based (75% confidence)
```

---

## 📈 **Accuracy Improvements**

### **Before (NASA Only):**
```
✅ Excellent historical context
✅ Great for climate trends
⚠️ Current conditions: ~1-2 days old
⚠️ No real-time alerts
⚠️ Limited forecast data
```

### **After (Hybrid):**
```
✅ Excellent historical context (NASA)
✅ Great for climate trends (NASA)
✅ Real-time current conditions (OpenWeather)
✅ 5-day hourly forecasts (OpenWeather)
✅ Weather alerts (OpenWeather)
✅ 90% probability confidence (Combined)
```

---

## 🔧 **Configuration**

### **Check Hybrid Mode Status:**

```javascript
// Check if hybrid mode is active
const response = await fetch(`${API_BASE}/hybrid-weather?lat=1.5&lon=110.3`);
const data = await response.json();

console.log(data.hybridMode); // true if OpenWeather configured
console.log(data.message); // Describes which APIs are being used
```

### **Enable Hybrid Mode:**

1. **Add OpenWeather API Key** (already done! ✅)
   - You've already configured: `98cda4edc63b4a997bfe76242b1b49be`
   - Hybrid mode is now ACTIVE!

2. **Verify Configuration:**
   ```typescript
   // In config.tsx
   OPENWEATHER: {
     API_KEY: '98cda4edc63b4a997bfe76242b1b49be', // ✅ Configured
   }
   ```

3. **Test the Endpoint:**
   ```bash
   # In browser console or terminal
   curl "https://YOUR_PROJECT.supabase.co/functions/v1/make-server-0765a8f0/hybrid-weather?lat=1.5535&lon=110.3593"
   ```

---

## 💡 **Use Cases**

### **1. Weather Dashboard**
```typescript
// Get complete weather picture
const weather = await fetch(
  `${API_BASE}/hybrid-weather?lat=${lat}&lon=${lon}`
);

// Display:
// - Current: OpenWeather real-time
// - Forecast: OpenWeather 5-day
// - Historical: NASA POWER trends
```

### **2. Activity Recommendations**
```typescript
// Get current conditions only (fast!)
const weather = await fetch(
  `${API_BASE}/hybrid-weather?lat=${lat}&lon=${lon}&historical=false&forecast=false`
);

// Use real-time OpenWeather data for:
// - Temperature
// - Precipitation
// - Wind speed
// - Activity suitability
```

### **3. Event Planning**
```typescript
// Get historical + forecast
const weather = await fetch(
  `${API_BASE}/hybrid-weather?lat=${lat}&lon=${lon}`
);

// Analyze:
// - Historical probability (NASA)
// - Short-term forecast (OpenWeather)
// - Combined confidence score
```

### **4. Weather Alerts**
```typescript
// Check for active alerts
const weather = await fetch(
  `${API_BASE}/hybrid-weather?lat=${lat}&lon=${lon}&historical=false`
);

if (weather.data.alerts) {
  // Display urgent weather warnings
  weather.data.alerts.forEach(alert => {
    console.log(`⚠️ ${alert.event}: ${alert.description}`);
  });
}
```

---

## 📊 **Data Structure Reference**

### **HybridWeatherData Interface:**

```typescript
interface HybridWeatherData {
  // Real-time current conditions
  current: {
    temperature: number;          // °C
    feelsLike: number;            // °C (heat index)
    humidity: number;             // %
    pressure: number;             // hPa
    windSpeed: number;            // km/h
    windDirection: number;        // degrees
    precipitation: number;        // mm
    uvIndex: number;              // 0-11+
    cloudCover: number;           // %
    visibility: number;           // km
    description: string;          // "scattered clouds"
    icon: string;                 // "03d"
    source: 'openweather' | 'nasa-power';
    timestamp: number;            // Unix timestamp
  };
  
  // Short-term forecast (OpenWeather)
  forecast?: {
    hourly: Array<{
      timestamp: number;
      temperature: number;
      precipitation: number;
      windSpeed: number;
      description: string;
      icon: string;
    }>;
    daily: Array<{
      date: string;
      tempMin: number;
      tempMax: number;
      precipitation: number;
      description: string;
      icon: string;
    }>;
  };
  
  // Historical statistics (NASA POWER)
  historical: {
    temperatureStats: {
      mean: number;
      min: number;
      max: number;
      stdDev: number;
    };
    precipitationStats: {
      mean: number;
      max: number;
      daysWithRain: number;
    };
    windStats: {
      mean: number;
      max: number;
    };
    sampleSize: number;
  };
  
  // Probability analysis (combined)
  probabilities: {
    rain: number;              // % probability
    heavyRain: number;         // % probability
    extremeHeat: number;       // % probability
    highWind: number;          // % probability
    confidence: number;        // % confidence in predictions
  };
  
  // Weather alerts (OpenWeather)
  alerts?: Array<{
    event: string;
    severity: string;
    description: string;
    start: number;
    end: number;
  }>;
}
```

---

## ⚡ **Performance Tips**

### **1. Request Only What You Need:**

```javascript
// ⚡ Fast - Current conditions only
?historical=false&forecast=false

// 🐌 Slower - Everything
?historical=true&forecast=true
```

### **2. Cache Results:**

```javascript
// Cache current conditions for 10 minutes
const cache = new Map();
const cacheKey = `${lat},${lon}`;
const cached = cache.get(cacheKey);

if (cached && Date.now() - cached.timestamp < 600000) {
  return cached.data;
}
```

### **3. Use Parallel Requests:**

```javascript
// Fetch multiple locations in parallel
const locations = [
  { lat: 1.5, lon: 110.3 },
  { lat: 3.1, lon: 101.6 }
];

const results = await Promise.all(
  locations.map(loc => 
    fetch(`${API_BASE}/hybrid-weather?lat=${loc.lat}&lon=${loc.lon}`)
  )
);
```

---

## 🎨 **UI Integration Examples**

### **1. Current Weather Card:**

```tsx
const { current } = weatherData;

<Card>
  <CardHeader>
    <div className="flex items-center gap-2">
      <img src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`} />
      <div>
        <h3>{current.temperature}°C</h3>
        <p className="text-muted-foreground">{current.description}</p>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-2">
      <div>Feels like: {current.feelsLike}°C</div>
      <div>Humidity: {current.humidity}%</div>
      <div>Wind: {current.windSpeed} km/h</div>
      <div>Pressure: {current.pressure} hPa</div>
    </div>
    <Badge variant={current.source === 'openweather' ? 'default' : 'secondary'}>
      {current.source === 'openweather' ? 'Real-time' : 'Satellite'}
    </Badge>
  </CardContent>
</Card>
```

### **2. Forecast Chart:**

```tsx
const { forecast } = weatherData;

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={forecast.hourly}>
    <XAxis 
      dataKey="timestamp" 
      tickFormatter={(ts) => new Date(ts * 1000).toLocaleTimeString()}
    />
    <YAxis />
    <Line type="monotone" dataKey="temperature" stroke="#3b82f6" />
    <Line type="monotone" dataKey="precipitation" stroke="#10b981" />
  </LineChart>
</ResponsiveContainer>
```

### **3. Historical Comparison:**

```tsx
const { current, historical } = weatherData;

<Alert>
  <AlertTitle>Today vs Historical Average</AlertTitle>
  <AlertDescription>
    Current: {current.temperature}°C
    <br />
    Average: {historical.temperatureStats.mean}°C
    <br />
    {current.temperature > historical.temperatureStats.mean + historical.temperatureStats.stdDev 
      ? '⚠️ Warmer than usual' 
      : '✅ Normal temperature'}
  </AlertDescription>
</Alert>
```

### **4. Weather Alerts Banner:**

```tsx
{weatherData.alerts?.map(alert => (
  <Alert variant="destructive" key={alert.event}>
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>{alert.event}</AlertTitle>
    <AlertDescription>{alert.description}</AlertDescription>
  </Alert>
))}
```

---

## ✅ **Benefits Summary**

| Feature | NASA Only | Hybrid (NASA + OpenWeather) |
|---------|-----------|----------------------------|
| Current Conditions | 1-2 days old | Real-time (10 min updates) |
| Forecast | Estimates only | Accurate 5-day forecast |
| Historical Data | ✅ 40+ years | ✅ 40+ years |
| Probabilities | 70% confidence | 90% confidence |
| Weather Alerts | ❌ No | ✅ Yes |
| Feels-like Temp | ❌ No | ✅ Yes |
| Cloud Cover | ❌ No | ✅ Yes |
| Visibility | ❌ No | ✅ Yes |
| API Cost | 🆓 Free | 🆓 Free (60 calls/min) |

---

## 🧪 **Testing**

### **Test the Hybrid Endpoint:**

```bash
# Quick test in browser console
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-0765a8f0/hybrid-weather?lat=1.5535&lon=110.3593')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Hybrid mode:', data.hybridMode);
    console.log('🌡️ Temperature:', data.data.current.temperature + '°C');
    console.log('📊 Data source:', data.data.current.source);
    console.log('🔮 Rain probability:', data.data.probabilities.rain + '%');
  });
```

### **Expected Output:**

```
✅ Hybrid mode: true
🌡️ Temperature: 28.5°C
📊 Data source: openweather
🔮 Rain probability: 65%
```

---

## 🚀 **Next Steps**

### **1. Update Your Components**

Replace NASA-only calls with hybrid endpoint:

```typescript
// OLD (NASA only)
const response = await fetch(`${API_BASE}/conditions?lat=${lat}&lon=${lon}`);

// NEW (Hybrid)
const response = await fetch(`${API_BASE}/hybrid-weather?lat=${lat}&lon=${lon}`);
```

### **2. Add Forecast Display**

Show 5-day forecast from OpenWeather:

```typescript
const { forecast } = weatherData.data;
forecast.daily.forEach(day => {
  console.log(`${day.date}: ${day.tempMin}-${day.tempMax}°C, ${day.description}`);
});
```

### **3. Implement Weather Alerts**

Display urgent warnings to users:

```typescript
if (weatherData.data.alerts) {
  // Show banner/notification
}
```

---

## 📚 **Related Files**

- `/supabase/functions/server/hybrid_weather.tsx` - Hybrid weather module
- `/supabase/functions/server/index.tsx` - API endpoint
- `/supabase/functions/server/config.tsx` - API keys configuration
- `/OPENWEATHER_USAGE_EXPLAINED.md` - OpenWeather background

---

## 🎉 **You're All Set!**

Your CitySync app now uses the **best of both worlds**:
- 🛰️ NASA POWER for historical climate analysis
- 🌤️ OpenWeather for real-time conditions and forecasts
- 🎯 Combined for maximum accuracy and confidence

**Test it now:** Click "View NASA API Status" and all 10 APIs should show green! ✅

---

**Questions?** Check `/API_CREDENTIALS_GUIDE.md` for more details!
