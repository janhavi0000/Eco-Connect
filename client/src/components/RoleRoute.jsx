import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Authorizing role permissions..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If user attempts to enter recycler or admin area, redirect appropriately
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'recycler') return <Navigate to="/recycler-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
