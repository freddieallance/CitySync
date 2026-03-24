# 🧪 Test Your APIs - Quick Guide

## ✅ YES! Your APIs Should Work Now!

You've successfully added:
- ✅ NASA Earthdata Bearer Token
- ✅ NASA Open API Key
- ✅ OpenWeather API Key

Let's test them all right now!

---

## 🎯 Quick Tests (Copy & Paste!)

### Test 1: NASA Open API (30 seconds)

**Copy this URL and open in your browser:**
```
https://api.nasa.gov/planetary/apod?api_key=bS1QbfeODmM2uwt5nemP9vOddDXCGn9QGbrIAGhb
```

**✅ If working, you'll see:**
```json
{
  "date": "2024-10-05",
  "title": "...",
  "url": "https://apod.nasa.gov/...",
  "explanation": "..."
}
```

**❌ If not working:**
- `{"error": {"code": "API_KEY_INVALID"}}` - Check your key
- `{"error": {"code": "OVER_RATE_LIMIT"}}` - Wait an hour

---

### Test 2: OpenWeather API (30 seconds)

**Copy this URL and open in your browser:**
```
https://api.openweathermap.org/data/2.5/weather?lat=1.5535&lon=110.3593&appid=a865627389f3f6f1a90c6f01699ef456&units=metric
```

**✅ If working, you'll see:**
```json
{
  "name": "Kuching",
  "main": {
    "temp": 28.5,
    "humidity": 80
  },
  "weather": [
    {"description": "clear sky"}
  ]
}
```

**❌ If not working:**
- `{"cod":401}` - Key not activated yet (wait 10 minutes after signup)
- `{"cod":429}` - Too many requests

---

### Test 3: NASA Earthdata (In Your App)

**Steps:**
1. Open your CitySync app
2. Scroll to the **bottom** of the Welcome page
3. Click the button: **"🧪 Test NASA Credentials"**

**✅ If working:**
```
✅ NASA APIs Working!
6 out of 6 APIs available
All authenticated APIs accessible!
```

**❌ If only showing 3/6:**
- Your Bearer Token might be expired or invalid
- Check the token in config.tsx

---

## 🖥️ Browser Console Tests

### Test All APIs at Once

**Press F12** to open browser console, then paste:

```javascript
// Test NASA Open API
console.log('🚀 Testing NASA Open API...');
fetch('https://api.nasa.gov/planetary/apod?api_key=bS1QbfeODmM2uwt5nemP9vOddDXCGn9QGbrIAGhb')
  .then(r => r.json())
  .then(data => {
    if (data.title) {
      console.log('✅ NASA Open API: WORKING!');
      console.log('   Today\'s space photo:', data.title);
    } else {
      console.log('❌ NASA Open API: Failed', data);
    }
  })
  .catch(e => console.log('❌ NASA Open API: Error', e));

// Test OpenWeather API
console.log('🌤️ Testing OpenWeather API...');
fetch('https://api.openweathermap.org/data/2.5/weather?lat=1.5535&lon=110.3593&appid=a865627389f3f6f1a90c6f01699ef456&units=metric')
  .then(r => r.json())
  .then(data => {
    if (data.name) {
      console.log('✅ OpenWeather API: WORKING!');
      console.log('   ' + data.name + ' weather:', data.main.temp + '°C');
    } else {
      console.log('❌ OpenWeather API: Failed', data);
    }
  })
  .catch(e => console.log('❌ OpenWeather API: Error', e));

// Test NASA Earthdata through your backend
console.log('🛰️ Testing NASA Earthdata...');
fetch('https://wqhvxhgddvumohhtmcjf.supabase.co/functions/v1/make-server-0765a8f0/test-nasa')
  .then(r => r.json())
  .then(data => {
    if (data.apisAvailable >= 6) {
      console.log('✅ NASA Earthdata: WORKING!');
      console.log('   APIs available:', data.apisAvailable + '/6');
    } else {
      console.log('⚠️ NASA Earthdata: Partial', data.apisAvailable + '/6');
    }
  })
  .catch(e => console.log('❌ NASA Earthdata: Error', e));
```

**Expected Output:**
```
🚀 Testing NASA Open API...
✅ NASA Open API: WORKING!
   Today's space photo: A Phoenix Aurora over Iceland

🌤️ Testing OpenWeather API...
✅ OpenWeather API: WORKING!
   Kuching weather: 28.5°C

🛰️ Testing NASA Earthdata...
✅ NASA Earthdata: WORKING!
   APIs available: 6/6
```

---

## 📱 Test in Your App

### Test Weather Dashboard:
1. Open CitySync app
2. Click **"Weather Dashboard"**
3. Should show:
   - 30-day climate trends ✅
   - Real-time weather ✅
   - Environmental alerts ✅

### Test Wildfire Events:
1. Click **"Wildfire & Events"**
2. Should show:
   - Nearby wildfires (if any) ✅
   - Natural disaster events ✅
   - Event history ✅

### Test Activity Recommendations:
1. Click **"Outdoor Activities"**
2. Should show:
   - Activity suggestions ✅
   - NASA-based safety scores ✅
   - UV index, air quality ✅

### Test Event Planner:
1. Click **"Event Planner"**
2. Create a test event
3. Should show:
   - Weather probability ✅
   - Safety analysis ✅
   - NASA climate data ✅

