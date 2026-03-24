# 🚀 NASA Open API Guide

## What is NASA Open API?

NASA's Open API provides access to **additional NASA datasets** beyond Earth observation data. This includes stunning space imagery, Mars rover photos, asteroid tracking, and much more!

---

## 🔑 How to Get Your NASA Open API Key

### Step 1: Visit NASA API Portal

Go to: **https://api.nasa.gov/**

### Step 2: Fill Out the Form

Provide:
- **First Name**
- **Last Name**
- **Email Address**

### Step 3: Get Your Key Instantly!

You'll receive your API key **immediately** on the screen and via email.

**Example Key:**
```
abc123def456ghi789jkl012mno345pqr678stu
```

---

## 📊 Rate Limits

### DEMO_KEY (No Signup Required)
```
Rate Limit: 30 requests per hour
Rate Limit: 50 requests per day
```

### Your Personal API Key (Free!)
```
Rate Limit: 1,000 requests per hour
Rate Limit: 1,000 requests per day
```

**💡 Recommendation:** Get your own key! It's free and takes 30 seconds.

---

## 🛠️ How to Add Your Key

### Option 1: Edit Config File

Open `/supabase/functions/server/config.tsx` and add:

```typescript
NASA_OPEN: {
  API_KEY: 'your_actual_nasa_api_key_here',  // ← Paste your key here
},
```

### Option 2: Use DEMO_KEY for Testing

```typescript
NASA_OPEN: {
  API_KEY: 'DEMO_KEY',  // Temporary for testing only
},
```

---

## 🌟 What APIs Does This Unlock?

### 1. **APOD - Astronomy Picture of the Day** 📸
Get NASA's daily featured space image with description.

**Endpoint:** `https://api.nasa.gov/planetary/apod`

**What you get:**
- Beautiful space photos
- Educational descriptions
- HD images and videos
- Historical archive access

**Use cases:**
- Daily space wallpapers
- Educational content
- Inspiration for users

---

### 2. **Mars Rover Photos** 🔴
Access photos from NASA's Mars rovers (Curiosity, Opportunity, Spirit, Perseverance).

**Endpoint:** `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos`

**What you get:**
- Real photos from Mars surface
- Filter by camera type
- Filter by sol (Martian day)
- Multiple rover support

**Use cases:**
- Mars exploration features
- Educational content
- Photo galleries

---

### 3. **NEO - Near Earth Objects** 🌠
Track asteroids and comets approaching Earth.

**Endpoint:** `https://api.nasa.gov/neo/rest/v1/feed`

**What you get:**
- Asteroid tracking data
- Close approach dates
- Size estimates
- Velocity and distance
- Potentially hazardous objects

**Use cases:**
- Space hazard awareness
- Educational astronomy
- Fun facts about space

---

### 4. **EPIC - Earth Imagery** 🌍
Daily imagery from NASA's EPIC camera on DSCOVR satellite.

**Endpoint:** `https://api.nasa.gov/EPIC/api/natural`

**What you get:**
- Full Earth photos from space
- Multiple times per day
- Natural and enhanced color
- Historical archive

**Use cases:**
- Earth from space views
- Environmental awareness
- Beautiful backgrounds

---

### 5. **NASA Image and Video Library** 🎥
Search NASA's vast collection of images, videos, and audio.

**Endpoint:** `https://images-api.nasa.gov/search`

**What you get:**
- 100,000+ images
- Videos from missions
- Audio recordings
- Historical media

**Use cases:**
- Educational content
- Space exploration history
- Multimedia galleries

---

### 6. **Exoplanet Archive** 🪐
Data about planets orbiting other stars.

**Endpoint:** `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI`

**What you get:**
- Confirmed exoplanets
- Planet characteristics
- Host star data
- Discovery methods

**Use cases:**
- Astronomy education
- Space exploration content
- Fun space facts

---

### 7. **InSight Mars Weather** 🌡️
Weather data from NASA's InSight lander on Mars.

**Endpoint:** `https://api.nasa.gov/insight_weather/`

**What you get:**
- Mars temperature
- Wind speed and direction
- Atmospheric pressure
- Historical sol data

**Use cases:**
- Compare Earth vs Mars weather
- Educational content
- Space weather tracking

---

### 8. **Donki - Space Weather** ☀️
Notifications about space weather events.

**Endpoint:** `https://api.nasa.gov/DONKI/notifications`

**What you get:**
- Solar flare alerts
- Coronal mass ejections
- Geomagnetic storms
- High-speed solar winds

**Use cases:**
- Space weather alerts
- Satellite safety info
- Aurora predictions

---

## 💻 Example API Calls

### Get Today's Astronomy Picture:
```javascript
fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)
  .then(r => r.json())
  .then(data => console.log(data));
```

**Response:**
```json
{
  "title": "A Phoenix Aurora over Iceland",
  "explanation": "All of the other aurora watchers had gone home...",
  "url": "https://apod.nasa.gov/apod/image/2401/PhoenixAurora_Zarzycka_960.jpg",
  "hdurl": "https://apod.nasa.gov/apod/image/2401/PhoenixAurora_Zarzycka_2048.jpg",
  "date": "2024-01-15"
}
```

---

### Get Mars Rover Photos:
```javascript
fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${NASA_API_KEY}`)
  .then(r => r.json())
  .then(data => console.log(data.photos));
