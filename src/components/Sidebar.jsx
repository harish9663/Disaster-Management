
import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: "▦" },
    { name: "Disaster Alerts", path: "/alerts", icon: "⚠" },
    { name: "Disaster Map", path: "/map", icon: "◎" },
    { name: "Report Incident", path: "/report", icon: "＋" },
    { name: "Weather", path: "/weather", icon: "☁" },
    { name: "Emergency Services", path: "/services", icon: "✚" },
    { name: "Safety Center", path: "/safety", icon: "盾" },
    { name: "Analytics", path: "/analytics", icon: "▥" },
    { name: "Admin Panel", path: "/admin", icon: "⚙" },
    { name: "Profile & Settings", path: "/profile", icon: "👤" },
    { name: "Resource Center", path: "/resources", icon: "🛡️" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">D</div>
        <div>
          <h2>Disaster360</h2>
          <span>Emergency Platform</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-heading">MAIN MENU</p>

        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-help">
          <span>🛡️</span>
          <h4>Stay Prepared</h4>
          <p>Be alert. Stay safe. Help others.</p>
        </div>

        <p className="sidebar-version">Disaster360 v1.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
