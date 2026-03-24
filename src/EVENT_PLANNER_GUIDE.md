# 🗓️ Weather Event Planner - User Guide

## Quick Start

The Weather Event Planner helps you plan outdoor activities by showing you the **probability** of encountering adverse weather conditions based on **NASA historical data**.

---

## 🎯 What It Does

Answers the question: *"What are the chances of very hot, very cold, very windy, very wet, or very uncomfortable conditions on my planned date?"*

### Example Output
> **Planning a hike on July 15, 2025 in Yosemite?**
> - ☀️ **Very Hot**: 65% chance (temperatures ≥ 35°C)
> - ❄️ **Very Cold**: 2% chance (temperatures ≤ 5°C)
> - 💨 **Very Windy**: 15% chance (wind ≥ 10 m/s)
> - 🌧️ **Very Wet**: 30% chance (precipitation ≥ 10mm)
> - 💧 **Very Humid**: 45% chance (humidity ≥ 85%)
>
> **Recommendation**: ⚡ Proceed with Caution - Bring sun protection and plenty of water!

---

## 📋 Step-by-Step Instructions

### 1. **Access the Event Planner**

From the welcome page, click the purple **"Plan Your Event"** button at the top.

### 2. **Fill Out Event Details**

#### Event Name (Optional)
- Example: "Summer Beach Trip", "Mountain Hike", "Fishing Weekend"
- Helps you identify the event when downloading data

#### Event Type (Required)
Choose from:
- 🥾 Hiking
- 🎣 Fishing
- ⛺ Camping
- 🏖️ Beach Visit
- 🧺 Picnic
- ⚽ Outdoor Sports
- 🚴 Cycling
- 📷 Photography

#### Planned Date (Required)
- Click the date field
- Select any future date from the calendar
- Default: 7 days from today

#### Location (Required)
- Click "Select location" button
- **Option 1**: Use the map to drop a pin
- **Option 2**: Search for a place name
- **Option 3**: Use "Current Location" button
- Confirm your selection

### 3. **Analyze**

Click the big **"Analyze Weather Probability"** button.

⏱️ *Takes 2-3 seconds to fetch and analyze 10 years of NASA data*

### 4. **Review Results**

The results appear in **3 tabs**:

#### 📊 **Probabilities Tab** (Default)
Shows 5 probability cards:

**Very Hot Conditions**
- Probability percentage (e.g., 65%)
- Severity badge (Low/Moderate/High/Extreme)
- Description explaining the likelihood
- Progress bar visualization
- Historical average vs. threshold

**Very Cold Conditions**
- Same format as above

**Very Windy Conditions**
- Same format as above

**Very Wet Conditions**
- Same format as above

**Very Humid/Uncomfortable**
- Same format as above

**Expected Conditions Summary**
- Temperature (°C)
- Wind Speed (m/s)
- Precipitation (mm)
- Humidity (%)

#### 📈 **Historical Trends Tab**
Interactive charts showing:
- **Temperature Trends**: Area chart of historical temperatures for your date
- **Precipitation & Wind Patterns**: Bar charts comparing rain and wind over years

#### 📄 **Detailed Data Tab**
Complete information:
- Location coordinates
- Event date details
- Data source (NASA POWER API)
- Years of data analyzed
- Risk thresholds used
- Educational notes

### 5. **Download Data** (Optional)

Two download options at the top:

**Download JSON**
- Complete dataset
- All probabilities and metadata
- Machine-readable format
- Filename: `weather-analysis-YYYY-MM-DD-eventname.json`

**Download CSV**
- Historical data only
- Spreadsheet-compatible
- Perfect for Excel/Google Sheets
- Filename: `weather-data-YYYY-MM-DD.csv`

---

## 🎨 Understanding the Results

### Severity Levels

| Level | Color | Meaning | Action |
|-------|-------|---------|--------|
| **Low** | 🟢 Green | 0-20% probability | Safe to proceed |
| **Moderate** | 🟡 Yellow | 21-40% probability | Be prepared |
| **High** | 🟠 Orange | 41-60% probability | Take precautions |
| **Extreme** | 🔴 Red | 61-100% probability | Consider rescheduling |

### Overall Safety Recommendations

**✅ Good Conditions Expected**
- 0-1 high-risk conditions
- Low probability of adverse weather
- Safe to proceed with normal planning

**⚡ Proceed with Caution**
- 1 high-risk condition
- Some preparation needed
- Bring appropriate gear

**⚠️ High Risk**
- 2+ high-risk conditions
- Significant adverse weather likely
- Consider alternative dates

---

## 🌡️ Weather Thresholds Explained

### Very Hot
- **Threshold**: ≥ 35°C (95°F)
- **Impact**: Heat exhaustion risk, dehydration
- **Recommendation**: Bring extra water, sun protection, avoid midday hours

### Very Cold
- **Threshold**: ≤ 5°C (41°F)
- **Impact**: Hypothermia risk, frostbite
- **Recommendation**: Warm clothing, hot beverages, shorter exposure

### Very Windy
- **Threshold**: ≥ 10 m/s (~22 mph)
- **Impact**: Difficult hiking, water sports unsafe
- **Recommendation**: Secure loose items, avoid exposed areas

### Very Wet
- **Threshold**: ≥ 10mm precipitation
- **Impact**: Trail flooding, slippery conditions
- **Recommendation**: Waterproof gear, check trail closures

### Very Humid/Uncomfortable
- **Threshold**: ≥ 85% humidity
- **Impact**: Heat stress, discomfort, slow drying
- **Recommendation**: Light clothing, frequent breaks, hydration

---

