
import { useState } from "react";

const weatherData = {
  Vijayawada: {
    temperature: 32,
    condition: "Partly Cloudy",
    humidity: 68,
    wind: 14,
    rainfall: 20
  },
  Hyderabad: {
    temperature: 29,
    condition: "Cloudy",
    humidity: 72,
    wind: 11,
    rainfall: 35
  },
  Visakhapatnam: {
    temperature: 30,
    condition: "Light Rain",
    humidity: 82,
    wind: 22,
    rainfall: 65
  },
  Delhi: {
    temperature: 26,
    condition: "Clear Sky",
    humidity: 45,
    wind: 9,
    rainfall: 5
  }
};

const forecast = [
  { day: "Monday", temp: 31, condition: "Sunny", icon: "☀️" },
  { day: "Tuesday", temp: 29, condition: "Cloudy", icon: "☁️" },
  { day: "Wednesday", temp: 28, condition: "Rainy", icon: "🌧️" },
  { day: "Thursday", temp: 30, condition: "Sunny", icon: "☀️" },
  { day: "Friday", temp: 27, condition: "Cloudy", icon: "⛅" }
];

function Weather() {
  const [city, setCity] = useState("Vijayawada");
  const [search, setSearch] = useState("");

  const weather = weatherData[city];

  function handleSearch(e) {
    e.preventDefault();

    const foundCity = Object.keys(weatherData).find(
      (item) => item.toLowerCase() === search.trim().toLowerCase()
    );

    if (foundCity) {
      setCity(foundCity);
      setSearch("");
    } else {
      alert("City not available in demo data. Try Vijayawada, Hyderabad, Visakhapatnam or Delhi.");
    }
  }

  return (
    <div className="weather-page">

      <div className="weather-heading">
        <div>
          <p className="dashboard-label">ENVIRONMENTAL MONITORING</p>
          <h1>Weather Monitoring</h1>
          <p>Monitor weather conditions and prepare for potential risks.</p>
        </div>

        <span className="weather-demo-label">DEMO DATA</span>
      </div>

      <form className="weather-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="current-weather-panel">

        <div>
          <p>Current Weather</p>
          <h2>{city}, India</h2>
          <h1>{weather.temperature}°C</h1>
          <h3>{weather.condition}</h3>
        </div>

        <div className="weather-icon">🌤️</div>

      </div>

      <div className="weather-stats">

        <div className="weather-stat-card">
          <span>💧</span>
          <p>Humidity</p>
          <h2>{weather.humidity}%</h2>
        </div>

        <div className="weather-stat-card">
          <span>🌬️</span>
          <p>Wind Speed</p>
          <h2>{weather.wind} km/h</h2>
        </div>

        <div className="weather-stat-card">
          <span>🌧️</span>
          <p>Rainfall Chance</p>
          <h2>{weather.rainfall}%</h2>
        </div>

      </div>

      <div className="forecast-panel">

        <h2>5-Day Weather Forecast</h2>

        <div className="forecast-grid">
          {forecast.map((item) => (
            <div className="forecast-card" key={item.day}>
              <h3>{item.day}</h3>
              <span>{item.icon}</span>
              <h2>{item.temp}°C</h2>
              <p>{item.condition}</p>
            </div>
          ))}
        </div>

      </div>

      <div className="weather-alert-panel">
        <h2>Weather Safety Tips</h2>
        <ul>
          <li>Monitor official weather warnings.</li>
          <li>Avoid flooded roads and low-lying areas.</li>
          <li>Stay indoors during thunderstorms.</li>
          <li>Keep drinking water and emergency supplies ready.</li>
        </ul>
      </div>

      <p className="weather-demo-note">
        Demonstration only: Weather values and forecasts are sample data,
        not live measurements or official forecasts.
      </p>

    </div>
  );
}

export default Weather;
