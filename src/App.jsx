import { useEffect, useMemo, useRef, useState } from "react";
import { getCurrentWeather, searchLocations } from "./api/openMeteo";
import WeatherCard from "./components/WeatherCard";
import Skeleton from "./components/Skeleton";

/**
 * Closure: tracks how many API actions happened.
 * This satisfies the "closure as memory" requirement.
 */
function createApiTracker() {
  let attempts = 0;
  let lastTime = null;

  return {
    nextAttempt() {
      attempts++;
      lastTime = new Date().toLocaleTimeString();
      return { attempts, lastTime };
    },
    get() {
      return { attempts, lastTime };
    },
  };
}

const apiTracker = createApiTracker();

export default function App() {
  const [query, setQuery] = useState("Chennai");

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  // Uncontrolled input (bonus, still fine)
  const inputRef = useRef(null);

  // Derived state
  const canSearch = useMemo(() => query.trim().length >= 2 && !loading, [query, loading]);

  const placeLabel = selected
    ? `${selected.name}${selected.admin1 ? ", " + selected.admin1 : ""}, ${selected.country}`
    : "";

  // Auto-search once on load (shows useEffect)
  useEffect(() => {
    onSearch("auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSearch(mode = "manual") {
    setError("");
    setStatus("");
    setWeather(null);
    setSelected(null);

    const q = query.trim();

    if (!q) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setLoading(true);

      const t = apiTracker.nextAttempt();
      setStatus(
        `Searching locations... (Attempt ${t.attempts}${t.lastTime ? ` • ${t.lastTime}` : ""})`
      );

      const results = await searchLocations(q);

      setLocations(results);

      if (results.length === 0) {
        setStatus("");
        setError("No matching locations found.");
      } else {
        setStatus("Select a location below.");
      }

      // keep cursor inside input
      if (mode === "manual") inputRef.current?.focus();
    } catch {
      setError("Failed to search locations. Check internet and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onPickLocation(loc) {
    setError("");
    setStatus("");
    setSelected(loc);
    setWeather(null);

    try {
      setLoading(true);

      const t = apiTracker.nextAttempt();
      setStatus(
        `Fetching current weather... (Attempt ${t.attempts}${t.lastTime ? ` • ${t.lastTime}` : ""})`
      );

      // clean UI: hide list after selection
      setLocations([]);

      const data = await getCurrentWeather(loc.latitude, loc.longitude);
      setWeather(data);

      setStatus("Done ✅");
    } catch {
      setError("Failed to fetch weather for this location.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060606]">
      {/* Bugatti background */}
      <div className="min-h-screen px-6 py-10 bg-[radial-gradient(circle_at_20%_15%,rgba(255,120,0,0.25),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_45%),linear-gradient(135deg,#050505,#0b0b0b,#111111)]">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                Weather Console
                </h1>

                <p className="mt-2 text-white/65">
                  Search a city → pick the correct location → get live weather
                  (Open-Meteo).
                </p>
              </div>

              <div className="hidden sm:block text-right">
                <p className="text-xs text-white/45 font-semibold">API Tracker</p>
                <p className="mt-1 text-sm font-bold text-white">
                  Attempts: {apiTracker.get().attempts}
                </p>
              </div>
            </div>

            {/* Input row */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                ref={inputRef}
                className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-orange-500/40"
                placeholder="Example: Vijayawada"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />

              <button
                onClick={onSearch}
                disabled={!canSearch}
                className="rounded-2xl px-6 py-3 font-extrabold tracking-wide text-black bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.99]"
              >
                {loading ? "LOADING..." : "SEARCH"}
              </button>
            </div>

            {/* Status / error */}
            {(status || error) && (
              <div className="mt-4 text-sm">
                {status && <p className="text-white/65">{status}</p>}
                {error && <p className="text-red-400 font-bold">{error}</p>}
              </div>
            )}
          </div>

          {/* Locations */}
          {locations.length > 0 && (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <p className="font-extrabold text-white tracking-tight">
                Select a location
              </p>

              <div className="mt-4 grid gap-3">
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => onPickLocation(loc)}
                    disabled={loading}
                    className="text-left rounded-2xl border border-white/10 bg-black/25 p-4 hover:bg-black/35 transition"
                  >
                    <p className="font-bold text-white">
                      {loc.name}
                      {loc.admin1 ? `, ${loc.admin1}` : ""} — {loc.country}
                    </p>

                    <p className="mt-1 text-xs text-white/45">
                      Lat: {loc.latitude} • Lon: {loc.longitude}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skeleton while loading weather */}
          {loading && selected && !weather && <Skeleton />}

          {/* Weather */}
          {weather && <WeatherCard placeLabel={placeLabel} weather={weather} />}

          {/* Footer */}
          <footer className="mt-10 text-center text-xs text-white/35">
            Built with React + Vite + Tailwind v4 • Open-Meteo APIs
          </footer>
        </div>
      </div>
    </div>
  );
}
