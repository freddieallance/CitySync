// Traffic Data
export const trafficData = [
  { time: "00:00", congestion: 15, speed: 65 },
  { time: "04:00", congestion: 10, speed: 70 },
  { time: "08:00", congestion: 75, speed: 25 },
  { time: "12:00", congestion: 55, speed: 40 },
  { time: "16:00", congestion: 85, speed: 20 },
  { time: "20:00", congestion: 45, speed: 50 },
  { time: "23:59", congestion: 20, speed: 60 },
];

export const trafficHotspots = [
  { location: "Jalan Tun Jugah", level: "High", incidents: 12, avgSpeed: 18 },
  { location: "Jalan Tunku Abdul Rahman", level: "Medium", incidents: 7, avgSpeed: 28 },
  { location: "Jalan Pending", level: "High", incidents: 15, avgSpeed: 15 },
  { location: "Jalan Bako", level: "Low", incidents: 3, avgSpeed: 45 },
  { location: "Jalan Stampin", level: "Medium", incidents: 8, avgSpeed: 32 },
];

// Flooding Data
export const floodRiskData = [
  { area: "Kuching Central", risk: "High", elevation: 2.5, rainfall: 245 },
  { area: "Miri", risk: "Medium", elevation: 5.8, rainfall: 180 },
  { area: "Sibu", risk: "High", elevation: 3.2, rainfall: 290 },
  { area: "Bintulu", risk: "Low", elevation: 12.5, rainfall: 145 },
  { area: "Sarikei", risk: "Medium", elevation: 4.1, rainfall: 210 },
];

export const monthlyRainfall = [
  { month: "Jan", rainfall: 280, threshold: 250 },
  { month: "Feb", rainfall: 240, threshold: 250 },
  { month: "Mar", rainfall: 310, threshold: 250 },
  { month: "Apr", rainfall: 290, threshold: 250 },
  { month: "May", rainfall: 265, threshold: 250 },
  { month: "Jun", rainfall: 220, threshold: 250 },
  { month: "Jul", rainfall: 200, threshold: 250 },
  { month: "Aug", rainfall: 215, threshold: 250 },
  { month: "Sep", rainfall: 270, threshold: 250 },
];

// Air Quality Data
export const airQualityData = [
  { date: "Mon", aqi: 65, pm25: 28, pm10: 45 },
  { date: "Tue", aqi: 72, pm25: 32, pm10: 52 },
  { date: "Wed", aqi: 58, pm25: 25, pm10: 38 },
  { date: "Thu", aqi: 85, pm25: 38, pm10: 65 },
  { date: "Fri", aqi: 92, pm25: 42, pm10: 72 },
  { date: "Sat", aqi: 68, pm25: 30, pm10: 48 },
  { date: "Sun", aqi: 55, pm25: 22, pm10: 35 },
];

export const airQualityByArea = [
  { area: "Kuching", aqi: 68, status: "Moderate", pm25: 30 },
  { area: "Miri", aqi: 45, status: "Good", pm25: 18 },
  { area: "Sibu", aqi: 82, status: "Moderate", pm25: 36 },
  { area: "Bintulu", aqi: 52, status: "Good", pm25: 22 },
  { area: "Sarikei", aqi: 75, status: "Moderate", pm25: 33 },
];

// Healthcare Data
export const healthcareAccess = [
  { area: "Kuching", hospitals: 8, clinics: 45, doctors: 320, population: 165642 },
  { area: "Miri", hospitals: 4, clinics: 28, doctors: 180, population: 300543 },
  { area: "Sibu", hospitals: 3, clinics: 22, doctors: 145, population: 162676 },
  { area: "Bintulu", hospitals: 2, clinics: 18, doctors: 95, population: 114058 },
  { area: "Sarikei", hospitals: 2, clinics: 15, doctors: 75, population: 56798 },
];

export const healthcareUtilization = [
  { month: "Jan", visits: 12500, capacity: 15000 },
  { month: "Feb", visits: 11800, capacity: 15000 },
  { month: "Mar", visits: 13200, capacity: 15000 },
  { month: "Apr", visits: 14100, capacity: 15000 },
  { month: "May", visits: 13800, capacity: 15000 },
  { month: "Jun", visits: 12900, capacity: 15000 },
];

export const diseaseDistribution = [
  { name: "Respiratory", value: 28, color: "#8b5cf6" },
  { name: "Cardiovascular", value: 22, color: "#3b82f6" },
  { name: "Infectious", value: 18, color: "#10b981" },
  { name: "Digestive", value: 15, color: "#f59e0b" },
  { name: "Others", value: 17, color: "#6b7280" },
];
