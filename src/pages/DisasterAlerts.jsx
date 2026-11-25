
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/alerts";

function DisasterAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataSource, setDataSource] = useState("NDMA SACHET");

  // Fetch official alerts from our backend
  async function fetchAlerts(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to retrieve official alerts."
        );
      }

      setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
      setLastUpdated(data.lastUpdated || null);
      setDataSource(data.source || "NDMA SACHET");

    } catch (err) {
      console.error("Alert fetching error:", err);

      setError(
        "Unable to connect to the live alert service. Please check whether your backend is running."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Load alerts when page opens
  useEffect(() => {
    fetchAlerts();

    const interval = setInterval(() => {
      fetchAlerts(true);
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  // Search official alerts
  const filteredAlerts = alerts
    .filter((alert) => {
      const searchText = search.toLowerCase();

      return (
        (alert.title || "").toLowerCase().includes(searchText) ||
        (alert.description || "").toLowerCase().includes(searchText)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0).getTime();
      const dateB = new Date(b.publishedAt || 0).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

  function formatDate(date) {
    if (!date) return "Publication date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  return (
    <div className="alerts-page">

      {/* PAGE HEADER */}

      <div className="alerts-header">
        <div>
          <span className="dashboard-label">
            OFFICIAL DISASTER INFORMATION
          </span>

          <h1>Disaster Alerts</h1>

          <p>
            Stay informed with disaster warnings published
            through the official NDMA SACHET feed.
          </p>
        </div>

        <button
          className="details-button"
          onClick={() => fetchAlerts(true)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "↻ Refresh Alerts"}
        </button>
      </div>

      {/* LIVE DATA STATUS */}

      <div className="live-data-status">
        <div>
          <span className="live-status-dot"></span>
          <strong>Official Feed Connection</strong>
        </div>

        <span>{dataSource}</span>

        <span>
          {lastUpdated
            ? `Last updated: ${formatDate(lastUpdated)}`
            : "Waiting for data"}
        </span>
      </div>

      {/* ALERT SUMMARY */}

      <div className="alert-summary">

        <div className="alert-summary-card">
          <span>Official Alerts Retrieved</span>
          <h2>{alerts.length}</h2>
        </div>

        <div className="alert-summary-card">
          <span>Matching Search Results</span>
          <h2>{filteredAlerts.length}</h2>
        </div>

      </div>

      {/* SEARCH AND FILTERS */}

      <div className="alert-filter-panel">

        <div className="alert-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search official alert headlines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <button
          className="reset-filter"
          onClick={() => {
            setSearch("");
            setSortOrder("newest");
          }}
        >
          Reset
        </button>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="no-alerts">
          <h2>Loading Official Alerts...</h2>
          <p>Connecting to the NDMA SACHET feed.</p>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="no-alerts live-error">
          <h2>Unable to Load Live Alerts</h2>
          <p>{error}</p>

          <button
            className="details-button"
            onClick={() => fetchAlerts()}
          >
            Try Again
          </button>
        </div>
      )}

      {/* LIVE ALERT CARDS */}

      {!loading && !error && (

        <div className="alerts-list">

          {filteredAlerts.length > 0 ? (

            filteredAlerts.map((alert) => (

              <div
                className="advanced-alert-card"
                key={alert.id}
              >

                <div className="advanced-alert-top">

                  <div>
                    <span className="alert-category">
                      OFFICIAL WARNING
                    </span>

                    <h2>{alert.title || "Untitled Alert"}</h2>

                    <p className="alert-location">
                      Source: {alert.source || "NDMA SACHET"}
                    </p>
                  </div>

                  <span className="severity-badge">
                    Official Feed
                  </span>

                </div>

                <p className="advanced-alert-description">
                  {alert.description ||
                    "No description was provided in this feed."}
                </p>

                <div className="advanced-alert-footer">

                  <div className="alert-meta">
                    <span>
                      ◷ {formatDate(alert.publishedAt)}
                    </span>
                  </div>

                  <button
                    className="details-button"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    View Details →
                  </button>

                </div>

              </div>

            ))

          ) : (

            <div className="no-alerts">
              <span>🔎</span>

              <h2>
                {alerts.length === 0
                  ? "No Alerts Available"
                  : "No Matching Alerts Found"}
              </h2>

              <p>
                {alerts.length === 0
                  ? "The official feed currently returned no alerts. Check again later."
                  : "Try changing your search."}
              </p>

            </div>

          )}

        </div>

      )}

      {/* ALERT DETAILS MODAL */}

      {selectedAlert && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedAlert(null)}
        >

          <div
            className="alert-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-heading">

              <div>
                <span className="dashboard-label">
                  OFFICIAL ALERT DETAILS
                </span>

                <h2>{selectedAlert.title}</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedAlert(null)}
              >
                ×
              </button>

            </div>

            <p className="modal-description">
              {selectedAlert.description ||
                "No additional description is available."}
            </p>

            <div className="modal-details">

              <p>
                <strong>Source:</strong>{" "}
                {selectedAlert.source || "NDMA SACHET"}
              </p>

              <p>
                <strong>Published:</strong>{" "}
                {formatDate(selectedAlert.publishedAt)}
              </p>

            </div>

            {selectedAlert.link && (
              <a
                href={selectedAlert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="details-button official-source-link"
              >
                View Official Alert ↗
              </a>
            )}

            <button
              className="modal-done"
              onClick={() => setSelectedAlert(null)}
            >
              Close Details
            </button>

          </div>

        </div>

      )}

      {/* DATA SOURCE NOTICE */}

      <div className="data-notice">
        <strong>Data source:</strong> NDMA SACHET official RSS feed,
        accessed through your Disaster360 backend. Alert severity,
        exact coordinates and other details are displayed only when
        supplied by the feed. Always follow the latest instructions
        from official authorities.
      </div>

    </div>
  );
}

export default DisasterAlerts;
