import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  return isAuthenticated ? Component : <Navigate to="/auth/signin" replace />;
};

export default PrivateRoute;
