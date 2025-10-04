import React, { useState, useEffect } from 'react';
import { getStateCode, getStateNames } from '../utils/stateCodes';
import './ContactForm.css';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    stateName: '',
    stateCode: '',
    message: ''
  });

  const stateNames = getStateNames();

  // Auto-populate state code when state name changes
  useEffect(() => {
    if (formData.stateName) {
      const code = getStateCode(formData.stateName);
      setFormData(prev => ({ ...prev, stateCode: code }));
    } else {
      setFormData(prev => ({ ...prev, stateCode: '' }));
    }
  }, [formData.stateName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(`Thank you, ${formData.name}! Your message from ${formData.stateName} (${formData.stateCode}) has been received.`);
  };

  return (
    <div className="contact-form-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stateName">State:</label>
          <select
            id="stateName"
            name="stateName"
            value={formData.stateName}
            onChange={handleChange}
            required
          >
            <option value="">Select a state</option>
            {stateNames.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="stateCode">State Code (Auto-populated):</label>
          <input
            type="text"
            id="stateCode"
            name="stateCode"
            value={formData.stateCode}
            readOnly
            className="readonly-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default ContactForm;
