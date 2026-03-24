// Gemini AI Integration for Environmental Safety App
// Using the new Google Generative AI SDK with gemini-2.5-flash
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";
import { CONFIG, isGeminiConfigured } from './config.tsx';

// Use API key from config.tsx or fallback to environment variable
const GEMINI_API_KEY = isGeminiConfigured() ? CONFIG.GEMINI.API_KEY : Deno.env.get('GEMINI_API_KEY');

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY not configured. Please set it in /supabase/functions/server/config.tsx');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Helper function to repair truncated/incomplete JSON
function repairJSON(text: string): string {
  let json = text.trim();
  
  // Extract from code blocks if present
  const codeBlockMatch = json.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    json = codeBlockMatch[1].trim();
  } else {
    // Extract from first { to end
    const firstBrace = json.indexOf('{');
    if (firstBrace !== -1) {
      json = json.substring(firstBrace);
    }
  }

  // Count braces to find where JSON might be truncated
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let lastValidPos = 0;
  let lastCompleteObjectPos = 0;

  for (let i = 0; i < json.length; i++) {
    const char = json[i];
    const prevChar = i > 0 ? json[i - 1] : '';

    // Track string state (ignore escaped quotes)
    if (char === '"' && prevChar !== '\\') {
      inString = !inString;
    }

    if (!inString) {
      if (char === '{') {
        openBraces++;
      } else if (char === '}') {
        openBraces--;
        if (openBraces === 0 && openBrackets === 0) {
          lastCompleteObjectPos = i + 1;
        }
      } else if (char === '[') {
        openBrackets++;
      } else if (char === ']') {
        openBrackets--;
      }

      // Track last position where we had valid structure
      if (openBraces >= 0 && openBrackets >= 0) {
        lastValidPos = i;
      }
    }
  }

  // If we found a complete object, use that
  if (lastCompleteObjectPos > 0) {
    json = json.substring(0, lastCompleteObjectPos);
  } else {
    // Otherwise, truncate at last valid position and close everything
    json = json.substring(0, lastValidPos + 1);

    // Close any open string
    if (inString) {
      json += '"';
    }

    // Close any open arrays (remove trailing comma if present)
    while (openBrackets > 0) {
      if (json.trim().endsWith(',')) {
        json = json.trim().slice(0, -1);
      }
      json += ']';
      openBrackets--;
    }

    // Close any open objects (remove trailing comma if present)
    while (openBraces > 0) {
      if (json.trim().endsWith(',')) {
        json = json.trim().slice(0, -1);
      }
      json += '}';
      openBraces--;
    }
  }

  // Clean up common issues
  json = json
    // Remove trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Fix unquoted property names
    .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
    // Remove control characters
    .replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F]/g, ' ')
    // Normalize whitespace in strings
    .replace(/\s+/g, ' ');

  return json;
}

