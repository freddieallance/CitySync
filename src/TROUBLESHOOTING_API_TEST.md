# 🔧 Troubleshooting API Test Errors

## Quick Fix Steps

### Step 1: Open Browser Console
1. Press **F12** (or right-click → Inspect)
2. Click **Console** tab
3. Look for error messages

---

## Common Errors & Solutions

### Error: "Failed to fetch"
**Meaning:** Can't connect to backend  
**Possible causes:**
1. Backend server not running
2. Network connectivity issue
3. CORS error

**Fix:**
```
1. Check backend is deployed
2. Check network connection
3. Try refreshing page (Ctrl+F5)
```

---

### Error: "Unexpected token"
**Meaning:** JSON parsing error  
**Possible causes:**
1. Backend returning HTML instead of JSON
2. Server error occurred
3. Invalid response format

**Fix:**
```
1. Check backend logs
2. Check route paths are correct
3. Verify backend is running properly
```

---

### Error: "Import error" or "Module not found"
**Meaning:** Backend can't import config.tsx  
**Possible causes:**
1. Config file doesn't exist
2. Export names don't match
3. TypeScript compilation issue

**Fix:**
```
1. Verify /supabase/functions/server/config.tsx exists
2. Check exports match imports
3. Restart backend
```

---

### Error: "Cannot read property 'API_KEY'"
**Meaning:** CONFIG object structure issue  
**Possible causes:**
1. Config file format is wrong
2. Import didn't work
3. Missing properties

**Fix:**
```
1. Check CONFIG structure in config.tsx
2. Verify all nested objects exist
3. Check for typos in property names
```

---

## Debug Steps

### Step 1: Test Backend Directly
Open these URLs in your browser to test backend:

**Test NASA POWER:**
```
https://wqhvxhgddvumohhtmcjf.supabase.co/functions/v1/make-server-0765a8f0/test-nasa-power
```

**Expected:** JSON response like:
```json
{
  "success": true,
  "message": "NASA POWER API accessible"
}
```

**If you get HTML:** Backend has an error, check backend logs

---

### Step 2: Check Network Tab
1. Open browser DevTools (F12)
2. Click **Network** tab
3. Click **"Test All APIs"** button
4. Watch for API requests

**Look for:**
- Status codes (should be 200)
- Response preview (should be JSON)
- Error messages in response

---

### Step 3: Check Console Messages
Look for these console messages:
```
✅ Good messages:
- "🧪 Starting comprehensive API test..."
- "Testing NASA POWER..."
- "NASA POWER result: { success: true }"
- "✅ All tests complete!"

❌ Error messages:
- "❌ Comprehensive test error:"
- "Failed to fetch"
- "SyntaxError: Unexpected token"
- Any red error text
```

---

## Manual API Test

### Test 1: Simple Fetch Test
Open console and paste:
```javascript
fetch('https://wqhvxhgddvumohhtmcjf.supabase.co/functions/v1/make-server-0765a8f0/test-nasa-power')
  .then(r => r.json())
  .then(d => console.log('✅ NASA POWER:', d))
  .catch(e => console.error('❌ Error:', e));
```

**Expected output:**
```
✅ NASA POWER: { success: true, message: "..." }
```

---

### Test 2: Check All Test Routes
```javascript
const API_BASE = 'https://wqhvxhgddvumohhtmcjf.supabase.co/functions/v1/make-server-0765a8f0';

const tests = [
  'test-nasa-power',
  'test-nasa-firms',
  'test-nasa-eonet',
  'test-ges-disc',
  'test-giovanni',
  'test-datarods',
  'test-nasa-open-api',
  'test-openweather'
];

tests.forEach(test => {
  fetch(`${API_BASE}/${test}`)
    .then(r => r.json())
    .then(d => console.log(`✅ ${test}:`, d.success ? 'WORKING' : 'FAILED', d))
    .catch(e => console.error(`❌ ${test}:`, e.message));
});
```

---

## Backend Verification

### Check Backend is Running
1. Go to: https://supabase.com/dashboard
2. Click your project
3. Go to **Edge Functions**
4. Check `make-server-0765a8f0` status
5. Look for any deployment errors

