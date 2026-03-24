# 🧪 How to Test Your APIs - Quick Guide

## 🎯 Quick Start (30 seconds)

### Step 1: Open the Test Page
1. Open your **CitySync app**
2. Scroll to the **bottom** of the Welcome page
3. Click **"🧪 Test NASA Credentials"**

### Step 2: Run the Test
1. You'll see a big blue button: **"⚡ Test All APIs"**
2. Click it
3. Watch the magic happen!

### Step 3: View Results
- Progress bar fills up (0% → 100%)
- Each API tested one by one
- Results appear in real-time
- Final summary shows X/8 working

---

## 📊 What You'll See

### Test Running:
```
┌─────────────────────────────────────┐
│  🧪 API Testing Center              │
│  6/8 APIs Working                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ⚡ Test All APIs                    │
│  [=====50%=====>            ]       │
│  Testing NASA EONET...              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  API Test Results                   │
│  ┌─────────────────────────────┐   │
│  │ ✅ NASA POWER    [Working]  │   │
│  │ ✓ Climate data accessible   │   │
│  ├─────────────────────────────┤   │
│  │ ✅ NASA FIRMS    [Working]  │   │
│  │ ✓ Wildfire data accessible  │   │
│  ├─────────────────────────────┤   │
│  │ 🔄 NASA EONET   [Testing..] │   │
│  │ Checking natural events...  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## ✅ Success Result

### All Working:
```
┌───────────────────────────────────┐
│ ✅ API Testing Complete           │
│ 8 out of 8 APIs Working! 🎉      │
└───────────────────────────────────┘

✅ NASA POWER     - Climate data accessible
✅ NASA FIRMS     - Wildfire data accessible
✅ NASA EONET     - Natural events accessible
✅ GES DISC       - Earth science accessible
✅ Giovanni       - Visualization accessible
✅ DataRods       - Hydrology accessible
✅ NASA Open API  - Space data accessible
✅ OpenWeather    - Weather data accessible
```

---

## ⚠️ Partial Working

### Some APIs Not Configured:
```
┌───────────────────────────────────┐
│ ⚠️ API Testing Complete           │
│ 5 out of 8 APIs Working          │
└───────────────────────────────────┘

