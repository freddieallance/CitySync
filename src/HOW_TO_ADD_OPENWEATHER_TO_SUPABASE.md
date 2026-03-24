# 🌤️ How to Add OpenWeather API to Supabase

## ✅ **3-Step Setup (Takes 2 minutes)**

Your OpenWeather API key needs to be stored as a **Supabase Secret** for security and flexibility.

---

## 📋 **Step 1: Go to Supabase Dashboard**

### **1.1 Open Supabase**
1. Go to: **https://supabase.com/dashboard**
2. Login with your account
3. Select your **CitySync** project

### **1.2 Navigate to Edge Functions**
1. Click **"Edge Functions"** in the left sidebar
2. Click **"Manage secrets"** button (top right corner)

You should see a secrets management page.

---

## 🔑 **Step 2: Add OpenWeather Secret**

### **2.1 Click "New secret"**

### **2.2 Enter the following:**

**Name:** (exactly as written, case-sensitive)
```
OPENWEATHER_API_KEY
```

**Value:** (your actual API key)
```
98cda4edc63b4a997bfe76242b1b49be
```

### **2.3 Click "Save"**

The secret is now stored securely in Supabase!

---

## ✅ **Step 3: Verify It's Working**

### **3.1 Test the Secret**

Open your browser console (F12) and run:

```javascript
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-0765a8f0/test-secrets')
  .then(r => r.json())
  .then(data => {
    console.log('Secrets Status:', data);
    console.log('OpenWeather:', data.secrets.openweather);
  });
```

**Expected Output:**
```json
{
  "success": true,
  "secrets": {
    "openweather": "configured ✓",
    "nasa_bearer": "configured ✓",
    "nasa_open": "configured ✓",
    "gemini": "not set ✗"
  },
  "validation": {
    "allRequired": true,
    "missing": [],
    "message": "All required secrets are configured ✓"
  }
}
```

### **3.2 Test Hybrid Weather**

```javascript
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-0765a8f0/hybrid-weather?lat=1.5535&lon=110.3593')
  .then(r => r.json())
  .then(data => {
    console.log('Hybrid Mode:', data.hybridMode);
    console.log('Data Source:', data.data.current.source);
  });
```

**Expected Output:**
```json
{
  "success": true,
  "hybridMode": true,
  "message": "Using NASA POWER + OpenWeather for maximum accuracy",
  "data": {
    "current": {
      "source": "openweather",
      "temperature": 28.5,
      ...
    }
  }
}
```

---

## 📊 **All Secrets to Add**

While you're in the secrets manager, add all these for complete functionality:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `OPENWEATHER_API_KEY` | `98cda4edc63b4a997bfe76242b1b49be` | ✅ Your OpenWeather key |
| `NASA_BEARER_TOKEN` | `eyJ0eXAiOiJKV1Qi...` | ✅ Your NASA Earthdata token |
| `NASA_OPEN_API_KEY` | `bS1QbfeODmM2uwt5...` | ✅ Your NASA Open API key |
| `GEMINI_API_KEY` | Get from: https://aistudio.google.com/app/apikey | ⚠️ Optional (for AI features) |

**How to add each:**
1. Click "New secret"
2. Enter the exact name (case-sensitive)
3. Paste the value
4. Click "Save"
5. Repeat for next secret

---

## 🎯 **Why Use Supabase Secrets?**

### **Before (Hardcoded - ❌ Bad):**
```typescript
// In config.tsx - visible in code
OPENWEATHER: {
  API_KEY: '98cda4edc63b4a997bfe76242b1b49be'  // ❌ Exposed!
}
```

**Problems:**
- ❌ Keys visible in code
- ❌ Hard to update (requires code changes)
- ❌ Risk of committing to Git
- ❌ Same key for everyone

### **After (Secrets - ✅ Good):**
```typescript
// In config.tsx - reads from environment
OPENWEATHER: {
  API_KEY: Deno.env.get('OPENWEATHER_API_KEY') || ''  // ✅ Secure!
}
```

**Benefits:**
- ✅ Keys never in code
- ✅ Easy to update (no code changes)
- ✅ Safe to commit code to Git
- ✅ Different keys per environment (dev/prod)
- ✅ Team members can use own keys

---

## 🔍 **Visual Guide**

### **Supabase Dashboard Navigation:**

```
┌─────────────────────────────────────────┐
│ 📊 Supabase Dashboard                   │
├─────────────────────────────────────────┤
│                                         │
│ ┌─ Left Sidebar ─┐                     │
│ │                │                     │
│ │ Home           │                     │
│ │ Table Editor   │                     │
│ │ Authentication │                     │
│ │ Storage        │                     │
│ │ Edge Functions │ ← Click here       │
│ │ Database       │                     │
│ │ ...            │                     │
│ └────────────────┘                     │
│                                         │
└─────────────────────────────────────────┘
```

### **Edge Functions Page:**

```
┌─────────────────────────────────────────┐
│ Edge Functions                          │
│                            [Manage secrets] ← Click
├─────────────────────────────────────────┤
│                                         │
│ Functions List:                         │
│ • make-server-0765a8f0                 │
│   Status: Active ✓                     │
│                                         │
└─────────────────────────────────────────┘
```

### **Secrets Manager:**

```
┌─────────────────────────────────────────┐
│ Edge Function Secrets    [New secret]   │ ← Click
├─────────────────────────────────────────┤
│                                         │
│ Existing Secrets:                       │
│ • NASA_BEARER_TOKEN          [Edit]    │
│ • NASA_OPEN_API_KEY          [Edit]    │
│ • OPENWEATHER_API_KEY        [Edit]    │
│                                         │
└─────────────────────────────────────────┘
```

