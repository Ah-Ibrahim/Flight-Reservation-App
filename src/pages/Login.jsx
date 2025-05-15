import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
	return (
		<section className="container">
			<form action="" className="form form--login">
				<h1 className="heading">Login Account</h1>
				<div className="input-details">
					<div className="input-details__item">
						<label htmlFor="user-email">Email</label>
						<input placeholder="example@email.com" type="email" name="user-email" id="user-email" />
					</div>
					<div className="input-details__item">
						<label htmlFor="user-password">Password</label>
						<input placeholder="password" type="password" name="user-password" id="user-password" />
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
