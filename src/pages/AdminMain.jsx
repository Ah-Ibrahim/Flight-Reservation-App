import React, { useEffect, useState } from 'react';
import './main.css'; // Make sure your CSS file has the appropriate styles

function AdminFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    FlightNumber: '',
    Airline: '',
    DepartureCity: '',
    ArrivalCity: '',
    DepartureTime: '',
    ArrivalTime: '',
    Gate: '',
    Status: '',
    Capacity: '',
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost/sw_project/get_flightt.php');
      if (!res.ok) throw new Error('Failed to fetch flights');
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.FlightNumber || !form.Airline || !form.DepartureCity || !form.ArrivalCity) {
      setError('Please fill required fields: FlightNumber, Airline, DepartureCity, ArrivalCity');
      return;
    }

    try {
      const res = await fetch('http://localhost/sw_project/add_flight.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Flight added successfully!');
        setForm({
          FlightNumber: '',
          Airline: '',
          DepartureCity: '',
          ArrivalCity: '',
          DepartureTime: '',
          ArrivalTime: '',
          Gate: '',
          Status: '',
          Capacity: '',
        });
        fetchFlights();
      } else {
        setError(data.error || 'Failed to add flight');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  const handleDeleteFlight = async (FlightID) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) return;

    try {
      const res = await fetch('http://localhost/sw_project/delete_flight.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ FlightID }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Flight deleted successfully!');
        setError('');
        fetchFlights();
      } else {
        setError(data.error || 'Failed to delete flight');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  return (
    <div className="admin-flights-container">
      <h1>Admin Flight Management</h1>

      {error && <p className="error">{error}</p>}

      <section className="flight-list-section">
        <h2>Flights List</h2>
        {loading ? (
          <p className="loading-text">Loading flights...</p>
        ) : flights.length === 0 ? (
          <p className="empty-text">No flights available</p>
        ) : (
          <table className="flights-table">
            <thead>
              <tr>
                <th>FlightID</th>
                <th>FlightNumber</th>
                <th>Airline</th>
                <th>DepartureCity</th>
                <th>ArrivalCity</th>
                <th>DepartureTime</th>
                <th>ArrivalTime</th>
                <th>Gate</th>
                <th>Status</th>
                <th>Capacity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(flight => (
                <tr key={flight.FlightID} className="flight-row">
                  <td>{flight.FlightID}</td>
                  <td>{flight.FlightNumber}</td>
                  <td>{flight.Airline}</td>
                  <td>{flight.DepartureCity}</td>
                  <td>{flight.ArrivalCity}</td>
                  <td>{new Date(flight.DepartureTime).toLocaleString()}</td>
                  <td>{new Date(flight.ArrivalTime).toLocaleString()}</td>
                  <td>{flight.Gate}</td>
                  <td>{flight.Status}</td>
                  <td>{flight.Capacity}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteFlight(flight.FlightID)}
                      aria-label={`Delete flight ${flight.FlightNumber}`}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="add-flight-section">
        <h2>Add New Flight</h2>
        <form onSubmit={handleAddFlight} className="add-flight-form" noValidate>
          <input
            type="text"
            name="FlightNumber"
            placeholder="Flight Number *"
            value={form.FlightNumber}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
          <input
            type="text"
            name="Airline"
            placeholder="Airline *"
            value={form.Airline}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
          <input
            type="text"
            name="DepartureCity"
            placeholder="Departure City *"
            value={form.DepartureCity}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
          <input
            type="text"
            name="ArrivalCity"
            placeholder="Arrival City *"
            value={form.ArrivalCity}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
          <input
            type="datetime-local"
            name="DepartureTime"
            placeholder="Departure Time"
            value={form.DepartureTime}
            onChange={handleInputChange}
          />
          <input
            type="datetime-local"
            name="ArrivalTime"
            placeholder="Arrival Time"
            value={form.ArrivalTime}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="Gate"
            placeholder="Gate"
            value={form.Gate}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <input
            type="text"
            name="Status"
            placeholder="Status"
            value={form.Status}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <input
            type="number"
            name="Capacity"
            placeholder="Capacity"
            value={form.Capacity}
            onChange={handleInputChange}
            min="0"
          />
          <button type="submit" className="btn-add" disabled={loading}>Add Flight</button>
        </form>
      </section>
    </div>
  );
}

export default AdminFlights;
