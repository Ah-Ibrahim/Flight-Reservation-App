import React, { useState } from 'react';
import './payment.css';  // Make sure this path is correct

const PaymentPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardName: '',
    cardNum: '',
    expMonth: '',
    expYear: '',
    cvv: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNum') {
      value = value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '';
    }

    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    if (name === 'zip') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const {
      name,
      email,
      address,
      city,
      state,
      zip,
      cardName,
      cardNum,
      expMonth,
      expYear,
      cvv,
    } = formData;

    if (!name || !email || !address || !city || !state || !zip || !cardName || !cardNum || !expMonth || !expYear || !cvv) {
      alert('Please fill in all the fields!');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address!');
      return false;
    }

    const rawCardNum = cardNum.replace(/\s/g, '');
    if (rawCardNum.length !== 16 || isNaN(rawCardNum)) {
      alert('Credit Card Number must be 16 digits!');
      return false;
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
      alert('CVV must be 3 digits!');
      return false;
    }

    const currentDate = new Date();
    const expiryDate = new Date(parseInt(expYear), parseInt(expMonth) - 1, 1);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    expiryDate.setDate(expiryDate.getDate() - 1);

    if (expiryDate < currentDate) {
      alert('The expiry date must be after today!');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost/sw_project/payment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          cardName: formData.cardName,
          cardNum: formData.cardNum.replace(/\s/g, ''),
          expMonth: formData.expMonth,
          expYear: formData.expYear,
          cvv: formData.cvv,
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        alert(`Payment failed: ${text}`);
      } else {
        alert(text);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Payment failed due to a network or server error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="payment-form" noValidate>
        <div className="row">
          <div className="col">
            <h3>Billing Address</h3>
            {['name', 'email', 'address', 'city', 'state', 'zip'].map((field) => (
              <div className="inputBox" key={field}>
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  {...(field === 'zip' ? { pattern: "\\d{5,10}" } : {})}
                />
              </div>
            ))}
          </div>

          <div className="col">
            <h3>Payment</h3>
            <div className="inputBox">
              <label>Card Accepted:</label>
              <img
                src="https://media.geeksforgeeks.org/wp-content/uploads/20240715140014/Online-Payment-Project.webp"
                alt="credit/debit card"
              />
            </div>

            <div className="inputBox">
              <label htmlFor="cardName">Name on Card:</label>
              <input
                type="text"
                name="cardName"
                id="cardName"
                value={formData.cardName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="inputBox">
              <label htmlFor="cardNum">Card Number:</label>
              <input
                type="text"
                name="cardNum"
                id="cardNum"
                value={formData.cardNum}
                onChange={handleChange}
                maxLength="19"
                required
                inputMode="numeric"
                pattern="\d{4} \d{4} \d{4} \d{4}"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div className="inputBox">
              <label htmlFor="expMonth">Exp Month:</label>
              <select
                name="expMonth"
                id="expMonth"
                value={formData.expMonth}
                onChange={handleChange}
                required
              >
                <option value="">Choose month</option>
                {[
                  '01', '02', '03', '04', '05', '06',
                  '07', '08', '09', '10', '11', '12',
                ].map((month) => (
                  <option key={month} value={month}>
                    {new Date(0, parseInt(month) - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex">
              <div className="inputBox">
                <label htmlFor="expYear">Exp Year:</label>
                <select
                  name="expYear"
                  id="expYear"
                  value={formData.expYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="inputBox">
                <label htmlFor="cvv">CVV:</label>
                <input
                  type="text"
                  name="cvv"
                  id="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  maxLength="3"
                  pattern="\d{3}"
                  inputMode="numeric"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        </div>

        <input
          type="submit"
          value={submitting ? "Processing..." : "Proceed to Checkout"}
          className="submit_btn"
          disabled={submitting}
        />
      </form>
    </div>
  );
};

export default PaymentPage;
