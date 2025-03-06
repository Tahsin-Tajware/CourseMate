import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoute = () => {
  const check = localStorage.getItem('access_token');
  if (!check) {
    return (
      <Navigate to="/login" replace state={{ message: "Please log in first!" }} />
    );
  }
  return <Outlet />;
};

export default ProtectedRoute;
