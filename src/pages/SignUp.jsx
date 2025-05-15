import { Link } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
	return(
<section className="container">
  <form action="" className="form form--login">
    <h1>Login Account</h1>
    <div className="input-details">
      <div className="input-details__item">
		<label htmlFor="SSN">SSN</label>
		<input placeholder='123-45-6789' type="text" name="SSN" id="SSN" />
	  </div>	
      <div className="input-details__item">
        <label htmlFor="Fname">First Name</label>
        <input placeholder="John" type="text" name="Fname" id="Fname" />
      </div>

      <div className="input-details__item">
        <label htmlFor="Lname">Last Name</label>
        <input placeholder="Doe" type="text" name="Lname" id="Lname" />
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
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <select name="birth-year" required>
            <option value="">Year</option>
            {Array.from({ length: 100 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>	
      </div>
	  <div className="input-details__item">
		<label htmlFor="user-email">Email</label>
		<input placeholder="John@gmail.com" type="email" name="user-email" id="user-email" />
	  </div>
	  <div className="input-details__item">
		<label htmlFor="user-password">Password</label>
		<input placeholder="password" type="password" name="user-password" id="user-password" />
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
