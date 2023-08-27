import React from "react";

export default function Tracking() {
  return (
    <div className="tracking-page-container">
      <header className="tracking-header">
        <h1>Tracking Page</h1>
      </header>
      <main className="tracking-content">
        <div className="tracking-info">
          <p>Your package is on its way!</p>
          {/* You can add tracking details, maps, or any other relevant information here. */}
        </div>
      </main>
      <footer className="tracking-footer">
        <span>Thank you for using our service!</span>
      </footer>
    </div>
  );
}
