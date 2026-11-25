
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/reports";

function ReportDisaster() {
  const [form, setForm] = useState({
    title: "",
    type: "Flood",
    severity: "Medium",
    location: "",
    description: ""
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [reports, setReports] = useState([]);

  // Clean up photo preview URL
  useEffect(() => {
    if (!photo) {
      setPreview("");
      return;
    }

    const imageURL = URL.createObjectURL(photo);
    setPreview(imageURL);

    return () => URL.revokeObjectURL(imageURL);
  }, [photo]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handlePhoto(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be below 5 MB.");
      return;
    }

    setError("");
    setPhoto(file);
  }

  // Capture GPS location
  function getMyLocation() {
    if (!navigator.geolocation) {
      setError("Your browser does not support GPS.");
      return;
    }

    setMessage("Getting your location...");
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

        setMessage("GPS location captured successfully.");
      },
      () => {
        setMessage("");
        setError("Unable to access location. Check browser permissions.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  }

  // Load previously submitted reports
  async function loadReports() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load reports.");
      }

      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      console.log("Report history is not available yet.");
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  // Submit report to backend
  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("type", form.type);
      formData.append("severity", form.severity);
      formData.append("location", form.location);
      formData.append("description", form.description);

      if (photo) {
        formData.append("photo", photo);
      }

      if (userLocation) {
        formData.append("latitude", userLocation.latitude);
        formData.append("longitude", userLocation.longitude);
      }

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Report submission failed.");
      }

      setMessage(
        `Report submitted successfully! Report ID: ${data.report.id}`
      );

      setForm({
        title: "",
        type: "Flood",
        severity: "Medium",
        location: "",
        description: ""
      });

      setPhoto(null);
      setUserLocation(null);

      await loadReports();

    } catch (err) {
      setError(
        err.message || "Unable to submit report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="report-page">

      <div className="report-heading">
        <p className="dashboard-label">CITIZEN EMERGENCY SERVICES</p>

        <h1>Report an Incident</h1>

        <p>
          Help emergency response teams understand incidents
          happening in your area.
        </p>
      </div>

      <div className="report-layout">

        <div className="report-form-panel">

          <h2>Incident Information</h2>

          <p>Provide accurate information about the incident.</p>

          <form onSubmit={handleSubmit}>

            <label>Incident Title</label>

            <input
              type="text"
              name="title"
              placeholder="Example: Heavy rainfall in Vijayawada"
              value={form.title}
              onChange={handleChange}
              maxLength={120}
              required
            />

            <div className="report-form-row">

              <div>
                <label>Disaster Type</label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option>Flood</option>
                  <option>Cyclone</option>
                  <option>Earthquake</option>
                  <option>Fire</option>
                  <option>Landslide</option>
                  <option>Accident</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label>Estimated Severity</label>

                <select
                  name="severity"
                  value={form.severity}
                  onChange={handleChange}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

            </div>

            <small className="report-field-note">
              Severity is your estimate. Authorities must verify it.
            </small>

            <label>Incident Location</label>

            <input
              type="text"
              name="location"
              placeholder="Enter area, city or district"
              value={form.location}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="my-location-button"
              onClick={getMyLocation}
            >
              ◎ Use My Current GPS Location
            </button>

            {userLocation && (
              <p className="report-field-note">
                GPS: {userLocation.latitude.toFixed(5)},
                {" "}{userLocation.longitude.toFixed(5)}
              </p>
            )}

            <label>Incident Description</label>

            <textarea
              name="description"
              placeholder="Explain what happened, when it happened, and whether anyone needs help..."
              value={form.description}
              onChange={handleChange}
              rows="5"
              maxLength={2000}
              required
            />

            <label>Upload Incident Photo</label>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhoto}
            />

            {preview && (
              <div className="photo-preview">
                <img src={preview} alt="Incident preview" />

                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                >
                  Remove Photo
                </button>
              </div>
            )}

            {message && (
              <div className="report-success-message">
                {message}
              </div>
            )}

            {error && (
              <div className="report-error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="submit-report-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Incident Report"}
            </button>

          </form>

        </div>

        <div className="report-side-panel">

          <h2>Reporting Guidelines</h2>

          <div className="guideline-item">
            <span>01</span>
            <div>
              <h3>Accurate Information</h3>
              <p>Provide the correct incident location and details.</p>
            </div>
          </div>

          <div className="guideline-item">
            <span>02</span>
            <div>
              <h3>Choose Incident Type</h3>
              <p>Select the disaster category and estimated severity.</p>
            </div>
          </div>

          <div className="guideline-item">
            <span>03</span>
            <div>
              <h3>Share GPS Location</h3>
              <p>GPS can help responders identify the reported area.</p>
            </div>
          </div>

          <div className="guideline-item">
            <span>04</span>
            <div>
              <h3>Upload Evidence</h3>
              <p>Upload a photo only when it is safe.</p>
            </div>
          </div>

          <div className="report-warning">
            <strong>Emergency?</strong>
            <p>
              Call 112 in India for immediate emergency assistance.
              Do not wait for this report to be processed.
            </p>
          </div>

        </div>

      </div>

      <div className="report-history-panel">

        <h2>My Submitted Reports</h2>

        {reports.length === 0 ? (
          <p className="empty-reports">
            No submitted reports found.
          </p>
        ) : (

          <div className="table-wrapper">

            <table className="incident-table">

              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.title}</td>
                    <td>{report.type}</td>
                    <td>{report.location}</td>
                    <td>
                      <span className="incident-status pending">
                        {report.status}
                      </span>
                    </td>
                    <td>
                      {report.date
                        ? new Date(report.date).toLocaleString()
                        : "Not available"}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default ReportDisaster;
