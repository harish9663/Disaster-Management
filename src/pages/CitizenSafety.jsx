
import { useState } from "react";
import "./CitizenSafety.css";

const safetyGuides = [
  {
    id: "flood",
    title: "Flood Safety",
    icon: "🌊",
    color: "blue",
    description: "Stay safe during heavy rainfall and flooding.",
    before: [
      "Monitor official weather alerts and flood warnings.",
      "Keep drinking water, food, medicines and emergency supplies ready.",
      "Move important documents and electrical appliances to higher places.",
      "Identify safe higher-ground locations and evacuation routes."
    ],
    during: [
      "Move to higher ground when flooding threatens.",
      "Never walk or drive through floodwater.",
      "Switch off electricity only if it is safe to do so.",
      "Avoid touching electrical equipment in wet areas.",
      "Follow evacuation instructions from local authorities."
    ],
    after: [
      "Return home only when authorities say it is safe.",
      "Avoid floodwater because it may contain sewage and dangerous objects.",
      "Do not use electrical appliances until they are checked.",
      "Drink safe or boiled water."
    ]
  },
  {
    id: "cyclone",
    title: "Cyclone Safety",
    icon: "🌀",
    color: "purple",
    description: "Prepare for strong winds, heavy rain and storm surges.",
    before: [
      "Follow official cyclone warnings and evacuation instructions.",
      "Keep emergency food, water, medicines and a torch ready.",
      "Secure loose outdoor objects and close windows and doors.",
      "Charge mobile phones and power banks.",
      "Know the nearest designated cyclone shelter."
    ],
    during: [
      "Stay inside a strong building and away from windows.",
      "Do not go outside during the apparent calm of the cyclone eye.",
      "Stay away from coastal areas and flooded roads.",
      "Keep listening to official weather updates.",
      "Evacuate if instructed by authorities."
    ],
    after: [
      "Wait for official confirmation before going outside.",
      "Avoid fallen power lines and damaged buildings.",
      "Use safe drinking water.",
      "Report damaged roads and dangerous conditions."
    ]
  },
  {
    id: "earthquake",
    title: "Earthquake Safety",
    icon: "🏚️",
    color: "orange",
    description: "Protect yourself during ground shaking.",
    before: [
      "Identify safe spots under sturdy tables.",
      "Secure heavy furniture and shelves.",
      "Keep an emergency kit accessible.",
      "Know how to switch off gas and electricity safely."
    ],
    during: [
      "DROP to your hands and knees.",
      "COVER your head and neck under sturdy furniture.",
      "HOLD ON until shaking stops.",
      "Stay away from windows and heavy objects.",
      "If outdoors, move away from buildings and power lines."
    ],
    after: [
      "Expect aftershocks and move carefully.",
      "Check yourself and others for injuries.",
      "Do not enter damaged buildings.",
      "Use stairs instead of lifts.",
      "Follow official rescue and evacuation instructions."
    ]
  },
  {
    id: "fire",
    title: "Fire Safety",
    icon: "🔥",
    color: "red",
    description: "Reduce fire risks and respond safely to fires.",
    before: [
      "Keep fire exits and escape routes clear.",
      "Install and maintain smoke alarms.",
      "Check electrical wiring and appliances.",
      "Keep suitable fire extinguishers accessible.",
      "Practice an evacuation plan."
    ],
    during: [
      "Raise the alarm and call emergency services.",
      "Leave immediately using safe escape routes.",
      "Stay low under smoke.",
      "Never use lifts during a fire.",
      "Do not re-enter a burning building."
    ],
    after: [
      "Do not enter the building until authorities declare it safe.",
      "Seek medical help for burns or smoke inhalation.",
      "Report damaged electrical and gas systems.",
      "Follow instructions from firefighters."
    ]
  },
  {
    id: "landslide",
    title: "Landslide Safety",
    icon: "⛰️",
    color: "green",
    description: "Stay alert in hilly areas during heavy rainfall.",
    before: [
      "Watch for official landslide warnings.",
      "Learn whether your area is landslide-prone.",
      "Observe unusual cracks in the ground or walls.",
      "Keep an emergency evacuation plan ready."
    ],
    during: [
      "Move away from the path of a landslide if safe to do so.",
      "Avoid river valleys and slopes during heavy rainfall.",
      "Do not cross active landslide debris.",
      "Follow evacuation instructions immediately."
    ],
    after: [
      "Stay away from the affected slope.",
      "Watch for additional landslides and debris flows.",
      "Report damaged roads and infrastructure.",
      "Return only after authorities declare the area safe."
    ]
  }
];

const emergencyKit = [
  "Drinking water",
  "Dry food and snacks",
  "First aid kit",
  "Regular medicines",
  "Torch and spare batteries",
  "Power bank",
  "Battery-powered radio",
  "Important document copies in waterproof bags",
  "Whistle",
  "Extra clothes and basic hygiene supplies"
];

