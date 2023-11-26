import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [errorResponse, setErrorResponse] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = () => {
    const requestBody = {
      email,
      password,
      is_active: true,
      is_superuser: false,
      is_verified: false,
      username,
      address:'',
    };

    axios.post('http://'+ window.location.hostname + ':5003/auth/register', requestBody)
      .then(response => {
        console.log('Registration successful:', response.data);
        navigate('/login');
      })
      .catch(error => {
        console.error('Registration failed:', error);
        if (error.response && error.response.data && error.response.data.detail) {
          setErrorResponse(error.response.data.detail);
        } else {
          setErrorResponse('Registration failed. Please try again.');
        }
      });
  };

  return (
    <div>
      {errorResponse && (
        <div style={{ color: 'red' }}>
          <p>Error Message: {errorResponse}</p>
        </div>
      )}
      <h2>Register</h2>
      <form>
        <label>
          Email:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleRegister}>Register</button>
      </form>
      <p>Already have an account? <button onClick={() => navigate('/login')}>Login</button></p>
    </div>
  );
};

export default Register;
