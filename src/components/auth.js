import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("line");
    localStorage.removeItem("storeLoged");
    localStorage.removeItem("refreshToken");
    setUsername("");
    setRole("");
    navigate("/login", { replace: true });
  };
  return (
    <AuthContext.Provider value={{ username, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
