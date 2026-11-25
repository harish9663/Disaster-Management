
import { useLocation } from "react-router-dom";

function ComingSoon() {
  const location = useLocation();

  const pageName = {
    "/weather": "Weather Monitoring",
    "/services": "Emergency Services",
    "/analytics": "Disaster Analytics",
    "/admin": "Administration Panel",
  };

  return (
    <div className="coming-soon">
      <div className="coming-icon">🚧</div>
      <h1>{pageName[location.pathname] || "Coming Soon"}</h1>
      <p>
        This module is part of the Disaster360 development plan.
        We will build it in the upcoming stages.
      </p>
    </div>
  );
}

export default ComingSoon;
