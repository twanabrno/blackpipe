import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./auth";

function RequireAuth({ children }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logedin = localStorage.getItem("username");
  useEffect(() => {}, []);

  if (!logedin) {
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  } else {
    // navigate("./", { replace: true });
  }
  return children;
}

export default RequireAuth;
