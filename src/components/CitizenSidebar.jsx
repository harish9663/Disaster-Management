
import { NavLink } from "react-router-dom";

function CitizenSidebar() {

  const menuItems = [
    { name: "Home", path: "/citizen", icon: "⌂" },
    { name: "Disaster Alerts", path: "/citizen/alerts", icon: "⚠" },
    { name: "Disaster Map", path: "/citizen/map", icon: "◎" },
    { name: "Emergency SOS", path: "/citizen/sos", icon: "🆘" },
    { name: "Report Incident", path: "/citizen/report", icon: "＋" },
    { name: "Weather Updates", path: "/citizen/weather", icon: "☁" },
    { name: "Nearby Hospitals", path: "/citizen/hospitals", icon: "✚" },
    { name: "Safety Center", path: "/citizen/safety", icon: "🛡" },
    { name: "Notifications", path: "/citizen/notifications", icon: "♢" },
    { name: "My Profile", path: "/citizen/profile", icon: "👤" },
  ];

  return (
    <aside className="citizen-sidebar">

      <div className="citizen-brand">
        <h2>🛡 Disaster360</h2>
        <p>Citizen Safety Portal</p>
      </div>

      <div className="citizen-menu-title">
        YOUR SERVICES
      </div>

      <nav className="citizen-menu">

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/citizen"}
            className={({ isActive }) =>
              isActive ? "citizen-link active" : "citizen-link"
            }
          >
            <span className="citizen-icon">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>

      <div className="citizen-sidebar-footer">
        <p>Emergency Support</p>
        <h3>Your Safety Comes First</h3>
      </div>

    </aside>
  );
}

export default CitizenSidebar;
