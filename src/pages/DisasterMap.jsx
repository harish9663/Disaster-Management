
import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

const API_URL = "http://localhost:5000/api/alerts";

// Default disaster marker
const disasterIcon = L.divIcon({
  className: "live-disaster-marker",
  html: `
    <div style="
      background:#ef4444;
      width:18px;
      height:18px;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 12px #ef4444;
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

// User location marker
const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `
    <div style="
      background:#38bdf8;
      width:18px;
      height:18px;
      border:4px solid white;
      border-radius:50%;
      box-shadow:0 0 12px #38bdf8;
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

// Move map when user selects their location
function MapLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 10, {
        duration: 1.5
      });
    }
  }, [position, map]);

  return null;
}

function DisasterMap() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");

  const [search, setSearch] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Get coordinates only when the backend provides valid values
  const mappedAlerts = alerts.filter((alert) => {
    const lat = Number(alert.latitude ?? alert.lat);
    const lng = Number(alert.longitude ?? alert.lng);

    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      alert.latitude !== null &&
      alert.longitude !== null
    );
  });

  const unmappedAlerts = alerts.filter(
    (alert) => !mappedAlerts.includes(alert)
  );

  // Fetch live alerts
  async function fetchAlerts() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to connect to the live alert service.");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Live alert service failed.");
      }

      setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
      setLastUpdated(data.lastUpdated || new Date().toISOString());
      setError("");

    } catch (err) {
      setError(
        "Unable to load live alerts. Please check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  // Initial fetch and automatic refresh
  useEffect(() => {
    fetchAlerts();

    const interval = setInterval(fetchAlerts, 120000);

    return () => clearInterval(interval);
  }, []);

  // Find user's current location
  function findMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Your browser does not support location services."
      );
      return;
    }

    setLocationMessage("Finding your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude
        ]);

        setLocationMessage("Your location was found.");
      },
      () => {
        setLocationMessage(
          "Location permission denied or unavailable."
        );
      }
    );
  }

  // Search alerts
  const filteredAlerts = alerts.filter((alert) => {
    const text = (
      (alert.title || "") +
      " " +
      (alert.description || "")
    ).toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const filteredMappedAlerts = mappedAlerts.filter((alert) => {
    const text = (
      (alert.title || "") +
      " " +
      (alert.description || "")
    ).toLowerCase();

    return text.includes(search.toLowerCase());
  });

  function formatDate(date) {
    if (!date) return "Date not provided";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString();
  }

  return (
    <div className="advanced-map-page citizen-map-page">

      {/* Heading */}

      <div className="map-heading">
        <div>
          <p className="dashboard-label">
            LIVE DISASTER MONITORING
          </p>

          <h1>Disaster Map</h1>

          <p>
            View official disaster alerts with available
            geographic coordinates.
          </p>
        </div>

        <span className="map-live-label">
          LIVE ALERT FEED
        </span>
      </div>

      {/* Live status */}

      <div className="live-data-status">
        <div>
          <span
            className="live-status-dot"
            style={{
              background: error ? "#ef4444" : "#22c55e"
            }}
          ></span>

          {error ? "Connection problem" : "NDMA alert feed"}
        </div>

        <span>
          Last updated: {lastUpdated
            ? formatDate(lastUpdated)
            : "Waiting for data"}
        </span>

        <button onClick={fetchAlerts}>
          ↻ Refresh
        </button>
      </div>

      {/* Search */}

      <div className="map-controls">

        <div>
          <label>Search alerts</label>

          <input
            type="text"
            placeholder="Search by disaster or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="my-location-button"
          onClick={findMyLocation}
        >
          ◎ Find My Location
        </button>

      </div>

      {locationMessage && (
        <p className="location-message">
          {locationMessage}
        </p>
      )}

      {/* Statistics */}

      <div className="map-stats">

        <div className="map-stat-card">
          <h2>{alerts.length}</h2>
          <p>Official Feed Alerts</p>
        </div>

        <div className="map-stat-card">
          <h2>{mappedAlerts.length}</h2>
          <p>Alerts With Coordinates</p>
        </div>

        <div className="map-stat-card">
          <h2>{unmappedAlerts.length}</h2>
          <p>Alerts Without Coordinates</p>
        </div>

      </div>

      {/* Map */}

      <div className="advanced-map-container">

        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapLocation position={userLocation} />

          {/* Real alert markers */}

          {filteredMappedAlerts.map((alert, index) => (
            <Marker
              key={alert.id || index}
              position={[
                Number(alert.latitude ?? alert.lat),
                Number(alert.longitude ?? alert.lng)
              ]}
              icon={disasterIcon}
              eventHandlers={{
                click: () => setSelectedAlert(alert)
              }}
            >
              <Popup>
                <h3>{alert.title}</h3>

                <p>
                  {alert.description || "No description provided."}
                </p>

                <p>
                  <b>Published:</b>{" "}
                  {formatDate(alert.publishedAt)}
                </p>

                <p>
                  <b>Source:</b> {alert.source || "Official feed"}
                </p>

                {alert.link && (
                  <a
                    href={alert.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Official Alert
                  </a>
                )}
              </Popup>
            </Marker>
          ))}

          {/* User location */}

          {userLocation && (
            <Marker
              position={userLocation}
              icon={userIcon}
            >
              <Popup>Your current location</Popup>
            </Marker>
          )}

        </MapContainer>

      </div>

      {/* Loading and errors */}

      {loading && (
        <div className="map-information">
          Loading official disaster alerts...
        </div>
      )}

      {error && (
        <div className="map-information">
          <h3>Unable to load live data</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Alerts without map coordinates */}

      <div className="map-information">
        <h3>Official Alerts Without Map Coordinates</h3>

        <p>
          These alerts were received from the official feed,
          but their geographic coordinates are not available.
          They are not displayed as map markers until a
          reliable location is available.
        </p>

        {filteredAlerts.filter((alert) => unmappedAlerts.includes(alert))
          .map((alert, index) => (
            <div className="unmapped-alert-card" key={alert.id || index}>

              <h4>{alert.title}</h4>

              <p>
                {alert.description || "No description provided."}
              </p>

              <small>
                Published: {formatDate(alert.publishedAt)}
              </small>

              {alert.link && (
                <p>
                  <a
                    href={alert.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Official Alert
                  </a>
                </p>
              )}

            </div>
          ))}

        {!loading && !error && filteredAlerts.length === 0 && (
          <p>No alerts match your search.</p>
        )}

      </div>

      {/* Selected alert details */}

      {selectedAlert && (
        <div className="map-information">
          <h3>{selectedAlert.title}</h3>

          <p>
            {selectedAlert.description}
          </p>

          <p>
            Published: {formatDate(selectedAlert.publishedAt)}
          </p>

          <button onClick={() => setSelectedAlert(null)}>
            Close Details
          </button>
        </div>
      )}

      <div className="map-information">
        <h3>Map Data Information</h3>

        <p>
          Data source: NDMA SACHET. Map markers are shown
          only when valid coordinates are supplied by the
          backend. Alert severity and location are not
          guessed. Always follow official government
          emergency instructions.
        </p>
      </div>

    </div>
  );
}

export default DisasterMap;
