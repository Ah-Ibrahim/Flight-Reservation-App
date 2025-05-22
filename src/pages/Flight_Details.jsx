import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Flight_Details.css"; // optional styling

export default function FlightDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const flight = state?.flight;

  const [ticketClass, setTicketClass] = useState("Economy");
  const [seatType, setSeatType] = useState("Window");

  if (!flight) {
    return <p>No flight selected. Please go back to search again.</p>;
  }

  const handleConfirm = () => {
    navigate("/payment", {
      state: { flight, ticketClass, seatType },
    });
  };

  return (
    <div className="Flight_Details">
      <h2>Flight Details</h2>
      <p><strong>Airline:</strong> {flight.Airline}</p>
      <p><strong>Flight Number:</strong> {flight.FlightNumber}</p>
      <p><strong>From:</strong> {flight.DepartureCity}</p>
      <p><strong>To:</strong> {flight.ArrivalCity}</p>
      <p><strong>Departure:</strong> {new Date(flight.DepartureTime).toLocaleString()}</p>
      <p><strong>Arrival:</strong> {new Date(flight.ArrivalTime).toLocaleString()}</p>
      <p><strong>Gate:</strong> {flight.Gate}</p>
      <p><strong>Status:</strong> {flight.Status}</p>
      <p><strong>Capacity:</strong> {flight.Capacity}</p>

      <hr />

      <label htmlFor="ticketClass"><strong>Ticket Class:</strong></label>
      <select
        id="ticketClass"
        value={ticketClass}
        onChange={(e) => setTicketClass(e.target.value)}
      >
        <option value="Economy">Economy</option>
        <option value="Business">Business</option>
        <option value="First Class">First Class</option>
      </select>

      <br /><br />

      <label htmlFor="seatType"><strong>Seat Preference:</strong></label>
      <select
        id="seatType"
        value={seatType}
        onChange={(e) => setSeatType(e.target.value)}
      >
        <option value="Window">Window</option>
        <option value="Aisle">Aisle</option>
        <option value="Middle">Middle</option>
      </select>

      <br /><br />

      <button onClick={handleConfirm} className="btn-confirm">
        Confirm Booking
      </button>
    </div>
  );
}
