# 📊 CitySync API Architecture - Visual Map

## Complete API Integration Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CITYSYNC APP                              │
│                     (React + TypeScript)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─── User Interface (Frontend)
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Welcome Page │    │ Weather      │    │ Event        │
│              │    │ Dashboard    │    │ Planner      │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│Recommendations│   │ Wildfire     │    │ Conditions   │
│    Page      │    │ Events       │    │    Map       │
└──────────────┘    └──────────────┘    └──────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌────────────────────────────────────────────────────────────────┐
│              BACKEND - Supabase Edge Functions                 │
│                  (Deno + Hono Framework)                       │
│                                                                │
│  📂 /supabase/functions/server/                               │
│     ├─ index.tsx         (Main server)                        │
│     ├─ nasa_api.tsx      (NASA integration)                   │
│     ├─ gemini_ai.tsx     (AI integration)                     │
│     ├─ config.tsx        (API credentials)                    │
│     └─ kv_store.tsx      (Database utilities)                 │
└────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  NASA APIs (6)  │  │  AI Services    │  │ Other Services  │
│                 │  │                 │  │                 │
│ ✅ POWER        │  │ ⚠️ Gemini 2.0   │  │ ✅ OpenStreetMap│
│ ✅ FIRMS        │  │    Flash        │  │ ⚠️ OpenWeather  │
│ ✅ EONET        │  │                 │  │                 │
│ ⚠️ GES DISC     │  │ Features:       │  │ ✅ Supabase     │
│ ⚠️ Giovanni     │  │ • Chat          │  │    Database     │
│ ⚠️ DataRods     │  │ • Recommend     │  │ ✅ Supabase Auth│
│                 │  │ • Photo AI      │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘

Legend:
  ✅ = Working without credentials (Public API)
  ⚠️ = Requires API key/credentials configuration
```

---

## Data Flow Architecture

### 1️⃣ **User Opens App**
```
User Location Detection
        │
        ├─── GPS Available?
        │    └─── Yes → Get Coordinates
        │    └─── No → Use Default (Kuching, Sarawak)
        │
        └─── Reverse Geocoding
             └─── OpenStreetMap Nominatim
                  └─── Returns: City Name, Country
```

---

### 2️⃣ **Activity Recommendations Flow**
```
User Selects "Outdoor" or "Indoor"
        │
        ▼
Backend: GET /conditions?lat={lat}&lon={lon}
        │
        ├─── Parallel API Calls:
        │    │
        │    ├─── NASA POWER API
        │    │    └─── Temperature, Humidity, Precipitation, Wind, Solar
        │    │
        │    ├─── NASA FIRMS
        │    │    └─── Active Wildfires (500km radius)
        │    │
        │    └─── NASA EONET
        │         └─── Natural Events (500km radius, 30 days)
        │
        ▼
Data Processing & Analysis
        │
        ├─── Calculate UV Index
        ├─── Estimate Air Quality
        ├─── Assess Flood Risk
        ├─── Assess Haze Severity
        ├─── Calculate Wildfire Risk
        └─── Categorize Natural Events
        │
        ▼
Activity Suitability Score
        │
        └─── Return: Excellent / Good / Fair / Poor
             └─── Frontend displays recommendations
```

---

### 3️⃣ **Weather Dashboard Flow**
```
User Opens Weather Dashboard
        │
        ▼
Backend: GET /climate-trends?days=30
        │
        └─── NASA POWER API
             └─── 30 days historical data
                  │
                  ├─── Daily Temperature
                  ├─── Daily Humidity
                  ├─── Daily Precipitation
                  └─── Daily Wind Speed
        │
        ▼
Frontend: Display Charts
        │
        ├─── Line Chart: Temperature Trends
        ├─── Line Chart: Precipitation Trends
        └─── Environmental Alerts Display
```

---

### 4️⃣ **Event Planner Flow**
```
User Creates Event
        │
        ├─── Event Name
        ├─── Date Selection
        └─── Location
        │
        ▼
Backend: GET /climate-trends?days={daysUntilEvent}
        │
        ├─── NASA POWER API
        │    └─── Climate forecast for date range
        │
        └─── NASA EONET API
             └─── Check upcoming natural events
        │
        ▼
Risk Assessment
        │
        ├─── Calculate weather probability
        ├─── Identify environmental risks
        └─── Generate recommendations
        │
        ▼
Return Event Safety Score
```

---

### 5️⃣ **Wildfire Monitoring Flow**
```
User Opens Wildfire Events Page
        │
        ▼
