# 🎯 WHERE TO PUT YOUR API KEYS

## TL;DR - Quick Answer

**Open this file and add your credentials:**

```
📁 /supabase/functions/server/config.tsx
```

**That's it!** Everything else is automatic.

---

## 📋 Visual Guide

### Step 1: Find the File

```
Your Project
└── supabase/
    └── functions/
        └── server/
            └── config.tsx  ← OPEN THIS FILE
```

### Step 2: Replace These Lines

**BEFORE** (what you see now):
```typescript
NASA: {
  BEARER_TOKEN: 'YOUR_NASA_BEARER_TOKEN_HERE',  // ← Not real
},
```

**AFTER** (what you should change it to):
```typescript
NASA: {
  BEARER_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',  // ← Your real token
},
```

**How to get your token:**
1. Go to: https://urs.earthdata.nasa.gov/
2. Login → Profile → User Tokens → Generate Token
3. Copy the token and paste it above

**Full guide:** See `/NASA_BEARER_TOKEN_GUIDE.md`

### Step 3: Do the Same for Other APIs

**NASA Open API (for space imagery):**
```typescript
NASA_OPEN: {
  API_KEY: 'abc123...',  // ← Paste your NASA API key here
},
```

**Gemini AI:**
```typescript
GEMINI: {
  API_KEY: 'AIzaSy...',  // ← Paste your real Gemini API key here
},
```

**OpenWeather:**
```typescript
OPENWEATHER: {
  API_KEY: 'abc123...',  // ← Paste your real OpenWeather key here
},
```

---

## 🔑 Where to Get Each API Key

| API | Get It Here | It's Free? | What It Does |
|-----|-------------|------------|--------------|
| **NASA Bearer Token** | https://urs.earthdata.nasa.gov/ | ✅ Yes | Earth data, weather, climate |
| **NASA Open API** | https://api.nasa.gov/ | ✅ Yes | Space imagery, Mars photos, asteroids |
| **Gemini AI** | https://aistudio.google.com/app/apikey | ✅ Yes | AI chat and recommendations |
| **OpenWeather** | https://openweathermap.org/api | ✅ Yes (free tier) | Additional weather data |

---

## ✅ Complete Example

Here's what your config file should look like when you're done:

```typescript
export const CONFIG = {
  NASA: {
    BEARER_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',  // ✅ Real token
  },

  NASA_OPEN: {
    API_KEY: 'abc123def456ghi789...',  // ✅ Real NASA API key
  },

  OPENWEATHER: {
    API_KEY: 'a1b2c3d4e5f6g7h8i9j0',  // ✅ Real API key
  },

  GEMINI: {
    API_KEY: 'AIzaSyABC123XYZ789...',  // ✅ Real API key
  },
};
```

---

## 📖 Detailed Guides

- **NASA Bearer Token:** See `/NASA_BEARER_TOKEN_GUIDE.md`
- **NASA Open API:** See `/NASA_OPEN_API_GUIDE.md`
- **All APIs Status:** See `/WORKING_APIS_STATUS.md`

---

## 🚀 After You Save

1. **Save** the file
2. **Refresh** your app
3. **Done!** All APIs will work automatically

No restart needed. No complicated setup. Just save and go! ✨

---

## 🔒 Is This Safe?

**YES!** Because:

- ✅ File is in `/supabase/functions/server/` (backend only)
- ✅ Users can't see backend files
- ✅ Your credentials never leave the server
- ✅ All API calls happen server-side

---

## ❓ Need More Help?

Read the detailed guide:
```
📄 /API_CREDENTIALS_GUIDE.md
```

---

**That's all you need to know!** Just edit one file, save, and you're done. 🎉
