# Geolocation Features

## Overview

The app now has comprehensive geolocation capabilities integrated throughout, particularly for the Environmental Alerts (Wildfire & Natural Disaster Tracking) feature powered by NASA real-time satellite data.

---

## 🌍 How Geolocation Works

### 1. **Automatic GPS Detection on Startup**

When the app loads, it automatically attempts to detect your location using the browser's Geolocation API:

```typescript
// App.tsx - Runs on app startup
useEffect(() => {
  if (navigator.geolocation && navigator.permissions) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Reverse geocode to get human-readable name
        setUserLocation({ latitude, longitude, name: locationName });
      }
    );
  }
}, []);
```

**Features:**
- ✅ Graceful fallback to default location (Kuching, Sarawak)
- ✅ Reverse geocoding using OpenStreetMap Nominatim
- ✅ Respects browser permissions (prompt/denied states)
- ✅ 5-second timeout with cached data (10 minutes)
- ✅ Low accuracy mode for better battery life

---

### 2. **Manual Location Selection**

Users can manually change their location anywhere in the app using the **LocationPicker** component:

**Available in:**
- ✅ WildfireEventsPage - View alerts anywhere globally
- ✅ RecommendationsPage - Get activity suggestions for any location
- ✅ PlaceSuggestionsPage - Find places in different cities
- ✅ ConditionsMapPage - Check environmental conditions worldwide

**Capabilities:**
- 🔍 **Search any city worldwide** using OpenStreetMap geocoding
- 📍 **Use current GPS location** button for real-time updates
- 🌐 **Popular locations** quick-select (8 major cities)
- 📊 **Search results** with full address and coordinates

---

### 3. **Environmental Alerts Geolocation**

The WildfireEventsPage leverages geolocation to show NASA satellite data:

**Data Sources:**
- 🔥 **NASA FIRMS** - Active wildfire detection (last 24 hours)
- 🌪️ **NASA EONET** - Natural disaster events (last 30 days)

**Location Features:**
1. **500km Radius Search**
   - Automatically fetches all alerts within 500km of your location
   - Distance calculated and displayed for each event

2. **Real-time Updates**
   - Change location → Data instantly refreshes
   - "Refresh" button to get latest satellite data
   - Auto-updates when location changes

3. **Location Display**
   - Shows current monitoring location at top
   - Displays GPS coordinates
   - Visual indicators for location source (GPS vs manual)

---

## 🎯 User Experience Flow

### First-time User

1. **App loads** → GPS permission requested
2. **Permission granted** → Location auto-detected
3. **Reverse geocoding** → "Kuching, Malaysia" displayed
4. **Welcome page** → Shows "Monitoring near Kuching, Malaysia"
5. **Click "View Alerts"** → See wildfires/disasters within 500km

### Changing Location

1. **Click "Change Location"** button (any page)
2. **Modal opens** with 3 options:
   - Use GPS (real-time location)
   - Search for city (global search)
   - Pick from popular locations
3. **Select location** → Modal closes
4. **Data updates** → New alerts/data for selected location
5. **Persistent** → Location stays selected across pages

### Permission Denied

1. **GPS blocked** → Uses default location (Kuching)
2. **Manual search** still works
3. **Popular locations** quick-select available
4. **No errors** → Seamless fallback experience

---

## 📍 Location Data Structure

```typescript
interface UserLocation {
  latitude: number;    // GPS latitude (-90 to +90)
  longitude: number;   // GPS longitude (-180 to +180)
  name?: string;       // Human-readable name (e.g., "Los Angeles, USA")
}
```

**Examples:**
```typescript
// GPS detected
{ latitude: 34.0522, longitude: -118.2437, name: "Los Angeles, USA" }

// Default fallback
{ latitude: 1.5535, longitude: 110.3593, name: "Kuching, Sarawak (Default)" }

// Manual search
{ latitude: -33.8688, longitude: 151.2093, name: "Sydney, Australia" }
```

---

## 🔧 Technical Implementation

### Components Using Geolocation