function CitizenSafety() {
  const [activeGuide, setActiveGuide] = useState(null);
  const [activeTab, setActiveTab] = useState("before");
  const [checkedItems, setCheckedItems] = useState([]);

  function toggleItem(item) {
    setCheckedItems((previous) =>
      previous.includes(item)
        ? previous.filter((value) => value !== item)
        : [...previous, item]
    );
  }

  return (
    <div className="citizen-safety">

      <div className="safety-heading">
        <div>
          <h1>Safety Center</h1>
          <p>
            Learn how to prepare for disasters and protect yourself and your family.
          </p>
        </div>
        <span className="safety-heading-icon">🛡️</span>
      </div>

      <div className="safety-emergency-banner">
        <div>
          <h2>Emergency Help</h2>
          <p>
            If you are in immediate danger, contact emergency services.
          </p>
        </div>

        <a href="tel:112">Call 112</a>
      </div>

      <h2 className="safety-section-title">
        Disaster Safety Guidelines
      </h2>

      <div className="safety-guide-grid">
        {safetyGuides.map((guide) => (
          <button
            key={guide.id}
            className={`safety-guide-card ${guide.color}`}
            onClick={() => {
              setActiveGuide(guide);
              setActiveTab("before");
            }}
          >
            <span className="safety-guide-icon">{guide.icon}</span>
            <h3>{guide.title}</h3>
            <p>{guide.description}</p>
            <span className="safety-read-more">Read Guidelines →</span>
          </button>
        ))}
      </div>

      {activeGuide && (
        <div className="safety-guide-details">
          <div className="safety-detail-heading">
            <div>
              <h2>
                {activeGuide.icon} {activeGuide.title}
              </h2>
              <p>{activeGuide.description}</p>
            </div>

            <button
              className="safety-close-btn"
              onClick={() => setActiveGuide(null)}
            >
              ✕
            </button>
          </div>

          <div className="safety-tabs">
            <button
              className={activeTab === "before" ? "active" : ""}
              onClick={() => setActiveTab("before")}
            >
              Before
            </button>

            <button
              className={activeTab === "during" ? "active" : ""}
              onClick={() => setActiveTab("during")}
            >
              During
            </button>

            <button
              className={activeTab === "after" ? "active" : ""}
              onClick={() => setActiveTab("after")}
            >
              After
            </button>
          </div>

          <ul className="safety-instructions">
            {activeGuide[activeTab].map((instruction, index) => (
              <li key={index}>
                <span>✓</span>
                {instruction}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="safety-kit-section">
        <div>
          <h2>🎒 Emergency Kit Checklist</h2>
          <p>Prepare these essential items before an emergency.</p>
        </div>

        <div className="safety-progress">
          {checkedItems.length} / {emergencyKit.length} items ready
        </div>

        <div className="safety-progress-track">
          <div
            style={{
              width: `${(checkedItems.length / emergencyKit.length) * 100}%`
            }}
          />
        </div>

        <div className="safety-checklist">
          {emergencyKit.map((item) => (
            <label key={item} className="safety-check-item">
              <input
                type="checkbox"
                checked={checkedItems.includes(item)}
                onChange={() => toggleItem(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>

        <button
          className="safety-reset-btn"
          onClick={() => setCheckedItems([])}
        >
          Reset Checklist
        </button>
      </div>

      <div className="safety-first-aid">
        <h2>🩹 Basic First Aid Reminders</h2>

        <div className="first-aid-grid">
          <div>
            <h3>Burns</h3>
            <p>
              Cool the burn under cool running water for 20 minutes.
              Do not apply ice, butter or creams. Seek medical help for serious burns.
            </p>
          </div>

          <div>
            <h3>Severe Bleeding</h3>
            <p>
              Apply firm, direct pressure with clean cloth or dressing
              and seek emergency medical assistance.
            </p>
          </div>

          <div>
            <h3>Unconscious Person</h3>
            <p>
              Call emergency services. Check breathing. If the person is
              not breathing normally, begin CPR if trained and follow
              the emergency operator's instructions.
            </p>
          </div>

          <div>
            <h3>Suspected Fracture</h3>
            <p>
              Keep the injured area still. Do not try to straighten the
              bone. Get medical assistance.
            </p>
          </div>
        </div>
      </div>

      <div className="safety-disclaimer">
        <h3>Important Safety Notice</h3>
        <p>
          These guidelines provide general preparedness information.
          Always follow instructions from NDMA, local authorities,
          emergency responders and qualified medical professionals.
          Do not delay emergency assistance to read this page.
        </p>
      </div>

    </div>
  );
}

export default CitizenSafety;
