const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchLocations(name) {
  const url =
    `${GEO_URL}?name=${encodeURIComponent(name)}` +
    `&count=6&language=en&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding failed");

  const data = await res.json();
  const results = data.results || [];

  return results.map((r) => ({
    id: `${r.latitude},${r.longitude},${r.name},${r.country}`,
    name: r.name,
    country: r.country,
    admin1: r.admin1 || "",
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone || "",
  }));
}

export async function getCurrentWeather(lat, lon) {
  const currentVars = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "weather_code",
    "wind_speed_10m",
    "is_day",
  ].join(",");

  const url =
    `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
    `&current=${currentVars}` +
    `&temperature_unit=celsius&wind_speed_unit=kmh` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");

  return await res.json();
}

export function weatherCodeToText(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    80: "Rain showers (slight)",
    81: "Rain showers (moderate)",
    82: "Rain showers (violent)",
    95: "Thunderstorm",
  };

  return map[code] ?? `Weather code: ${code}`;
}
