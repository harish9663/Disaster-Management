
import { useState } from "react";

function Admin() {
  const [activeTab, setActiveTab] = useState("Overview");

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "Flood Warning",
      location: "Vijayawada",
      severity: "High",
      status: "Active",
    },
    {
      id: 2,
      title: "Cyclone Alert",
      location: "Visakhapatnam",
      severity: "Critical",
      status: "Active",
    },
    {
      id: 3,
      title: "Fire Warning",
      location: "Hyderabad",
      severity: "Medium",
      status: "Resolved",
    },
  ]);

  const [teams] = useState([
    { id: 1, name: "Rescue Team Alpha", region: "Vijayawada", status: "Available" },
    { id: 2, name: "Medical Team Bravo", region: "Guntur", status: "On Duty" },
    { id: 3, name: "Fire Team Charlie", region: "Hyderabad", status: "Available" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: "",
    location: "",
    severity: "Medium",
  });

  const menuItems = ["Overview", "Alert Management", "Response Teams", "Activity Logs"];

  function addAlert(e) {
    e.preventDefault();

    const alert = {
      id: Date.now(),
      ...newAlert,
      status: "Active",
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ title: "", location: "", severity: "Medium" });
    setShowForm(false);
  }

  function deleteAlert(id) {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  }

  function changeStatus(id) {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              status: alert.status === "Active" ? "Resolved" : "Active",
            }
          : alert
      )
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-heading">
        <div>
          <p className="admin-label">SYSTEM CONTROL CENTER</p>
          <h1>Admin Dashboard</h1>
          <p>Manage disaster alerts, response teams and platform activity.</p>
        </div>

        <div className="admin-status">
          <span className="admin-status-dot"></span>
          Demo System Online
        </div>
      </div>

      <div className="admin-tabs">
        {menuItems.map((item) => (
          <button
            key={item}
            className={activeTab === item ? "admin-tab active" : "admin-tab"}
            onClick={() => setActiveTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <>
          <div className="admin-stats">
            <div className="admin-stat">
              <span>👥</span>
              <p>Total Users</p>
              <h2>1,248</h2>
              <small>Sample platform data</small>
            </div>

            <div className="admin-stat">
              <span>⚠️</span>
              <p>Total Alerts</p>
              <h2>{alerts.length}</h2>
              <small>Managed alerts</small>
            </div>

            <div className="admin-stat">
              <span>🚨</span>
              <p>Active Incidents</p>
              <h2>{alerts.filter((a) => a.status === "Active").length}</h2>
              <small>Based on demo alerts</small>
            </div>

            <div className="admin-stat">
              <span>🚑</span>
              <p>Response Teams</p>
              <h2>{teams.length}</h2>
              <small>Sample teams</small>
            </div>
          </div>

          <div className="admin-panel">
            <h2>Recent Disaster Alerts</h2>
            <p>Overview of alerts currently in the system.</p>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Alert</th>
                    <th>Location</th>
                    <th>Severity</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {alerts.slice(0, 5).map((alert) => (
                    <tr key={alert.id}>
                      <td>{alert.title}</td>
                      <td>{alert.location}</td>
                      <td>{alert.severity}</td>
                      <td>{alert.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "Alert Management" && (
        <div className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Alert Management</h2>
              <p>Create, update and remove disaster alerts.</p>
            </div>

            <button
              className="admin-primary-btn"
              onClick={() => setShowForm(!showForm)}
            >
              + Add New Alert
            </button>
          </div>

          {showForm && (
            <form className="admin-form" onSubmit={addAlert}>
              <label>Alert Title</label>
              <input
                required
                value={newAlert.title}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, title: e.target.value })
                }
                placeholder="Enter alert title"
              />

              <label>Location</label>
              <input
                required
                value={newAlert.location}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, location: e.target.value })
                }
                placeholder="Enter location"
              />

              <label>Severity</label>
              <select
                value={newAlert.severity}
                onChange={(e) =>
                  setNewAlert({ ...newAlert, severity: e.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>

              <button className="admin-primary-btn" type="submit">
                Save Alert
              </button>
            </form>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Alert</th>
                  <th>Location</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>{alert.title}</td>
                    <td>{alert.location}</td>
                    <td>{alert.severity}</td>
                    <td>{alert.status}</td>
                    <td>
                      <button
                        className="admin-action-btn"
                        onClick={() => changeStatus(alert.id)}
                      >
                        Change Status
                      </button>

                      <button
                        className="admin-delete-btn"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Response Teams" && (
        <div className="admin-panel">
          <h2>Response Team Management</h2>
          <p>Sample emergency response team information.</p>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Region</th>
                  <th>Availability</th>
                </tr>
              </thead>

              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td>{team.name}</td>
                    <td>{team.region}</td>
                    <td>{team.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Activity Logs" && (
        <div className="admin-panel">
          <h2>System Activity Logs</h2>
          <p>Example activity records for the demo dashboard.</p>

          <div className="admin-log">
            <span>🟢</span>
            <div>
              <strong>System initialized</strong>
              <p>Disaster360 demo dashboard is running.</p>
            </div>
          </div>

          <div className="admin-log">
            <span>⚠️</span>
            <div>
              <strong>Disaster alert records loaded</strong>
              <p>Sample alert information is available.</p>
            </div>
          </div>

          <div className="admin-log">
            <span>🚑</span>
            <div>
              <strong>Response teams loaded</strong>
              <p>Sample response team records are available.</p>
            </div>
          </div>
        </div>
      )}

      <div className="admin-disclaimer">
        Demo Admin Panel: Information is sample data. Changes are stored only
        in React state and will reset when the page is refreshed. Secure login,
        database storage and real user management are not implemented yet.
      </div>
    </div>
  );
}

export default Admin;
