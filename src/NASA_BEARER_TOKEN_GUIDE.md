# 🔐 NASA Earthdata Bearer Token Guide

## ✅ **UPDATED: Now Using Bearer Token Authentication**

CitySync has been updated to use **Bearer Token authentication** instead of username/password for NASA APIs. This is more secure and aligns with modern authentication practices.

---

## 📋 What Changed?

### Before (Username/Password):
```typescript
CONFIG.NASA = {
  USERNAME: 'your_username',
  PASSWORD: 'your_password'
}
```

### After (Bearer Token):
```typescript
CONFIG.NASA = {
  BEARER_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

---

## 🎯 How to Get Your NASA Bearer Token

### Step 1: Create NASA Earthdata Account (If You Don't Have One)

1. Go to: **https://urs.earthdata.nasa.gov/users/new**
2. Fill out the registration form
3. Verify your email address
4. Login to your account

---

### Step 2: Generate Your Bearer Token

1. **Login** to NASA Earthdata: https://urs.earthdata.nasa.gov/
2. Click on your **username** (top right)
3. Select **"My Profile"** or **"Profile"**
4. Navigate to **"User Tokens"** or **"Generate Token"** tab
5. Click **"Generate Token"**
6. **Copy the token** (you'll only see it once!)

**Example Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjMwMDAwMDAwfQ.abcdefghijklmnopqrstuvwxyz123456789
```

---

### Step 3: Add Token to CitySync

#### **Option 1: Via Config File (Backend)**

Open `/supabase/functions/server/config.tsx` and update:

```typescript
export const CONFIG = {
  NASA: {
    BEARER_TOKEN: 'YOUR_ACTUAL_TOKEN_HERE',  // ← Paste your token here
  },
  // ... other configs
};
```

#### **Option 2: Via CitySync UI (User-Specific)**

1. Open CitySync app
2. Click on **"NASA Credentials"** (login required)
3. Paste your Bearer token
4. Click **"Save Token"**
5. Click **"Test Connection"** to verify

---

## 🔍 Where to Find Your Token on NASA Earthdata

### Direct URL:
```
https://urs.earthdata.nasa.gov/users/YOUR_USERNAME/user_tokens
```
(Replace `YOUR_USERNAME` with your actual username)

### Navigation Path:
```
NASA Earthdata Login
  └── Profile (top right)
      └── User Tokens
          └── Generate Token
```

---

## 🛡️ Security Best Practices

### ✅ DO:
- ✅ Keep your Bearer token **private and secure**
- ✅ Store it in the backend config file (never in frontend)
- ✅ Regenerate your token if you suspect it's been compromised
- ✅ Use environment variables in production

### ❌ DON'T:
- ❌ Share your Bearer token publicly
- ❌ Commit your token to version control (Git)
- ❌ Store your token in frontend code
- ❌ Use the same token across multiple applications

---

## 🧪 Testing Your Token

### Method 1: Use the Test Button
1. Open CitySync
2. Go to **Welcome Page**
3. Scroll to bottom
4. Click **"🧪 Test NASA Credentials"**
5. Check the results

### Method 2: Browser Console
```javascript
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-0765a8f0/test-nasa')
  .then(r => r.json())
  .then(data => console.log('NASA APIs Available:', data.apisAvailable, '/', data.totalAPIs));
```

### Expected Result (With Valid Token):
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
  }
}
```

---

## 📊 Which APIs Need the Bearer Token?

### ✅ Public APIs (No Token Needed):
1. **NASA POWER** - Climate data
2. **NASA FIRMS** - Wildfire detection
3. **NASA EONET** - Natural disasters
4. **Worldview** - Satellite imagery
5. **CMR** - Dataset search

### 🔐 Authenticated APIs (Token Required):
6. **GES DISC** - Atmospheric composition
7. **Giovanni** - Climate analysis
8. **DataRods** - Hydrology data

---

## 🔄 Token vs Username/Password

### Why Bearer Token is Better:

| Feature | Username/Password | Bearer Token |
|---------|------------------|--------------|
| **Security** | ❌ Sends credentials with every request | ✅ Token can be revoked |
| **Expiration** | ❌ Password rarely expires | ✅ Token has expiration |
| **Scope** | ❌ Full account access | ✅ Limited scope possible |
| **Audit** | ❌ Hard to track | ✅ Easy to audit usage |
| **Best Practice** | ❌ Outdated method | ✅ Modern standard |

---

## 🚨 Troubleshooting

### ❌ "Invalid Bearer Token"
**Solution:** Regenerate your token on NASA Earthdata

### ❌ "Token Expired"
**Solution:** Generate a new token (tokens may expire after some time)

### ❌ "Unauthorized"
**Solution:** Make sure you've approved your application on NASA Earthdata

### ❌ "403 Forbidden"
**Solution:** Check if your NASA account has access to the specific dataset

---

## 📖 Official NASA Documentation

- **Earthdata Login:** https://urs.earthdata.nasa.gov/documentation
- **API Authentication:** https://wiki.earthdata.nasa.gov/display/EL/How+To+Register+An+Application
- **Bearer Token Info:** https://wiki.earthdata.nasa.gov/display/EL/How+To+Generate+Earthdata+Prerequisite+Files

---

## 💡 Quick Reference

### Config File Location:
```
/supabase/functions/server/config.tsx
```

### Token Format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Where It's Used:
```typescript
// In NASA API calls
headers: {
  'Authorization': `Bearer ${CONFIG.NASA.BEARER_TOKEN}`
}
```

---

## ✅ Migration Complete

Your CitySync app now uses **Bearer Token authentication** for NASA APIs!

- ✅ More secure than username/password
- ✅ Easier to manage and revoke
- ✅ Follows industry best practices
- ✅ Works with all 6 NASA APIs

---

## 🎯 Next Steps

1. **Generate your Bearer token** on NASA Earthdata
2. **Add it to config.tsx** (backend) or via the UI
3. **Test the connection** using the test button
4. **Start using all 6 NASA APIs!** 🚀

---

**Questions?** Check the updated documentation:
- `/WORKING_APIS_STATUS.md` - Current API status
- `/API_VISUAL_MAP.md` - Architecture overview
- `/WHERE_TO_PUT_API_KEYS.md` - Quick setup guide
