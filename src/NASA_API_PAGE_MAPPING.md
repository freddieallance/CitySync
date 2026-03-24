# 🗺️ CitySync - NASA API to Page Mapping (Detailed)

## Complete Component-to-API Mapping

This document shows **exactly which NASA APIs are used by which pages** in CitySync, including the specific data flows and API endpoints.

---

## 📊 Visual Overview

```
CitySync Pages
├── WelcomePage.tsx ..................... No direct NASA calls
├── LoginPage.tsx ....................... No NASA calls
├── RegisterPage.tsx .................... No NASA calls
│
├── RecommendationsPage.tsx ............. ✅ NASA POWER
│   └── Fetches: /conditions
│
├── PlaceSuggestionsPage.tsx ............ ✅ NASA POWER
│   └── Fetches: /conditions, /activity-safety
│
├── ConditionsMapPage.tsx ............... ✅ NASA POWER + EONET + FIRMS
│   └── Fetches: /conditions (includes all 3 APIs)
│
├── WeatherDashboardPage.tsx ............ ✅ NASA POWER
│   ├── Fetches: /conditions
│   └── Fetches: /climate-trends
│
├── EventPlannerPage.tsx ................ ✅ NASA POWER + EONET + FIRMS
│   ├── Fetches: /conditions
│   └── Uses: naturalEvents data from EONET
│
├── WildfireEventsPage.tsx .............. ✅ NASA FIRMS + EONET
│   └── Used by: EventPlannerPage (embedded)
│
├── NASACredentialsPage.tsx ............. ✅ GES DISC + Giovanni + DataRods
│   └── Manages: Earthdata authentication
│
├── UserProfilePage.tsx ................. No NASA calls
├── HistoryPage.tsx ..................... No NASA calls
└── AISettingsPage.tsx .................. No NASA calls
```

---

## 🔥 Detailed Page-by-Page Breakdown

### 1. **WelcomePage.tsx** (Home)
**NASA APIs Used:** None directly  
**Purpose:** Landing page with navigation  

**What it does:**
- Shows user location (from GPS)
- Displays navigation cards to other features
- Links to Weather Dashboard and Event Planner (which use NASA data)

**No API calls made from this page.**

---

### 2. **RecommendationsPage.tsx** (Activity Recommendations)
**NASA APIs Used:** 
- ✅ **NASA POWER** (via `/conditions` endpoint)

**API Call Flow:**
```typescript
// Location: /lib/api.ts
export async function getEnvironmentalConditions(latitude, longitude)
  ↓
Backend: /make-server-0765a8f0/conditions?lat={lat}&lon={lon}
  ↓
Server: /supabase/functions/server/nasa_api.tsx
  ↓
NASA POWER API: https://power.larc.nasa.gov/api/temporal/daily/point
  ↓
Returns: temperature, humidity, precipitation, wind, solar radiation
```

**Data Used:**
- Temperature → Determines heat warnings
- Precipitation → Calculates rain probability
- UV Index (calculated from solar radiation) → UV warnings
- Air Quality (estimated) → Safety recommendations

**Component Features:**
1. **Activity Cards** - Shows outdoor/indoor activities
2. **Safety Indicators** - Green/Yellow/Red status based on NASA data
3. **Weather Warnings** - "High UV", "Heavy Rain", "Poor Air Quality"
4. **AI Recommendations** - Gemini analyzes NASA data for suggestions

**Visual Elements:**
- Activity cards with safety badges
- Weather condition summary bar
- Real-time temperature and rain chance display
- Location picker (updates NASA data query)

---

### 3. **PlaceSuggestionsPage.tsx** (Place Recommendations)
**NASA APIs Used:**
- ✅ **NASA POWER** (via `/conditions` and `/activity-safety` endpoints)

**API Call Flow:**
```typescript
// First call: Get conditions
/make-server-0765a8f0/conditions?lat={lat}&lon={lon}
  ↓
NASA POWER: Climate data

// Second call: Get safety assessment
/make-server-0765a8f0/activity-safety?type={outdoor/indoor}
  ↓
Analyzes NASA data for activity-specific safety
```

**Data Used:**
- **Temperature** → Heat warnings for outdoor venues
- **Precipitation** → Rain probability for each place
- **UV Index** → Sunscreen recommendations
- **Air Quality** → Respiratory health warnings
- **Wind Speed** → Beach/outdoor suitability

