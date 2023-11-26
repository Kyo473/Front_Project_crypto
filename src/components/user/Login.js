import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [errorResponse, setErrorResponse] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      setErrorResponse('Both username and password are required.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const requestBody = new URLSearchParams();
      requestBody.append('grant_type', 'password');
      requestBody.append('username', username);
      requestBody.append('password', password);
      requestBody.append('scope', '');
      requestBody.append('client_id', '');
      requestBody.append('client_secret', '');

      try {
        const response = await axios.post('http://'+ window.location.hostname + ':5003/auth/jwt/login', requestBody, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        console.log('Login successful:', response.data);

        const token = response.data.access_token;
        const decodedToken = JSON.parse(atob(token.split('.')[1]));

        sessionStorage.setItem('authToken', response.data.access_token);
        sessionStorage.setItem('userId', decodedToken.sub);
        sessionStorage.setItem('lat', latitude);
        sessionStorage.setItem('lon', longitude);

        navigate('/main');
      } catch (error) {
        console.error('Login failed:', error);

        if (error.response && error.response.data && error.response.data.detail) {
          setErrorResponse(error.response.data.detail);
        } else {
          setErrorResponse('Login failed. Please try again.');
        }
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
      <h2>Login</h2>
      <form>
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
        <button type="button" onClick={handleLogin}>Login</button>
      </form>
    </div>
  );
};

export default Login;
