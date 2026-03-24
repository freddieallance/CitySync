# 🔐 API Credentials Setup Guide

## Quick Setup - Put Your API Keys Here

All API credentials are configured in **ONE FILE**:

📁 **`/supabase/functions/server/config.tsx`**

---

## Step 1: Open the Config File

Navigate to:
```
/supabase/functions/server/config.tsx
```

You'll see a file that looks like this:

```typescript
export const CONFIG = {
  NASA: {
    USERNAME: 'YOUR_NASA_USERNAME_HERE',  // ← PUT YOUR NASA USERNAME HERE
    PASSWORD: 'YOUR_NASA_PASSWORD_HERE',  // ← PUT YOUR NASA PASSWORD HERE
  },

  OPENWEATHER: {
    API_KEY: 'YOUR_OPENWEATHER_API_KEY_HERE',  // ← PUT YOUR KEY HERE
  },

  GEMINI: {
    API_KEY: 'YOUR_GEMINI_API_KEY_HERE',  // ← PUT YOUR KEY HERE
  },
};
```

---

## Step 2: Replace the Placeholder Values

### 🛰️ NASA Earthdata Credentials

**What you need:**
- Username and password from NASA Earthdata

**How to get it:**
1. Go to: https://urs.earthdata.nasa.gov/users/new
2. Register for a free account
3. Note your username and password

**Where to put it:**
```typescript
NASA: {
  USERNAME: 'your_actual_username',  // ← Replace this
  PASSWORD: 'your_actual_password',  // ← Replace this
},
```

**Example:**
```typescript
NASA: {
  USERNAME: 'john_doe',
  PASSWORD: 'MySecurePassword123!',
},
```

---

### 🌤️ OpenWeather API Key

**What you need:**
- Free API key from OpenWeatherMap

**How to get it:**
1. Go to: https://openweathermap.org/api
2. Sign up for free
3. Get your API key from the dashboard

**Where to put it:**
```typescript
OPENWEATHER: {
  API_KEY: 'abc123def456ghi789',  // ← Replace this
},
```

**Example:**
```typescript
OPENWEATHER: {
  API_KEY: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
},
```

---

### 🤖 Google Gemini API Key

**What you need:**
- Free API key from Google AI Studio

**How to get it:**
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"

**Where to put it:**
```typescript
GEMINI: {
  API_KEY: 'AIzaSy...',  // ← Replace this
},
```

**Example:**
```typescript
GEMINI: {
  API_KEY: 'AIzaSyABC123XYZ789-abcdefghijklmnopqrstuvwxyz',
},
```

---

## Step 3: Save the File

After replacing all placeholders, your config file should look like:

```typescript
export const CONFIG = {
  NASA: {
    USERNAME: 'john_doe',
    PASSWORD: 'MySecurePassword123!',
  },

  OPENWEATHER: {
    API_KEY: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  },

  GEMINI: {
    API_KEY: 'AIzaSyABC123XYZ789-abcdefghijklmnopqrstuvwxyz',
  },
};
```

**Save the file** and you're done! ✅

---

## ✅ How It Works

### Backend Only

- The config file is **only** in the backend (`/supabase/functions/server/`)
- Your credentials are **never** exposed to users
- Your credentials are **never** visible in the frontend
- All API calls happen server-side

### Automatic Usage

Once you save your credentials, the backend will automatically use them:

- ✅ **NASA APIs** - Uses your NASA username/password
- ✅ **Gemini AI** - Uses your Gemini API key  
- ✅ **OpenWeather** - Uses your OpenWeather API key (if you add it to the code)

---

## 🧪 Testing Your Setup

### Test NASA APIs

Open your browser console and run:

```javascript
// Replace with your project ID
const projectId = 'YOUR_PROJECT_ID';

fetch(`https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0/test-nasa`, {
  method: 'GET'
})
.then(r => r.json())
.then(d => console.log('NASA Test Result:', d));
```

**Expected result:**
```json
{
  "success": true,
  "apisAvailable": 6,
  "credentialsConfigured": true,
  "results": {
    "gesdisc": true,
    "giovanni": true,
    "datarods": true,
    "worldview": true,
    "power": true,
    "cmr": true
  }
}
```

---

## 🔒 Security

### Is This Secure?

**YES!** Your credentials are:

✅ **Only in the backend** - Never sent to frontend  
✅ **Never visible to users** - Users can't see the config file  
✅ **Server-side only** - All API calls happen in the backend  
✅ **Protected by Supabase** - Only your backend can access them

### Additional Security (Optional)

If you want even more security, you can still use Supabase environment variables:

1. Go to Supabase Dashboard
2. Navigate to Edge Functions → Manage Secrets
3. Add your credentials as environment variables
4. The code will automatically use environment variables if they exist

**Priority:**
1. Config file (easy for development)
2. Environment variables (more secure for production)

---

## ❓ Troubleshooting

### "NASA credentials not configured"

**Problem:** You didn't replace the placeholder values in config.tsx

**Solution:**
1. Open `/supabase/functions/server/config.tsx`
2. Make sure you replaced:
   - `'YOUR_NASA_USERNAME_HERE'` with your actual username
   - `'YOUR_NASA_PASSWORD_HERE'` with your actual password

### "Invalid credentials"

**Problem:** Your NASA username/password is wrong

**Solution:**
1. Test login at https://urs.earthdata.nasa.gov/
2. Make sure your credentials work
3. Update config.tsx with the correct values

### "GEMINI_API_KEY not configured"

**Problem:** You didn't add your Gemini API key

**Solution:**
1. Get a free API key from https://aistudio.google.com/app/apikey
2. Open `/supabase/functions/server/config.tsx`
3. Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual key

---

## 🎯 Summary

### What You Did

1. ✅ Opened `/supabase/functions/server/config.tsx`
2. ✅ Replaced placeholder values with your actual API keys
3. ✅ Saved the file

### What Happens Next

- ✅ Backend automatically uses your credentials
- ✅ All NASA APIs work (authenticated + public)
- ✅ Gemini AI features work
- ✅ No user login required for NASA data
- ✅ All credentials stay secure in the backend

---

## 📚 API Accounts You Need

| Service | Sign Up URL | What You Get |
|---------|------------|--------------|
| **NASA Earthdata** | https://urs.earthdata.nasa.gov/users/new | Username & Password |
| **OpenWeather** | https://openweathermap.org/api | API Key (free tier) |
| **Google Gemini** | https://aistudio.google.com/app/apikey | API Key (free tier) |

All accounts are **FREE** and take less than 5 minutes to set up!

---

## 🚀 You're Ready!

Once you've updated the config file with your credentials:

1. ✅ Save the file
2. ✅ Refresh your app
3. ✅ All features should work!

**No need to restart the server** - Deno will automatically reload the config when you save.

---

**Need help?** Check the `/NASA_BACKEND_INTEGRATION.md` file for examples of how your features use these APIs behind the scenes!
