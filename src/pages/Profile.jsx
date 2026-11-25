
import { useState } from "react";

function Profile() {
  const [activeTab, setActiveTab] = useState("Personal Information");

  const [profile, setProfile] = useState({
    name: "Administrator",
    email: "admin@disaster360.com",
    phone: "",
    role: "System Administrator",
    location: "Andhra Pradesh, India",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    disasterAlerts: true,
    soundNotifications: false,
    compactMode: false,
  });

  const [theme, setTheme] = useState("Dark");

  const [saved, setSaved] = useState(false);

  function updateProfile(e) {
    e.preventDefault();
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  }

  function toggleSetting(key) {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  }

  const tabs = [
    "Personal Information",
    "Preferences",
    "Appearance",
  ];

  return (
    <div className="profile-page">
      <div className="profile-page-heading">
        <div>
          <p className="profile-page-label">ACCOUNT MANAGEMENT</p>
          <h1>Profile & Settings</h1>
          <p>Manage your account and application preferences.</p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar-card">
          <div className="profile-large-avatar">A</div>
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          <span className="profile-role">{profile.role}</span>

          <div className="profile-side-info">
            <div>
              <span>📍</span>
              {profile.location}
            </div>
            <div>
              <span>🛡️</span>
              Verified demo role
            </div>
          </div>
        </div>

        <div className="profile-settings-panel">
          <div className="profile-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={
                  activeTab === tab
                    ? "profile-tab active"
                    : "profile-tab"
                }
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Personal Information" && (
            <form
              className="profile-form"
              onSubmit={updateProfile}
            >
              <h2>Personal Information</h2>
              <p>Update your administrator profile details.</p>

              <label>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value,
                  })
                }
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value,
                  })
                }
                required
              />

              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone: e.target.value,
                  })
                }
              />

              <label>Role</label>
              <input
                type="text"
                value={profile.role}
                disabled
              />

              <label>Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    location: e.target.value,
                  })
                }
              />

              <button className="profile-save-btn" type="submit">
                Save Changes
              </button>

              {saved && (
                <p className="profile-success">
                  ✓ Profile changes saved in this session!
                </p>
              )}
            </form>
          )}

          {activeTab === "Preferences" && (
            <div className="profile-preferences">
              <h2>Notification Preferences</h2>
              <p>Choose how you want to receive notifications.</p>

              {[
                {
                  key: "emailNotifications",
                  title: "Email Notifications",
                  description: "Receive general account updates.",
                },
                {
                  key: "disasterAlerts",
                  title: "Disaster Alerts",
                  description: "Show disaster-related notifications.",
                },
                {
                  key: "soundNotifications",
                  title: "Sound Notifications",
                  description: "Enable notification sound preferences.",
                },
                {
                  key: "compactMode",
                  title: "Compact Mode",
                  description: "Use a more compact display preference.",
                },
              ].map((item) => (
                <div className="preference-item" key={item.key}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>

                  <button
                    type="button"
                    className={
                      settings[item.key]
                        ? "setting-toggle enabled"
                        : "setting-toggle"
                    }
                    onClick={() => toggleSetting(item.key)}
                    aria-label={`Toggle ${item.title}`}
                    aria-pressed={settings[item.key]}
                  >
                    <span></span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Appearance" && (
            <div className="profile-appearance">
              <h2>Appearance Settings</h2>
              <p>Choose your preferred dashboard appearance.</p>

              <div className="theme-options">
                <button
                  className={
                    theme === "Dark"
                      ? "theme-option selected"
                      : "theme-option"
                  }
                  onClick={() => setTheme("Dark")}
                >
                  <div className="theme-preview dark-preview">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h4>Dark Theme</h4>
                  <p>Current dashboard style</p>
                </button>

                <button
                  className={
                    theme === "Light"
                      ? "theme-option selected"
                      : "theme-option"
                  }
                  onClick={() => setTheme("Light")}
                >
                  <div className="theme-preview light-preview">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h4>Light Theme</h4>
                  <p>Light appearance preference</p>
                </button>
              </div>

              <p className="theme-note">
                Selected theme: <strong>{theme}</strong>.
                Theme preference selection is currently a demo;
                the complete website theme will be connected later.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="profile-disclaimer">
        Demo profile: Changes are held in React state and will reset
        when the page is refreshed. Account authentication and
        permanent profile storage are not implemented.
      </div>
    </div>
  );
}

export default Profile;
