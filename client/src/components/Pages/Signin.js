import React, { useState } from 'react';
import axios from 'axios';
import baseURL from '../../connection/connection';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/pages/signin`, formData);
      const userId = response.data.user.id; // Assuming response contains user info with ID
      setMessage(response.data.message);
      navigate(`/dashboard/${userId}`); // Redirect to the user's dashboard
    } catch (error) {
      setMessage(error.response.data.message || 'Error occurred');
    }
  };

  return (
    <div>
      <h2>Signin</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Signin</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signin;