// More robust JSON parser with multiple repair strategies
function parseJSONWithFallback(text: string): any {
  // Strip markdown code blocks FIRST before any parsing attempt
  let cleanedText = text.trim();
  
  // Remove ```json ... ``` or ``` ... ``` blocks
  const codeBlockMatch = cleanedText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    cleanedText = codeBlockMatch[1].trim();
  }
  
  // Also try to extract JSON from first { to last }
  const firstBrace = cleanedText.indexOf('{');
  const lastBrace = cleanedText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
  }
  
  // Strategy 1: Try parsing the cleaned text
  try {
    return JSON.parse(cleanedText);
  } catch (e1) {
    // Strategy 2: Try with basic repair
    try {
      const repaired = repairJSON(cleanedText);
      return JSON.parse(repaired);
    } catch (e2) {
      // Strategy 3: Try to salvage partial data by finding last complete array item
      try {
        const repaired = repairJSON(text);
        
        // If it's an object with an insights array that might be truncated
        // Find the last complete object in the insights array
        const insightsMatch = repaired.match(/"insights"\s*:\s*\[([\s\S]*)\]/);
        if (insightsMatch) {
          const insightsContent = insightsMatch[1];
          
          // Find all complete objects in the array
          const objects: string[] = [];
          let depth = 0;
          let start = -1;
          let inString = false;
          
          for (let i = 0; i < insightsContent.length; i++) {
            const char = insightsContent[i];
            const prevChar = i > 0 ? insightsContent[i - 1] : '';
            
            if (char === '"' && prevChar !== '\\') {
              inString = !inString;
            }
            
            if (!inString) {
              if (char === '{') {
                if (depth === 0) start = i;
                depth++;
              } else if (char === '}') {
                depth--;
                if (depth === 0 && start !== -1) {
                  objects.push(insightsContent.substring(start, i + 1));
                  start = -1;
                }
              }
            }
          }
          
          // Rebuild with only complete objects
          if (objects.length > 0) {
            const rebuiltInsights = objects.join(',');
            const rebuiltJSON = repaired.replace(
              /"insights"\s*:\s*\[[\s\S]*\]/,
              `"insights":[${rebuiltInsights}]`
            );
            return JSON.parse(rebuiltJSON);
          }
        }
        
        // If still failing, try parsing whatever we have
        return JSON.parse(repaired);
      } catch (e3) {
        console.error('All JSON repair strategies failed');
        console.error('Text received (first 500 chars):', cleanedText.substring(0, 500));
        console.error('Original error:', e1);
        console.error('Repair attempt 1 error:', e2);
        console.error('Repair attempt 2 error:', e3);
        throw e1;
      }
    }
  }
}

// AI Chat Assistant - Conversational helper for safety questions
export async function chatAssistant(
  userMessage: string,
  context?: {
    location?: string;
    weather?: any;
    nasaData?: any;
    userHistory?: any;
  }
) {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please provide GEMINI_API_KEY.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Build context-aware system prompt
    let systemContext = `You are SafetyBot, an intelligent environmental safety assistant helping users make informed decisions about outdoor activities.

Your expertise includes:
- Weather conditions and safety
- Environmental hazards (flooding, wildfires, air quality)
- Outdoor activity recommendations
- NASA satellite data interpretation
- Emergency preparedness

Always provide:
- Clear, concise safety advice
- Specific actionable recommendations
- Risk levels (Low, Medium, High)
- Alternative suggestions when conditions are unsafe
- Empathy and understanding

Current context:`;

    if (context?.location) {
      systemContext += `\nLocation: ${context.location}`;
    }

    if (context?.weather) {
      systemContext += `\nWeather: Temp ${context.weather.temp}°C, ${context.weather.description}`;
      if (context.weather.windSpeed) {
        systemContext += `, Wind ${context.weather.windSpeed} m/s`;
      }
      if (context.weather.precipitation) {
        systemContext += `, Rain ${context.weather.precipitation}mm`;
      }
    }

    if (context?.nasaData) {
      systemContext += `\nNASA Data: ${JSON.stringify(context.nasaData)}`;
    }

    const fullPrompt = `${systemContext}

User question: ${userMessage}

Provide a helpful, safety-focused response in a friendly conversational tone.`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return {
      message: text,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    throw new Error(`AI Chat failed: ${error.message}`);
  }
}

