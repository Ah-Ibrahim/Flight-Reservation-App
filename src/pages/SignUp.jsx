import { Link } from 'react-router-dom';
import './SignUp.css';

const signUpEndpoint = import.meta.env.VITE_SIGN_UP_ENDPOINT;

function SignUp() {
	const handleSignUp = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());
		const year = formData.get('birth-year');
		const month = formData.get('birth-month');
		const day = formData.get('birth-day');
		data.dob = `${year}-${String(new Date(`${month} 1`).getMonth() + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
		try {
			const response = await fetch(signUpEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				alert(result.success);
			} else if (result.error) {
				alert(result.error);
			}
		} catch (error) {
			console.error('Sign up error:', error);
			alert('An error occurred during sign up.');
		}
	};
	return (
		<section className="container">
			<form onSubmit={handleSignUp} className="form form--login">
				<h1>Create Acount</h1>
				<div className="input-details">
					<div className="input-details__item">
						<label htmlFor="SSN">SSN</label>
						<input placeholder="123-45-6789" type="text" name="ssn" id="ssn" />
					</div>
					<div className="input-details__item">
						<label htmlFor="Fname">First Name</label>
						<input placeholder="John" type="text" name="firstname" id="firstname" />
					</div>

					<div className="input-details__item">
						<label htmlFor="Lname">Last Name</label>
						<input placeholder="Doe" type="text" name="lastname" id="lastname" />
					</div>
					<div className="input-details__item">
						<label htmlFor="user-phone">Phone</label>
						<input placeholder="(123) 456-7890" type="tel" name="phonenumber" id="phonenumber" />
					</div>

					<div className="input-details__item">
						<label>Birthday</label>
						<div className="birthday-options">
							<select name="birth-month" required>
								<option value="">Month</option>
								<option value="Jan">Jan</option>
								<option value="Feb">Feb</option>
								<option value="Mar">Mar</option>
								<option value="Apr">Apr</option>
								<option value="May">May</option>
								<option value="Jun">Jun</option>
								<option value="Jul">Jul</option>
								<option value="Aug">Aug</option>
								<option value="Sep">Sep</option>
								<option value="Oct">Oct</option>
								<option value="Nov">Nov</option>
								<option value="Dec">Dec</option>
							</select>

							<select name="birth-day" required>
								<option value="">Day</option>
								{Array.from({ length: 31 }, (_, i) => (
									<option key={i + 1} value={i + 1}>
										{i + 1}
									</option>
								))}
							</select>

							<select name="birth-year" required>
								<option value="">Year</option>
								{Array.from({ length: 100 }, (_, i) => {
									const year = new Date().getFullYear() - i;
									return (
										<option key={year} value={year}>
											{year}
										</option>
									);
								})}
							</select>
						</div>
					</div>
					<div className="input-details__item">
						<label htmlFor="user-email">Email</label>
						<input placeholder="John@gmail.com" type="email" name="email" id="email" />
					</div>
					<div className="input-details__item">
						<label htmlFor="user-password">Password</label>
						<input placeholder="password" type="password" name="password" id="password" />
					</div>
					<div className="input-details__item">
						<label htmlFor="user-password-confirm">Confirm Password</label>
						<input placeholder="password" type="password" name="confirm_password" id="confirm_password" />
					</div>
					<button className="form__button">Signup</button>

					<div className="change-text">
						Already have an account? <Link to="/login">sign in</Link>
					</div>
				</div>
			</form>
		</section>
	);
}

export default SignUp;
