import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Booking from './pages/Booking';
import Payment from './pages/payment'; // Import Payment page
import FlightDetails from './pages/FlightDetails'; // <-- Add this
import AdminLogin from './pages/adminlogin';
import AdminSignup from './pages/adminsignup'; // ✅ New admin pages
import AdminMain from './pages/AdminMain'; // ✅ New admin pages
function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/booking" element={<Booking />} />
				<Route path="/payment" element={<Payment />} /> {/* Payment route */}
				<Route path="/flight-details" element={<FlightDetails />} /> {/* New route */}
				<Route path="/admin/login" element={<AdminLogin />} /> {/* ✅ Admin Login */}
				<Route path="/admin/signup" element={<AdminSignup />} /> {/* ✅ Admin Signup */}
				<Route path="/admin/AdminMain" element={<AdminMain />} /> {/* ✅ Admin Signup */}
			</Routes>
		</>
	);
}

export default App;
