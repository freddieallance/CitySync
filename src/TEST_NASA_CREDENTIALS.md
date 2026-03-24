# 🧪 Test Your NASA Credentials

## Quick Test

I've created a test endpoint to verify your NASA credentials are working!

---

## Method 1: Browser Console (Easiest)

### Step 1: Open Your App

Open your CitySync app in the browser.

### Step 2: Open Console

Press `F12` or right-click → "Inspect" → "Console" tab

### Step 3: Run This Code

Copy and paste this into the console:

```javascript
fetch('https://wqhvxhgddvumohhtmcjf.supabase.co/functions/v1/make-server-0765a8f0/test-nasa')
  .then(r => r.json())
  .then(data => {
    console.log('='.repeat(60));
    console.log('🛰️  NASA API CREDENTIALS TEST RESULTS');
    console.log('='.repeat(60));
    console.log('');
    console.log('✅ Credentials Configured:', data.credentialsConfigured ? 'YES' : 'NO');
    console.log('📊 APIs Available:', data.apisAvailable, '/', data.totalAPIs);
    console.log('');
    console.log('📋 Individual API Status:');
    console.log('  - GES DISC (Authenticated):', data.results.gesdisc ? '✅ Working' : '❌ Not Working');
    console.log('  - Giovanni (Authenticated):', data.results.giovanni ? '✅ Working' : '❌ Not Working');
    console.log('  - DataRods (Authenticated):', data.results.datarods ? '✅ Working' : '❌ Not Working');
    console.log('  - Worldview (Public):', data.results.worldview ? '✅ Working' : '❌ Not Working');
    console.log('  - POWER (Public):', data.results.power ? '✅ Working' : '❌ Not Working');
    console.log('  - CMR (Public):', data.results.cmr ? '✅ Working' : '❌ Not Working');
    console.log('');
    console.log('💬 Message:', data.message);
    console.log('='.repeat(60));
    
    // Return the data for further inspection
    return data;
  })
  .catch(err => {
    console.error('❌ Test failed:', err);
  });
```

---

## What You Should See

### ✅ Success (Credentials Working)

```
============================================================
🛰️  NASA API CREDENTIALS TEST RESULTS
============================================================

✅ Credentials Configured: YES
📊 APIs Available: 6 / 6

📋 Individual API Status:
  - GES DISC (Authenticated): ✅ Working
  - Giovanni (Authenticated): ✅ Working
  - DataRods (Authenticated): ✅ Working
  - Worldview (Public): ✅ Working
  - POWER (Public): ✅ Working
  - CMR (Public): ✅ Working

💬 Message: NASA credentials are configured correctly!
============================================================
```

**This means:** All your NASA APIs are working! 🎉

---

### ⚠️ Partial Success (Only Public APIs)

```
============================================================
🛰️  NASA API CREDENTIALS TEST RESULTS
============================================================

✅ Credentials Configured: NO
📊 APIs Available: 3 / 6

📋 Individual API Status:
  - GES DISC (Authenticated): ❌ Not Working
  - Giovanni (Authenticated): ❌ Not Working
  - DataRods (Authenticated): ❌ Not Working
  - Worldview (Public): ✅ Working
  - POWER (Public): ✅ Working
  - CMR (Public): ✅ Working

💬 Message: NASA credentials not configured. Only public APIs available.
============================================================
```

**This means:** 
- Your config file still has placeholder values
- Only 3 public NASA APIs work (no authentication needed)
- You need to add your NASA username and password to config.tsx

---

### ❌ All Failed

```
============================================================
🛰️  NASA API CREDENTIALS TEST RESULTS
============================================================

✅ Credentials Configured: YES
📊 APIs Available: 0 / 6

📋 Individual API Status:
  - GES DISC (Authenticated): ❌ Not Working
  - Giovanni (Authenticated): ❌ Not Working
  - DataRods (Authenticated): ❌ Not Working
  - Worldview (Public): ❌ Not Working
  - POWER (Public): ❌ Not Working
  - CMR (Public): ❌ Not Working

💬 Message: NASA credentials are configured correctly!
============================================================
```

**This means:**
- Either NASA APIs are down (rare)
- Or there's a network issue
- Try again in a few minutes

---

## Method 2: Direct URL (Alternative)

Just open this URL in your browser:

```
https://wqhvxhgddvumohhtmcjf.supabase.co/functions/v1/make-server-0765a8f0/test-nasa
```

You'll see raw JSON output like:

```json
{
  "success": true,
  "credentialsConfigured": true,
  "apisAvailable": 6,
  "totalAPIs": 6,
  "results": {
    "gesdisc": true,
    "giovanni": true,
    "datarods": true,
    "worldview": true,
    "power": true,
    "cmr": true
  },
  "message": "NASA credentials are configured correctly!"
}
```

---

## Troubleshooting

### Problem: "Credentials Configured: NO"

**Solution:**
1. Open `/supabase/functions/server/config.tsx`
2. Make sure you replaced:
   ```typescript
   NASA: {
     USERNAME: 'YOUR_NASA_USERNAME_HERE',  // ← Change this
     PASSWORD: 'YOUR_NASA_PASSWORD_HERE',  // ← Change this
   },
   ```
3. With your actual credentials:
   ```typescript
   NASA: {
     USERNAME: 'your_actual_username',  // ← Your real username
     PASSWORD: 'your_actual_password',  // ← Your real password
   },
   ```
4. Save the file
5. Run the test again

### Problem: "Credentials Configured: YES" but Authenticated APIs Failed

**Possible causes:**
1. **Wrong username/password** - Double-check your NASA Earthdata credentials
2. **NASA account not approved** - New accounts may take a few minutes
3. **NASA services temporarily down** - Try again later

**How to verify your credentials:**
1. Go to https://urs.earthdata.nasa.gov/
2. Try logging in with your username and password
3. If login fails, reset your password or create a new account
4. Update config.tsx with the correct credentials

### Problem: ALL APIs Failed

**Possible causes:**
1. **Network issue** - Check your internet connection
2. **NASA services down** - Check https://status.earthdata.nasa.gov/
3. **Firewall blocking** - NASA APIs might be blocked by your network

**Solution:**
- Wait a few minutes and try again
- Try from a different network
- Check NASA status page

---

## Current Status Check

Based on your config file, here's what I can see:

✅ **NASA Username:** `freddieallance` (configured)  
✅ **NASA Password:** `Freddie@LLance99` (configured)  
❌ **OpenWeather API Key:** Not configured (optional)  
❌ **Gemini API Key:** Not configured (optional)

**Your NASA credentials ARE configured!** Run the test to verify they work.

---

## What Happens After Test Passes?

Once the test shows all 6 APIs working:

✅ Your app can use all NASA Earth observation data  
✅ Weather Dashboard gets high-res atmospheric data  
✅ Event Planner gets climate analysis  
✅ Conditions Map gets flood risk data  
✅ All features work with real NASA satellite data  

**No changes needed to your app** - the backend will automatically use the credentials!

---

## Next Steps

### If Test Passes ✅
You're done! Your NASA APIs are working. All your app features will now use real NASA data.

### If Test Fails ❌
1. Double-check your credentials at https://urs.earthdata.nasa.gov/
2. Make sure they're correctly entered in `/supabase/functions/server/config.tsx`
3. Save the file and test again
4. If still failing, try creating a new NASA account

---

**Run the test now and let me know what you see!** 🚀