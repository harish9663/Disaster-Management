
import { Link } from "react-router-dom";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dashboard() {

  // Demonstration disaster statistics
  const statistics = [
    {
      title: "Active Disasters",
      number: "12",
      change: "Sample data",
      icon: "⚠",
      color: "red",
    },
    {
      title: "High Risk Areas",
      number: "05",
      change: "Sample assessment",
      icon: "◎",
      color: "orange",
    },
    {
      title: "Reports Received",
      number: "248",
      change: "Demo reports",
      icon: "▤",
      color: "blue",
    },
    {
      title: "Response Teams",
      number: "36",
      change: "Demo availability",
      icon: "✚",
      color: "green",
    },
  ];

  // Sample activity chart data
  const activityData = [
    { day: "Mon", incidents: 12 },
    { day: "Tue", incidents: 18 },
    { day: "Wed", incidents: 14 },
    { day: "Thu", incidents: 25 },
    { day: "Fri", incidents: 20 },
    { day: "Sat", incidents: 30 },
    { day: "Sun", incidents: 24 },
  ];

  // Sample risk distribution
  const riskData = [
    { name: "High Risk", value: 5, color: "#ef4444" },
    { name: "Medium Risk", value: 8, color: "#f59e0b" },
    { name: "Low Risk", value: 12, color: "#22c55e" },
  ];

  // Sample recent incidents
  const recentIncidents = [
    {
      id: 1,
      name: "Flood Warning",
      location: "Vijayawada",
      severity: "High",
      status: "Monitoring",
    },
    {
      id: 2,
      name: "Cyclone Warning",
      location: "Visakhapatnam",
      severity: "Medium",
      status: "Under Review",
    },
    {
      id: 3,
      name: "Fire Alert",
      location: "Hyderabad",
      severity: "High",
      status: "Monitoring",
    },
    {
      id: 4,
      name: "Earthquake Report",
      location: "Delhi",
      severity: "Low",
      status: "Reviewed",
    },
  ];

  return (
    <div className="dashboard">

      {/* Welcome Section */}

      <div className="welcome-section">
        <div>
          <span className="dashboard-label">
            EMERGENCY MONITORING SYSTEM
          </span>

          <h1>Disaster Overview</h1>

          <p>
            Monitor disaster activity, risk levels and emergency reports
            from one place.
          </p>
        </div>

        <Link to="/report" className="report-button">
          + Report Disaster
        </Link>
      </div>


      {/* Statistics Cards */}

      <div className="stats-grid">

        {statistics.map((item) => (
          <div className="stat-card" key={item.title}>

            <div className="stat-top">
              <div className={`stat-icon ${item.color}`}>
                {item.icon}
              </div>

              <span className="stat-menu">•••</span>
            </div>

            <p>{item.title}</p>

            <h2>{item.number}</h2>

            <span className="stat-change">
              {item.change}
            </span>

          </div>
        ))}

      </div>


      {/* Main Charts */}

      <div className="analytics-grid">

        {/* Activity Chart */}

        <div className="panel chart-panel">

          <div className="panel-heading">
            <div>
              <h2>Disaster Activity</h2>
              <p>Sample incident activity over seven days</p>
            </div>

            <span className="chart-tag">7 Days</span>
          </div>

          <div className="chart-container">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={activityData}>

                <defs>
                  <linearGradient
                    id="activityColor"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#3b82f6"
                      stopOpacity={0.4}
                    />

                    <stop
                      offset="95%"
                      stopColor="#3b82f6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#26344a"
                />

                <XAxis
                  dataKey="day"
                  stroke="#8999b2"
                />

                <YAxis
                  stroke="#8999b2"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111c2f",
                    border: "1px solid #30425d",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="incidents"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#activityColor)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* Risk Chart */}

        <div className="panel risk-panel">

          <div className="panel-heading">
            <div>
              <h2>Risk Distribution</h2>
              <p>Sample risk category breakdown</p>
            </div>
          </div>

          <div className="pie-container">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={riskData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                >

                  {riskData.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                    />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

          <div className="risk-legend">

            {riskData.map((item) => (
              <div className="legend-item" key={item.name}>
                <span
                  className="legend-dot"
                  style={{ backgroundColor: item.color }}
                ></span>

                <span>{item.name}</span>

                <strong>{item.value}</strong>
              </div>
            ))}

          </div>

        </div>

      </div>


      {/* Recent Incident Table */}

      <div className="panel incident-panel">

        <div className="panel-heading">

          <div>
            <h2>Recent Incident Reports</h2>
            <p>Sample incident monitoring records</p>
          </div>

          <Link to="/alerts">View All</Link>

        </div>

        <div className="table-wrapper">

          <table className="incident-table">

            <thead>
              <tr>
                <th>Incident</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {recentIncidents.map((incident) => (
                <tr key={incident.id}>

                  <td>{incident.name}</td>

                  <td>{incident.location}</td>

                  <td>
                    <span className={`risk ${incident.severity.toLowerCase()}`}>
                      {incident.severity}
                    </span>
                  </td>

                  <td>
                    <span className="incident-status">
                      {incident.status}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* Quick Access */}

      <div className="quick-access-section">

        <h2>Emergency Quick Access</h2>

        <p>Access important disaster management services.</p>

        <div className="quick-access-grid">

          <Link to="/map" className="quick-card">
            <span>🌍</span>
            <h3>Disaster Map</h3>
            <p>Explore sample disaster locations</p>
          </Link>

          <Link to="/contacts" className="quick-card">
            <span>☎</span>
            <h3>Emergency Contacts</h3>
            <p>Access emergency helpline numbers</p>
          </Link>

          <Link to="/safety" className="quick-card">
            <span>🛡️</span>
            <h3>Safety Guidelines</h3>
            <p>Learn emergency safety procedures</p>
          </Link>

          <Link to="/report" className="quick-card">
            <span>📋</span>
            <h3>Report Incident</h3>
            <p>Submit a disaster report</p>
          </Link>

        </div>

      </div>


      {/* Demo Notice */}

      <div className="data-notice">
        <strong>Demonstration mode:</strong> All dashboard statistics,
        charts and incident records are sample data. They are not
        verified live disaster information.
      </div>

    </div>
  );
}

export default Dashboard;