## 📊 How Probabilities Are Calculated

### Data Source
- **NASA POWER API**: Global weather and climate data
- **Coverage**: 40+ years of historical observations
- **Resolution**: Daily data for any location on Earth
- **Parameters**: Temperature, precipitation, wind, humidity

### Calculation Method
1. **Historical Sample Collection**
   - Gets data for the same date (±3 days) across 10 years
   - Example: Planning July 15? Gets data for July 12-18 from 2015-2024
   - Typical sample size: 70-140 days

2. **Threshold Analysis**
   - Counts how many historical days exceeded each threshold
   - Example: 47 out of 73 days exceeded 35°C = 64% probability

3. **Statistical Validity**
   - More samples = higher confidence
   - ±3 day window ensures adequate sample size
   - Multi-year analysis captures climate variability

### Example Calculation
```
Location: Yosemite Valley
Date: July 15, 2025
Historical Period: July 12-18, 2015-2024

Sample Data (73 days):
- Days ≥ 35°C: 47 days
- Probability = 47/73 = 64%
- Result: "64% chance of very hot conditions"
```

---

## 💡 Pro Tips

### Planning Tips
1. **Check Multiple Dates**: If one date shows high risk, try nearby dates
2. **Compare Locations**: Different locations may have better conditions
3. **Plan B**: Always have indoor alternatives for high-risk events
4. **Download Data**: Keep records for future planning

### Best Practices
- **Plan 1-2 weeks ahead**: Allows time to adjust plans
- **Check closer to date**: Use short-term forecasts for final confirmation
- **Consider event type**: Some activities are more weather-sensitive
- **Review trends**: Look at historical patterns, not just probabilities

### Understanding Limitations
- **Historical vs. Current**: Based on past patterns, not real-time forecasts
- **Climate Change**: Recent years may differ from historical averages
- **Local Variations**: Microclimates may vary from regional averages
- **Extreme Events**: Rare events may not appear in 10-year history

---

## 🗺️ Location Selection

### Method 1: Map Pin
1. Click "Select location"
2. Pan and zoom the map
3. Click to drop a pin
4. Confirm location

### Method 2: Search
1. Click "Select location"
2. Type place name in search box
3. Select from results
4. Location appears on map

### Method 3: Current Location
1. Click "Select location"
2. Click "Use Current Location"
3. Allow browser location access
4. Your GPS location is used

### Method 4: Recent Locations
- Previously used locations appear as shortcuts
- Click to quickly reuse a location

---

## 📱 Mobile vs. Desktop

### Mobile Experience
- Optimized touch interface
- GPS location works best
- Swipe through charts
- Portrait-friendly layout

### Desktop Experience
- Larger charts and graphs
- More detailed tooltips
- Faster typing for locations
- Side-by-side comparisons

---

## 🔄 Common Workflows

### Vacation Planning
1. Select vacation destination
2. Choose mid-point of trip dates
3. Review all 5 probability types
4. Download data for reference
5. Share with travel companions

### Event Organization
1. Pick event location and date
2. Check probabilities
3. If high risk, try alternative dates
4. Once confirmed, download for records
5. Check again 1 week before event

### Regular Activity
1. Save favorite locations
2. Check probabilities weekly
3. Build understanding of seasonal patterns
4. Use historical trends for long-term planning

---

## ❓ Troubleshooting

### "No data available"
- **Cause**: Location too remote or date too far in future
- **Solution**: Try nearby location or closer date

### "Insufficient historical data"
- **Cause**: Recent location with limited NASA coverage
- **Solution**: Use broader region or check data availability

### Loading takes too long
- **Cause**: Large historical dataset or slow connection
- **Solution**: Wait up to 10 seconds, refresh if needed

### Unexpected probabilities
- **Cause**: Local climate patterns or seasonal variations
- **Solution**: Review historical trends chart for context

---

## 📞 Support

### Data Questions
- NASA POWER API: https://power.larc.nasa.gov/
- Data documentation: See API docs

### App Issues
- Check internet connection
- Verify location is selected
- Ensure date is in the future
- Try refreshing the page

### Feedback
- Report issues through app feedback system
- Suggest improvements
- Share success stories

---

## 🎓 Educational Notes

### About NASA POWER
- **POWER**: Prediction Of Worldwide Energy Resources
- **Purpose**: Originally for solar energy applications
- **Scope**: Now includes comprehensive climate data
- **Access**: Free and open to public
- **Quality**: Research-grade satellite and model data

### Data Parameters
- **T2M**: Temperature at 2 meters above ground
- **RH2M**: Relative humidity at 2 meters
- **PRECTOTCORR**: Precipitation (bias-corrected)
- **WS2M**: Wind speed at 2 meters
- **Coverage**: Global, land and ocean

### Accuracy
- **Temperature**: ±2°C typical accuracy
- **Precipitation**: Varies by location, ±20-30%
- **Wind**: ±1-2 m/s typical accuracy
- **Humidity**: ±5-10% typical accuracy

---

## 🌟 Example Use Cases

### ✅ Good Use Cases
- Planning summer vacation 2-6 months ahead
- Scheduling outdoor wedding
- Choosing dates for hiking trips
- Fishing trip planning
- Photography session timing
- Sports event scheduling
- Festival planning

### ⚠️ Limited Use Cases
- Tomorrow's weather (use short-term forecasts)
- Hourly conditions (daily averages only)
- Extreme event prediction (rare events)
- Indoor event planning (not applicable)

---

**Last Updated**: 2025-10-04  
**Version**: 1.0.0  
**Related**: See `/CHALLENGE_ALIGNMENT.md` for technical details