---

### Check Backend Logs
1. In Supabase dashboard
2. Go to **Edge Functions** → **make-server-0765a8f0**
3. Click **Logs** tab
4. Look for errors when test runs

**Common log errors:**
- `Import failed`
- `Cannot find module`
- `Unexpected token`
- `CONFIG is not defined`

---

## Config File Verification

### Check config.tsx exists:
```
/supabase/functions/server/config.tsx
```

### Check config.tsx has correct exports:
```typescript
export const CONFIG = { ... }
export function areNASACredentialsConfigured() { ... }
export function isOpenWeatherConfigured() { ... }
export function isNASAOpenAPIConfigured() { ... }
```

### Check imports in index.tsx:
```typescript
import { 
  CONFIG, 
  areNASACredentialsConfigured, 
  isOpenWeatherConfigured, 
  isNASAOpenAPIConfigured 
} from './config.tsx';
```

---

## Quick Fixes

### Fix 1: Restart Everything
```
1. Refresh browser (Ctrl+F5)
2. Clear browser cache
3. Wait 10 seconds
4. Try test again
```

---

### Fix 2: Check Backend Deployment
```
1. Go to Supabase dashboard
2. Check Edge Functions are deployed
3. Redeploy if needed
4. Wait for deployment to complete
```

---

### Fix 3: Simplify Test
If all tests fail, try testing one API manually:

```javascript
// Test just NASA POWER
fetch('https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M&community=RE&longitude=110.3593&latitude=1.5535&start=20241001&end=20241005&format=JSON')
  .then(r => r.json())
  .then(d => console.log('NASA POWER Direct:', d))
  .catch(e => console.error('Error:', e));
```

If this works but test button fails, issue is in backend routes.

---

## Expected Console Output

### When Tests Work:
```
🧪 Starting comprehensive API test...
Testing NASA POWER...
NASA POWER result: { success: true, message: "NASA POWER API accessible" }
Testing NASA FIRMS...
NASA FIRMS result: { success: true, message: "NASA FIRMS API accessible" }
Testing NASA EONET...
NASA EONET result: { success: true, message: "NASA EONET API accessible" }
Testing GES DISC...
GES DISC result: { success: true, message: "GES DISC API accessible with Bearer Token" }
Testing Giovanni...
Giovanni result: { success: true, message: "Giovanni API ready (Bearer Token configured)" }
Testing DataRods...
DataRods result: { success: true, message: "DataRods API ready (Bearer Token configured)" }
Testing NASA Open API...
NASA Open API result: { success: true, message: "NASA Open API accessible" }
Testing OpenWeather...
OpenWeather result: { success: true, message: "OpenWeather API accessible" }
✅ All tests complete!
```

---

## Still Not Working?

### Fallback: Test Individual APIs Manually

**Test NASA APIs directly:**
```
1. NASA POWER: https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M&community=RE&longitude=110.3593&latitude=1.5535&start=20241001&end=20241005&format=JSON

2. NASA EONET: https://eonet.gsfc.nasa.gov/api/v3/events?limit=5

3. NASA Open API: https://api.nasa.gov/planetary/apod?api_key=YOUR_KEY

4. OpenWeather: https://api.openweathermap.org/data/2.5/weather?lat=1.5535&lon=110.3593&appid=YOUR_KEY
```

If these work directly, the issue is in your backend test routes.

---

## Get Help

**Share these details:**
1. Error message from console
2. Network tab screenshots
3. Which APIs fail
4. Backend logs (if accessible)

**Include:**
- Browser version
- What you see vs what's expected
- Any red error messages

---

## Recovery Steps

If nothing works:

### Option 1: Use Old Test Button
The original "Test Connection" button should still work on the Setup tab.

### Option 2: Test APIs Outside App
Test each API directly in browser using URLs above.

### Option 3: Skip Testing
If individual APIs work when tested directly, the app features should work even if test button doesn't.

---

## Most Common Fix

**90% of errors fixed by:**
```
1. Hard refresh: Ctrl + F5
2. Clear cache
3. Wait 30 seconds
4. Try again
```

**The backend needs time to deploy changes!**

---

Good luck! 🍀