Backend: Parallel Calls
        │
        ├─── GET /wildfires?lat={lat}&lon={lon}&radius=500
        │    │
        │    └─── NASA FIRMS API
        │         └─── Active fires within 500km
        │              │
        │              ├─── Fire coordinates
        │              ├─── Brightness level
        │              ├─── Confidence rating
        │              └─── Detection time
        │
        └─── GET /natural-events?lat={lat}&lon={lon}&radius=500&days=30
             │
             └─── NASA EONET API
                  └─── All natural events within 500km
                       │
                       ├─── Severe storms
                       ├─── Wildfires (historical)
                       ├─── Floods
                       ├─── Volcanoes
                       └─── Other disasters
        │
        ▼
Calculate Distances from User
        │
        ├─── Sort by distance (nearest first)
        └─── Display on map/list
```

---

### 6️⃣ **AI Features Flow** (When Gemini API Configured)
```
User Interacts with AI
        │
        ├─── Chat with AI Assistant
        │    │
        │    └─── POST /ai/chat
        │         └─── Google Gemini 2.0 Flash
        │              │
        │              ├─── Context: User location
        │              ├─── Context: Current weather
        │              └─── Context: Activity preferences
        │              │
        │              └─── Return: Natural language response
        │
        ├─── Get Smart Recommendations
        │    │
        │    └─── POST /ai/recommendations
        │         └─── Gemini analyzes:
        │              ├─── NASA climate data
        │              ├─── User preferences
        │              └─── Safety conditions
        │              │
        │              └─── Return: Personalized activities
        │
        └─── Analyze Photo
             │
             └─── POST /ai/analyze-photo
                  └─── Gemini vision model:
                       ├─── Identify weather conditions
                       ├─── Detect environmental hazards
                       └─── Provide safety insights
```

---

## API Endpoint Map

### 🔐 **Authentication Endpoints**
```
POST /make-server-0765a8f0/signup
  ├─ Input: email, password, name
  └─ Output: user data, access_token

POST /make-server-0765a8f0/signin
  ├─ Input: email, password
  └─ Output: user data, access_token
```

---

### 🌍 **NASA Data Endpoints**
```
GET /make-server-0765a8f0/conditions?lat={lat}&lon={lon}
  ├─ Calls: NASA POWER, FIRMS, EONET
  └─ Output: Complete environmental conditions

GET /make-server-0765a8f0/climate-trends?days={days}&lat={lat}&lon={lon}
  ├─ Calls: NASA POWER
  └─ Output: Historical climate data array

GET /make-server-0765a8f0/wildfires?lat={lat}&lon={lon}&radius={km}
  ├─ Calls: NASA FIRMS
  └─ Output: Active wildfire array

GET /make-server-0765a8f0/natural-events?lat={lat}&lon={lon}&radius={km}&days={days}
  ├─ Calls: NASA EONET
  └─ Output: Natural disaster events array

GET /make-server-0765a8f0/test-nasa
  ├─ Tests: All 6 NASA APIs
  └─ Output: Status report
```

---

### 🤖 **AI Endpoints** (Requires Gemini API Key)
```
POST /make-server-0765a8f0/ai/chat
  ├─ Input: message, location, conditions
  └─ Output: AI chat response

POST /make-server-0765a8f0/ai/recommendations
  ├─ Input: activityType, location, conditions
  └─ Output: Smart activity recommendations

POST /make-server-0765a8f0/ai/safety-insights
  ├─ Input: location, conditions
  └─ Output: Personalized safety insights

POST /make-server-0765a8f0/ai/analyze-photo
  ├─ Input: base64 image
  └─ Output: Environmental analysis

POST /make-server-0765a8f0/ai/suggest-places
  ├─ Input: activity, location
  └─ Output: Real place suggestions
```

---

### 👤 **User Data Endpoints**
```
GET /make-server-0765a8f0/history
  ├─ Auth: Required (access_token)
  └─ Output: User activity history array

POST /make-server-0765a8f0/save-activity
  ├─ Auth: Required (access_token)
  ├─ Input: activityType, activity, conditions
  └─ Output: Success confirmation
