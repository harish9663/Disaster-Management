
import { useState } from "react";

const nationalContacts = [
  { name: "National Emergency", number: "112", description: "Police, fire and emergency assistance", category: "Emergency" },
  { name: "Police", number: "100", description: "Police assistance", category: "Emergency" },
  { name: "Fire and Rescue", number: "101", description: "Fire emergencies", category: "Emergency" },
  { name: "Ambulance", number: "108", description: "Medical emergencies", category: "Medical" },
  { name: "Women Helpline", number: "181", description: "Women in distress", category: "Support" },
  { name: "Child Helpline", number: "1098", description: "Child protection and assistance", category: "Support" },
  { name: "Disaster Control Room", number: "1070", description: "State disaster management", category: "Disaster" },
  { name: "District Disaster Control", number: "1077", description: "District disaster assistance", category: "Disaster" },
  { name: "Cyber Crime Helpline", number: "1930", description: "Report online financial fraud", category: "Support" },
  { name: "AP Disaster Helpline", number: "18004250101", description: "Andhra Pradesh disaster assistance", category: "Disaster" }
];

const districts = [
  { name: "Alluri Sitharama Raju", number: "8935293448" },
  { name: "Anakapalli", number: "08924222888" },
  { name: "Ananthapuramu", number: "" },
  { name: "Annamayya", number: "" },
  { name: "Bapatla", number: "08643220226" },
  { name: "Chittoor", number: "" },
  { name: "Dr. B.R. Ambedkar Konaseema", number: "8856293104" },
  { name: "East Godavari", number: "8832944455" },
  { name: "Eluru", number: "18002331077" },
  { name: "Guntur", number: "08632234014" },
  { name: "Kakinada", number: "08842356801" },
  { name: "Krishna", number: "08672252399" },
  { name: "Kurnool", number: "" },
  { name: "Markapuram", number: "9248702500" },
  { name: "Nandyal", number: "" },
  { name: "NTR", number: "9154970454" },
  { name: "Palnadu", number: "" },
  { name: "Parvathipuram Manyam", number: "08963450347" },
  { name: "Polavaram", number: "18004254225" },
  { name: "Prakasam", number: "08592295600" },
  { name: "Sri Potti Sriramulu Nellore", number: "7995576699" },
  { name: "Sri Sathya Sai", number: "" },
  { name: "Srikakulam", number: "08942240557" },
  { name: "Tirupati", number: "08772236007" },
  { name: "Visakhapatnam", number: "08912590102" },
  { name: "Vizianagaram", number: "8922236947" },
  { name: "West Godavari", number: "08816299181" },
  { name: "YSR Kadapa", number: "" }
];

function CitizenSOS() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [search, setSearch] = useState("");

  const filteredContacts = nationalContacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.number.includes(search)
  );

  const selectedDistrictInfo = districts.find(
    (district) => district.name === selectedDistrict
  );

  return (
    <div className="citizen-page sos-page">

      <div className="sos-page-heading">
        <p className="dashboard-label">CITIZEN EMERGENCY SERVICES</p>
        <h1>Emergency SOS & Contacts</h1>
        <p>Find emergency assistance and important helpline numbers.</p>
      </div>

      {/* EMERGENCY SOS CARD */}

      <div className="sos-card">
        <div className="sos-icon">🆘</div>
        <h2>Need Immediate Help?</h2>
        <p>
          If you are in immediate danger, contact emergency
          services immediately.
        </p>

        <a href="tel:112" className="sos-call-button">
          📞 Call Emergency Number - 112
        </a>
      </div>

      {/* NATIONAL HELPLINES */}

      <div className="sos-section">
        <div className="sos-section-heading">
          <div>
            <h2>National Emergency Helplines</h2>
            <p>Important emergency numbers across India</p>
          </div>
        </div>

        <input
          type="text"
          className="sos-search"
          placeholder="Search helpline name or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="helpline-grid">
          {filteredContacts.map((contact) => (
            <div className="helpline-card" key={contact.number}>
              <div className="helpline-card-top">
                <span className="helpline-symbol">☎</span>
                <span className="helpline-category">
                  {contact.category}
                </span>
              </div>

              <h3>{contact.name}</h3>
              <p>{contact.description}</p>

              <div className="helpline-card-bottom">
                <strong>{contact.number}</strong>
                <a href={`tel:${contact.number}`}>
                  Call Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <p className="sos-empty">No helpline numbers found.</p>
        )}
      </div>

      {/* ANDHRA PRADESH DISTRICT CONTACTS */}

      <div className="sos-section">
        <div className="sos-section-heading">
          <div>
            <h2>Andhra Pradesh District Contacts</h2>
            <p>Select your district to view its available contact number.</p>
          </div>
        </div>

        <div className="district-selector">
          <label htmlFor="district">Select Your District</label>

          <select
            id="district"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">Choose your district</option>

            {districts.map((district) => (
              <option key={district.name} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        {selectedDistrictInfo && (
          <div className="district-contact-card">
            <span className="district-icon">📍</span>

            <div className="district-contact-details">
              <h3>{selectedDistrictInfo.name}</h3>

              {selectedDistrictInfo.number ? (
                <>
                  <p>Published district response contact</p>
                  <strong>{selectedDistrictInfo.number}</strong>
                  <a
                    href={`tel:${selectedDistrictInfo.number}`}
                    className="district-call-button"
                  >
                    📞 Call District Contact
                  </a>
                </>
              ) : (
                <p className="district-unavailable">
                  District contact number is not verified yet.
                  Please use 112 or 1070 for emergency assistance.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SAFETY INSTRUCTIONS */}

      <div className="sos-info">
        <h3>🛡 Emergency Safety Instructions</h3>
        <ul>
          <li>Stay calm and move to a safe location.</li>
          <li>Call 112 if you need immediate emergency assistance.</li>
          <li>Share your location with trusted family members.</li>
          <li>Follow official government disaster announcements.</li>
          <li>Keep emergency medicines and important documents ready.</li>
        </ul>
      </div>

      <div className="sos-disclaimer">
        <strong>Important:</strong> Some district numbers above were
        published during a cyclone response and may be temporary.
        Verify their current availability with local authorities.
        Blank district contacts have not been verified. Do not rely
        on this demonstration directory as a replacement for official
        emergency services.
      </div>

    </div>
  );
}

export default CitizenSOS;
