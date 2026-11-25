
import { useState } from "react";

function ResourceCenter() {
  const [activeTab, setActiveTab] = useState("Emergency Kit");
  const [checkedItems, setCheckedItems] = useState([]);

  const emergencyItems = [
    { id: 1, name: "Drinking water", detail: "Water for several days" },
    { id: 2, name: "First aid kit", detail: "Bandages and basic supplies" },
    { id: 3, name: "Flashlight", detail: "With spare batteries" },
    { id: 4, name: "Emergency food", detail: "Non-perishable food items" },
    { id: 5, name: "Power bank", detail: "Keep phones charged" },
    { id: 6, name: "Important documents", detail: "Copies in a waterproof bag" },
    { id: 7, name: "Emergency medicines", detail: "Essential personal medicines" },
    { id: 8, name: "Whistle", detail: "For emergency signalling" },
    { id: 9, name: "Extra clothing", detail: "Comfortable dry clothing" },
    { id: 10, name: "Hygiene supplies", detail: "Soap and sanitizer" },
  ];

  const shelters = [
    {
      name: "Community Relief Center",
      location: "Vijayawada",
      capacity: "Demo capacity: 200",
      facilities: "Water, food and first aid",
    },
    {
      name: "District Emergency Shelter",
      location: "Guntur",
      capacity: "Demo capacity: 150",
      facilities: "Medical support and food",
    },
    {
      name: "Coastal Relief Center",
      location: "Visakhapatnam",
      capacity: "Demo capacity: 250",
      facilities: "Water, medical and rescue support",
    },
    {
      name: "City Relief Shelter",
      location: "Hyderabad",
      capacity: "Demo capacity: 180",
      facilities: "Food and temporary accommodation",
    },
  ];

  const evacuationSteps = [
    "Stay informed through verified official disaster announcements.",
    "Prepare your emergency kit before evacuation becomes necessary.",
    "Keep important documents and medicines with you.",
    "Follow evacuation instructions from local authorities.",
    "Use officially designated evacuation routes.",
    "Avoid flooded roads and damaged buildings.",
    "Help children, older adults and people with disabilities if safe.",
    "Inform family members about your location when possible.",
  ];

  const firstAid = [
    {
      title: "Minor Cuts",
      description:
        "Wash your hands, gently clean the wound and cover it with a clean dressing. Seek medical help for deep or serious wounds.",
    },
    {
      title: "Burns",
      description:
        "Cool the burn under cool running water for 20 minutes. Do not apply ice, butter or toothpaste. Seek medical care for serious burns.",
    },
    {
      title: "Severe Bleeding",
      description:
        "Call emergency services and apply firm, direct pressure using a clean cloth or dressing. Follow emergency dispatcher instructions.",
    },
    {
      title: "Unconscious Person",
      description:
        "Call emergency services immediately. Check breathing and follow dispatcher instructions. Start CPR only if trained or guided.",
    },
  ];

  function toggleItem(id) {
    setCheckedItems((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  const progress = Math.round(
    (checkedItems.length / emergencyItems.length) * 100
  );

  const tabs = [
    "Emergency Kit",
    "Shelter Information",
    "Evacuation Guide",
    "First Aid",
  ];

  return (
    <div className="resource-page">
      <div className="resource-heading">
        <div>
          <p className="resource-label">DISASTER PREPAREDNESS</p>
          <h1>Disaster Resource Center</h1>
          <p>
            Essential information and resources to help you prepare
            for emergencies.
          </p>
        </div>

        <div className="resource-heading-icon">🛡️</div>
      </div>

      <div className="resource-banner">
        <div>
          <span>BE PREPARED. STAY SAFE.</span>
          <h2>Preparation saves lives.</h2>
          <p>
            Learn essential safety steps before an emergency happens.
          </p>
        </div>
        <div className="resource-banner-icon">🚨</div>
      </div>

      <div className="resource-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={
              activeTab === tab ? "resource-tab active" : "resource-tab"
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Emergency Kit" && (
        <div className="resource-panel">
          <div className="resource-panel-heading">
            <div>
              <h2>Emergency Kit Checklist</h2>
              <p>Check the items you have already prepared.</p>
            </div>
            <div className="resource-progress-number">
              {progress}%
            </div>
          </div>

          <div className="resource-progress-track">
            <div
              className="resource-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="resource-progress-text">
            {checkedItems.length} of {emergencyItems.length} items prepared
          </p>

          <div className="resource-kit-grid">
            {emergencyItems.map((item) => (
              <label
                key={item.id}
                className={
                  checkedItems.includes(item.id)
                    ? "resource-kit-item checked"
                    : "resource-kit-item"
                }
              >
                <input
                  type="checkbox"
                  checked={checkedItems.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                />

                <div>
                  <h4>{item.name}</h4>
                  <p>{item.detail}</p>
                </div>
              </label>
            ))}
          </div>

          <button
            className="resource-reset-btn"
            onClick={() => setCheckedItems([])}
          >
            Reset Checklist
          </button>
        </div>
      )}

      {activeTab === "Shelter Information" && (
        <div className="resource-panel">
          <h2>Emergency Shelter Information</h2>
          <p>
            Example shelter cards for demonstrating the interface.
          </p>

          <div className="resource-shelter-grid">
            {shelters.map((shelter, index) => (
              <div className="resource-shelter-card" key={index}>
                <div className="resource-shelter-icon">🏠</div>
                <h3>{shelter.name}</h3>
                <p>📍 {shelter.location}</p>
                <p>👥 {shelter.capacity}</p>
                <p>✚ {shelter.facilities}</p>
                <span className="resource-demo-tag">DEMO DATA</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Evacuation Guide" && (
        <div className="resource-panel">
          <h2>Emergency Evacuation Guide</h2>
          <p>General steps to help you prepare for evacuation.</p>

          <div className="resource-steps">
            {evacuationSteps.map((step, index) => (
              <div className="resource-step" key={index}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div className="resource-warning">
            Always follow instructions from local emergency
            authorities. Do not use unverified routes or shelter locations.
          </div>
        </div>
      )}

      {activeTab === "First Aid" && (
        <div className="resource-panel">
          <h2>Basic First Aid Information</h2>
          <p>
            General first-aid awareness. Serious injuries require
            professional medical assistance.
          </p>

          <div className="resource-firstaid-grid">
            {firstAid.map((item, index) => (
              <div className="resource-firstaid-card" key={index}>
                <span>✚</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="resource-emergency">
        <div>
          <h3>Need Emergency Assistance?</h3>
          <p>
            In India, call 112 for immediate emergency assistance.
          </p>
        </div>
        <a href="tel:112">Call 112</a>
      </div>

      <div className="resource-disclaimer">
        IMPORTANT: Shelter names, locations and capacities displayed
        here are fictional demonstration data, not verified operating
        shelters. Confirm real shelter availability and evacuation
        instructions with local authorities. First-aid guidance is
        general information and is not a substitute for professional care.
      </div>
    </div>
  );
}

export default ResourceCenter;
