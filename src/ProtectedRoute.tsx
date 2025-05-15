import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
  exp: number;
}

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  
  if (!token || !userString) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    const user = JSON.parse(userString);
    
    // Vérifier si le token est expiré
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/" replace />;
    }

    // Vérifier si l'utilisateur a le bon rôle
    if (!allowedRoles.includes(user.Roles)) {
      // Rediriger vers la page appropriée selon le rôle
      return <Navigate to={user.Roles === 'admin' || user.Roles === 'superadmin' ? "/dashbord" : "/dashbordUser"} replace />;
    }

    return <Outlet />;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;