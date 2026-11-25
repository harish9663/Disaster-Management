
function Home() {
  return (
    <div className="home">

      <section className="hero">

        <h1>
          Be Prepared. Stay Safe.
        </h1>

        <p>
          Your safety is our priority.
          Get real-time disaster information
          and emergency assistance.
        </p>

        <button>Explore Safety Tips</button>

      </section>

      <section className="disaster-section" id="alerts">

        <h2>Types of Disasters</h2>

        <div className="cards">

          <div className="card">
            <h3>🌊 Flood</h3>
            <p>Learn about flood risks and safety measures.</p>
          </div>

          <div className="card">
            <h3>🌍 Earthquake</h3>
            <p>Know how to protect yourself during earthquakes.</p>
          </div>

          <div className="card">
            <h3>🌀 Cyclone</h3>
            <p>Stay prepared for severe storms and cyclones.</p>
          </div>

          <div className="card">
            <h3>🔥 Fire</h3>
            <p>Understand fire prevention and emergency response.</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;
