
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

const monthlyData = [
  { month: "Jan", incidents: 35 },
  { month: "Feb", incidents: 48 },
  { month: "Mar", incidents: 30 },
  { month: "Apr", incidents: 65 },
  { month: "May", incidents: 52 },
  { month: "Jun", incidents: 80 },
  { month: "Jul", incidents: 60 },
  { month: "Aug", incidents: 95 },
  { month: "Sep", incidents: 72 },
  { month: "Oct", incidents: 88 },
  { month: "Nov", incidents: 55 },
  { month: "Dec", incidents: 40 }
];

const disasterData = [
  { name: "Flood", value: 40 },
  { name: "Cyclone", value: 20 },
  { name: "Fire", value: 15 },
  { name: "Earthquake", value: 10 },
  { name: "Other", value: 15 }
];

const regionalData = [
  { region: "Andhra Pradesh", incidents: 85 },
  { region: "Telangana", incidents: 65 },
  { region: "Delhi", incidents: 45 },
  { region: "Odisha", incidents: 72 },
  { region: "Kerala", incidents: 55 }
];

const COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6"
];

function Analytics() {
  return (
    <div className="analytics-page">

      <div className="analytics-heading">
        <div>
          <p className="dashboard-label">DISASTER INTELLIGENCE</p>
          <h1>Analytics & Reports</h1>
          <p>Understand disaster patterns and regional risk trends.</p>
        </div>

        <span className="analytics-demo-label">DEMO ANALYTICS</span>
      </div>

      <div className="analytics-kpi-grid">

        <div className="analytics-kpi">
          <span>📊</span>
          <p>Total Incidents</p>
          <h2>248</h2>
          <small>Sample annual records</small>
        </div>

        <div className="analytics-kpi">
          <span>⚠️</span>
          <p>Critical Incidents</p>
          <h2>18</h2>
          <small>Sample records</small>
        </div>

        <div className="analytics-kpi">
          <span>📍</span>
          <p>Regions Monitored</p>
          <h2>05</h2>
          <small>Sample regions</small>
        </div>

        <div className="analytics-kpi">
          <span>🚑</span>
          <p>Response Teams</p>
          <h2>36</h2>
          <small>Illustrative figure</small>
        </div>

      </div>

      <div className="analytics-chart-grid">

        <div className="analytics-chart-panel">
          <h2>Monthly Disaster Trends</h2>
          <p>Sample incident counts across the year</p>

          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#26344d" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="incidents"
                  stroke="#3b82f6"
                  fill="url(#incidentGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-chart-panel">
          <h2>Disaster Distribution</h2>
          <p>Sample incidents by disaster type</p>

          <div className="analytics-pie">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disasterData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={55}
                  paddingAngle={4}
                >
                  {disasterData.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="analytics-legend">
            {disasterData.map((item, index) => (
              <div key={item.name}>
                <span style={{ background: COLORS[index] }} />
                {item.name} — {item.value}%
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="analytics-chart-panel">
        <h2>Regional Incident Comparison</h2>
        <p>Illustrative incident counts by region</p>

        <div className="analytics-regional-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalData}>
              <CartesianGrid stroke="#26344d" strokeDasharray="3 3" />
              <XAxis dataKey="region" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />

              <Bar
                dataKey="incidents"
                fill="#06b6d4"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-insight">
        <h2>Disaster Intelligence Insights</h2>

        <div>
          <span>🌊</span>
          <p>
            Floods represent the largest category in this sample dataset.
            Prioritize flood preparedness in planning exercises.
          </p>
        </div>

        <div>
          <span>📈</span>
          <p>
            Sample monthly incident counts vary throughout the year.
            Compare with verified historical records before drawing conclusions.
          </p>
        </div>

        <div>
          <span>🛡️</span>
          <p>
            Regional comparisons can help identify where additional
            preparedness resources may be needed.
          </p>
        </div>
      </div>

      <p className="analytics-disclaimer">
        All charts, statistics and insights on this page use illustrative
        sample data. They are not official disaster statistics or live reports.
      </p>

    </div>
  );
}

export default Analytics;
