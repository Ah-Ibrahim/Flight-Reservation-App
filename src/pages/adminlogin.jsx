import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginadmin.css';

const adminLoginEndpoint = import.meta.env.VITE_ADMIN_LOGIN_ENDPOINT;

function AdminLogin() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			console.log('Sending login request with:', { username, password }); // Log request data

			const res = await fetch(adminLoginEndpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});

			console.log('Response status:', res.status); // Log HTTP status code

			const data = await res.json();

			console.log('Response data:', data); // Log full response data

			if (res.ok) {
				alert(data.message || 'Login successful!');
				// You can navigate here if needed
			} else {
				alert(data.message || `Login failed (status ${res.status})`);
			}
		} catch (error) {
			alert('Network error: Could not connect to server. See console for details.');
			console.error('Login error:', error);

			// Extra debugging info:
			if (error.name === 'TypeError') {
				console.error(
					'This usually means the fetch failed to reach the server. Is the server running and reachable?'
				);
			}
		}
	};

	return (
		<section className="container">
			<form onSubmit={handleLogin} className="form form--login">
				<h1 className="heading">Admin Login</h1>
				<div className="input-details">
					<div className="input-details__item">
						<label htmlFor="admin-username">Username</label>
						<input
							placeholder="Username"
							type="text"
							id="admin-username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="input-details__item">
						<label htmlFor="admin-password">Password</label>
						<input
							placeholder="Password"
							type="password"
							id="admin-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button className="form__button" type="submit">
						Login
					</button>
					{/* You can add a link to signup or forgot password if needed */}
				</div>
			</form>
		</section>
	);
}

export default AdminLogin;
