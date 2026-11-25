
import { useEffect, useState } from "react";
import "./CitizenWeather.css";

const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

function getWeatherDescription(code) {
  const conditions = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",
    61: "Light Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Light Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Rain Showers",
    81: "Moderate Showers",
    82: "Heavy Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Hail",
    99: "Severe Thunderstorm"
  };

  return conditions[code] || "Unknown Conditions";
}

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌡️";
}

function CitizenWeather() {
  const [city, setCity] = useState("Vijayawada");
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  async function loadWeather(latitude, longitude, locationName) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch weather data.");
      }

      const data = await response.json();

      setWeather({
        city: locationName,
        temperature: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        wind: data.current.wind_speed_10m,
        rainfall: data.current.precipitation,
        code: data.current.weather_code,
        isDay: data.current.is_day
      });

      const days = data.daily.time.map((date, index) => ({
        date,
        code: data.daily.weather_code[index],
        max: data.daily.temperature_2m_max[index],
        min: data.daily.temperature_2m_min[index],
        rain: data.daily.precipitation_probability_max[index]
      }));

      setForecast(days);
    } catch (err) {
      setError(err.message || "Weather service is unavailable.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  async function searchCity(cityName) {
    if (!cityName.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error("City search failed.");
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Try another city.");
      }

      const result = data.results[0];
      const locationName = `${result.name}, ${result.admin1 || result.country || ""}`;

      setCity(result.name);
      await loadWeather(result.latitude, result.longitude, locationName);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Your browser does not support location services.");
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await loadWeather(latitude, longitude, "Your Current Location");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setError("Location permission denied. Please search for your city.");
        setLocationLoading(false);
      }
    );
  }

  useEffect(() => {
    searchCity("Vijayawada");
  }, []);

  const warning =
    weather && [65, 82, 95, 96, 99].includes(weather.code);

  return (
    <div className="citizen-weather">
      <div className="weather-heading">
        <div>
          <h1>Weather Updates</h1>
          <p>Live weather conditions and forecasts to help you stay safe.</p>
        </div>

        <span className="weather-live">● Live Weather</span>
      </div>

      <div className="weather-search">
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchCity(search);
          }}
        />

        <button onClick={() => searchCity(search)}>
          Search
        </button>

        <button
          className="location-weather-btn"
          onClick={getCurrentLocation}
          disabled={locationLoading}
        >
          {locationLoading ? "Getting Location..." : "📍 My Location"}
        </button>
      </div>

      {error && <div className="weather-error">{error}</div>}

      {loading && <p className="weather-loading">Loading live weather...</p>}

      {!loading && weather && (
        <>
          <div className="weather-main-card">
            <div>
              <p className="weather-location">📍 {weather.city}</p>
              <h2>{weather.temperature}°C</h2>
              <h3>{getWeatherDescription(weather.code)}</h3>
              <p>Feels like {weather.feelsLike}°C</p>
            </div>

            <div className="weather-big-icon">
              {getWeatherIcon(weather.code)}
            </div>
          </div>

          {warning && (
            <div className="weather-warning">
              <h3>⚠️ Weather Caution</h3>
              <p>
                The current weather condition may require extra caution.
                Follow official local authority alerts and safety instructions.
              </p>
            </div>
          )}

          <h2 className="weather-section-title">Current Weather Details</h2>

          <div className="weather-details-grid">
            <div className="weather-detail-card">
              <span>💧</span>
              <p>Humidity</p>
              <h3>{weather.humidity}%</h3>
            </div>

            <div className="weather-detail-card">
              <span>💨</span>
              <p>Wind Speed</p>
              <h3>{weather.wind} km/h</h3>
            </div>

            <div className="weather-detail-card">
              <span>🌧️</span>
              <p>Rainfall</p>
              <h3>{weather.rainfall} mm</h3>
            </div>

            <div className="weather-detail-card">
              <span>🌡️</span>
              <p>Feels Like</p>
              <h3>{weather.feelsLike}°C</h3>
            </div>
          </div>

          <h2 className="weather-section-title">7-Day Forecast</h2>

          <div className="weather-forecast">
            {forecast.map((day) => (
              <div className="forecast-card" key={day.date}>
                <p>
                  {new Date(day.date + "T00:00:00").toLocaleDateString(
                    "en-IN",
                    { weekday: "short", day: "numeric" }
                  )}
                </p>

                <span>{getWeatherIcon(day.code)}</span>

                <h3>{day.max}°</h3>
                <p>{day.min}°</p>
                <small>🌧️ {day.rain ?? "—"}% rain</small>
              </div>
            ))}
          </div>

          <div className="weather-safety">
            <h2>Weather Safety Tips</h2>
            <ul>
              <li>Follow official weather warnings issued by authorities.</li>
              <li>Stay indoors during thunderstorms and lightning.</li>
              <li>Avoid flooded roads and overflowing water bodies.</li>
              <li>Keep drinking water and emergency supplies ready.</li>
              <li>Call 112 in India for immediate emergencies.</li>
            </ul>
          </div>

          <p className="weather-source">
            Weather data: Open-Meteo. Forecast information is not a substitute
            for official IMD warnings.
          </p>
        </>
      )}
    </div>
  );
}

export default CitizenWeather;