**Component Features:**
1. **Place Cards** - Shows parks, beaches, malls, etc.
2. **Safety Ratings** - "Good", "Fair", "Bad" per location
3. **Specific Warnings** - "Bring umbrella", "Wear sunscreen"
4. **Distance Display** - km from user location
5. **User Feedback** - Community reviews per place

**Place-Specific Assessments:**
- **Parks** - Checks temperature, rain, air quality
- **Beaches** - Checks UV, wind, rain
- **Hiking Trails** - Checks temperature, precipitation, air quality
- **Indoor Venues** - Only used during bad weather conditions

---

### 4. **ConditionsMapPage.tsx** (Environmental Conditions Map)
**NASA APIs Used:**
- ✅ **NASA POWER** - Weather data
- ✅ **NASA EONET** - Natural disaster events
- ✅ **NASA FIRMS** - Active wildfires

**API Call Flow:**
```typescript
/make-server-0765a8f0/conditions?lat={lat}&lon={lon}
  ↓
Parallel calls to:
├── NASA POWER (climate data)
├── NASA FIRMS (wildfire detection) 
└── NASA EONET (natural events)
  ↓
Combined response with all environmental data
```

**Data Used:**
```javascript
{
  weather: {
    temperature: 28.5,
    humidity: 75,
    precipitation: 15,
    rainChance: 50,
    uvIndex: 7,
    windSpeed: 12
  },
  airQuality: {
    aqi: 68,
    pm25: 28,
    status: "Moderate"
  },
  wildfires: {
    count: 3,
    nearestDistance: 150,  // km
    riskLevel: "Moderate",
    fires: [/* fire locations */]
  },
  naturalEvents: {
    total: 5,
    byCategory: [
      { category: "Wildfires", count: 2 },
      { category: "Severe Storms", count: 3 }
    ]
  }
}
```

**Component Features:**
1. **Environmental Metrics** - Temp, humidity, AQI, UV
2. **Map View** - Shows user location (could show events)
3. **Wildfire Alerts** - Count and proximity
4. **Natural Events** - Storms, floods, earthquakes nearby
5. **Flood/Haze Risk** - Regional assessments
6. **Data Source Attribution** - "Powered by NASA"

**Visual Elements:**
- Metric cards with icons
- Color-coded status indicators (green/yellow/red)
- Alert badges for hazards
- Location display with coordinates
- Real-time timestamp

---

### 5. **WeatherDashboardPage.tsx** (Weather Analytics & Trends)
**NASA APIs Used:**
- ✅ **NASA POWER** (via `/conditions` and `/climate-trends` endpoints)

**API Call Flow:**
```typescript
// Call 1: Current conditions
/make-server-0765a8f0/conditions?lat={lat}&lon={lon}
  ↓
NASA POWER: Last 7 days average

// Call 2: Historical trends
/make-server-0765a8f0/climate-trends?days=30&lat={lat}&lon={lon}
  ↓
NASA POWER: Daily data for last 30 days
  ↓
Returns: Array of {date, temperature, humidity, precipitation, windSpeed}
```

**Data Used:**
- **Current Weather** - Real-time snapshot
- **30-Day Temperature Trend** - Line chart
- **30-Day Humidity Trend** - Line chart  
- **30-Day Precipitation Trend** - Bar chart
- **30-Day Wind Speed Trend** - Line chart

**Component Features:**
1. **Overview Dashboard**
   - Current temperature, humidity, wind
   - Rain probability
   - UV Index
   - AQI estimate

2. **Air Quality Dashboard**
   - AQI value and status
   - PM2.5 levels
   - Health recommendations
   - Historical AQI trend (estimated)

3. **Flooding Dashboard**
   - Precipitation analysis
   - Flood risk level
   - Affected areas list
   - 7-day precipitation chart

4. **Healthcare Dashboard**  
   - Temperature extremes
   - Heat index
   - Respiratory health (AQI-based)
   - UV exposure warnings

5. **Trend Charts**
   - Temperature over 30 days (Recharts)
   - Precipitation patterns
   - Humidity variations
   - Wind speed changes