| Component | Purpose | Location Features |
|-----------|---------|------------------|
| **App.tsx** | State management | Auto-detect GPS, store location |
| **WildfireEventsPage** | NASA alerts | 500km radius search, distance calc |
| **RecommendationsPage** | Activity suggestions | Weather based on location |
| **PlaceSuggestionsPage** | Place finder | Location-based recommendations |
| **ConditionsMapPage** | Environmental map | Location-centered map view |
| **LocationPicker** | Location selector | Search, GPS, popular locations |
| **WelcomePage** | Home screen | Display current location |

### API Integrations

1. **Browser Geolocation API**
   - Native GPS access
   - Permission handling
   - Position updates

2. **OpenStreetMap Nominatim**
   - Forward geocoding (search → coordinates)
   - Reverse geocoding (coordinates → name)
   - Free, no API key required

3. **NASA APIs**
   - FIRMS - Wildfire data by lat/lon + radius
   - EONET - Natural events by lat/lon + radius
   - POWER - Weather data by lat/lon

---

## 🌟 Advanced Features

### 1. **Distance Calculations**

The app calculates distance from your location to each event using the Haversine formula:

```typescript
// Server-side (nasa_api.tsx)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  // ... Haversine formula implementation
  return distance;
}
```

**Used for:**
- Sorting events by proximity
- Risk level assessment (closer = higher risk)
- Filtering events within radius

### 2. **Smart Location Persistence**

Location is stored in React state and persists:
- ✅ Between page navigations
- ✅ Until user changes it
- ✅ Across all features (alerts, recommendations, places)

### 3. **Popular Locations**

Pre-configured cities commonly affected by environmental events:

- Los Angeles, USA (wildfires)
- Sydney, Australia (bushfires)
- Athens, Greece (heatwaves)
- São Paulo, Brazil (floods)
- Jakarta, Indonesia (floods, earthquakes)
- Mumbai, India (monsoons)
- Cape Town, South Africa (droughts)
- Tokyo, Japan (earthquakes, typhoons)

---

## 🛡️ Privacy & Security

### User Privacy

- ❌ **No location tracking** - Location only used in-session
- ❌ **No data storage** - GPS coordinates not saved to database
- ❌ **No third-party tracking** - All APIs are privacy-respecting
- ✅ **User control** - Can deny GPS and use manual selection
- ✅ **Transparent** - Clear display of current location

### Permissions

- **Browser asks permission** before accessing GPS
- **Graceful degradation** if denied
- **No persistent permissions** - Asked per session
- **User can revoke** anytime via browser settings

---

## 🚀 Future Enhancements

### Potential Additions

1. **Location History**
   - Save frequently used locations
   - Quick-switch between saved places

2. **Automatic Location Updates**
   - Detect when user moves significantly
   - Prompt to update location

3. **Custom Radius**
   - Let users choose search radius (100km, 500km, 1000km)
   - Better control over alert scope

4. **Location-based Notifications**
   - Alert when new events detected near saved locations
   - Push notifications for critical alerts

5. **Multi-location Monitoring**
   - Track multiple locations simultaneously
   - Compare conditions across cities

6. **Offline Location Cache**
   - Store last known location
   - Work offline with cached data

---

## 📱 Mobile Considerations

### GPS Accuracy

- **Mobile devices** → High accuracy GPS (3-10m)
- **Desktop/WiFi** → Lower accuracy (50-200m)
- **No impact** → 500km radius large enough for both

### Performance

- **Lazy loading** → Location only fetched when needed
- **Caching** → 10-minute cache for GPS data
- **Debouncing** → Prevents excessive API calls
- **Responsive UI** → Works on all screen sizes

---

## 🔗 Related Documentation

- [NASA_REALTIME_DATA.md](/NASA_REALTIME_DATA.md) - NASA API details
- [LOCATION_HANDLING.md](/LOCATION_HANDLING.md) - Location implementation guide
- [API_INTEGRATION_GUIDE.md](/API_INTEGRATION_GUIDE.md) - Server endpoints

---

**Last Updated**: 2025-10-03  
**Component**: LocationPicker, WildfireEventsPage, App.tsx  
**APIs Used**: Browser Geolocation, OpenStreetMap Nominatim, NASA FIRMS/EONET
