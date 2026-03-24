# 🧪 Test Your Hybrid Weather API

## ✅ Quick Test (30 seconds)

### **Step 1: Test in Browser Console**

Open your CitySync app, press **F12** to open Developer Console, and paste this:

```javascript
// Test hybrid weather endpoint
const API_BASE = 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-0765a8f0';

fetch(`${API_BASE}/hybrid-weather?lat=1.5535&lon=110.3593`)
  .then(r => r.json())
  .then(data => {
    console.log('═══════════════════════════════════════════');
    console.log('🌐 HYBRID WEATHER TEST RESULTS');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('✅ Success:', data.success);
    console.log('🔄 Hybrid Mode:', data.hybridMode ? 'ACTIVE' : 'Inactive');
    console.log('💬 Message:', data.message);
    console.log('');
    console.log('───────────────────────────────────────────');
    console.log('📊 CURRENT CONDITIONS');
    console.log('───────────────────────────────────────────');
    console.log('🌡️  Temperature:', data.data.current.temperature + '°C');
    console.log('🤒 Feels Like:', data.data.current.feelsLike + '°C');
    console.log('💧 Humidity:', data.data.current.humidity + '%');
    console.log('💨 Wind Speed:', data.data.current.windSpeed + ' km/h');
    console.log('☁️  Cloud Cover:', data.data.current.cloudCover + '%');
    console.log('🌦️  Description:', data.data.current.description);
    console.log('📍 Data Source:', data.data.current.source.toUpperCase());
    console.log('');
    console.log('───────────────────────────────────────────');
    console.log('📈 HISTORICAL STATISTICS (365 days)');
    console.log('───────────────────────────────────────────');
    console.log('🌡️  Avg Temp:', data.data.historical.temperatureStats.mean + '°C');
    console.log('🔥 Max Temp:', data.data.historical.temperatureStats.max + '°C');
    console.log('❄️  Min Temp:', data.data.historical.temperatureStats.min + '°C');
    console.log('💧 Avg Rain:', data.data.historical.precipitationStats.mean + ' mm');
    console.log('🌧️  Days with Rain:', data.data.historical.precipitationStats.daysWithRain);
    console.log('📊 Sample Size:', data.data.historical.sampleSize + ' days');
    console.log('');
    console.log('───────────────────────────────────────────');
    console.log('🔮 PROBABILITIES');
    console.log('───────────────────────────────────────────');
    console.log('🌧️  Rain:', data.data.probabilities.rain + '%');
    console.log('⛈️  Heavy Rain:', data.data.probabilities.heavyRain + '%');
    console.log('🔥 Extreme Heat:', data.data.probabilities.extremeHeat + '%');
    console.log('💨 High Wind:', data.data.probabilities.highWind + '%');
    console.log('🎯 Confidence:', data.data.probabilities.confidence + '%');
    console.log('');
    
    if (data.data.forecast) {
      console.log('───────────────────────────────────────────');
      console.log('🔮 5-DAY FORECAST');
      console.log('───────────────────────────────────────────');
      data.data.forecast.daily.forEach(day => {
        console.log(`📅 ${day.date}: ${day.tempMin}°C - ${day.tempMax}°C`);
        console.log(`   ☔ Precip: ${day.precipitation.toFixed(1)}mm - ${day.description}`);
      });
      console.log('');
    }
    
    if (data.data.alerts && data.data.alerts.length > 0) {
      console.log('───────────────────────────────────────────');
      console.log('⚠️  WEATHER ALERTS');
      console.log('───────────────────────────────────────────');
      data.data.alerts.forEach(alert => {
        console.log(`🚨 ${alert.event} (${alert.severity})`);
        console.log(`   ${alert.description}`);
      });
      console.log('');
    }
    
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('Full data object:', data);
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
```

---

## 📊 **Expected Output**

```
═══════════════════════════════════════════
🌐 HYBRID WEATHER TEST RESULTS
═══════════════════════════════════════════

✅ Success: true
🔄 Hybrid Mode: ACTIVE
💬 Message: Using NASA POWER + OpenWeather for maximum accuracy

───────────────────────────────────────────
📊 CURRENT CONDITIONS
───────────────────────────────────────────
🌡️  Temperature: 28.5°C
🤒 Feels Like: 32.1°C
💧 Humidity: 78%
💨 Wind Speed: 12.5 km/h
☁️  Cloud Cover: 45%
🌦️  Description: scattered clouds
📍 Data Source: OPENWEATHER

───────────────────────────────────────────
📈 HISTORICAL STATISTICS (365 days)
───────────────────────────────────────────
🌡️  Avg Temp: 27.8°C
🔥 Max Temp: 33.5°C
❄️  Min Temp: 22.3°C
💧 Avg Rain: 6.2 mm
🌧️  Days with Rain: 156
📊 Sample Size: 365 days

───────────────────────────────────────────
🔮 PROBABILITIES
───────────────────────────────────────────
🌧️  Rain: 65%
⛈️  Heavy Rain: 35%
🔥 Extreme Heat: 10%
💨 High Wind: 20%
🎯 Confidence: 90%

───────────────────────────────────────────
🔮 5-DAY FORECAST
───────────────────────────────────────────
📅 2025-01-11: 24.5°C - 31.2°C
   ☔ Precip: 5.3mm - moderate rain
📅 2025-01-12: 23.8°C - 30.5°C
   ☔ Precip: 2.1mm - light rain
...

═══════════════════════════════════════════
```

---

## ✅ **What to Check**

### **1. Hybrid Mode Status**
```
🔄 Hybrid Mode: ACTIVE
```
- ✅ **ACTIVE** = OpenWeather configured, using both APIs
- ⚠️ **Inactive** = OpenWeather not configured, using NASA only

