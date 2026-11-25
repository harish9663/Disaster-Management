
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-about">
          <h2>Disaster360</h2>
          <p>
            Your safety is our priority.
            Stay informed, stay prepared
            and stay safe.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/alerts">Disaster Alerts</Link>
          <Link to="/safety">Safety Guidelines</Link>
          <Link to="/map">Live Disaster Map</Link>
        </div>

        <div className="footer-links">
          <h3>Services</h3>
          <Link to="/contacts">Emergency Contacts</Link>
          <Link to="/report">Report a Disaster</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Disaster360. All Rights Reserved.
        </p>
        <p>Be Prepared. Stay Safe.</p>
      </div>

    </footer>
  );
}

export default Footer;