**Visual Elements:**
- Interactive line charts (Recharts library)
- Tabbed navigation between dashboards
- Metric cards with trend indicators (↑↓)
- Color-coded status badges
- Export data button (downloads CSV)
- Location picker for different cities

**Technical Implementation:**
```typescript
// Example chart data transformation
const chartData = trends.map(day => ({
  date: formatDate(day.date),
  temperature: day.temperature,
  humidity: day.humidity,
  precipitation: day.precipitation
}));

<LineChart data={chartData}>
  <Line dataKey="temperature" stroke="#ef4444" />
  <Line dataKey="humidity" stroke="#3b82f6" />
</LineChart>
```

---

### 6. **EventPlannerPage.tsx** (Weather Event Planning)
**NASA APIs Used:**
- ✅ **NASA POWER** - Weather forecasts
- ✅ **NASA EONET** - Natural disaster events
- ✅ **NASA FIRMS** - Wildfire detection

**API Call Flow:**
```typescript
/make-server-0765a8f0/conditions?lat={lat}&lon={lon}
  ↓
Returns full environmental data including:
├── Weather conditions (NASA POWER)
├── Natural events (NASA EONET)
└── Wildfire data (NASA FIRMS)
```

**Data Used:**
- **Weather Suitability** - For selected event date
- **Natural Disaster Warnings** - Events within 500km
- **Wildfire Proximity** - Active fires near event location
- **Historical Patterns** - Similar dates in past years

**Component Features:**
1. **Event Form**
   - Event name input
   - Date picker (Calendar component)
   - Location selector
   - Activity type selection

2. **Weather Forecast** (for selected date)
   - Expected temperature range
   - Precipitation probability
   - Wind conditions
   - UV index forecast

3. **Risk Assessment**
   - Overall safety score (0-100)
   - Specific hazard warnings
   - Natural disaster alerts
   - Wildfire proximity warnings

4. **Wildfire Events Panel** (WildfireEventsPage embedded)
   - Active fires list
   - Distance from event location
   - Fire confidence levels
   - Detection timestamps

5. **Natural Events Panel**
   - Storms, floods, earthquakes
   - Event categories
   - Distance from event
   - Event status (open/closed)

6. **Recommendations**
   - Best backup dates
   - Alternative locations
   - Safety precautions
   - Required equipment

**Visual Elements:**
- Date picker calendar
- Risk meter visualization
- Event cards with hazard badges
- Map showing event location + hazards
- AI-generated suggestions panel

**User Flow:**
```
1. User selects event date and location
2. System fetches NASA data for that location
3. Analyzes historical weather patterns for that date
4. Checks for active/predicted natural disasters
5. Calculates suitability score
6. Displays recommendations and warnings
7. Saves event to user's calendar (if logged in)
```

---

### 7. **WildfireEventsPage.tsx** (Wildfire Tracking)
**NASA APIs Used:**
- ✅ **NASA FIRMS** - Active fire detection
- ✅ **NASA EONET** - Wildfire events

**API Call Flow:**
```typescript
/make-server-0765a8f0/conditions?lat={lat}&lon={lon}
  ↓
Returns wildfires and naturalEvents data
  ↓
Filters for wildfire-specific events
```

**Data Structure:**
```javascript
wildfires: {
  detected: true,
  count: 5,
  nearestDistance: 150,  // km
  riskLevel: "Moderate",
  fires: [
    {
      id: "fire_1",
      latitude: 1.5535,
      longitude: 110.3593,
      brightness: 320.5,  // Kelvin
      confidence: "high",  // low/nominal/high
      distance: 150,  // km from user
      detected: "2025-10-04 14:30"
    },
    // ... more fires
  ]
}

naturalEvents: {
  byCategory: [
    {
      category: "Wildfires",
      count: 3,
      events: [
        {
          id: "EONET_6789",
          title: "Wildfire - Borneo",
          description: "Active wildfire in Sarawak region",
          date: "2025-10-03T10:00:00Z",
          latitude: 1.6,
          longitude: 110.4,
          distance: 120,
          link: "https://eonet.gsfc.nasa.gov/..."
        }
      ]
    }
  ]
}
```

**Component Features:**
1. **Fire Summary Card**
   - Total active fires count
   - Nearest fire distance
   - Overall risk level
   - Last update timestamp