---

## ✅ Expected Results Summary

| Test | What to Look For | Status |
|------|------------------|--------|
| **NASA Open API** | Returns JSON with astronomy photo | Should work ✅ |
| **OpenWeather** | Returns JSON with weather data | Should work ✅ |
| **NASA Earthdata** | Shows "6/6 APIs available" | Should work ✅ |
| **Weather Dashboard** | Shows climate trends | Should work ✅ |
| **Wildfire Events** | Shows fire/disaster data | Should work ✅ |
| **Event Planner** | Shows weather predictions | Should work ✅ |

---

## ⚠️ Common Issues & Solutions

### Issue 1: OpenWeather returns 401
**Problem:** API key not activated yet  
**Solution:** Wait 10 minutes after signup, then try again  
**Why:** OpenWeather takes time to activate new keys

### Issue 2: NASA Open API returns "API_KEY_INVALID"
**Problem:** Key is wrong or has typo  
**Solution:** Double-check the key in config.tsx  
**Copy from:** https://api.nasa.gov/ (your account)

### Issue 3: NASA Earthdata only shows 3/6 APIs
**Problem:** Bearer token expired or invalid  
**Solution:** Generate new token at https://urs.earthdata.nasa.gov/  
**Note:** Your current token expires June 2, 2025 (still valid!)

### Issue 4: Weather Dashboard shows no data
**Problem:** Backend might not be using the new keys  
**Solution:** Refresh the page (Ctrl+F5) to reload  
**Check:** Open console for error messages

---

## 🎯 What Each API Does

### NASA Earthdata Bearer Token:
- ✅ Environmental conditions
- ✅ Climate data
- ✅ Wildfire detection
- ✅ Natural disasters
- ✅ Air quality
- ✅ Hydrology data

### NASA Open API:
- 🌟 Astronomy pictures
- 🔴 Mars rover photos
- 🌠 Asteroid data
- 🌍 Earth from space
- ☀️ Space weather

### OpenWeather API:
- 🌤️ Current weather
- 📊 5-day forecast
- 💨 Wind data
- 💧 Humidity
- 🌡️ Temperature

---

## 📊 Your Configuration Status

```typescript
✅ NASA.BEARER_TOKEN = 'eyJ0eXAiOiJKV1Qi...'
✅ NASA_OPEN.API_KEY = 'bS1QbfeODmM2uwt5...'
✅ OPENWEATHER.API_KEY = 'a865627389f3f6f1...'
⚪ GEMINI.API_KEY = 'YOUR_GEMINI_API_KEY_HERE'
```

**3 out of 4 APIs configured! 75% complete!** 🎉

---

## 🚀 Quick Action Checklist

Copy these URLs and test them now:

### ☑️ Test 1: NASA Open API
```
https://api.nasa.gov/planetary/apod?api_key=bS1QbfeODmM2uwt5nemP9vOddDXCGn9QGbrIAGhb
```
**Expected:** JSON with today's space photo ✅

### ☑️ Test 2: OpenWeather API  
```
https://api.openweathermap.org/data/2.5/weather?lat=1.5535&lon=110.3593&appid=a865627389f3f6f1a90c6f01699ef456&units=metric
```
**Expected:** JSON with Kuching weather ✅

### ☑️ Test 3: NASA Earthdata
**In your app:** Click "🧪 Test NASA Credentials" button  
**Expected:** "6 out of 6 APIs available" ✅

### ☑️ Test 4: Weather Features
**In your app:** Click "Weather Dashboard"  
**Expected:** Climate trends and weather data ✅

---

## 💡 Pro Tips

### Tip 1: Check Browser Console
Press **F12** and look at the Console tab. Any errors will show there.

### Tip 2: Hard Refresh
If something doesn't work, try **Ctrl+F5** (Windows) or **Cmd+Shift+R** (Mac) to clear cache.

### Tip 3: Wait for OpenWeather
If OpenWeather shows 401, wait 10 minutes after signup. New keys take time to activate.

### Tip 4: Monitor Rate Limits
- NASA Open API: 1,000 requests/hour
- OpenWeather: 60 requests/minute
- Don't spam the APIs!

### Tip 5: Check Network Tab
In browser DevTools, check the Network tab to see actual API responses.

---

## ✅ Final Answer: Will It Work?

# **YES! Your APIs should work now!** 🎉

Based on your config file:
- ✅ NASA Earthdata Bearer Token is valid (expires June 2025)
- ✅ NASA Open API key looks correct (40 characters)
- ✅ OpenWeather API key looks correct (32 characters)

**All keys are properly formatted and configured!**

---

## 🎯 Do This Right Now:

1. **Copy this URL:**
   ```
   https://api.nasa.gov/planetary/apod?api_key=bS1QbfeODmM2uwt5nemP9vOddDXCGn9QGbrIAGhb
   ```

2. **Open in your browser**

3. **Check the result:**
   - ✅ See JSON? **IT'S WORKING!** 🎉
   - ❌ See error? Check the error message

---

**Go test it now and let me know the results!** 🚀

The APIs are configured correctly, so they should all work! If you see any errors, just let me know what error message you get and I'll help you fix it! 💪