✅ NASA POWER     - Working
✅ NASA FIRMS     - Working
✅ NASA EONET     - Working
❌ GES DISC       - Bearer Token not configured
❌ Giovanni       - Bearer Token not configured
❌ DataRods       - Bearer Token not configured
✅ NASA Open API  - Working
✅ OpenWeather    - Working
```

**What to do:**
Configure NASA Earthdata Bearer Token in backend

---

## 🎨 Understanding the Results

### Green Card = Success ✅
```
┌─────────────────────────────────┐
│ ✅ NASA POWER      [Working]    │
│ ✓ Climate data accessible       │
│ Sample: Available               │
└─────────────────────────────────┘
```
**Meaning:** API is working perfectly!

---

### Red Card = Error ❌
```
┌─────────────────────────────────┐
│ ❌ GES DISC        [Failed]     │
│ Bearer Token not configured     │
│ Action: Add token to backend    │
└─────────────────────────────────┘
```
**Meaning:** API needs configuration

---

### Blue Card = Testing 🔄
```
┌─────────────────────────────────┐
│ 🔄 NASA EONET     [Testing...]  │
│ Checking natural events API...  │
└─────────────────────────────────┘
```
**Meaning:** Currently being tested

---

### Gray Card = Pending ⚪
```
┌─────────────────────────────────┐
│ ⚪ OpenWeather     [Pending]    │
│ Waiting to test...              │
└─────────────────────────────────┘
```
**Meaning:** Waiting in queue

---

## 🔍 What Each API Does

### 1. NASA POWER ✅
**What:** Climate and weather data  
**Test:** Fetches 7 days of temperature  
**Success:** Returns temperature data  
**Requires:** Nothing (public API)

---

### 2. NASA FIRMS ✅
**What:** Wildfire detection  
**Test:** Fetches recent fire data  
**Success:** Returns fire incidents  
**Requires:** Nothing (public API)

---

### 3. NASA EONET ✅
**What:** Natural disaster events  
**Test:** Fetches current events  
**Success:** Returns event list  
**Requires:** Nothing (public API)

---

### 4. GES DISC 🔒
**What:** Earth science datasets  
**Test:** Checks Bearer Token auth  
**Success:** Token authenticates  
**Requires:** NASA Earthdata Bearer Token

---

### 5. Giovanni 🔒
**What:** Climate visualization  
**Test:** Checks Bearer Token config  
**Success:** Token configured  
**Requires:** NASA Earthdata Bearer Token

---

### 6. DataRods 🔒
**What:** Hydrology data  
**Test:** Checks Bearer Token config  
**Success:** Token configured  
**Requires:** NASA Earthdata Bearer Token

---

### 7. NASA Open API 🔑
**What:** Space exploration data  
**Test:** Fetches Astronomy Picture  
**Success:** Returns APOD data  
**Requires:** NASA Open API key (backend)

---

### 8. OpenWeather 🔑
**What:** Real-time weather  
**Test:** Fetches current weather  
**Success:** Returns weather data  
**Requires:** OpenWeather API key (backend)

---

## ❌ Common Errors & Fixes

### Error: "Bearer Token not configured"
**What it means:** GES DISC, Giovanni, or DataRods need Bearer Token  
**How to fix:**
1. Go to: https://urs.earthdata.nasa.gov/
2. Login → Profile → User Tokens → Generate Token
3. Copy token
4. Add to `/supabase/functions/server/config.tsx`

---

### Error: "NASA Open API key not configured"
**What it means:** NASA Open API key missing from backend  
**How to fix:**
1. Go to: https://api.nasa.gov/
2. Sign up (free, 30 seconds)
3. Get your API key
4. Add to `CONFIG.NASA_OPEN.API_KEY` in backend

---

### Error: "OpenWeather API key not configured"
**What it means:** OpenWeather key missing from backend  
**How to fix:**
1. Go to: https://openweathermap.org/api
2. Sign up (free)
3. Get your API key
4. Add to `CONFIG.OPENWEATHER.API_KEY` in backend

---

### Error: "Invalid API key"
**What it means:** API key is wrong  
**How to fix:**
1. Double-check the key
2. Make sure no extra spaces
3. Regenerate key if needed
4. Update in backend config

---

### Error: "API key not activated yet"
**What it means:** OpenWeather keys take 10 minutes to activate  
**How to fix:**
1. Wait 10 minutes after signup
2. Try test again
3. Check email for activation confirmation

---

## 🎯 Quick Troubleshooting

### All Tests Fail?
**Check:**
- ✅ Internet connection
- ✅ Backend server running
- ✅ No firewall blocking requests

---

### Only Public APIs Work (3/8)?
**Check:**
- ❌ NASA Bearer Token not configured
- ❌ NASA Open API key not configured
- ❌ OpenWeather API key not configured

**Fix:** Add credentials to backend config

---

### 7/8 Working, 1 Fails?
**Check which API:**
- If **GES DISC**: Bearer Token might be expired
- If **NASA Open API**: Check API key validity
- If **OpenWeather**: Key might not be activated yet

---

## 📱 Test Page Navigation

### Tab 1: Test APIs (Default)
- Main test button
- Progress indicator
- Test results
- Success/error summary

### Tab 2: Setup
- Bearer Token management
- Save/test/delete token
- Token visibility toggle
- API documentation

---

## ⚡ Quick Actions

### Run Test:
```
1. Click "Test All APIs" button
2. Wait 15-20 seconds
3. View results
```

### Check Individual API:
```
1. Scroll through results
2. Find specific API card
3. Check status and message
```

### Setup Bearer Token:
```
1. Switch to "Setup" tab
2. Enter Bearer Token
3. Click "Save Token"
4. Click "Test Connection"
```

---

## 🎉 Expected Timeline

### Complete Test Run:
```
0s   - Start test
2s   - NASA POWER tested ✅
4s   - NASA FIRMS tested ✅
6s   - NASA EONET tested ✅
8s   - GES DISC tested ✅/❌
10s  - Giovanni tested ✅/❌
12s  - DataRods tested ✅/❌
14s  - NASA Open API tested ✅/❌
16s  - OpenWeather tested ✅/❌
16s  - Complete! Show results
```

---

## ✅ Best Practices

### Before Testing:
1. ✅ Ensure backend config is updated
2. ✅ Check all API keys are correct
3. ✅ Verify internet connection
4. ✅ Wait 10 min after OpenWeather signup

### During Testing:
1. ✅ Don't close the app
2. ✅ Don't click test button again
3. ✅ Wait for all tests to complete
4. ✅ Watch progress bar

### After Testing:
1. ✅ Review all results carefully
2. ✅ Fix any failed APIs
3. ✅ Retest after fixes
4. ✅ Document any issues

---

## 🎯 Success Checklist

### Public APIs (Should Always Work):
- [ ] NASA POWER ✅
- [ ] NASA FIRMS ✅
- [ ] NASA EONET ✅

### Authenticated APIs (Need Bearer Token):
- [ ] GES DISC ✅ (if Bearer Token configured)
- [ ] Giovanni ✅ (if Bearer Token configured)
- [ ] DataRods ✅ (if Bearer Token configured)

### External APIs (Need Backend Keys):
- [ ] NASA Open API ✅ (if key in backend)
- [ ] OpenWeather ✅ (if key in backend)

---

## 📊 Your Test Results

### Record Your Results:
```
Date: _______________
Time: _______________

Results:
[ ] NASA POWER     ✅/❌
[ ] NASA FIRMS     ✅/❌
[ ] NASA EONET     ✅/❌
[ ] GES DISC       ✅/❌
[ ] Giovanni       ✅/❌
[ ] DataRods       ✅/❌
[ ] NASA Open API  ✅/❌
[ ] OpenWeather    ✅/❌

Total: ___/8 Working

Notes:
_________________________
_________________________
_________________________
```

---

## 🚀 Next Steps

### If All Tests Pass (8/8):
🎉 **Congratulations!** All APIs working!
- Start using all features
- Build amazing weather apps
- Explore NASA data

### If Some Tests Fail:
📝 **Action Items:**
1. Note which APIs failed
2. Check error messages
3. Follow fix instructions
4. Retest after fixes

### If Most Tests Fail:
🔧 **Troubleshooting:**
1. Check backend configuration
2. Verify API keys
3. Check internet connection
4. Review documentation

---

## 💡 Pro Tips

### Tip 1: Test Regularly
Run tests after any backend changes to ensure APIs still work

### Tip 2: Save Results
Screenshot test results for documentation

### Tip 3: Monitor Status
If APIs suddenly fail, check for:
- Expired Bearer Tokens
- Rate limits exceeded
- API key issues

### Tip 4: Use Both Tabs
- **Test tab**: Quick validation
- **Setup tab**: Detailed configuration

---

## 🎉 You're All Set!

Your comprehensive API testing system is ready to use!

**Now go test your APIs:**
1. Open CitySync
2. Click "🧪 Test NASA Credentials"
3. Click "⚡ Test All APIs"
4. See the results! ✨

**Happy testing!** 🚀