// src/components/BookingForm.jsx
import React, { useEffect, useState } from "react";
import { FaPlaneDeparture, FaPlaneArrival, FaUser, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";
import "./Booking.css";

export default function Booking({ onSearch }) {


const [cities, setCities] = useState([]);

useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/population/cities");
        const data = await response.json();
        if (data && data.data) {
          const cityNames = [...new Set(data.data.map(city => city.city))];
          setCities(cityNames.sort());
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const form = Object.fromEntries(data.entries());
    onSearch(form);
  };

  return (
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
          />
          <datalist id="to-airports">
           {cities.map((city, index) => (
              <option key={index} value={city} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="field-group date-range">
        <label htmlFor="date">Date</label>
        <div className="input-wrapper">
          <FaCalendarAlt className="icon" />
          <input type="date" id="startDate" name="startDate" />
          <span className="separator">—</span>
          <input type="date" id="endDate" name="endDate" />
        </div>
      </div>


      <button type="submit" className="btn-submit">
        LET'S FLY!
      </button>
    </form>
  );
}
