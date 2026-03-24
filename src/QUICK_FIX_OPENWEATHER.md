# ⚡ Quick Fix: OpenWeather Unavailable

## 🎯 Problem
Seeing "OpenWeather Unavailable" even though you added the key to Supabase.

## ✅ Solution (30 seconds)

### **Redeploy Your Edge Function:**

1. Go to: **https://supabase.com/dashboard**
2. Select your **CitySync** project
3. Click **"Edge Functions"** (left sidebar)
4. Find **"make-server-0765a8f0"**
5. Click the **"..." menu** (three dots)
6. Click **"Deploy"**
7. Wait **1-2 minutes**

Done! 🎉

---

## 🧪 Test It Works

Run in browser console (F12):

```javascript
fetch('https://idjudvjmyedpexdembrz.supabase.co/functions/v1/make-server-0765a8f0/hybrid-weather?lat=1.5535&lon=110.3593')
  .then(r => r.json())
  .then(data => {
    console.log('Source:', data.data.current.source);
    console.log(data.data.current.source === 'openweather' ? '✅ WORKING!' : '❌ Still broken');
  });
```

**Expected:** `✅ WORKING!`

---

## 🔍 Why?

Edge Functions are containerized. When you add a secret:
- ✅ Secret saved to Supabase
- ❌ Old container doesn't have it yet
- ✅ **Redeploy** creates new container with secret

---

## 📱 Verify in App

1. Open your app
2. Click **"Outdoor Activities"**
3. Look at **"Current Conditions"** card
4. Click **"OpenWeather"** tab
5. Should show real-time data (no "Unavailable" message)

---

## 🚀 That's It!

Just **redeploy** and your OpenWeather integration will work!

**Full guide:** `/FIX_OPENWEATHER_UNAVAILABLE.md`
