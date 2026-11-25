
import { useEffect, useState } from "react";
import "./CitizenNotifications.css";

const API_URL = "http://localhost:5000/api/alerts";
const STORAGE_KEY = "disaster360_read_notifications";

function getAlertId(alert) {
  return String(
    alert.id ||
    `${alert.link || ""}-${alert.title || ""}-${alert.publishedAt || ""}`
  );
}

function CitizenNotifications() {
  const [alerts, setAlerts] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  async function loadAlerts() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load alerts");
      }

      setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
      setLastUpdated(data.lastUpdated || null);
      setError("");
    } catch (err) {
      setError("Unable to connect to the live disaster alert service.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts();

    const interval = setInterval(loadAlerts, 120000);

    return () => clearInterval(interval);
  }, []);

  function saveReadIds(updated) {
    setReadIds(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function markAsRead(id) {
    if (readIds.includes(id)) return;
    saveReadIds([...readIds, id]);
  }

  function markAllAsRead() {
    const allIds = alerts.map(getAlertId);
    saveReadIds([...new Set([...readIds, ...allIds])]);
  }

  function formatDate(date) {
    if (!date) return "Publication date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Publication date unavailable";
    }

    return parsed.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  const unreadCount = alerts.filter(
    (alert) => !readIds.includes(getAlertId(alert))
  ).length;

  const filteredAlerts = alerts.filter((alert) => {
    const id = getAlertId(alert);
    const isRead = readIds.includes(id);

    const matchesFilter =
      filter === "All" ||
      (filter === "Read" && isRead) ||
      (filter === "Unread" && !isRead);

    const searchText = search.toLowerCase();

    const matchesSearch =
      (alert.title || "").toLowerCase().includes(searchText) ||
      (alert.description || "").toLowerCase().includes(searchText) ||
      (alert.location || "").toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  }).sort(
    (a, b) =>
      new Date(b.publishedAt || 0) -
      new Date(a.publishedAt || 0)
  );

  return (
    <div className="citizen-notifications-page">

      <div className="notifications-page-header">
        <div>
          <span className="notifications-eyebrow">
            CITIZEN ALERT CENTER
          </span>
          <h1>Notifications</h1>
          <p>
            Stay informed about official disaster warnings and updates.
          </p>
        </div>

        <button
          className="notifications-refresh"
          onClick={loadAlerts}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="notifications-stats">

        <div className="notification-stat-card">
          <span>Total Alerts</span>
          <h2>{alerts.length}</h2>
        </div>

        <div className="notification-stat-card">
          <span>Unread Alerts</span>
          <h2>{unreadCount}</h2>
        </div>

        <div className="notification-stat-card">
          <span>Read Alerts</span>
          <h2>{alerts.length - unreadCount}</h2>
        </div>

      </div>

      <div className="notifications-toolbar">

        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="notification-filter-buttons">
          {["All", "Unread", "Read"].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          className="notification-mark-all"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </button>

      </div>

      <div className="notification-feed-status">
        <span className="notification-live-dot"></span>
        Source: NDMA SACHET official feed

        <span>
          {lastUpdated
            ? `Last updated: ${formatDate(lastUpdated)}`
            : "Waiting for feed"}
        </span>
      </div>

      {loading && (
        <div className="notifications-empty">
          Loading official notifications...
        </div>
      )}

      {!loading && error && (
        <div className="notifications-empty notification-load-error">
          <h3>Unable to load notifications</h3>
          <p>{error}</p>
          <button onClick={loadAlerts}>Try Again</button>
        </div>
      )}

      {!loading && !error && (
        <div className="notification-feed">

          {filteredAlerts.length === 0 ? (
            <div className="notifications-empty">
              <h3>No notifications found</h3>
              <p>
                {alerts.length === 0
                  ? "The official feed currently has no alerts."
                  : "Try another filter or search term."}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const id = getAlertId(alert);
              const isRead = readIds.includes(id);

              return (
                <article
                  className={`notification-card ${
                    isRead ? "notification-read" : "notification-unread"
                  }`}
                  key={id}
                >
                  <div className="notification-card-icon">
                    ⚠
                  </div>

                  <div className="notification-card-body">

                    <div className="notification-card-heading">
                      <h3>{alert.title || "Official Disaster Alert"}</h3>

                      <span className={isRead ? "read-label" : "unread-label"}>
                        {isRead ? "Read" : "New"}
                      </span>
                    </div>

                    <p>
                      {alert.description ||
                        "No additional description was provided."}
                    </p>

                    <div className="notification-card-meta">
                      <span>{alert.location || "Location not provided"}</span>
                      <span>{formatDate(alert.publishedAt)}</span>
                      <span>{alert.source || "NDMA SACHET"}</span>
                    </div>

                    <div className="notification-card-actions">

                      {!isRead && (
                        <button onClick={() => markAsRead(id)}>
                          Mark as read
                        </button>
                      )}

                      {alert.link && (
                        <a
                          href={alert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => markAsRead(id)}
                        >
                          View Official Alert ↗
                        </a>
                      )}

                    </div>

                  </div>
                </article>
              );
            })
          )}

        </div>
      )}

      <div className="notifications-disclaimer">
        <strong>Important:</strong> These notifications display information
        from the NDMA SACHET feed. Always follow official emergency
        instructions. This page does not replace emergency services.
      </div>

    </div>
  );
}

export default CitizenNotifications;