```

**Response:**
```json
{
  "photos": [
    {
      "id": 102693,
      "img_src": "http://mars.jpl.nasa.gov/msl-raw-images/...",
      "earth_date": "2015-09-28",
      "camera": {
        "name": "MAST",
        "full_name": "Mast Camera"
      }
    }
  ]
}
```

---

### Get Near Earth Objects:
```javascript
fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-01-01&end_date=2024-01-07&api_key=${NASA_API_KEY}`)
  .then(r => r.json())
  .then(data => console.log(data.near_earth_objects));
```

**Response:**
```json
{
  "near_earth_objects": {
    "2024-01-01": [
      {
        "name": "162173 Ryugu",
        "estimated_diameter": {
          "meters": {
            "estimated_diameter_min": 865.5,
            "estimated_diameter_max": 1935.5
          }
        },
        "is_potentially_hazardous_asteroid": false
      }
    ]
  }
}
```

---

## 🎯 Quick Setup

### 1. Get Your API Key
Visit: https://api.nasa.gov/ (takes 30 seconds)

### 2. Add to Config File
```typescript
// /supabase/functions/server/config.tsx

NASA_OPEN: {
  API_KEY: 'your_key_here',  // ← Paste your NASA API key
}
```

### 3. Use in Your Backend
```typescript
import { CONFIG } from './config.tsx';

// Example: Get APOD
const response = await fetch(
  `https://api.nasa.gov/planetary/apod?api_key=${CONFIG.NASA_OPEN.API_KEY}`
);
const data = await response.json();
```

---

## 🔐 Security Best Practices

### ✅ DO:
- ✅ Store API key in backend config only
- ✅ Use environment variables in production
- ✅ Keep your key private
- ✅ Monitor your usage

### ❌ DON'T:
- ❌ Put API key in frontend code
- ❌ Commit API key to Git
- ❌ Share your key publicly
- ❌ Use DEMO_KEY in production

---

## 📊 Comparison: NASA APIs in CitySync

### NASA Earthdata (Bearer Token)
**Purpose:** Earth observation and climate data  
**APIs:** GES DISC, Giovanni, DataRods, POWER, FIRMS, EONET  
**Use:** Environmental conditions, weather, disasters  
**Key Location:** `CONFIG.NASA.BEARER_TOKEN`

### NASA Open API (API Key)
**Purpose:** Space exploration and astronomy  
**APIs:** APOD, Mars Rovers, NEO, EPIC, etc.  
**Use:** Space imagery, education, astronomy  
**Key Location:** `CONFIG.NASA_OPEN.API_KEY`

**Both are FREE and complement each other!** 🚀

---

## 🧪 Test Your NASA Open API Key

### Browser Test:
Replace `YOUR_KEY` with your actual key:

```
https://api.nasa.gov/planetary/apod?api_key=YOUR_KEY
```

**Expected:** You should see JSON data with today's astronomy picture.

### Console Test:
```javascript
fetch('https://api.nasa.gov/planetary/apod?api_key=YOUR_KEY')
  .then(r => r.json())
  .then(data => console.log('✅ NASA Open API Working!', data.title));
```

---

## 💡 Feature Ideas for CitySync

### 1. **Daily Space Feature**
- Show APOD on welcome screen
- Rotate Mars rover photos
- Display space facts

### 2. **Space Weather Integration**
- Solar flare alerts
- Aurora predictions
- Satellite safety warnings

### 3. **Astronomy Education**
- Near Earth Object tracker
- Exoplanet browser
- Mars weather comparison

### 4. **Photo Gallery**
- NASA image library search
- Mars exploration timeline
- Earth from space views

---

## 📖 Official Documentation

- **Main Portal:** https://api.nasa.gov/
- **API Browser:** https://api.nasa.gov/api.html
- **GitHub Examples:** https://github.com/nasa
- **Rate Limits:** Check your usage at https://api.nasa.gov/

---

## ⚠️ Troubleshooting

### Error: "API_KEY_INVALID"
**Solution:** Check your key is correct, no extra spaces

### Error: "OVER_RATE_LIMIT"
**Solution:** You've exceeded 1000 requests/hour. Wait or get a new key.

### Error: "API_KEY_MISSING"
**Solution:** Make sure you added `?api_key=YOUR_KEY` to the URL

### Using DEMO_KEY?
**Remember:** Only 30 requests/hour! Get your own key for 1000/hour.

---

## 🎯 Quick Reference

### Your Config Location:
```
/supabase/functions/server/config.tsx
```

### Add Your Key:
```typescript
NASA_OPEN: {
  API_KEY: 'your_nasa_api_key_here',
}
```

### Access in Code:
```typescript
import { CONFIG } from './config.tsx';

const apiKey = CONFIG.NASA_OPEN.API_KEY;
```

### Test URL:
```
https://api.nasa.gov/planetary/apod?api_key=YOUR_KEY
```

---

## ✅ Summary

**NASA Open API Key provides:**
- ✅ 1,000 requests per hour (vs 30 with DEMO_KEY)
- ✅ Access to 20+ NASA APIs
- ✅ Free forever
- ✅ Takes 30 seconds to sign up
- ✅ Instant activation

**Perfect for:**
- 🌟 Space imagery and education
- 🔴 Mars exploration content
- 🌍 Earth from space views
- 🌠 Asteroid tracking
- ☀️ Space weather alerts

---

## 🚀 Get Started Now!

1. **Get your key:** https://api.nasa.gov/
2. **Add to config.tsx:** `NASA_OPEN.API_KEY = 'your_key'`
3. **Start exploring space!** 🛰️

---

**Ready to add amazing space features to CitySync?** Your NASA Open API key is waiting! 🌌