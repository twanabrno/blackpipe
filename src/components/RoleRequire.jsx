import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RoleRequire = ({ allowedRoles }) => {
  const location = useLocation();
  return allowedRoles?.includes(localStorage.getItem("role")) ? (
    <>
      <Outlet />
    </>
  ) : localStorage.getItem("role") == "Enter" ? (
    <Navigate to="/rolls" state={{ path: location.pathname }} replace />
  ) : localStorage.getItem("role") == "Sliter" ? (
    <Navigate to="/sliter" state={{ path: location.pathname }} replace />
  ) : localStorage.getItem("role") == "Tambur" ? (
    <Navigate to="/tambur" state={{ path: location.pathname }} replace />
  ) : (
    <Navigate to="/" state={{ path: location.pathname }} replace />
  );
};

export default RoleRequire;
