# 🔐 Adding OpenWeather API to Supabase Secrets

## ✅ **Best Practice: Use Supabase Secrets**

Instead of hardcoding API keys in your code, use **Supabase Secrets** for better security and easier management!

---

## 🚀 **Quick Setup (3 Steps)**

### **Step 1: Add Secrets to Supabase Dashboard**

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: **CitySync**

2. **Navigate to Edge Functions Settings:**
   - Click **Edge Functions** in the left sidebar
   - Click **Manage secrets** button (top right)

3. **Add Your API Keys:**

Click **"New secret"** and add each of these:

```
Name: OPENWEATHER_API_KEY
Value: 98cda4edc63b4a997bfe76242b1b49be
```

```
Name: NASA_BEARER_TOKEN
Value: eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6ImZyZWRkaWVhbGxhbmNlIiwiZXhwIjoxNzY0ODE5OTcxLCJpYXQiOjE3NTk2MzU5NzEsImlzcyI6Imh0dHBzOi8vdXJzLmVhcnRoZGF0YS5uYXNhLmdvdiIsImlkZW50aXR5X3Byb3ZpZGVyIjoiZWRsX29wcyIsImFjciI6ImVkbCIsImFzc3VyYW5jZV9sZXZlbCI6M30.OyHel68nLm4CcFWABK0T0bZLUUUT8upb8fkkKyoCJNUaco31Lfw7UzmsuhkekTxmBo2vAEt8_26ngtn0YXHgzsQieFyuqKTlaNvZU34dNKWhdvIOk-TWqEOgxI49WT_l7EChka_gfcMkeU54XcCD9HdKOXuwE-ULmf6u5-W0Nsk0744fzpKk9zAU8KuwnfoLLUpkV2FFTaadnm9M5Jlodjbtx2tQNP7pP_DDE8G9bjiTTehimKt3HEpgDXzxQvH7te6_B_Kaf5czoLU5ZGjwgx7qFIpbyj_icgqmCo7CHBcl_KFEMQj-sQZWeGVAT5BM9A9n1SEUSyRyYGoQx645bg
```

```
Name: NASA_OPEN_API_KEY
Value: bS1QbfeODmM2uwt5nemP9vOddDXCGn9QGbrIAGhb
```

```
Name: GEMINI_API_KEY
Value: YOUR_GEMINI_API_KEY_HERE
(Replace with your actual key from: https://aistudio.google.com/app/apikey)
```

4. **Click "Save" for each secret**

---

### **Step 2: Access Secrets in Your Code**

Supabase automatically injects secrets as environment variables in Edge Functions.

**Access them using:**
```typescript
const openweatherKey = Deno.env.get('OPENWEATHER_API_KEY');
const nasaToken = Deno.env.get('NASA_BEARER_TOKEN');
const nasaApiKey = Deno.env.get('NASA_OPEN_API_KEY');
const geminiKey = Deno.env.get('GEMINI_API_KEY');
```

---

### **Step 3: Update Your Config File**

I'll update `/supabase/functions/server/config.tsx` to use environment variables.

---

## 📋 **Complete List of Secrets to Add**

| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `OPENWEATHER_API_KEY` | OpenWeather API key | https://openweathermap.org/api |
| `NASA_BEARER_TOKEN` | NASA Earthdata bearer token | https://urs.earthdata.nasa.gov/users/YOUR_USERNAME/user_tokens |
| `NASA_OPEN_API_KEY` | NASA Open API key | https://api.nasa.gov/ |
| `GEMINI_API_KEY` | Google Gemini API key | https://aistudio.google.com/app/apikey |

---

## 🎯 **Why Use Supabase Secrets?**

### **Without Secrets (Current - ❌ Bad):**
```typescript
// Hardcoded in config.tsx - visible in code
export const CONFIG = {
  OPENWEATHER: {
    API_KEY: '98cda4edc63b4a997bfe76242b1b49be'  // ❌ Exposed
  }
};
```

### **With Secrets (Better - ✅ Good):**
```typescript
// Read from environment - not in code
export const CONFIG = {
  OPENWEATHER: {
    API_KEY: Deno.env.get('OPENWEATHER_API_KEY') || ''  // ✅ Secure
  }
};
```

### **Benefits:**
- ✅ **Security** - Keys not exposed in code
- ✅ **Flexibility** - Change keys without code changes
- ✅ **Team-friendly** - Each team member uses their own keys
- ✅ **Production-safe** - Different keys for dev/prod
- ✅ **Git-safe** - No accidental commits of keys

---

## 🖥️ **Alternative: Using Supabase CLI**

### **Install Supabase CLI:**
```bash
npm install -g supabase
```

### **Login:**
```bash
supabase login
```