### **Add New Secret:**

```
┌─────────────────────────────────────────┐
│ Add Secret                              │
├─────────────────────────────────────────┤
│                                         │
│ Name:                                   │
│ ┌─────────────────────────────────────┐ │
│ │ OPENWEATHER_API_KEY                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Value:                                  │
│ ┌─────────────────────────────────────┐ │
│ │ 98cda4edc63b4a997bfe76242b1b49be    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│              [Cancel] [Save]            │
│                                         │
└─────────────────────────────────────────┘
```

---

## ⚠️ **Important Notes**

### **1. Name Must Match Exactly**
```
✅ CORRECT: OPENWEATHER_API_KEY
❌ WRONG:   openweather_api_key
❌ WRONG:   OpenWeather_API_Key
❌ WRONG:   OPENWEATHER_KEY
```

### **2. No Spaces or Quotes**
```
✅ CORRECT: 98cda4edc63b4a997bfe76242b1b49be
❌ WRONG:   "98cda4edc63b4a997bfe76242b1b49be"
❌ WRONG:    98cda4edc63b4a997bfe76242b1b49be 
            ↑ extra space
```

### **3. Redeploy After Adding Secrets**
After adding secrets, you may need to redeploy:
- Click **"Deploy"** button in Edge Functions
- Or wait a few minutes for auto-reload

### **4. Secrets Are Function-Specific**
- Only available in Edge Functions (backend)
- NOT accessible from client-side code
- This is GOOD for security!

---

## 🧪 **Troubleshooting**

### **Problem: "not set ✗"**

**Cause:** Secret not added or name doesn't match

**Fix:**
1. Go to Edge Functions → Manage secrets
2. Check if `OPENWEATHER_API_KEY` exists
3. Verify name is exact (case-sensitive)
4. Verify value is pasted correctly
5. Click Save
6. Redeploy Edge Functions

### **Problem: "hybridMode: false"**

**Cause:** Secret not being read by application

**Fix:**
1. Check secret name is exactly: `OPENWEATHER_API_KEY`
2. Redeploy Edge Functions
3. Wait 1-2 minutes
4. Test again

### **Problem: Can't find "Manage secrets"**

**Cause:** Wrong page or old UI

**Fix:**
1. Make sure you're on the Edge Functions page
2. Look for "Manage secrets" button (top right)
3. Try refreshing the page
4. Alternative: Use Supabase CLI (see below)

---

## 🖥️ **Alternative: Use CLI**

If you prefer command line:

### **Install Supabase CLI:**
```bash
npm install -g supabase
```

### **Login:**
```bash
supabase login
```

### **Set Secret:**
```bash
supabase secrets set OPENWEATHER_API_KEY=98cda4edc63b4a997bfe76242b1b49be
```

### **Verify:**
```bash
supabase secrets list
```

**Output:**
```
NAME                    VALUE (preview)
NASA_BEARER_TOKEN       eyJ0eXAiOiJKV1Qi...
NASA_OPEN_API_KEY       bS1QbfeODmM2uwt...
OPENWEATHER_API_KEY     98cda4edc63b4a9...  ← Should appear
```

---

## 📱 **What Happens After Adding Secret**

### **1. Backend Automatically Uses It**

Your `/supabase/functions/server/config.tsx` reads from environment:

```typescript
export const CONFIG = {
  OPENWEATHER: {
    API_KEY: Deno.env.get('OPENWEATHER_API_KEY') || ''
  }
};
```

### **2. Hybrid Weather Activates**

The hybrid weather system automatically detects OpenWeather:

```typescript
if (CONFIG.OPENWEATHER.API_KEY) {
  // Use OpenWeather for real-time data ✓
} else {
  // Fall back to NASA only
}
```

### **3. Tabs Update**

In your Recommendations page, the tabs will show:
- **OpenWeather Tab:** ✅ Real-time data
- **NASA Tab:** ✅ Historical data
- **Integrated Tab:** ✅ Combined (90% confidence)

---

## ✅ **Quick Checklist**

- [ ] Go to Supabase Dashboard
- [ ] Navigate to Edge Functions → Manage secrets
- [ ] Click "New secret"
- [ ] Enter name: `OPENWEATHER_API_KEY`
- [ ] Enter value: `98cda4edc63b4a997bfe76242b1b49be`
- [ ] Click "Save"
- [ ] Test: `GET /test-secrets`
- [ ] Verify: `hybridMode: true`
- [ ] Check tabs in Recommendations page
- [ ] OpenWeather tab shows data ✓

---

## 🎉 **Done!**

Your OpenWeather API key is now:
- ✅ Securely stored in Supabase
- ✅ Automatically used by your app
- ✅ Easy to update without code changes
- ✅ Safe from being committed to Git

**Test it:**
1. Open Outdoor/Indoor Activities
2. Look at Current Conditions card
3. Click "OpenWeather" tab
4. You should see real-time data! 🌤️

---

## 📚 **Related Guides**

- `/SUPABASE_SECRETS_GUIDE.md` - Complete secrets guide
- `/HYBRID_WEATHER_GUIDE.md` - Hybrid weather system
- `/TABBED_CONDITIONS_ADDED.md` - 3-tab interface
- `/API_CREDENTIALS_GUIDE.md` - All API keys

---

**Questions?** Test your setup:
```javascript
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-0765a8f0/test-secrets')
  .then(r => r.json())
  .then(data => console.log(data));
```

Should show: `"openweather": "configured ✓"` 🎉
