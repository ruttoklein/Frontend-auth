
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

function ProtectedRoutes() {
  const token = localStorage.getItem('accessToken');

  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
