
function EmergencyContacts() {

  const contacts = [
    {
      id: 1,
      name: "National Emergency",
      number: "112",
      description: "For police, fire and medical emergencies",
      icon: "🚨"
    },
    {
      id: 2,
      name: "Fire Service",
      number: "101",
      description: "For fire-related emergencies",
      icon: "🔥"
    },
    {
      id: 3,
      name: "Ambulance",
      number: "108",
      description: "For medical emergencies",
      icon: "🚑"
    },
    {
      id: 4,
      name: "Disaster Management",
      number: "1078",
      description: "Disaster-related assistance",
      icon: "🌊"
    },
    {
      id: 5,
      name: "Police",
      number: "100",
      description: "For police assistance",
      icon: "👮"
    }
  ];

  return (
    <div className="contacts-page">

      <h1>Emergency Contacts</h1>

      <p className="contact-subtitle">
        Important emergency helpline numbers.
        Stay safe and get help when needed.
      </p>

      <div className="contact-container">

        {contacts.map((contact) => (

          <div className="contact-card" key={contact.id}>

            <h2>{contact.icon} {contact.name}</h2>

            <p>{contact.description}</p>

            <h3>{contact.number}</h3>

            <a href={`tel:${contact.number}`}>
              <button className="call-btn">
                Call Now
              </button>
            </a>

          </div>

        ))}

      </div>

      <div className="emergency-note">
        <h3>Important Notice</h3>
        <p>
          In an emergency, call 112 for immediate assistance.
          Contact availability may vary by location and service.
        </p>
      </div>

    </div>
  );
}

export default EmergencyContacts;