### **2. Data Source**
```
📍 Data Source: OPENWEATHER
```
- ✅ **OPENWEATHER** = Real-time conditions (best accuracy)
- ⚠️ **NASA-POWER** = Fallback to satellite data

### **3. Confidence Level**
```
🎯 Confidence: 90%
```
- ✅ **90%** = Both APIs working perfectly
- ⚠️ **70-75%** = One API unavailable
- ⚠️ **50%** = Limited data

### **4. Forecast Availability**
```
🔮 5-DAY FORECAST
📅 2025-01-11: 24.5°C - 31.2°C
```
- ✅ **Present** = OpenWeather working
- ❌ **Missing** = OpenWeather not configured

---

## 🔧 **Troubleshooting**

### **Problem: Hybrid Mode = Inactive**

**Cause:** OpenWeather API key not configured

**Fix:**
1. Check `/supabase/functions/server/config.tsx`
2. Verify `OPENWEATHER.API_KEY` is set to your actual key
3. Make sure it's not set to `YOUR_OPENWEATHER_API_KEY_HERE`

### **Problem: Data Source = NASA-POWER**

**Cause:** OpenWeather API call failed

**Possible Reasons:**
- API key not activated yet (wait 10 minutes after signup)
- Invalid API key
- Rate limit exceeded (60 calls/minute on free tier)
- Network error

**Fix:**
1. Test OpenWeather directly: `https://api.openweathermap.org/data/2.5/weather?lat=1.5535&lon=110.3593&appid=YOUR_KEY`
2. Check if you get valid JSON response
3. If error 401: API key not activated or invalid
4. If error 429: Rate limit exceeded

### **Problem: No Forecast Data**

**Cause:** OpenWeather forecast endpoint failed

**Fix:**
1. Check console for errors
2. Verify forecast endpoint: `https://api.openweathermap.org/data/2.5/forecast?lat=1.5535&lon=110.3593&appid=YOUR_KEY`
3. Same troubleshooting as above

---

## 📱 **Test Different Scenarios**

### **Test 1: Your Current Location**
```javascript
navigator.geolocation.getCurrentPosition(pos => {
  fetch(`${API_BASE}/hybrid-weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
    .then(r => r.json())
    .then(data => console.log('Your location weather:', data));
});
```

### **Test 2: Current Conditions Only (Fast)**
```javascript
fetch(`${API_BASE}/hybrid-weather?lat=1.5535&lon=110.3593&historical=false&forecast=false`)
  .then(r => r.json())
  .then(data => console.log('Current only:', data.data.current));
```

### **Test 3: Historical Analysis Only**
```javascript
fetch(`${API_BASE}/hybrid-weather?lat=1.5535&lon=110.3593&forecast=false`)
  .then(r => r.json())
  .then(data => console.log('Historical stats:', data.data.historical));
```

### **Test 4: Multiple Locations**
```javascript
const locations = [
  { name: 'Kuching', lat: 1.5535, lon: 110.3593 },
  { name: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 }
];

Promise.all(
  locations.map(loc => 
    fetch(`${API_BASE}/hybrid-weather?lat=${loc.lat}&lon=${loc.lon}&historical=false&forecast=false`)
      .then(r => r.json())
  )
).then(results => {
  results.forEach((data, i) => {
    console.log(`${locations[i].name}: ${data.data.current.temperature}°C - ${data.data.current.description}`);
  });
});
```

---

## 🎯 **Performance Comparison**

### **NASA POWER Only:**
```
Request time: ~2-3 seconds
Data age: 1-2 days old
Forecast: Estimates only
Confidence: 70%
```

### **Hybrid (NASA + OpenWeather):**
```
Request time: ~1-2 seconds (parallel fetch)
Data age: Real-time (10 min updates)
Forecast: Accurate 5-day
Confidence: 90%
```

---

## ✅ **Success Checklist**

- [ ] Hybrid Mode shows "ACTIVE"
- [ ] Data Source shows "OPENWEATHER"
- [ ] Temperature is reasonable for your location
- [ ] Forecast data is present (5 days)
- [ ] Historical statistics show 365 days
- [ ] Probabilities have 90% confidence
- [ ] No errors in console

---

## 🚀 **Next Steps**

### **1. Update RecommendationsPage**

Replace NASA-only API call with hybrid:

```tsx
// In RecommendationsPage.tsx
const response = await fetch(
  `${API_BASE}/hybrid-weather?lat=${lat}&lon=${lon}&forecast=false`
);
const { data } = await response.json();

// Use data.current for real-time conditions
setConditions(data.current);
```

### **2. Add Forecast Display**

Show 5-day forecast in Weather Dashboard:

```tsx
// In WeatherDashboardPage.tsx
const { data } = await response.json();

return (
  <>
    <CurrentWeather data={data.current} />
    <ForecastChart data={data.forecast.daily} />
    <HistoricalStats data={data.historical} />
  </>
);
```

### **3. Show Weather Alerts**

Display urgent warnings:

```tsx
{data.alerts?.map(alert => (
  <Alert variant="destructive" key={alert.event}>
    <AlertTriangle />
    <AlertTitle>{alert.event}</AlertTitle>
    <AlertDescription>{alert.description}</AlertDescription>
  </Alert>
))}
```

---

## 📚 **Documentation**

- `/HYBRID_WEATHER_GUIDE.md` - Complete hybrid weather guide
- `/OPENWEATHER_USAGE_EXPLAINED.md` - OpenWeather background
- `/API_CREDENTIALS_GUIDE.md` - API configuration help

---

**Your hybrid weather system is ready!** 🎉

Test it now and enjoy the most accurate weather data possible! 🌐✨
