
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        Disaster360
      </Link>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/alerts">Alerts</Link></li>
        <li><Link to="/safety">Safety Tips</Link></li>
        <li><Link to="/contacts">Contacts</Link></li>
        <li><Link to="/report">Report</Link></li>
        <li><Link to="/map">Live Map</Link></li>
      </ul>

    </nav>
  );
}

export default Navbar;
