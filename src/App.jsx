import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Booking from './pages/Booking';
import Payment from './pages/payment'; // Import Payment page

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/booking" element={<Booking />} />
				<Route path="/payment" element={<Payment />} /> {/* Payment route */}
			</Routes>
		</>
	);
}

export default App;
