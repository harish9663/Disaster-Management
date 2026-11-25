
const emergencyServices = [
  {
    name: "National Emergency",
    number: "112",
    category: "Emergency",
    icon: "🚨",
    description: "National emergency response assistance."
  },
  {
    name: "Fire Services",
    number: "101",
    category: "Fire",
    icon: "🚒",
    description: "Fire accidents and rescue assistance."
  },
  {
    name: "Ambulance",
    number: "108",
    category: "Medical",
    icon: "🚑",
    description: "Emergency medical transportation."
  },
  {
    name: "Disaster Management",
    number: "1078",
    category: "Disaster",
    icon: "🆘",
    description: "Disaster-related assistance."
  },
  {
    name: "Police",
    number: "100",
    category: "Police",
    icon: "👮",
    description: "Police assistance."
  }
];

const serviceCenters = [
  {
    name: "Emergency Medical Support",
    type: "Medical Assistance",
    icon: "🏥",
    description: "Contact emergency ambulance services for urgent medical needs."
  },
  {
    name: "Fire and Rescue",
    type: "Rescue Assistance",
    icon: "🚒",
    description: "Contact fire services for fire emergencies and rescue."
  },
  {
    name: "Relief and Shelter",
    type: "Disaster Relief",
    icon: "🏠",
    description: "Contact local disaster authorities for verified shelter information."
  }
];

function EmergencyServices() {
  return (
    <div className="services-page">

      <div className="services-heading">
        <div>
          <p className="dashboard-label">EMERGENCY RESPONSE CENTER</p>
          <h1>Emergency Services</h1>
          <p>Find important emergency contacts and assistance information.</p>
        </div>

        <span className="services-status">INDIA</span>
      </div>

      <div className="emergency-banner">
        <div>
          <h2>Need Immediate Help?</h2>
          <p>For immediate emergencies in India, call 112.</p>
        </div>

        <a href="tel:112" className="emergency-call-btn">
          📞 Call 112
        </a>
      </div>

      <div className="services-section">

        <h2>Emergency Helpline Numbers</h2>

        <div className="helpline-grid">

          {emergencyServices.map((service) => (
            <div className="helpline-card" key={service.number}>

              <div className="helpline-icon">
                {service.icon}
              </div>

              <span className="service-category">
                {service.category}
              </span>

              <h3>{service.name}</h3>

              <p>{service.description}</p>

              <h2>{service.number}</h2>

              <a href={`tel:${service.number}`}>
                Call Now →
              </a>

            </div>
          ))}

        </div>

      </div>

      <div className="services-section">

        <h2>Emergency Assistance</h2>

        <div className="assistance-grid">

          {serviceCenters.map((service) => (
            <div className="assistance-card" key={service.name}>
              <span>{service.icon}</span>
              <h3>{service.name}</h3>
              <small>{service.type}</small>
              <p>{service.description}</p>
            </div>
          ))}

        </div>

      </div>

      <div className="emergency-instructions">
        <h2>Important Emergency Instructions</h2>

        <ul>
          <li>Stay calm and move to a safe location.</li>
          <li>Provide your exact location when calling for help.</li>
          <li>Follow instructions from emergency authorities.</li>
          <li>Do not enter damaged buildings or flooded areas.</li>
          <li>Keep emergency contacts accessible.</li>
        </ul>
      </div>

      <p className="services-note">
        Helpline availability and numbers can vary by service and location.
        Verify local contacts with official authorities. This page does not
        dispatch emergency services or confirm shelter availability.
      </p>

    </div>
  );
}

export default EmergencyServices;
