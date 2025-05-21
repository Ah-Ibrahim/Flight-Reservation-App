// src/components/BookingForm.jsx
import React, { useEffect, useState } from "react";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarAlt,
} from "react-icons/fa";
import "./Booking.css";

export default function Booking({ onSearch }) {
  const [cities, setCities] = useState([]);
  const [flights, setFlights] = useState([]);

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    arrivalDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/population/cities"
        );
        const data = await response.json();
        if (data && data.data) {
          const cityNames = [...new Set(data.data.map((city) => city.city))];
          setCities(cityNames.sort());
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  const cleanCityName = (name) => name.replace(/\s*\(.*?\)\s*/g, "").trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const from = cleanCityName(formData.from);
    const to = cleanCityName(formData.to);
    const departureDate = new Date(formData.departureDate)
      .toISOString()
      .split("T")[0];
    const arrivalDate = new Date(formData.arrivalDate).toISOString().split("T")[0];

    if (!from || !to || !departureDate || !arrivalDate) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      setFlights([]);
      const response = await fetch("http://localhost/sw_project/get_Flights.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, departureDate, arrivalDate }),
      });

      if (!response.ok) throw new Error("Failed to send booking data");

      const result = await response.json();
      if (result.success) {
        setFlights(result.flights);
      } else {
        alert(result.message || "No flights found.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting the booking.");
    }
  };

  const handleBook = (flight) => {
    alert(`You booked flight ${flight.FlightNumber} with ${flight.Airline}!`);
    // Here you can add your booking logic or navigation
  };

  return (
    <>
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="from">From</label>
          <div className="input-wrapper">
            <FaPlaneDeparture className="icon" />
            <input
              type="text"
              id="from"
              name="from"
              placeholder="Departure"
              list="from-airports"
              value={formData.from}
              onChange={handleChange}
            />
            <datalist id="from-airports">
              {cities.map((city, index) => (
                <option key={index} value={city} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="swap-icon">⇄</div>

        <div className="field-group">
          <label htmlFor="to">To</label>
          <div className="input-wrapper">
            <FaPlaneArrival className="icon" />
            <input
              type="text"
              id="to"
              name="to"
              placeholder="Destination"
              list="to-airports"
              value={formData.to}
              onChange={handleChange}
            />
            <datalist id="to-airports">
              {cities.map((city, index) => (
                <option key={index} value={city} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="departureDate">Departure Date</label>
          <div className="input-wrapper">
            <FaCalendarAlt className="icon" />
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="arrivalDate">Arrival Date</label>
          <div className="input-wrapper">
            <FaCalendarAlt className="icon" />
            <input
              type="date"
              id="arrivalDate"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn-submit">
          LET'S FLY!
        </button>
      </form>

      {flights.length > 0 && (
        <div className="flight-results">
          <h2>Available Flights</h2>
          <ul>
            {flights.map((flight, index) => (
              <li key={index} className="flight-card">
                <strong>{flight.Airline}</strong> - Flight {flight.FlightNumber}
                <br />
                {flight.DepartureCity} (
                {new Date(flight.DepartureTime).toLocaleString()}) →
                {flight.ArrivalCity} (
                {new Date(flight.ArrivalTime).toLocaleString()})
                <br />
                Gate: {flight.Gate}, Status: {flight.Status}, Capacity: {flight.Capacity}
                <button
                  className="btn-book"
                  onClick={() => handleBook(flight)}
                  type="button"
                >
                  Book
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
