
import { useNavigate } from "react-router-dom";

function CitizenDashboard() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Disaster Alerts",
      description: "Check warnings and important emergency updates.",
      icon: "⚠️",
      path: "/citizen/alerts",
    },
    {
      title: "Disaster Map",
      description: "Explore affected areas and nearby safe zones.",
      icon: "🗺️",
      path: "/citizen/map",
    },
    {
      title: "Emergency SOS",
      description: "Find emergency contacts and get help.",
      icon: "🆘",
      path: "/citizen/sos",
    },
    {
      title: "Report an Incident",
      description: "Inform authorities about a disaster or emergency.",
      icon: "📢",
      path: "/citizen/report",
    },
    {
      title: "Weather Updates",
      description: "Stay informed about weather conditions.",
      icon: "🌦️",
      path: "/citizen/weather",
    },
    {
      title: "Nearby Hospitals",
      description: "Find hospitals and medical assistance.",
      icon: "🏥",
      path: "/citizen/hospitals",
    },
    {
      title: "Safety Center",
      description: "Learn what to do before, during, and after disasters.",
      icon: "🛡️",
      path: "/citizen/safety",
    },
    {
      title: "My Reports",
      description: "View the incidents you have submitted.",
      icon: "📋",
      path: "/citizen/reports",
    },
  ];

  return (
    <div className="citizen-dashboard">
      <div className="citizen-welcome">
        <p className="welcome-label">CITIZEN SAFETY PORTAL</p>
        <h1>Your Safety, Our Priority</h1>
        <p>
          Get emergency information, stay updated, and find help
          when you need it.
        </p>
        <button onClick={() => navigate("/citizen/alerts")}>
          View Disaster Alerts
        </button>
      </div>

      <div className="citizen-section-heading">
        <h2>Emergency Services</h2>
        <p>Everything you need to stay safe in one place.</p>
      </div>

      <div className="citizen-services-grid">
        {services.map((service) => (
          <div
            className="citizen-service-card"
            key={service.title}
            onClick={() => navigate(service.path)}
          >
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <span>Explore Service →</span>
          </div>
        ))}
      </div>

      <div className="citizen-emergency-note">
        <h2>Facing an Emergency?</h2>
        <p>
          Contact your local emergency services immediately.
          Do not wait for an online response during a life-threatening
          situation.
        </p>
        <button onClick={() => navigate("/citizen/sos")}>
          Get Emergency Help
        </button>
      </div>
    </div>
  );
}

export default CitizenDashboard;
