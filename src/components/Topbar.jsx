
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pages = [
    { name: "Dashboard", path: "/", description: "Main monitoring dashboard", keywords: "home overview statistics" },
    { name: "Disaster Alerts", path: "/alerts", description: "View emergency warnings", keywords: "flood cyclone fire earthquake warning" },
    { name: "Disaster Map", path: "/map", description: "Explore disaster locations", keywords: "map location risk areas" },
    { name: "Report Incident", path: "/report", description: "Submit a new incident report", keywords: "report emergency submit incident" },
    { name: "Weather", path: "/weather", description: "Weather monitoring and forecast", keywords: "rain temperature wind forecast" },
    { name: "Emergency Services", path: "/services", description: "Emergency contacts and services", keywords: "helpline ambulance police fire 112" },
    { name: "Safety Center", path: "/safety", description: "Disaster safety guidelines", keywords: "preparedness protection guidelines" },
    { name: "Resource Center", path: "/resources", description: "Emergency kits and resources", keywords: "kit shelter evacuation first aid" },
    { name: "Analytics", path: "/analytics", description: "Disaster statistics and reports", keywords: "charts graphs data statistics" },
    { name: "Admin Panel", path: "/admin", description: "Manage alerts and response teams", keywords: "administrator management teams" },
    { name: "Profile & Settings", path: "/profile", description: "Manage your profile and preferences", keywords: "account settings preferences" },
  ];

  const filteredPages = pages.filter((page) => {
    const searchText = search.toLowerCase();

    return (
      page.name.toLowerCase().includes(searchText) ||
      page.description.toLowerCase().includes(searchText) ||
      page.keywords.toLowerCase().includes(searchText)
    );
  });

  function openPage(page) {
    navigate(page.path);
    setSearch("");
    setShowSearchResults(false);
  }

  function handleSearchKeyDown(event) {
    if (event.key === "Enter" && filteredPages.length > 0) {
      openPage(filteredPages[0]);
    }

    if (event.key === "Escape") {
      setShowSearchResults(false);
    }
  }

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Flood Warning",
      message: "High flood risk reported in Vijayawada.",
      time: "5 minutes ago",
      type: "danger",
      read: false,
    },
    {
      id: 2,
      title: "Cyclone Alert",
      message: "Cyclone monitoring active near Visakhapatnam.",
      time: "20 minutes ago",
      type: "warning",
      read: false,
    },
    {
      id: 3,
      title: "Incident Report",
      message: "A new incident report has been submitted.",
      time: "1 hour ago",
      type: "info",
      read: false,
    },
    {
      id: 4,
      title: "Safety Update",
      message: "Emergency preparedness guidelines updated.",
      time: "2 hours ago",
      type: "success",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  function markAsRead(id) {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }

  function clearNotifications() {
    setNotifications([]);
  }

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>Disaster Monitoring Center</h2>
        <p>Monitor emergencies and stay informed</p>
      </div>

      <div className="topbar-actions">
        <div className="topbar-search search-container">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search pages and features..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            onKeyDown={handleSearchKeyDown}
          />

          {search && (
            <button
              className="search-clear"
              onClick={() => {
                setSearch("");
                setShowSearchResults(false);
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}

          {showSearchResults && search.trim() !== "" && (
            <div className="global-search-results">
              <div className="search-results-heading">
                SEARCH RESULTS
              </div>

              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <button
                    key={page.path}
                    className="search-result-item"
                    onClick={() => openPage(page)}
                  >
                    <span className="search-result-icon">⌕</span>

                    <span>
                      <strong>{page.name}</strong>
                      <small>{page.description}</small>
                    </span>

                    <span className="search-result-arrow">→</span>
                  </button>
                ))
              ) : (
                <div className="search-no-results">
                  <span>🔍</span>
                  <p>No matching pages found.</p>
                  <small>Try another keyword.</small>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="notification-wrapper">
          <button
            className="notification-button"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <div>
                  <h3>Notifications</h3>
                  <p>{unreadCount} unread messages</p>
                </div>

                <button onClick={() => setShowNotifications(false)}>
                  ✕
                </button>
              </div>

              <div className="notification-actions">
                <button onClick={markAllAsRead}>
                  Mark all as read
                </button>

                <button onClick={clearNotifications}>
                  Clear all
                </button>
              </div>

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="notification-empty">
                    <span>🔕</span>
                    <p>No notifications available</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${
                        notification.read ? "read" : "unread"
                      }`}
                    >
                      <div className={`notification-icon ${notification.type}`}>
                        {notification.type === "danger" && "🚨"}
                        {notification.type === "warning" && "⚠️"}
                        {notification.type === "info" && "📢"}
                        {notification.type === "success" && "🛡️"}
                      </div>

                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <small>{notification.time}</small>

                        {!notification.read && (
                          <button
                            className="mark-read-button"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </button>
                        )}
                      </div>

                      {!notification.read && (
                        <span className="unread-dot"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="notification-footer">
                Disaster360 Notification Center
              </div>
            </div>
          )}
        </div>

        <div className="profile">
          <div className="profile-avatar">A</div>
          <div>
            <h4>Administrator</h4>
            <p>Control Center</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
