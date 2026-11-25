
import { useEffect, useState } from "react";
import "./CitizenLocationSettings.css";

const STORAGE_KEY = "disaster360_user_location";
const DEFAULT_RADIUS = 10;

function CitizenLocationSettings() {
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setLocation(JSON.parse(saved));
      }
    } catch {
      setError("Unable to read your saved location.");
    }
  }, []);

  function saveLocation(newLocation) {
    const locationData = {
      ...newLocation,
      radiusKm: DEFAULT_RADIUS,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(locationData));

    setLocation(locationData);
    setResults([]);
    setMessage("Your location has been saved successfully.");
    setError("");
  }

  function useCurrentLocation() {
    setMessage("");
    setError("");

    if (!navigator.geolocation) {
      setError("Your browser does not support GPS location.");
      return;
    }

    setLoadingGPS(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        saveLocation({
          name: "Current GPS Location",
          latitude,
          longitude,
          method: "GPS"
        });

        setLoadingGPS(false);
      },
      (err) => {
        setLoadingGPS(false);

        if (err.code === 1) {
          setError("Location permission was denied. Allow location access in your browser or select a city manually.");
        } else if (err.code === 2) {
          setError("Your current location could not be detected. Try selecting a city manually.");
        } else {
          setError("Location request timed out. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  }

  async function searchLocation(e) {
    e.preventDefault();

    if (!search.trim()) {
      setError("Please enter a city, district or town name.");
      return;
    }

    setSearching(true);
    setError("");
    setMessage("");
    setResults([]);

    try {
      const url =
        "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(search.trim()) +
        "&count=8&language=en&format=json";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const data = await response.json();

      const places = (data.results || []).map((place) => ({
        name: place.name,
        admin1: place.admin1 || "",
        country: place.country || "",
        latitude: place.latitude,
        longitude: place.longitude
      }));

      setResults(places);

      if (places.length === 0) {
        setMessage("No matching places found. Try another spelling.");
      }
    } catch (err) {
      setError("Unable to search locations. Check your internet connection.");
    } finally {
      setSearching(false);
    }
  }

  function choosePlace(place) {
    saveLocation({
      name: [place.name, place.admin1, place.country]
        .filter(Boolean)
        .join(", "),
      latitude: place.latitude,
      longitude: place.longitude,
      method: "Manual"
    });

    setSearch(place.name);
  }

  function clearLocation() {
    if (!window.confirm("Remove your saved location?")) return;

    localStorage.removeItem(STORAGE_KEY);
    setLocation(null);
    setResults([]);
    setMessage("Saved location removed.");
    setError("");
  }

  return (
    <div className="citizen-location-page">

      <div className="citizen-location-header">
        <span>PERSONAL ALERT SETTINGS</span>
        <h1>My Location</h1>
        <p>
          Select where you live to receive relevant nearby disaster alerts.
        </p>
      </div>

      {message && (
        <div className="location-message">
          {message}
        </div>
      )}

      {error && (
        <div className="location-error">
          {error}
        </div>
      )}

      <div className="location-settings-card">

        <div className="location-section-heading">
          <h2>Choose Your Location</h2>
          <p>You can use GPS or select a place manually.</p>
        </div>

        <div className="location-method-card">
          <div>
            <h3>Use Current GPS Location</h3>
            <p>
              Allow your browser to detect your current coordinates.
            </p>
          </div>

          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={loadingGPS}
          >
            {loadingGPS ? "Detecting..." : "Use My Location"}
          </button>
        </div>

        <div className="location-or">
          <span>OR SELECT MANUALLY</span>
        </div>

        <form onSubmit={searchLocation} className="location-search-form">
          <label htmlFor="location-search">
            Search City, Town or District
          </label>

          <div className="location-search-row">
            <input
              id="location-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Example: Vijayawada"
            />

            <button type="submit" disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {results.length > 0 && (
          <div className="location-search-results">
            <h3>Select your place</h3>

            {results.map((place, index) => (
              <button
                type="button"
                className="location-result"
                key={`${place.name}-${place.latitude}-${index}`}
                onClick={() => choosePlace(place)}
              >
                <span>📍</span>

                <span>
                  <strong>{place.name}</strong>
                  <small>
                    {[place.admin1, place.country]
                      .filter(Boolean)
                      .join(", ")}
                  </small>
                </span>
              </button>
            ))}
          </div>
        )}

      </div>

      <div className="location-settings-card">
        <div className="location-section-heading">
          <h2>Nearby Alert Radius</h2>
          <p>
            Your selected default radius for nearby alert matching.
          </p>
        </div>

        <div className="location-radius-display">
          <span>10 km</span>
          <small>Default radius</small>
        </div>

        <p className="location-help-text">
          The 10 km radius is an additional proximity setting.
          Official NDMA affected-area boundaries will also be checked.
        </p>
      </div>

      <div className="location-settings-card">
        <div className="location-section-heading">
          <h2>Saved Location</h2>
        </div>

        {location ? (
          <div className="saved-location-details">
            <div>
              <span className="saved-location-label">Selected place</span>
              <h3>{location.name}</h3>
              <p>Method: {location.method}</p>
              <p>
                Latitude: {Number(location.latitude).toFixed(5)}
              </p>
              <p>
                Longitude: {Number(location.longitude).toFixed(5)}
              </p>
              <p>Alert radius: {location.radiusKm || 10} km</p>
            </div>

            <button
              type="button"
              className="remove-location-button"
              onClick={clearLocation}
            >
              Remove Location
            </button>
          </div>
        ) : (
          <p className="location-help-text">
            No location saved yet. Use GPS or search for your city above.
          </p>
        )}
      </div>

      <div className="location-privacy-note">
        <strong>Location privacy:</strong> This version saves coordinates
        only in this browser. Your location is not yet sent to the
        Disaster360 backend or Firebase. You choose whether to share GPS
        location through your browser's permission prompt.
      </div>

    </div>
  );
}

export default CitizenLocationSettings;
