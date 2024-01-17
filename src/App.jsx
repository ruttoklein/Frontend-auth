// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import ProtectedRoutes from './ProtectedRoutes';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (storedToken) {
      setToken(storedToken);
    } else if (refreshToken) {
      axios.post('http://localhost:5000/refresh', {}, { headers: { Authorization: `Bearer ${refreshToken}` } })
        .then(response => {
          const newAccessToken = response.data.access_token;
          setToken(newAccessToken);
          localStorage.setItem('accessToken', newAccessToken);
        })
        .catch(error => console.error('Error refreshing token:', error));
    } else {
      axios.post('http://localhost:5000/login', {
        username: 'your_username',
        password: 'your_password',
      })
        .then(response => {
          const { access_token, refresh_token } = response.data;
          setToken(access_token);
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);
        })
        .catch(error => console.error('Error fetching access token:', error));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<Home />} path="/home" />
        </Route>
        <Route index element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
