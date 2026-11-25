
import { Outlet } from "react-router-dom";
import CitizenSidebar from "./CitizenSidebar";
import CitizenNotificationBell from "./CitizenNotificationBell";

function CitizenLayout() {
  return (
    <div className="citizen-layout">
      <CitizenSidebar />

      <main className="citizen-main">
        <div className="citizen-topbar">
          <div>
            <h2>Disaster360</h2>
            <p>Stay informed. Stay safe.</p>
          </div>

          <CitizenNotificationBell />
        </div>

        <Outlet />
      </main>
    </div>
  );
}

export default CitizenLayout;

