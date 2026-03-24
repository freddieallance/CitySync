/**
 * Read API keys from environment variables (Supabase Secrets)
 * 
 * These are automatically injected by Supabase when you:
 * 1. Add secrets in Dashboard (Edge Functions → Manage secrets)
 * 2. Or use CLI: supabase secrets set KEY_NAME=value
 * 
 * Last updated: Triggering redeploy to activate OpenWeather secret
 */

// Log environment variable status on load (for debugging)
console.log('🔐 Loading configuration from environment variables...');
console.log('📦 Deployment timestamp:', new Date().toISOString());
const openweatherKey = Deno.env.get('OPENWEATHER_API_KEY');
const nasaBearerToken = Deno.env.get('NASA_BEARER_TOKEN');
const nasaOpenKey = Deno.env.get('NASA_OPEN_API_KEY');
const geminiKey = Deno.env.get('GEMINI_API_KEY');

console.log('📊 Environment Variable Status:');
console.log('   OPENWEATHER_API_KEY:', openweatherKey ? `✓ Found (${openweatherKey.substring(0, 8)}...)` : '✗ Not found');
console.log('   NASA_BEARER_TOKEN:', nasaBearerToken ? `✓ Found (${nasaBearerToken.substring(0, 8)}...)` : '✗ Not found');
console.log('   NASA_OPEN_API_KEY:', nasaOpenKey ? `✓ Found (${nasaOpenKey.substring(0, 8)}...)` : '✗ Not found');
console.log('   GEMINI_API_KEY:', geminiKey ? `✓ Found (${geminiKey.substring(0, 8)}...)` : '✗ Not found');
console.log('');

export const CONFIG = {
  // ═══════════��═══════════════════════════════════════════════
  // 🛰️  NASA EARTHDATA BEARER TOKEN
  // ════════════════════════════════════════════════════════════
  // 
  // Supabase Secret Name: NASA_BEARER_TOKEN
  // Get your token from: https://urs.earthdata.nasa.gov/users/YOUR_USERNAME/user_tokens
  // 
  NASA: {
    BEARER_TOKEN: nasaBearerToken || '',
    API_KEY: Deno.env.get('NASA_API_KEY') || '',
  },

  // ════════════════════════════════════════════════════════════
  // 🚀  NASA OPEN API KEY
  // ════════════════════════════════════════════════════════════
  // 
  // Supabase Secret Name: NASA_OPEN_API_KEY
  // Sign up (FREE): https://api.nasa.gov/
  // 
  NASA_OPEN: {
    API_KEY: nasaOpenKey || 'DEMO_KEY',
  },

  // ════════════════════════════════════════════════════════════
  // 🌤️  OPENWEATHER API KEY
  // ═══════════════════════════════════════════════════════════
  // 
  // Supabase Secret Name: OPENWEATHER_API_KEY
  // Sign up (FREE): https://openweathermap.org/api
  // 
  OPENWEATHER: {
    API_KEY: openweatherKey || '',
  },

  // ════════════════════════════════════════════════════════════
  // 🤖  GOOGLE GEMINI API KEY
  // ═══════════════════════════════════════════════════════════
  // 
  // Supabase Secret Name: GEMINI_API_KEY
  // Get key (FREE): https://aistudio.google.com/app/apikey
  // 
  GEMINI: {
    API_KEY: geminiKey || '',
  },
};

/**
 * Helper function to check if NASA credentials are configured
 */
export function areNASACredentialsConfigured(): boolean {
  return (
    CONFIG.NASA.BEARER_TOKEN.length > 0 &&
    CONFIG.NASA.BEARER_TOKEN.startsWith('eyJ')
  );
}

/**
 * Helper function to check if OpenWeather is configured
 */
export function isOpenWeatherConfigured(): boolean {
  return (
    CONFIG.OPENWEATHER.API_KEY.length > 0 &&
    CONFIG.OPENWEATHER.API_KEY !== ''
  );
}

/**
 * Helper function to check if Gemini is configured
 */
export function isGeminiConfigured(): boolean {
  return (
    CONFIG.GEMINI.API_KEY.length > 0 &&
    CONFIG.GEMINI.API_KEY !== ''
  );
}

/**
 * Helper function to check if NASA Open API is configured
 */
export function isNASAOpenAPIConfigured(): boolean {
  return (
    CONFIG.NASA_OPEN.API_KEY.length > 0 &&
    CONFIG.NASA_OPEN.API_KEY !== 'DEMO_KEY' &&
    CONFIG.NASA_OPEN.API_KEY !== ''
  );
}

/**
 * Get configuration status for debugging
 */
export function getConfigStatus() {
  return {
    nasa_bearer: areNASACredentialsConfigured() ? 'configured ✓' : 'not set ✗',
    nasa_open: isNASAOpenAPIConfigured() ? 'configured ✓' : 'using DEMO_KEY',
    openweather: isOpenWeatherConfigured() ? 'configured ✓' : 'not set ✗',
    gemini: isGeminiConfigured() ? 'configured ✓' : 'not set ✗',
  };
}

/**
 * Validate all required API keys are present
 */
export function validateConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!areNASACredentialsConfigured()) {
    missing.push('NASA_BEARER_TOKEN');
  }
  
  if (!isOpenWeatherConfigured()) {
    missing.push('OPENWEATHER_API_KEY');
  }
  
  // Gemini is optional
  // NASA Open API can use DEMO_KEY
  
  return {
    valid: missing.length === 0,
    missing
  };
}