### **Link Your Project:**
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### **Set Secrets via CLI:**
```bash
supabase secrets set OPENWEATHER_API_KEY=98cda4edc63b4a997bfe76242b1b49be
supabase secrets set NASA_BEARER_TOKEN=eyJ0eXAiOiJKV1Qi...
supabase secrets set NASA_OPEN_API_KEY=bS1QbfeODmM2uwt5...
supabase secrets set GEMINI_API_KEY=YOUR_KEY_HERE
```

### **List All Secrets:**
```bash
supabase secrets list
```

### **Deploy Functions:**
```bash
supabase functions deploy
```

---

## 🔍 **Verify Secrets Are Set**

### **Method 1: Check Dashboard**
1. Go to **Edge Functions** → **Manage secrets**
2. You should see all 4 secrets listed

### **Method 2: Test Endpoint**
```javascript
// Test in browser console
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-0765a8f0/test-secrets')
  .then(r => r.json())
  .then(data => console.log(data));
```

Expected output:
```json
{
  "openweather": "configured ✓",
  "nasa_bearer": "configured ✓",
  "nasa_api": "configured ✓",
  "gemini": "configured ✓"
}
```

---

## 🛠️ **Local Development**

### **Create `.env` file:**
```bash
# In your project root
touch .env
```

### **Add secrets to `.env`:**
```bash
OPENWEATHER_API_KEY=98cda4edc63b4a997bfe76242b1b49be
NASA_BEARER_TOKEN=eyJ0eXAiOiJKV1Qi...
NASA_OPEN_API_KEY=bS1QbfeODmM2uwt5...
GEMINI_API_KEY=YOUR_KEY_HERE
```

### **Run locally:**
```bash
supabase functions serve
```

**Note:** Add `.env` to `.gitignore` to avoid committing secrets!

---

## 🔄 **Migration from Hardcoded to Secrets**

### **Before (config.tsx):**
```typescript
export const CONFIG = {
  OPENWEATHER: {
    API_KEY: '98cda4edc63b4a997bfe76242b1b49be'
  },
  NASA: {
    BEARER_TOKEN: 'eyJ0eXAiOiJKV1Qi...'
  }
};
```

### **After (config.tsx):**
```typescript
export const CONFIG = {
  OPENWEATHER: {
    API_KEY: Deno.env.get('OPENWEATHER_API_KEY') || ''
  },
  NASA: {
    BEARER_TOKEN: Deno.env.get('NASA_BEARER_TOKEN') || ''
  }
};
```

### **No code changes needed elsewhere!**
All your existing code continues to work because `CONFIG` object structure remains the same.

---

## ⚠️ **Important Notes**

### **1. Secrets are Function-specific**
- Secrets set for Edge Functions only work in Edge Functions
- Not accessible from client-side code
- This is a GOOD thing for security!

### **2. Restart After Adding Secrets**
- After adding/updating secrets, redeploy your functions
- Dashboard: Click **"Deploy"** button
- CLI: Run `supabase functions deploy`

### **3. Don't Commit Secrets**
```bash
# Add to .gitignore
.env
.env.local
config.local.tsx
```

### **4. Keep Backup**
- Save your API keys in a password manager
- Document which keys are used where
- Have a plan for key rotation

---

## 🎯 **Quick Start Checklist**

- [ ] Go to Supabase Dashboard
- [ ] Navigate to Edge Functions → Manage secrets
- [ ] Add `OPENWEATHER_API_KEY` secret
- [ ] Add `NASA_BEARER_TOKEN` secret
- [ ] Add `NASA_OPEN_API_KEY` secret
- [ ] Add `GEMINI_API_KEY` secret (optional)
- [ ] Click Save for each
- [ ] Redeploy Edge Functions
- [ ] Test the hybrid weather endpoint
- [ ] Verify all APIs working

---

## 🧪 **Testing**

### **Test OpenWeather:**
```javascript
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-0765a8f0/hybrid-weather?lat=1.5535&lon=110.3593')
  .then(r => r.json())
  .then(data => {
    console.log('Hybrid mode:', data.hybridMode);
    console.log('Source:', data.data.current.source);
  });
```

Expected:
- `hybridMode: true`
- `source: "openweather"`

---

## 📚 **Resources**

- **Supabase Secrets Docs:** https://supabase.com/docs/guides/functions/secrets
- **Supabase CLI:** https://supabase.com/docs/guides/cli
- **Edge Functions:** https://supabase.com/docs/guides/functions
- **Environment Variables:** https://supabase.com/docs/guides/functions/environment-variables

---

## 🎉 **Done!**

Your API keys are now securely stored in Supabase secrets and automatically available to your Edge Functions!

**Benefits:**
- ✅ Secure (not in code)
- ✅ Easy to update (no code changes)
- ✅ Team-friendly (each member can use own keys)
- ✅ Production-ready (proper secret management)

**Next Steps:**
1. Test the hybrid weather endpoint
2. Verify OpenWeather tab shows data
3. Check NASA tab works too
4. Enjoy your secure API setup! 🚀
