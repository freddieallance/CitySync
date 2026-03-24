import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0765a8f0`;

export async function signup(email: string, password: string, name: string) {
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({ email, password, name })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to sign up');
  }
  return data;
}

export async function signin(email: string, password: string) {
  const response = await fetch(`${API_BASE}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to sign in');
  }
  return data;
}

export async function getHistory(accessToken: string) {
  const response = await fetch(`${API_BASE}/history`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get history');
  }
  return data.history;
}

export async function saveActivity(
  accessToken: string,
  activityType: string,
  activity: string,
  conditions: any
) {
  const response = await fetch(`${API_BASE}/save-activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      activityType,
      activity,
      conditions,
      timestamp: new Date().toISOString()
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save activity');
  }
  return data;
}

export async function getConditions(latitude?: number, longitude?: number) {
  const params = new URLSearchParams();
  if (latitude !== undefined) params.append('lat', latitude.toString());
  if (longitude !== undefined) params.append('lon', longitude.toString());
  
  const url = `${API_BASE}/conditions${params.toString() ? `?${params.toString()}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get conditions');
  }
  return data;
}

export async function getActivitySafety(
  activityType: 'outdoor' | 'indoor',
  latitude?: number,
  longitude?: number
) {
  const params = new URLSearchParams();
  params.append('type', activityType);
  if (latitude !== undefined) params.append('lat', latitude.toString());
  if (longitude !== undefined) params.append('lon', longitude.toString());
  
  const url = `${API_BASE}/activity-safety?${params.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get activity safety assessment');
  }
  return data;
}

export async function getClimateTrends(
  days: number = 30,
  latitude?: number,
  longitude?: number
) {
  const params = new URLSearchParams();
  params.append('days', days.toString());
  if (latitude !== undefined) params.append('lat', latitude.toString());
  if (longitude !== undefined) params.append('lon', longitude.toString());
  
  const url = `${API_BASE}/climate-trends?${params.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get climate trends');
  }
  return data;
}

export async function uploadFeedbackPhoto(accessToken: string, photo: File) {
  const formData = new FormData();
  formData.append('photo', photo);

  const response = await fetch(`${API_BASE}/upload-feedback-photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload photo');
  }
  return data;
}

export async function submitFeedback(
  accessToken: string,
  feedback: {
    placeName: string;
    placeLocation: string;
    rating: number;
    conditionsAccurate: boolean;
    actualSafety: 'safe' | 'caution' | 'unsafe';
    comments: string;
    timestamp: string;
    photoUrl?: string | null;
    photoPath?: string | null;
  }
) {
  const response = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(feedback)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit feedback');
  }
  return data;
}

export async function rateFeedback(
  accessToken: string,
  feedbackId: string,
  placeName: string,
  isHelpful: boolean
) {
  const response = await fetch(`${API_BASE}/rate-feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ feedbackId, placeName, isHelpful })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to rate feedback');
  }
  return data;
}

export async function getUserReputation(userId: string) {
  const response = await fetch(`${API_BASE}/user-reputation/${userId}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get user reputation');
  }
  return data;
}

export async function uploadProfilePicture(accessToken: string, photo: File) {
  const formData = new FormData();
  formData.append('photo', photo);

  const response = await fetch(`${API_BASE}/upload-profile-picture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload profile picture');
  }
  return data;
}

export async function updateAvatar(accessToken: string, avatarUrl: string, avatarType: 'preset' | 'custom' = 'preset') {
  const response = await fetch(`${API_BASE}/update-avatar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ avatarUrl, avatarType })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update avatar');
  }
  return data;
}

export async function getPlaceFeedback(placeName: string) {
  const response = await fetch(`${API_BASE}/feedback/${encodeURIComponent(placeName)}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get feedback');
  }
  return data;
}