```

---

## Configuration File Structure

### 📁 `/supabase/functions/server/config.tsx`
```typescript
export const CONFIG = {
  NASA: {
    USERNAME: 'freddieallance',      // ✅ Your credentials
    PASSWORD: 'Freddie@LLance99',    // ✅ Your credentials
  },
  
  OPENWEATHER: {
    API_KEY: 'YOUR_KEY_HERE',        // ⚠️ Optional - not configured
  },
  
  GEMINI: {
    API_KEY: 'YOUR_KEY_HERE',        // ⚠️ Needed for AI - not configured
  },
};
```

---

## Real-Time Data Sources

### NASA POWER API
```
📍 Source: NASA Langley Research Center
🌐 URL: power.larc.nasa.gov
📊 Data: Global climate data since 1981
🔄 Update: Daily
🗺️ Coverage: Worldwide
📏 Resolution: 0.5° x 0.5° (~55km)
✅ Status: Public, no auth required
```

### NASA FIRMS
```
📍 Source: NASA Fire Information for Resource Management System
🌐 URL: firms.modaps.eosdis.nasa.gov
📊 Data: Active fire detections
🔄 Update: Near real-time (3-hour delay)
🗺️ Coverage: Worldwide
📏 Resolution: 375m (VIIRS), 1km (MODIS)
✅ Status: Public, no auth required
```

### NASA EONET
```
📍 Source: NASA Earth Observatory Natural Event Tracker
🌐 URL: eonet.gsfc.nasa.gov
📊 Data: Natural disasters and events
🔄 Update: Near real-time
🗺️ Coverage: Worldwide
📏 Resolution: Event-based
✅ Status: Public, no auth required
```

### NASA GES DISC (Authenticated)
```
📍 Source: NASA Goddard Earth Sciences Data and Information Services Center
🌐 URL: disc.gsfc.nasa.gov
📊 Data: Atmospheric composition
🔄 Update: Daily to monthly
🗺️ Coverage: Worldwide
📏 Resolution: Varies by dataset
⚠️ Status: Requires NASA Earthdata login
```

### Google Gemini 2.0 Flash
```
📍 Source: Google AI Studio
🌐 URL: ai.google.dev
📊 Features: Text generation, vision, chat
🔄 Update: Real-time AI responses
🗺️ Coverage: Global knowledge base
📏 Context: 32k tokens
⚠️ Status: Requires API key
```

---

## Current Integration Status

| Service | Type | Status | Required For | Configuration |
|---------|------|--------|--------------|---------------|
| NASA POWER | Public API | ✅ Working | Weather data | None |
| NASA FIRMS | Public API | ✅ Working | Wildfire tracking | None |
| NASA EONET | Public API | ✅ Working | Disaster tracking | None |
| NASA GES DISC | Auth API | ⚠️ Configured | Air quality | NASA login in config.tsx |
| NASA Giovanni | Auth API | ⚠️ Configured | Climate analysis | NASA login in config.tsx |
| NASA DataRods | Auth API | ⚠️ Configured | Hydrology | NASA login in config.tsx |
| Gemini 2.0 | API Key | ❌ Not Set | AI features | Add key to config.tsx |
| OpenWeather | API Key | ❌ Not Set | Optional weather | Add key to config.tsx |
| OpenStreetMap | Public API | ✅ Working | Geocoding | None |
| Supabase DB | Managed | ✅ Working | Data storage | Auto-configured |
| Supabase Auth | Managed | ✅ Working | User login | Auto-configured |

---

## Testing Your Setup

### Quick Test Command (Browser Console):
```javascript
// Test NASA APIs
fetch('https://wqhvxhgddvumohhtmcjf.supabase.co/functions/v1/make-server-0765a8f0/test-nasa')
  .then(r => r.json())
  .then(data => console.log('NASA APIs:', data.apisAvailable, '/', data.totalAPIs));

// Test environmental conditions
fetch('https://wqhvxhgddvumohhtmcjf.supabase.co/functions/v1/make-server-0765a8f0/conditions?lat=1.5535&lon=110.3593')
  .then(r => r.json())
  .then(data => console.log('Conditions:', data));

// Test climate trends
fetch('https://wqhvxhgddvumohhtmcjf.supabase.co/functions/v1/make-server-0765a8f0/climate-trends?days=7')
  .then(r => r.json())
  .then(data => console.log('Climate Trends:', data));
```

---

## 🎯 Summary

**You have:**
- ✅ 3 Public NASA APIs working immediately
- ✅ 3 Authenticated NASA APIs (credentials configured)
- ✅ Location services (OpenStreetMap)
- ✅ User authentication system
- ✅ Database storage
- ⚠️ AI features (needs Gemini API key)
- ⚠️ Enhanced weather (optional OpenWeather key)

**Total APIs Active: 8-11 depending on configuration**

**Next Step:** Test your NASA credentials to verify all 6 NASA APIs work! 🚀