
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import DisasterAlerts from "./pages/DisasterAlerts";
import SafetyGuidelines from "./pages/SafetyGuidelines";
import EmergencyContacts from "./pages/EmergencyContacts";
import ReportDisaster from "./pages/ReportDisaster";
import DisasterMap from "./pages/DisasterMap";
import Weather from "./pages/Weather";
import EmergencyServices from "./pages/EmergencyServices";
import Analytics from "./pages/Analytics";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import ResourceCenter from "./pages/ResourceCenter";
import CitizenSOS from "./pages/CitizenSOS";
import CitizenLayout from "./components/CitizenLayout";
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenWeather from "./pages/CitizenWeather";
import CitizenHospitals from "./pages/CitizenHospitals";
import CitizenSafety from "./pages/CitizenSafety";
import CitizenMyReports from "./pages/CitizenMyReports";
import CitizenNotifications from "./pages/CitizenNotifications";
import CitizenLocationSettings from "./pages/CitizenLocationSettings";
import CitizenProfile from "./pages/CitizenProfile";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ADMIN WEBSITE */}
        <Route
          path="/*"
          element={
            <div className="app-layout">
              <Sidebar />

              <div className="main-area">
                <Topbar />

                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/alerts" element={<DisasterAlerts />} />
                    <Route path="/safety" element={<SafetyGuidelines />} />
                    <Route path="/contacts" element={<EmergencyContacts />} />
                    <Route path="/report" element={<ReportDisaster />} />
                    <Route path="/map" element={<DisasterMap />} />
                    <Route path="/weather" element={<Weather />} />
                    <Route path="/services" element={<EmergencyServices />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/resources" element={<ResourceCenter />} />
                    <Route path="notifications" element={<CitizenNotifications />} />
                    <Route path="location" element={<CitizenLocationSettings />} />
                    <Route path="profile" element={<CitizenProfile />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />

        {/* CITIZEN WEBSITE */}
        <Route path="/citizen" element={<CitizenLayout />}>
  <Route index element={<CitizenDashboard />} />

  <Route path="alerts" element={<DisasterAlerts />} />

  <Route
    path="*"
    element={
      <div style={{ padding: "30px", color: "white" }}>
        <h2>Coming Soon</h2>
        <p>This citizen feature is under development.</p>
      </div>
    }
  />
  <Route path="map" element={<DisasterMap />} />
  <Route path="sos" element={<CitizenSOS />} />
  <Route path="report" element={<ReportDisaster />} />
  <Route path="weather" element={<CitizenWeather />} />
  <Route path="hospitals" element={<CitizenHospitals />} />
  <Route path="safety" element={<CitizenSafety />} />
   <Route path="my-reports" element={<CitizenMyReports />} />
   <Route path="notifications" element={<CitizenNotifications />} />
   <Route path="location" element={<CitizenLocationSettings />} />
   <Route path="profile" element={<CitizenProfile />} />
</Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
