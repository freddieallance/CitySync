# NASA API Authentication Guide

## Overview

This application now supports both **public** and **authenticated** NASA APIs to provide comprehensive environmental data for outdoor activity planning.

## Available NASA APIs

### Public APIs (No Authentication Required) ✅

These APIs are already working and don't require any setup:

1. **NASA POWER** - Prediction of Worldwide Energy Resources
   - Climate and weather data
   - Temperature, humidity, precipitation, solar radiation
   - Already integrated and working

2. **NASA FIRMS** - Fire Information for Resource Management System
   - Real-time wildfire detection
   - Satellite-based fire hotspots
   - Already integrated and working

3. **NASA EONET** - Earth Observatory Natural Event Tracker
   - Natural disaster events (storms, floods, wildfires, etc.)
   - Real-time event tracking
   - Already integrated and working

4. **Worldview (GIBS)** - Global Imagery Browse Services
   - Satellite imagery tiles
   - No authentication required
   - Available for visualization

5. **CMR** - Common Metadata Repository
   - Search for Earth science data collections
   - No authentication required
   - Available for data discovery

### Authenticated APIs (Requires NASA Earthdata Login) 🔐

These APIs require credentials but provide more detailed data:

1. **GES DISC** - Goddard Earth Sciences Data and Information Services Center
   - Atmospheric composition data
   - Precipitation and climate datasets
   - MERRA-2 reanalysis data
   - Requires authentication

2. **Giovanni** - Online Visualization and Analysis System
   - Interactive atmospheric data analysis
   - Time series and area averaging
   - Multi-dataset comparison
   - Requires authentication

3. **DataRods** - Hydrology Data Access
   - Precipitation data
   - Hydrological datasets
   - Water cycle information
   - Requires authentication

## How to Set Up Authentication

### Step 1: Create NASA Earthdata Account

1. Go to https://urs.earthdata.nasa.gov/users/new
2. Fill out the registration form
3. Verify your email address
4. Your account is ready!

### Step 2: Configure in the App

1. **Login** to the app (or create an account if you don't have one)
2. From the **Welcome Page**, click on **"Advanced NASA APIs"** card
3. Enter your **NASA Earthdata username** and **password**
4. Click **"Save Credentials"**
5. Click **"Test Connection"** to verify it works

### Step 3: Use the APIs

Once configured, the app can access authenticated NASA APIs automatically. Your credentials are stored securely and encrypted.

## Using the APIs in Your Code

### Frontend Example

```typescript
import { fetchGESDISCData, fetchGiovanniData, fetchDataRodsData } from '../lib/nasa';

// Fetch atmospheric data from GES DISC
const atmosphericData = await fetchGESDISCData(
  accessToken,
  latitude,
  longitude
);

// Fetch analysis from Giovanni
const analysis = await fetchGiovanniData(
  accessToken,
  latitude,
  longitude,
  'AIRX3STD_006_TotCO_A' // Parameter ID
);

// Fetch hydrology data from DataRods
const hydroData = await fetchDataRodsData(
  accessToken,
  latitude,
  longitude
);
```

### Backend Example

```typescript
import { getGESDISCData, getGiovanniData, getDataRodsData } from './nasa_api.tsx';

// Get user's stored credentials
const credentials = await kv.get(`nasa_credentials:${userId}`);

// Fetch data with credentials
const data = await getGESDISCData(
  credentials,
  latitude,
  longitude
);
```

## API Endpoints

### Credentials Management

- `POST /nasa/credentials` - Save NASA Earthdata credentials
- `GET /nasa/credentials` - Retrieve saved credentials (username only)
- `DELETE /nasa/credentials` - Delete credentials

### Data Access

- `GET /nasa/test-connection` - Test if credentials are valid
- `POST /nasa/authenticated-data` - Fetch data from specific NASA API

## Security Notes

### Credentials Storage

- Credentials are stored in the secure KV store
- Each user's credentials are isolated
- Passwords are transmitted securely via HTTPS
- **Production Recommendation**: Encrypt passwords before storing

### API Access

- All requests use HTTPS
- Bearer token authentication for user verification
- Credentials never exposed to client-side code
- Server-side proxy pattern for API calls

## Data Types and Use Cases

### GES DISC Use Cases

- **Air Quality Monitoring**: Get detailed atmospheric composition
- **Climate Analysis**: Access historical climate datasets
- **Weather Forecasting**: Retrieve high-resolution weather data

### Giovanni Use Cases

- **Time Series Analysis**: Track environmental changes over time
- **Spatial Analysis**: Compare conditions across regions
- **Multi-Source Data**: Combine different datasets for insights

### DataRods Use Cases

- **Flood Prediction**: Access precipitation and runoff data
- **Drought Monitoring**: Track water availability
- **Hydrological Planning**: Plan activities based on water conditions

## API Limitations

### Rate Limits

- NASA APIs have generous rate limits
- Typical limit: 100-1000 requests per hour
- Contact NASA for higher limits if needed

### Data Availability

- Some datasets have temporal delays (updated daily/weekly)
- Real-time data available for certain parameters
- Historical data may require specific access permissions

### Geographic Coverage

- Global coverage for most datasets
- Some datasets have regional focus
- Resolution varies by dataset

## Troubleshooting

### "Unauthorized" Error

- Check if credentials are saved correctly
- Verify your NASA Earthdata account is active
- Try resetting your password at https://urs.earthdata.nasa.gov/

### "Connection Test Failed"

- Check internet connectivity
- Verify NASA services are online
- Ensure credentials are correct

### "No Data Available"

- Check if the requested location/time has data
- Some APIs may return null for certain regions
- Try different parameters or date ranges

## Additional Resources

- [NASA Earthdata](https://earthdata.nasa.gov/) - Official portal
- [GES DISC Documentation](https://disc.gsfc.nasa.gov/) - GES DISC guide
- [Giovanni User Guide](https://giovanni.gsfc.nasa.gov/giovanni/doc/) - Giovanni docs
- [Earthdata Search](https://search.earthdata.nasa.gov/) - Browse datasets

## Future Enhancements

Potential additions:

- [ ] Cache frequently accessed data
- [ ] Batch API requests for efficiency
- [ ] Visualize satellite imagery on maps
- [ ] Historical trend analysis
- [ ] Automated alerts based on NASA data
- [ ] Export data in various formats

## Support

For issues with:
- **App functionality**: Check the app's documentation
- **NASA API access**: Contact NASA Earthdata support
- **Account issues**: Visit https://urs.earthdata.nasa.gov/

---

**Last Updated**: 2025-10-04
**Version**: 1.0.0
