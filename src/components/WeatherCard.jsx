import { weatherCodeToText } from "../api/openMeteo";

export default function WeatherCard({ placeLabel, weather }) {
  const cur = weather?.current;
  if (!cur) return null;

  const conditionText = weatherCodeToText(cur.weather_code);
  const isDay = cur.is_day === 1;

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-white">
            {placeLabel}
          </p>

          <p className="mt-1 text-sm text-white/70">
            {conditionText} • {isDay ? "Day" : "Night"}
          </p>

          <p className="mt-1 text-xs text-white/50">
            Timezone: {weather.timezone}
          </p>
        </div>

        <div className="text-right">
          <p className="text-5xl font-black text-white">
            {Math.round(cur.temperature_2m)}°C
          </p>

          <p className="mt-1 text-sm text-white/70">
            Feels like {Math.round(cur.apparent_temperature)}°C
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-white/55">Humidity</p>
          <p className="mt-1 font-bold text-white">
            {cur.relative_humidity_2m}%
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-white/55">Wind</p>
          <p className="mt-1 font-bold text-white">
            {cur.wind_speed_10m} km/h
          </p>
        </div>
      </div>
    </div>
  );
}
