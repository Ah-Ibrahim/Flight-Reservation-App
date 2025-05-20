import { Link,useNavigate } from 'react-router-dom';
import './Login.css';
import React, { useState } from 'react';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/get_customer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.success) {
        alert(result.success); 
        navigate('/booking');
      } else if (result.error) {
        alert(result.error); 
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };
	return (
		<section className="container">
			<form onSubmit={handleLogin} className="form form--login">
				<h1 className="heading">Login Account</h1>
				<div className="input-details">
					<div className="input-details__item">
						<label htmlFor="user-email">Email</label>
						<input placeholder="example@email.com" type="email" name="user-email" id="user-email"  value={email} onChange={(e) => setEmail(e.target.value)} />
					</div>
					<div className="input-details__item">
						<label htmlFor="user-password">Password</label>
						<input placeholder="password" type="password" name="user-password" id="user-password"   value={password}  onChange={(e) => setPassword(e.target.value)} />
					</div>
					<button className="form__button">Login</button>
					<div className="change-text">
						Do not have an account? <Link to="/signup">Create Account</Link>
					</div>
				</div>
			</form>
		</section>
	);
}

export default Login;
