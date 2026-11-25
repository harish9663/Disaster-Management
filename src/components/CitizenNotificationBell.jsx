
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CitizenNotificationBell.css";

const API_URL = "http://localhost:5000/api/alerts";
const STORAGE_KEY = "disaster360_read_notifications";

function getAlertId(alert) {
  return String(
    alert.id ||
    `${alert.link || ""}-${alert.title || ""}-${alert.publishedAt || ""}`
  );
}

function CitizenNotificationBell() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Unable to load notifications");
        }

        if (active) {
          setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError("Could not connect to the alert service.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadNotifications();

    const interval = setInterval(loadNotifications, 120000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  function markAsRead(id) {
    setReadIds((previous) => {
      const updated = [...new Set([...previous, id])];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function markAllAsRead() {
    const allIds = alerts.map(getAlertId);

    setReadIds((previous) => {
      const updated = [...new Set([...previous, ...allIds])];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function openAlert(alert) {
    markAsRead(getAlertId(alert));
    setIsOpen(false);
    navigate("/citizen/alerts");
  }

  const unreadCount = alerts.filter(
    (alert) => !readIds.includes(getAlertId(alert))
  ).length;

  const recentAlerts = [...alerts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt || 0) -
        new Date(a.publishedAt || 0)
    )
    .slice(0, 10);

  function formatDate(date) {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Date unavailable";

    return parsed.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  return (
    <div className="citizen-notification-wrapper">
      <button
        className="citizen-notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open notifications"
      >
        <span className="notification-bell-icon">♢</span>
        <span>Notifications</span>

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="notification-dismiss-area"
            onClick={() => setIsOpen(false)}
          />

          <div className="citizen-notification-panel">
            <div className="notification-panel-header">
              <div>
                <h3>Notifications</h3>
                <p>{unreadCount} unread alerts</p>
              </div>

              <button
                className="mark-all-read"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all read
              </button>
            </div>

            {loading && (
              <p className="notification-message">
                Loading official alerts...
              </p>
            )}

            {!loading && error && (
              <p className="notification-message notification-error">
                {error}
              </p>
            )}

            {!loading && !error && recentAlerts.length === 0 && (
              <p className="notification-message">
                No official alerts are currently available.
              </p>
            )}

            {!loading && !error && recentAlerts.length > 0 && (
              <div className="notification-list">
                {recentAlerts.map((alert) => {
                  const id = getAlertId(alert);
                  const isRead = readIds.includes(id);

                  return (
                    <button
                      key={id}
                      className={`notification-item ${
                        isRead ? "read" : "unread"
                      }`}
                      onClick={() => openAlert(alert)}
                    >
                      <span className="notification-item-dot">
                        {isRead ? "○" : "●"}
                      </span>

                      <span className="notification-item-content">
                        <strong>
                          {alert.title || "Official Disaster Alert"}
                        </strong>

                        <span>
                          {alert.description ||
                            "Open the alerts page for more details."}
                        </span>

                        <small>
                          {formatDate(alert.publishedAt)}
                        </small>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <button
              className="view-all-notifications"
              onClick={() => {
                setIsOpen(false);
                navigate("/citizen/alerts");
              }}
            >
              View All Disaster Alerts →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CitizenNotificationBell;