2. **Active Fires List (NASA FIRMS data)**
   - Each fire's location (lat/lon)
   - Distance from user
   - Brightness (temperature)
   - Confidence level indicator
   - Detection time

3. **Wildfire Events (NASA EONET data)**
   - Named wildfire events
   - Event descriptions
   - Geographic coordinates
   - Status and links

4. **Risk Indicators**
   - Color-coded risk levels:
     - 🟢 None - No fires detected
     - 🟡 Low - Fires >200km away
     - 🟠 Moderate - Fires 100-200km
     - 🔴 High - Fires 50-100km
     - ⛔ Extreme - Fires <50km

5. **Safety Recommendations**
   - Air quality warnings
   - Evacuation advisories (if close)
   - Protective measures
   - Emergency contacts

**Visual Elements:**
- Fire icon badges
- Distance indicators
- Confidence meters (%)
- Sorting by distance/brightness
- Real-time update indicator
- Link to NASA EONET for details

**Used By:**
- **EventPlannerPage** - Embedded to show fire risks
- Can be standalone page (requires routing update)

---

### 8. **NASACredentialsPage.tsx** (NASA Earthdata Authentication)
**NASA APIs Used:**
- ✅ **GES DISC** (requires authentication)
- ✅ **Giovanni** (requires authentication)
- ✅ **DataRods** (requires authentication)

**Purpose:**  
Allows users to connect their NASA Earthdata account to access advanced authenticated APIs.

**API Flow:**
```typescript
// Save credentials
POST /make-server-0765a8f0/nasa/credentials
Body: { username: "user@email.com", password: "***" }
Authorization: Bearer {accessToken}
  ↓
Server encrypts and stores in KV store
  ↓
Returns: { success: true, username: "user@email.com" }

// Test connection
GET /make-server-0765a8f0/nasa/test-connection
Authorization: Bearer {accessToken}
  ↓
Server retrieves credentials
  ↓
Tests authentication with GES DISC
  ↓
Returns: { success: true, apis: ["gesdisc", "giovanni", "datarods"] }
```

**Component Features:**
1. **Status Display**
   - Shows if credentials are saved
   - Displays connected username
   - Lists accessible APIs

2. **Credential Form**
   - Username input
   - Password input (hidden)
   - Save button
   - Test connection button

3. **API Status Indicators**
   - GES DISC - Available ✅ / Not Available ❌
   - Giovanni - Available ✅ / Not Available ❌
   - DataRods - Available ✅ / Not Available ❌

4. **Information Panel**
   - What each API provides
   - Registration instructions
   - Link to https://urs.earthdata.nasa.gov/
   - Privacy notice (password encrypted)

5. **Delete Credentials**
   - Remove stored credentials
   - Confirmation dialog

**Data NOT Stored:**
- Plain text passwords ❌
- Passwords are encrypted before storage ✅
- Only username is returned to frontend ✅

**Available Authenticated APIs:**

**GES DISC (Goddard Earth Sciences Data and Information Services Center)**
- High-resolution atmospheric data
- MERRA-2 reanalysis data
- Precipitation measurements (GPM)
- Aerosol observations
- Use case: Advanced air quality analysis

**Giovanni (Online Data Analysis)**
- Atmospheric composition analysis
- Time-averaged maps
- Correlation studies
- Vertical profiles
- Use case: Climate research and visualization

**DataRods (Hydrology Data)**
- Near-real-time precipitation
- Soil moisture data
- Streamflow estimates
- Drought indicators
- Use case: Flood forecasting and water management

**Visual Elements:**
- Credential input form
- Status badges (connected/disconnected)
- API feature descriptions
- Test connection button
- Success/error notifications
- Registration help link

---

## 🔄 Backend API Endpoints

All NASA data flows through the Supabase Edge Function server:

### Server File: `/supabase/functions/server/index.tsx`

**Available Endpoints:**

#### 1. `GET /make-server-0765a8f0/conditions`
**Query Params:** `?lat={latitude}&lon={longitude}`  
**NASA APIs Called:**
- NASA POWER (climate data)
- NASA FIRMS (wildfires)
- NASA EONET (natural events)

**Used By:**
- RecommendationsPage
- PlaceSuggestionsPage
- ConditionsMapPage
- WeatherDashboardPage
- EventPlannerPage