// Smart Activity Recommendations - AI-enhanced suggestions
export async function generateSmartRecommendations(data: {
  location: string;
  weather: any;
  nasaData?: any;
  userPreferences?: string[];
  activityType: 'outdoor' | 'indoor';
}) {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please provide GEMINI_API_KEY.');
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7,
      }
    });

    const prompt = `As an environmental safety expert, analyze this data and provide intelligent activity recommendations:

Location: ${data.location}
Activity Type: ${data.activityType}
Weather: ${JSON.stringify(data.weather)}
${data.nasaData ? `NASA Environmental Data: ${JSON.stringify(data.nasaData)}` : ''}
${data.userPreferences ? `User Preferences: ${data.userPreferences.join(', ')}` : ''}

Provide:
1. Top 3 recommended activities with safety ratings (Safe/Moderate/Risky)
2. Specific safety tips for each activity
3. Time recommendations (best time of day)
4. Required equipment/preparation
5. Alternative suggestions if conditions worsen

Return raw JSON ONLY (NO markdown, NO code blocks, NO backticks):
{
  "recommendations": [
    {
      "activity": "Activity Name",
      "safetyRating": "Safe",
      "score": 85,
      "tips": ["brief tip 1", "brief tip 2"],
      "bestTime": "Morning",
      "equipment": ["item1", "item2"],
      "reasoning": "Brief reason (1 sentence)"
    }
  ],
  "overallAssessment": "Brief assessment (2 sentences max)",
  "alerts": ["Brief alert 1", "Brief alert 2"]
}

CRITICAL: Return raw JSON starting with { and ending with }. NO \`\`\`json wrappers. Keep all text BRIEF. Single-line strings. Max 3 recommendations.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      const parsed = parseJSONWithFallback(text);
      return {
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        overallAssessment: parsed.overallAssessment || text,
        alerts: Array.isArray(parsed.alerts) ? parsed.alerts : []
      };
    } catch (parseError) {
      console.error('JSON parse error in smart recommendations:', parseError);
      return {
        recommendations: [],
        overallAssessment: text,
        alerts: []
      };
    }
  } catch (error: any) {
    console.error('Smart recommendations error:', error);
    throw new Error(`Smart recommendations failed: ${error.message}`);
  }
}

// Photo Analysis - Verify review photos match safety conditions
export async function analyzePhoto(
  imageUrl: string,
  claimedConditions: {
    weatherCondition?: string;
    safetyRating?: string;
    timestamp?: string;
  }
) {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please provide GEMINI_API_KEY.');
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    // Fetch image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = btoa(
      new Uint8Array(imageBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    const prompt = `Analyze this outdoor/environmental photo and verify the safety conditions.

Claimed Conditions:
${claimedConditions.weatherCondition ? `Weather: ${claimedConditions.weatherCondition}` : ''}
${claimedConditions.safetyRating ? `Safety Rating: ${claimedConditions.safetyRating}` : ''}

Please analyze:
1. Actual weather conditions visible in photo
2. Environmental hazards (flooding, smoke, storm, debris)
3. Visibility and lighting conditions
4. Ground/terrain conditions
5. Whether photo matches claimed conditions

Return raw JSON ONLY (NO markdown, NO code blocks, NO backticks):
{
  "verified": true,
  "actualConditions": {
    "weather": "description",
    "hazards": ["hazard1", "hazard2"],
    "visibility": "Good",
    "safetyLevel": "Safe"
  },
  "matchScore": 85,
  "discrepancies": ["discrepancy1"],
  "confidence": 90,
  "analysis": "Detailed description of what you see"
}

CRITICAL: Return raw JSON starting with { and ending with }. NO \`\`\`json wrappers. All string values must be single-line.`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64
        }
      },
      { text: prompt }
    ]);

    const response = result.response;
    const text = response.text();

    try {
      return parseJSONWithFallback(text);
    } catch (parseError) {
      console.error('JSON parse error in photo analysis:', parseError);
      return {
        verified: false,
        actualConditions: {},
        matchScore: 0,
        discrepancies: ['Unable to analyze photo'],
        confidence: 0,
        analysis: text
      };
    }
  } catch (error: any) {
    console.error('Photo analysis error:', error);
    throw new Error(`Photo analysis failed: ${error.message}`);
  }
}

