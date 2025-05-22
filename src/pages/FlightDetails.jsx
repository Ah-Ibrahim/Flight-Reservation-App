// src/components/FlightDetails.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FlightDetails.css";

export default function FlightDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const flight = location.state?.flight;

  const [ticketClass, setTicketClass] = useState("Economy");
  const [seatPreference, setSeatPreference] = useState("Aisle");

  if (!flight) {
    return (
      <div className="no-flight">
        <p>No flight details available.</p>
        <button onClick={() => navigate("/")}>Back to Search</button>
      </div>
    );
  }

  const handleBook = () => {
    navigate("/payment", {
      state: {
        flight,
        ticketClass,
        seatPreference,
        customerId: localStorage.getItem("loggedInCustomerId"),
      },
    });
  };

  return (
    <div className="flight-details-container">
      <h1>Flight Details</h1>
      <div className="flight-card">
        <h2>
          {flight.Airline} - Flight {flight.FlightNumber}
        </h2>

        <div className="flight-info">
          <div>
            <strong>From:</strong> {flight.DepartureCity}
            <br />
            <strong>Departure:</strong>{" "}
            {new Date(flight.DepartureTime).toLocaleString()}
          </div>
          <div>
            <strong>To:</strong> {flight.ArrivalCity}
            <br />
            <strong>Arrival:</strong>{" "}
            {new Date(flight.ArrivalTime).toLocaleString()}
          </div>
          <div>
            <strong>Gate:</strong> {flight.Gate}
            <br />
            <strong>Status:</strong> {flight.Status}
          </div>
          <div>
            <strong>Capacity:</strong> {flight.Capacity}
          </div>
        </div>

        <div className="selectors">
          <div className="selector">
            <label htmlFor="ticketClass">Ticket Class:</label>
            <select
              id="ticketClass"
              value={ticketClass}
              onChange={(e) => setTicketClass(e.target.value)}
            >
              <option>Economy</option>
              <option>Business</option>
              <option>First Class</option>
            </select>
          </div>

          <div className="selector">
            <label htmlFor="seatPreference">Seat Preference:</label>
            <select
              id="seatPreference"
              value={seatPreference}
              onChange={(e) => setSeatPreference(e.target.value)}
            >
              <option>Aisle</option>
              <option>Window</option>
              <option>Middle</option>
            </select>
          </div>
        </div>

        <div className="button-group">
        <button className="btn-back" onClick={() => navigate(-1)} type="button">
            Back
        </button>
        <button className="btn-book" onClick={handleBook} type="button">
            Book
        </button>
        </div>

      </div>
    </div>
  );
}