**Response:**
```json
{
  "timestamp": "2025-10-04T12:00:00Z",
  "location": { "latitude": 1.5535, "longitude": 110.3593 },
  "dataSource": {
    "primary": "Multiple NASA APIs",
    "sources": [
      "NASA POWER API - Climate & Weather",
      "NASA FIRMS - Active Wildfires",
      "NASA EONET - Natural Disaster Events"
    ]
  },
  "weather": { /* NASA POWER data */ },
  "airQuality": { /* Estimated from NASA data */ },
  "flood": { /* Calculated from precipitation */ },
  "haze": { /* Estimated from air quality */ },
  "wildfires": { /* NASA FIRMS data */ },
  "naturalEvents": { /* NASA EONET data */ }
}
```

---

#### 2. `GET /make-server-0765a8f0/activity-safety`
**Query Params:** `?type={outdoor|indoor}&lat={lat}&lon={lon}`  
**NASA APIs Called:**
- NASA POWER (via conditions endpoint)

**Used By:**
- PlaceSuggestionsPage
- RecommendationsPage (implicit)

**Response:**
```json
{
  "overallSafety": "Good",
  "safetyScore": 85,
  "weatherScore": 90,
  "airQualityScore": 80,
  "warnings": ["High UV index"],
  "recommendations": ["Wear sunscreen"],
  "conditions": { /* Full NASA data */ }
}
```

---

#### 3. `GET /make-server-0765a8f0/climate-trends`
**Query Params:** `?days={30}&lat={lat}&lon={lon}`  
**NASA APIs Called:**
- NASA POWER (historical data)

**Used By:**
- WeatherDashboardPage

**Response:**
```json
{
  "location": { "latitude": 1.5535, "longitude": 110.3593 },
  "period": { "start": "20250904", "end": "20251004" },
  "dataPoints": 30,
  "trends": [
    {
      "date": "20250904",
      "temperature": 28.5,
      "humidity": 75.2,
      "precipitation": 15.3,
      "windSpeed": 3.2
    },
    // ... 29 more days
  ]
}
```

---

#### 4. `POST /make-server-0765a8f0/nasa/credentials`
**Body:** `{ username: string, password: string }`  
**NASA APIs:** GES DISC, Giovanni, DataRods (authentication setup)

**Used By:**
- NASACredentialsPage

---

#### 5. `GET /make-server-0765a8f0/nasa/test-connection`
**NASA APIs Called:**
- GES DISC (test authentication)

**Used By:**
- NASACredentialsPage

---

## 📱 Component Dependencies

### Pages Using NASA Data (Directly or Indirectly)

| Page | Direct NASA Call | Indirect (via props) | APIs Used |
|------|-----------------|---------------------|-----------|
| **WelcomePage** | ❌ No | ❌ No | None |
| **LoginPage** | ❌ No | ❌ No | None |
| **RegisterPage** | ❌ No | ❌ No | None |
| **RecommendationsPage** | ✅ Yes | ❌ No | POWER |
| **PlaceSuggestionsPage** | ✅ Yes | ❌ No | POWER |
| **ConditionsMapPage** | ✅ Yes | ❌ No | POWER, FIRMS, EONET |
| **WeatherDashboardPage** | ✅ Yes | ❌ No | POWER |
| **EventPlannerPage** | ✅ Yes | ❌ No | POWER, FIRMS, EONET |
| **WildfireEventsPage** | ❌ No | ✅ Yes (from parent) | FIRMS, EONET |
| **NASACredentialsPage** | ✅ Yes | ❌ No | Auth Setup |
| **UserProfilePage** | ❌ No | ❌ No | None |
| **HistoryPage** | ❌ No | ❌ No | None |

---

## 🤖 AI Integration with NASA Data

### AIChatAssistant.tsx
**NASA Data Integration:**  
When users ask questions, the AI receives current NASA conditions as context:

```typescript
// Context passed to Gemini 2.0 Flash
const context = {
  location: "Kuching, Malaysia",
  nasaData: {
    temperature: 28.5,
    humidity: 75,
    precipitation: 15,
    uvIndex: 7,
    aqi: 68,
    wildfires: { count: 3, nearest: 150 },
    naturalEvents: { count: 5 }
  }
};

// AI analyzes NASA data to answer questions like:
"Is it safe to go hiking today?"
"What's the air quality like?"
"Are there any wildfires nearby?"
"Should I bring an umbrella?"
```