// Intelligent Safety Insights - Multi-source data analysis
export async function generateSafetyInsights(data: {
  location: string;
  currentWeather: any;
  forecast?: any[];
  nasaData?: any;
  communityReviews?: any[];
  historicalData?: any;
}) {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please provide GEMINI_API_KEY.');
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        maxOutputTokens: 2048, // Limit response length to avoid truncation
        temperature: 0.7,
      }
    });

    const prompt = `As an environmental safety analyst, provide comprehensive safety insights by analyzing multiple data sources:

Location: ${data.location}

Current Weather: ${JSON.stringify(data.currentWeather)}
${data.forecast ? `Forecast: ${JSON.stringify(data.forecast.slice(0, 3))}` : ''}
${data.nasaData ? `NASA Data: ${JSON.stringify(data.nasaData)}` : ''}
${data.communityReviews ? `Community Reviews (${data.communityReviews.length}): ${JSON.stringify(data.communityReviews.slice(0, 5))}` : ''}

Provide analysis as VALID JSON ONLY. DO NOT wrap in markdown code blocks or backticks.

Example format (return raw JSON like this):
{
  "overallSafetyScore": 75,
  "riskLevel": "Low",
  "insights": [
    {
      "category": "Weather",
      "title": "Short title (max 5 words)",
      "description": "Concise explanation (max 2 sentences)",
      "severity": "Info",
      "actionable": "Brief action (max 1 sentence)"
    }
  ],
  "predictions": {
    "next6Hours": "Brief prediction (1 sentence)",
    "next24Hours": "Brief prediction (1 sentence)",
    "trend": "Stable"
  },
  "recommendations": ["brief tip 1", "brief tip 2"],
  "emergencyContacts": "Optional emergency info"
}

CRITICAL RULES:
1. Return ONLY raw JSON - NO markdown formatting, NO code blocks, NO backticks
2. Do NOT use \`\`\`json or \`\`\` wrappers
3. Start directly with { and end with }
4. Keep all text BRIEF and CONCISE to avoid truncation
5. Max 3-5 insights only
6. All strings on single lines
7. Ensure proper JSON escaping
8. Close all braces and brackets`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      const parsed = parseJSONWithFallback(text);
      
      // Validate required fields
      return {
        overallSafetyScore: parsed.overallSafetyScore || 50,
        riskLevel: parsed.riskLevel || 'Medium',
        insights: Array.isArray(parsed.insights) ? parsed.insights : [],
        predictions: parsed.predictions || { next6Hours: 'Unknown', next24Hours: 'Unknown', trend: 'Stable' },
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        emergencyContacts: parsed.emergencyContacts || undefined
      };
    } catch (parseError: any) {
      console.error('JSON parse error in safety insights:', parseError.message);
      console.error('Failed to parse text (first 1000 chars):', text.substring(0, 1000));
      
      // Return safe fallback
      return {
        overallSafetyScore: 50,
        riskLevel: 'Medium',
        insights: [],
        predictions: { next6Hours: 'Analysis unavailable', next24Hours: 'Analysis unavailable', trend: 'Stable' },
        recommendations: ['AI analysis could not be completed. Please check weather and NASA data manually.']
      };
    }
  } catch (error: any) {
    console.error('Safety insights error:', error);
    throw new Error(`Safety insights failed: ${error.message}`);
  }
}

