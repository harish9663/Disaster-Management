
import { useEffect, useState } from "react";
import "./CitizenMyReports.css";

const API_URL = "http://localhost:5000/api/reports";

function CitizenMyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  async function loadReports() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load reports.");
      }

      const data = await response.json();

      setReports(Array.isArray(data) ? data : data.reports || []);
    } catch (err) {
      setError(
        "Could not connect to the reports server. Please check whether your backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (report.title || "").toLowerCase().includes(searchText) ||
      (report.location || "").toLowerCase().includes(searchText) ||
      String(report.id || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      (report.status || "Submitted") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function getStatusClass(status) {
    switch (status) {
      case "Verified":
        return "verified";
      case "Resolved":
        return "resolved";
      case "Under Review":
        return "review";
      default:
        return "submitted";
    }
  }

  function formatDate(date) {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return (
    <div className="citizen-my-reports">

      <div className="my-reports-heading">
        <div>
          <h1>My Reports</h1>
          <p>View and track submitted disaster incident reports.</p>
        </div>

        <button onClick={loadReports} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      <div className="my-reports-stats">
        <div>
          <span>📋</span>
          <h2>{reports.length}</h2>
          <p>Total Reports</p>
        </div>

        <div>
          <span>⏳</span>
          <h2>
            {reports.filter((r) =>
              ["Submitted", "Pending", "Under Review", "Pending Verification"]
                .includes(r.status || "Submitted")
            ).length}
          </h2>
          <p>Pending Review</p>
        </div>

        <div>
          <span>✅</span>
          <h2>
            {reports.filter((r) =>
              ["Verified", "Resolved"].includes(r.status)
            ).length}
          </h2>
          <p>Verified / Resolved</p>
        </div>
      </div>

      <div className="my-reports-filters">

        <input
          type="text"
          placeholder="Search by report title, ID or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Pending Verification">Pending Verification</option>
          <option value="Verified">Verified</option>
          <option value="Resolved">Resolved</option>
        </select>

      </div>

      {error && (
        <div className="my-reports-error">
          {error}
          <button onClick={loadReports}>Try Again</button>
        </div>
      )}

      {loading ? (
        <div className="my-reports-empty">
          Loading your reports...
        </div>
      ) : (
        <>
          <div className="my-reports-list-heading">
            <h2>Submitted Incident Reports</h2>
            <span>{filteredReports.length} reports</span>
          </div>

          {filteredReports.length === 0 ? (
            <div className="my-reports-empty">
              <span>📄</span>
              <h3>No reports found</h3>
              <p>
                {reports.length === 0
                  ? "You haven't submitted any reports yet."
                  : "Try changing your search or status filter."}
              </p>
            </div>
          ) : (
            <div className="my-reports-table-wrapper">
              <table className="my-reports-table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Incident</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report, index) => (
                    <tr key={report.id || index}>
                      <td>{report.id || "Not available"}</td>
                      <td>{report.title || report.type || "Incident"}</td>
                      <td>{report.location || "Not available"}</td>
                      <td>{formatDate(report.date || report.createdAt)}</td>
                      <td>
                        <span
                          className={`report-status ${getStatusClass(report.status)}`}
                        >
                          {report.status || "Submitted"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="report-view-btn"
                          onClick={() => setSelectedReport(report)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {selectedReport && (
        <div
          className="report-modal-overlay"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="report-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="report-modal-heading">
              <h2>Report Details</h2>
              <button onClick={() => setSelectedReport(null)}>
                ✕
              </button>
            </div>

            <div className="report-modal-content">
              <p><strong>Report ID:</strong> {selectedReport.id || "N/A"}</p>
              <p><strong>Title:</strong> {selectedReport.title || "N/A"}</p>
              <p><strong>Type:</strong> {selectedReport.type || "N/A"}</p>
              <p><strong>Severity:</strong> {selectedReport.severity || "N/A"}</p>
              <p><strong>Location:</strong> {selectedReport.location || "N/A"}</p>
              <p><strong>Status:</strong> {selectedReport.status || "Submitted"}</p>
              <p>
                <strong>Submitted:</strong>{" "}
                {formatDate(selectedReport.date || selectedReport.createdAt)}
              </p>

              <p>
                <strong>Description:</strong>
                <br />
                {selectedReport.description || "No description available."}
              </p>

              {selectedReport.photo && (
                <img
                  className="report-detail-photo"
                  src={
                    selectedReport.photo.startsWith("http")
                      ? selectedReport.photo
                      : `http://localhost:5000${selectedReport.photo}`
                  }
                  alt="Reported incident"
                />
              )}
            </div>

            <button
              className="report-modal-close"
              onClick={() => setSelectedReport(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default CitizenMyReports;
