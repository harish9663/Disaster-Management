
import { useState } from "react";

const guides = {
  Flood: {
    icon: "🌊",
    before: [
      "Keep drinking water and emergency food ready.",
      "Identify higher ground and evacuation routes.",
      "Keep important documents in waterproof bags.",
      "Charge your phone and emergency power bank."
    ],
    during: [
      "Move to higher ground immediately.",
      "Stay away from flooded roads and bridges.",
      "Never walk or drive through floodwater.",
      "Follow official evacuation instructions."
    ],
    after: [
      "Return only when authorities say it is safe.",
      "Avoid damaged electrical equipment.",
      "Do not drink potentially contaminated water.",
      "Report damaged infrastructure to authorities."
    ]
  },

  Earthquake: {
    icon: "🌍",
    before: [
      "Secure heavy furniture and shelves.",
      "Prepare an emergency supply kit.",
      "Identify safe places in each room.",
      "Practice Drop, Cover and Hold On."
    ],
    during: [
      "Drop, Cover and Hold On.",
      "Stay away from windows and glass.",
      "Do not use elevators.",
      "If outside, move away from buildings."
    ],
    after: [
      "Expect possible aftershocks.",
      "Leave damaged buildings carefully.",
      "Check for injuries and request assistance.",
      "Avoid damaged structures and utility lines."
    ]
  },

  Cyclone: {
    icon: "🌀",
    before: [
      "Monitor official cyclone warnings.",
      "Prepare food, water and medicines.",
      "Secure loose outdoor objects.",
      "Know your nearest evacuation shelter."
    ],
    during: [
      "Stay indoors and away from windows.",
      "Keep emergency supplies nearby.",
      "Do not go outside during the eye of a cyclone.",
      "Follow evacuation instructions."
    ],
    after: [
      "Wait for official all-clear information.",
      "Avoid fallen electrical wires.",
      "Stay away from damaged buildings.",
      "Use safe drinking water."
    ]
  },

  Fire: {
    icon: "🔥",
    before: [
      "Install and maintain smoke alarms.",
      "Know at least two escape routes.",
      "Keep fire extinguishers accessible.",
      "Store flammable materials safely."
    ],
    during: [
      "Raise the alarm and evacuate immediately.",
      "Stay low if there is smoke.",
      "Never use elevators during a fire.",
      "Call emergency services from a safe location."
    ],
    after: [
      "Do not re-enter the burning building.",
      "Wait for fire officials to declare it safe.",
      "Seek medical attention if exposed to smoke.",
      "Report remaining hazards."
    ]
  },

  Landslide: {
    icon: "⛰️",
    before: [
      "Monitor heavy rainfall warnings.",
      "Know the landslide risks in your area.",
      "Avoid building near unstable slopes.",
      "Prepare an emergency evacuation plan."
    ],
    during: [
      "Move away from the landslide path.",
      "Avoid river valleys and low-lying channels.",
      "Follow evacuation instructions.",
      "Warn others if it is safe to do so."
    ],
    after: [
      "Stay away from the affected slope.",
      "Watch for additional landslides.",
      "Avoid damaged roads and bridges.",
      "Wait for official safety clearance."
    ]
  }
};

const kitItems = [
  "Drinking water",
  "Non-perishable food",
  "First aid kit",
  "Flashlight and batteries",
  "Power bank",
  "Essential medicines",
  "Important documents",
  "Emergency contact list",
  "Whistle",
  "Extra clothes and blanket"
];

function SafetyGuidelines() {
  const [disaster, setDisaster] = useState("Flood");
  const [stage, setStage] = useState("before");
  const [checkedItems, setCheckedItems] = useState([]);

  const guide = guides[disaster];

  const instructions = guide[stage];

  function toggleItem(item) {
    setCheckedItems((previous) =>
      previous.includes(item)
        ? previous.filter((value) => value !== item)
        : [...previous, item]
    );
  }

  const progress = Math.round(
    (checkedItems.length / kitItems.length) * 100
  );

  return (
    <div className="safety-page">

      <div className="safety-heading">
        <div>
          <p className="dashboard-label">PREPAREDNESS CENTER</p>
          <h1>Safety & Preparedness</h1>
          <p>Learn how to prepare for disasters and protect your family.</p>
        </div>
        <span className="safety-status">STAY PREPARED</span>
      </div>

      <div className="safety-banner">
        <div>
          <h2>Preparedness Saves Lives</h2>
          <p>
            Understand disaster risks, prepare emergency supplies
            and follow official safety instructions.
          </p>
        </div>
        <span>🛡️</span>
      </div>

      <section className="safety-section">
        <h2>Disaster Safety Guides</h2>
        <p className="safety-subtitle">
          Select a disaster to view its safety instructions.
        </p>

        <div className="disaster-selector">
          {Object.keys(guides).map((item) => (
            <button
              key={item}
              className={disaster === item ? "disaster-option selected" : "disaster-option"}
              onClick={() => setDisaster(item)}
            >
              {guides[item].icon} {item}
            </button>
          ))}
        </div>

        <div className="safety-guide-panel">
          <h2>{guide.icon} {disaster} Safety Instructions</h2>

          <div className="safety-tabs">
            {["before", "during", "after"].map((item) => (
              <button
                key={item}
                className={stage === item ? "safety-tab active" : "safety-tab"}
                onClick={() => setStage(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="safety-instructions">
            {instructions.map((instruction, index) => (
              <div className="safety-instruction" key={index}>
                <span>{index + 1}</span>
                <p>{instruction}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="safety-section">
        <h2>Emergency Kit Checklist</h2>
        <p className="safety-subtitle">
          Select the supplies you already have prepared.
        </p>

        <div className="kit-progress">
          <div className="kit-progress-info">
            <span>Preparation Progress</span>
            <strong>{progress}%</strong>
          </div>

          <div className="kit-progress-track">
            <div
              className="kit-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="kit-grid">
          {kitItems.map((item) => (
            <label className="kit-item" key={item}>
              <input
                type="checkbox"
                checked={checkedItems.includes(item)}
                onChange={() => toggleItem(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>

        <p className="kit-count">
          {checkedItems.length} of {kitItems.length} supplies prepared.
        </p>
      </section>

      <section className="safety-section first-aid-panel">
        <h2>Basic First Aid Information</h2>

        <div className="first-aid-grid">
          <div>
            <span>🩹</span>
            <h3>Minor Wounds</h3>
            <p>
              Use clean water to rinse minor wounds and cover them
              with a sterile dressing. Seek medical help for serious wounds.
            </p>
          </div>

          <div>
            <span>🔥</span>
            <h3>Burns</h3>
            <p>
              Cool a burn under cool running water for 20 minutes.
              Do not apply ice or creams. Seek medical help for serious burns.
            </p>
          </div>

          <div>
            <span>🚑</span>
            <h3>Serious Injuries</h3>
            <p>
              Contact emergency services. Avoid moving someone with
              a suspected serious neck or spinal injury unless there
              is immediate danger.
            </p>
          </div>
        </div>
      </section>

      <div className="safety-disclaimer">
        <strong>Important:</strong> These are general preparedness guidelines,
        not a replacement for professional emergency instructions.
        Follow local authorities and trained medical responders.
        In India, call 112 for immediate emergency assistance.
      </div>

    </div>
  );
}

export default SafetyGuidelines;
