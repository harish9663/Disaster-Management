
import { useEffect, useState } from "react";
import "./CitizenProfile.css";

const PROFILE_KEY = "disaster360_citizen_profile";
const LOCATION_KEY = "disaster360_user_location";

const emptyProfile = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  emergencyName: "",
  emergencyPhone: ""
};

function CitizenProfile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [location, setLocation] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_KEY);
      const savedLocation = localStorage.getItem(LOCATION_KEY);

      if (savedProfile) {
        setProfile({
          ...emptyProfile,
          ...JSON.parse(savedProfile)
        });
      }

      if (savedLocation) {
        setLocation(JSON.parse(savedLocation));
      }
    } catch {
      setMessage("Unable to load saved profile information.");
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function saveProfile(e) {
    e.preventDefault();

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

    setEditing(false);
    setMessage("Your profile has been saved successfully.");

    setTimeout(() => setMessage(""), 3000);
  }

  function cancelEditing() {
    const savedProfile = localStorage.getItem(PROFILE_KEY);

    setProfile(
      savedProfile
        ? { ...emptyProfile, ...JSON.parse(savedProfile) }
        : emptyProfile
    );

    setEditing(false);
    setMessage("");
  }

  function clearProfile() {
    const confirmed = window.confirm(
      "Are you sure you want to clear your profile details?"
    );

    if (!confirmed) return;

    localStorage.removeItem(PROFILE_KEY);
    setProfile(emptyProfile);
    setEditing(false);
    setMessage("Profile details have been cleared.");
  }

  return (
    <div className="citizen-profile-page">

      <div className="citizen-profile-header">
        <div>
          <span className="profile-eyebrow">ACCOUNT SETTINGS</span>
          <h1>My Profile</h1>
          <p>Manage your personal information and emergency contact.</p>
        </div>
      </div>

      {message && (
        <div className="profile-message">
          {message}
        </div>
      )}

      <div className="profile-main-card">

        <div className="profile-user-heading">
          <div className="profile-avatar">
            {profile.fullName
              ? profile.fullName.trim().charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <h2>{profile.fullName || "Citizen User"}</h2>
            <p>{profile.email || "Add your email address"}</p>
            <span className="profile-account-label">
              Disaster360 Citizen
            </span>
          </div>
        </div>

        <div className="profile-card-divider"></div>

        <form onSubmit={saveProfile}>

          <div className="profile-section-title">
            <h3>Personal Information</h3>

            {!editing && (
              <button
                type="button"
                className="profile-edit-button"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="profile-form-grid">

            <div className="profile-form-field">
              <label>Full Name</label>
              <input
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={!editing}
                required
              />
            </div>

            <div className="profile-form-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={!editing}
              />
            </div>

            <div className="profile-form-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                disabled={!editing}
              />
            </div>

            <div className="profile-form-field">
              <label>City / District</label>
              <input
                name="city"
                value={profile.city}
                onChange={handleChange}
                placeholder="Enter your city"
                disabled={!editing}
              />
            </div>

            <div className="profile-form-field profile-full-width">
              <label>Address</label>
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Enter your address"
                disabled={!editing}
                rows="3"
              />
            </div>

          </div>

          <div className="profile-card-divider"></div>

          <div className="profile-section-title">
            <h3>Emergency Contact</h3>
          </div>

          <p className="profile-section-description">
            Add someone who can be contacted during an emergency.
          </p>

          <div className="profile-form-grid">

            <div className="profile-form-field">
              <label>Contact Person Name</label>
              <input
                name="emergencyName"
                value={profile.emergencyName}
                onChange={handleChange}
                placeholder="Emergency contact name"
                disabled={!editing}
              />
            </div>

            <div className="profile-form-field">
              <label>Emergency Contact Number</label>
              <input
                type="tel"
                name="emergencyPhone"
                value={profile.emergencyPhone}
                onChange={handleChange}
                placeholder="Emergency contact number"
                disabled={!editing}
              />
            </div>

          </div>

          {editing && (
            <div className="profile-form-actions">
              <button type="button" onClick={cancelEditing}>
                Cancel
              </button>

              <button type="submit" className="profile-save-button">
                Save Profile
              </button>
            </div>
          )}

        </form>

      </div>

      <div className="profile-main-card profile-location-card">
        <div>
          <span className="profile-eyebrow">LOCATION SETTINGS</span>
          <h3>Saved Disaster Alert Location</h3>

          {location ? (
            <>
              <p>{location.name}</p>
              <small>
                Alert radius: {location.radiusKm || 10} km
              </small>
            </>
          ) : (
            <p>No location saved yet.</p>
          )}
        </div>

        <a href="/citizen/location">
          Manage Location →
        </a>
      </div>

      <div className="profile-danger-zone">
        <div>
          <h3>Clear Profile Details</h3>
          <p>
            This removes the profile information saved in this browser.
            It does not delete your location settings.
          </p>
        </div>

        <button onClick={clearProfile}>
          Clear Profile
        </button>
      </div>

      <div className="profile-privacy-note">
        <strong>Privacy:</strong> This beginner version saves profile
        information in your browser only. It is not yet connected to
        user accounts or a secure backend.
      </div>

    </div>
  );
}

export default CitizenProfile;
