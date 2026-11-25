
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./CitizenHospitals.css";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});

const OVERPASS_API = "https://overpass-api.de/api/interpreter";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371;
  const toRadians = (value) => (value * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return (
    earthRadius *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}

function CitizenHospitals() {
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [radius, setRadius] = useState("10000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);

  async function findHospitals(latitude, longitude, searchRadius) {
    setLoading(true);
    setError("");
    setHospitals([]);
    setSelectedHospital(null);

    setUserLocation({
      lat: latitude,
      lng: longitude
    });

    const query = `
      [out:json][timeout:25];
      (
        nwr["amenity"="hospital"]
        (around:${searchRadius},${latitude},${longitude});
      );
      out center tags;
    `;

    try {
      const response = await fetch(OVERPASS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          data: query
        })
      });

      if (!response.ok) {
        throw new Error(
          "Hospital search service is temporarily unavailable."
        );
      }

      const data = await response.json();

      const results = data.elements
        .map((item) => {
          const lat = item.lat ?? item.center?.lat;
          const lng = item.lon ?? item.center?.lon;

          if (lat == null || lng == null) return null;

          const distance = calculateDistance(
            latitude,
            longitude,
            lat,
            lng
          );

          return {
            id: `${item.type}-${item.id}`,
            name: item.tags?.name || "Hospital name unavailable",
            lat,
            lng,
            distance,
            address:
              item.tags?.["addr:full"] ||
              [
                item.tags?.["addr:street"],
                item.tags?.["addr:city"] ||
                  item.tags?.["addr:district"]
              ]
                .filter(Boolean)
                .join(", "),
            phone:
              item.tags?.phone ||
              item.tags?.["contact:phone"] ||
              "",
            website:
              item.tags?.website ||
              item.tags?.["contact:website"] ||
              ""
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);

      setHospitals(results);
    } catch (err) {
      setError(
        err.message || "Unable to find nearby hospitals. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function getMyLocation() {
    if (!navigator.geolocation) {
      setError("Your browser does not support GPS location.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        findHospitals(
          position.coords.latitude,
          position.coords.longitude,
          Number(radius)
        );
      },
      () => {
        setLoading(false);
        setError(
          "Location permission denied. Please allow location access and try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000
      }
    );
  }

  function changeRadius(value) {
    setRadius(value);

    if (userLocation) {
      findHospitals(
        userLocation.lat,
        userLocation.lng,
        Number(value)
      );
    }
  }

  function openDirections(hospital) {
    const url =
      `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="citizen-hospitals">

      <div className="hospital-heading">
        <div>
          <h1>Nearby Hospitals</h1>
          <p>
            Find hospitals and healthcare facilities near your location.
          </p>
        </div>

        <span className="hospital-live-status">
          ● Location Search
        </span>
      </div>

      <div className="hospital-controls">

        <div className="hospital-radius">
          <label>Search Radius</label>

          <select
            value={radius}
            onChange={(e) => changeRadius(e.target.value)}
          >
            <option value="5000">Within 5 KM</option>
            <option value="10000">Within 10 KM</option>
            <option value="20000">Within 20 KM</option>
          </select>
        </div>

        <button
          className="hospital-find-btn"
          onClick={getMyLocation}
          disabled={loading}
        >
          📍 {loading ? "Searching..." : "Find Hospitals Near Me"}
        </button>

      </div>

      {error && (
        <div className="hospital-error">
          {error}
        </div>
      )}

      <div className="hospital-stats">
        <div className="hospital-stat-card">
          <span>🏥</span>
          <div>
            <h2>{hospitals.length}</h2>
            <p>Hospitals Found</p>
          </div>
        </div>

        <div className="hospital-stat-card">
          <span>📍</span>
          <div>
            <h2>{radius / 1000} KM</h2>
            <p>Search Radius</p>
          </div>
        </div>
      </div>

      <h2 className="hospital-section-title">
        Hospital Map
      </h2>

      <div className="hospital-map-container">

        {userLocation ? (
          <MapContainer
            key={`${userLocation.lat}-${userLocation.lng}`}
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "420px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[userLocation.lat, userLocation.lng]}
            >
              <Popup>Your Current Location</Popup>
            </Marker>

            {hospitals.map((hospital) => (
              <Marker
                key={hospital.id}
                position={[hospital.lat, hospital.lng]}
              >
                <Popup>
                  <strong>{hospital.name}</strong>
                  <br />
                  {hospital.distance.toFixed(2)} KM away
                  <br />

                  <button
                    onClick={() => openDirections(hospital)}
                  >
                    Get Directions
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="hospital-map-placeholder">
            <span>🗺️</span>
            <h3>Find Hospitals Around You</h3>
            <p>
              Allow location access to display nearby hospitals on the map.
            </p>
            <button onClick={getMyLocation}>
              Find My Location
            </button>
          </div>
        )}

      </div>

      <div className="hospital-list-heading">
        <h2>Nearby Hospital List</h2>
        <span>{hospitals.length} results</span>
      </div>

      {loading && (
        <p className="hospital-loading">
          Searching for nearby hospitals...
        </p>
      )}

      {!loading && userLocation && hospitals.length === 0 && !error && (
        <div className="hospital-empty">
          No hospitals were found in this search radius.
          Try increasing the radius.
        </div>
      )}

      <div className="hospital-list">

        {hospitals.map((hospital) => (
          <div
            className="hospital-card"
            key={hospital.id}
          >
            <div className="hospital-card-icon">
              🏥
            </div>

            <div className="hospital-card-info">
              <h3>{hospital.name}</h3>

              <p>
                📍 {hospital.distance.toFixed(2)} KM away
              </p>

              {hospital.address && (
                <p>{hospital.address}</p>
              )}

              {hospital.phone && (
                <p>☎ {hospital.phone}</p>
              )}

              {hospital.website && (
                <a
                  href={
                    hospital.website.startsWith("http")
                      ? hospital.website
                      : `https://${hospital.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit Website
                </a>
              )}
            </div>

            <button
              className="hospital-direction-btn"
              onClick={() => {
                setSelectedHospital(hospital);
                openDirections(hospital);
              }}
            >
              Directions
            </button>
          </div>
        ))}

      </div>

      <p className="hospital-data-note">
        Hospital information is sourced from OpenStreetMap contributors.
        Some facilities may have incomplete or outdated details.
        Always call the hospital to confirm services and availability.
        For immediate emergencies in India, call 112.
      </p>

    </div>
  );
}

export default CitizenHospitals;
