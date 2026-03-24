import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0`;

/**
 * Save NASA Earthdata credentials
 */
export async function saveNASACredentials(
  accessToken: string,
  username: string,
  password: string
) {
  const response = await fetch(`${API_BASE}/nasa/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save credentials');
  }
  return data;
}

/**
 * Get saved NASA credentials (username only, password is never returned)
 */
export async function getNASACredentials(accessToken: string) {
  const response = await fetch(`${API_BASE}/nasa/credentials`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get credentials');
  }
  return data.credentials;
}

/**
 * Delete NASA credentials
 */
export async function deleteNASACredentials(accessToken: string) {
  const response = await fetch(`${API_BASE}/nasa/credentials`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete credentials');
  }
  return data;
}

/**
 * Test NASA API connection
 */
export async function testNASAConnection(accessToken: string) {
  const response = await fetch(`${API_BASE}/nasa/test-connection`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Connection test failed');
  }
  return data;
}

/**
 * Fetch data from authenticated NASA APIs
 */
export async function fetchNASAData(
  accessToken: string,
  api: 'gesdisc' | 'giovanni' | 'datarods' | 'worldview' | 'cmr',
  latitude: number,
  longitude: number,
  params?: any
) {
  const response = await fetch(`${API_BASE}/nasa/authenticated-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      api,
      latitude,
      longitude,
      params
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch NASA data');
  }
  return data;
}

/**
 * Fetch GES DISC atmospheric data
 */
export async function fetchGESDISCData(
  accessToken: string,
  latitude: number,
  longitude: number
) {
  return fetchNASAData(accessToken, 'gesdisc', latitude, longitude);
}

/**
 * Fetch Giovanni atmospheric analysis
 */
export async function fetchGiovanniData(
  accessToken: string,
  latitude: number,
  longitude: number,
  parameter?: string
) {
  return fetchNASAData(accessToken, 'giovanni', latitude, longitude, { parameter });
}

/**
 * Fetch DataRods hydrology data
 */
export async function fetchDataRodsData(
  accessToken: string,
  latitude: number,
  longitude: number
) {
  return fetchNASAData(accessToken, 'datarods', latitude, longitude);
}

/**
 * Fetch Worldview satellite imagery
 */
export async function fetchWorldviewImagery(
  latitude: number,
  longitude: number,
  date?: string
) {
  return fetchNASAData('', 'worldview', latitude, longitude, { date });
}

/**
 * Search NASA Common Metadata Repository
 */
export async function searchNASACMR(
  keywords: string,
  boundingBox?: { north: number; south: number; east: number; west: number }
) {
  return fetchNASAData('', 'cmr', 0, 0, { keywords, boundingBox });
}