**Used By:**
- Can be embedded in any page (currently available via future implementation)

### AISmartRecommendations.tsx
**NASA Data Integration:**  
Generates intelligent suggestions based on NASA environmental data:

```typescript
// AI receives NASA conditions and generates:
{
  recommendations: [
    "Perfect weather for beach activities",
    "UV index is high - wear sunscreen",
    "Air quality is moderate - limit intense exercise"
  ],
  alternatives: [
    "If rain increases, consider indoor activities",
    "Evening outdoor activities recommended (lower UV)"
  ]
}
```

**Used By:**
- RecommendationsPage
- PlaceSuggestionsPage

---

## 📊 Data Update Frequency

| NASA API | Update Frequency | Latency | Cache Recommendation |
|----------|-----------------|---------|---------------------|
| **NASA POWER** | Daily | 1-2 days | 30 minutes |
| **NASA FIRMS** | Every 24h | Real-time | 1 hour |
| **NASA EONET** | Real-time | Real-time | 15 minutes |
| **GES DISC** | Varies | 3-7 days | 1 hour |
| **Giovanni** | On-demand | N/A | Session-based |
| **DataRods** | Daily | 1-2 days | 30 minutes |

**Current Implementation:**  
❌ No caching (fetches fresh data every request)

**Recommended:**  
✅ Add 30-minute cache to reduce API calls

---

## 🎯 Key Takeaways

### Primary Data Source: NASA POWER
**Powers 90% of the app:**
- Temperature, humidity, precipitation, wind, solar radiation
- Used across 5 major pages
- Provides baseline for all environmental calculations

### Real-Time Hazards: NASA FIRMS + EONET
**Critical for safety features:**
- Wildfire detection within 500km
- Natural disaster tracking
- Event risk assessment

### Advanced Features: Authenticated APIs
**Optional enhancements:**
- High-resolution atmospheric data (GES DISC)
- Custom analysis and visualization (Giovanni)
- Hydrological modeling (DataRods)

### AI Enhancement: Google Gemini 2.0
**Analyzes NASA data for:**
- Natural language responses
- Personalized recommendations
- Trend analysis
- Safety assessments

---

## 🚀 Future Enhancements

### Phase 1 (Easy) - No New APIs
- [ ] Add response caching (30 min)
- [ ] Add loading skeletons for NASA data
- [ ] Show data age ("Updated 2 minutes ago")
- [ ] Add refresh button to force new data
- [ ] Display API status indicators

### Phase 2 (Medium) - Enhanced Visualization
- [ ] NASA Worldview satellite imagery on map
- [ ] Animated weather overlays
- [ ] Wildfire heat maps
- [ ] Natural event timeline view
- [ ] Comparative location analysis

### Phase 3 (Advanced) - New NASA APIs
- [ ] NASA GPM (Global Precipitation) - Real-time rain radar
- [ ] NASA SMAP (Soil Moisture) - Flood prediction
- [ ] NASA MODIS (Vegetation) - Drought monitoring
- [ ] NASA VIIRS (Night Lights) - Urban activity
- [ ] NASA GRACE (Groundwater) - Water availability

---

## 📞 Troubleshooting

### "No NASA data showing"
**Check:**
1. Browser console for API errors
2. Server logs in Supabase dashboard
3. Valid location coordinates (lat: -90 to 90, lon: -180 to 180)
4. Internet connectivity
5. NASA API status (power.larc.nasa.gov)

### "Wildfire data not updating"
**Reason:** NASA FIRMS updates every 24 hours  
**Solution:** This is expected - wildfires are detected daily, not hourly

### "Authenticated APIs not working"
**Check:**
1. NASA Earthdata credentials saved
2. Test connection successful
3. Username/password correct
4. Earthdata account active

---

**Last Updated:** October 4, 2025  
**Total Pages:** 11  
**Pages Using NASA Data:** 6  
**NASA APIs Integrated:** 8 (5 free + 3 authenticated)  
**Primary API:** NASA POWER (Climate & Weather)  
**Real-Time APIs:** NASA FIRMS (Wildfires), NASA EONET (Events)