// Personalized Safety Alerts - AI learns user preferences
export async function generatePersonalizedAlert(data: {
  userId: string;
  location: string;
  userPreferences?: any;
  userHistory?: any;
  currentConditions: any;
  upcomingChanges?: any;
}) {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please provide GEMINI_API_KEY.');
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      }
    });

    const prompt = `Generate a personalized safety alert for this user:

Location: ${data.location}
User Preferences: ${JSON.stringify(data.userPreferences || {})}
User History: ${JSON.stringify(data.userHistory || {})}
Current Conditions: ${JSON.stringify(data.currentConditions)}
${data.upcomingChanges ? `Upcoming Changes: ${JSON.stringify(data.upcomingChanges)}` : ''}

Create a personalized alert that:
1. Addresses user's specific interests/activities
2. Uses their preferred notification style
3. References their past experiences if relevant
4. Provides actionable next steps
5. Is timely and relevant

Return raw JSON ONLY (NO markdown, NO code blocks, NO backticks):
{
  "shouldAlert": true,
  "priority": "Medium",
  "title": "Alert title",
  "message": "Personalized message",
  "recommendations": ["action1", "action2"],
  "timing": "Send now",
  "reasoning": "Why this alert matters to this user"
}

CRITICAL: Return raw JSON starting with { and ending with }. NO \`\`\`json wrappers. All string values must be single-line.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      return parseJSONWithFallback(text);
    } catch (parseError) {
      console.error('JSON parse error in personalized alert:', parseError);
      return {
        shouldAlert: false,
        priority: 'Low',
        title: 'Safety Update',
        message: text,
        recommendations: [],
        timing: 'Send now',
        reasoning: ''
      };
    }
  } catch (error: any) {
    console.error('Personalized alert error:', error);
    throw new Error(`Personalized alert failed: ${error.message}`);
  }
}

// AI-Powered Real Place Suggestions
export async function suggestRealPlaces(data: {
  location: string;
  latitude: number;
  longitude: number;
  activity: string;
  activityType: 'outdoor' | 'indoor';
  weather?: any;
  nasaData?: any;
}) {
  if (!genAI) {
    throw new Error('Gemini AI is not configured. Please provide GEMINI_API_KEY.');
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.8,
      }
    });

    const prompt = `You are a local expert for ${data.location} (${data.latitude}, ${data.longitude}).

Task: Suggest REAL, SPECIFIC places in or near ${data.location} for "${data.activity}" activities.

Activity Type: ${data.activityType}
${data.weather ? `Current Weather: ${JSON.stringify(data.weather)}` : ''}
${data.nasaData ? `Environmental Data: ${JSON.stringify(data.nasaData)}` : ''}

Requirements:
1. Suggest 3-5 REAL places that actually exist in or near ${data.location}
2. Use actual place names (parks, malls, beaches, trails, gyms, restaurants, etc.)
3. Provide realistic distances (in km from city center)
4. Include brief, accurate descriptions
5. Suggest realistic ratings (3.5-5.0 stars)
6. Consider current weather/environmental conditions in your suggestions

For ${data.activityType} activities like "${data.activity}", suggest places that are:
- Actually located in/near ${data.location}
- Suitable for the specified activity
- Safe given current conditions
- Accessible to visitors

Return raw JSON ONLY (NO markdown, NO code blocks, NO backticks):
{
  "places": [
    {
      "name": "Actual place name",
      "description": "Brief description (1-2 sentences)",
      "location": "Specific area/district",
      "distance": "X km",
      "rating": 4.5,
      "type": "park|mall|beach|gym|museum|restaurant|etc",
      "suitability": "Why it's good for this activity (1 sentence)"
    }
  ],
  "localTips": ["Brief local tip 1", "Brief local tip 2"],
  "bestTime": "Best time to visit",
  "transportTip": "How to get there"
}

CRITICAL: Return raw JSON starting with { and ending with }. NO \`\`\`json wrappers. Suggest REAL places that exist in ${data.location}. Be specific with actual names. All strings single-line.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    try {
      const parsed = parseJSONWithFallback(text);
      return {
        places: Array.isArray(parsed.places) ? parsed.places : [],
        localTips: Array.isArray(parsed.localTips) ? parsed.localTips : [],
        bestTime: parsed.bestTime || 'Anytime',
        transportTip: parsed.transportTip || ''
      };
    } catch (parseError) {
      console.error('JSON parse error in place suggestions:', parseError);
      return {
        places: [],
        localTips: [],
        bestTime: 'Anytime',
        transportTip: ''
      };
    }
  } catch (error: any) {
    console.error('Real place suggestions error:', error);
    throw new Error(`Real place suggestions failed: ${error.message}`);
  }
}
