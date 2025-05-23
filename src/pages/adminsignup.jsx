import React, { useState } from 'react';
import './admincss.css';

const adminSignUpEndpoint = import.meta.env.VITE_ADMIN_SIGN_UP_ENDPOINT;

function AdminSignup() {
	const [form, setForm] = useState({
		username: '',
		email: '',
		password: '',
		fullname: '',
	});
	const [msg, setMsg] = useState('');

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSignup = async (e) => {
		e.preventDefault();
		console.log('Sending form data:', form); // Debug log

		try {
			const res = await fetch(adminSignUpEndpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			const data = await res.json();
			setMsg(data.message || 'Signup response received.');
		} catch (err) {
			console.error('Error during signup:', err);
			setMsg('An error occurred. Please try again.');
		}
	};

	return (
		<div className="signup-container">
			<form className="signup-box" onSubmit={handleSignup}>
				<h2>Admin Signup</h2>
				<input name="username" placeholder="Username" required value={form.username} onChange={handleChange} />
				<input
					name="email"
					type="email"
					placeholder="Email"
					required
					value={form.email}
					onChange={handleChange}
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					required
					value={form.password}
					onChange={handleChange}
				/>
				<input name="fullname" placeholder="Full Name" required value={form.fullname} onChange={handleChange} />
				<button type="submit">Signup</button>
				<p>{msg}</p>
			</form>
		</div>
	);
}

export default AdminSignup;
