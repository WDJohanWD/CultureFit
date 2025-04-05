import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const rawRoles = decoded?.role || decoded?.roles || decoded?.authorities || [];
  
      let roles = [];
      if (typeof rawRoles === "string") {
        roles = [rawRoles];
      } else if (Array.isArray(rawRoles)) {
        roles = rawRoles;
      }
  
      console.log("Decoded roles:", roles); 
      setIsAdmin(roles.includes("ROLE_ADMIN"));
  
      fetchUser(decoded?.sub);
    }
  }, [token]);
  

  const fetchUser = async (username) => {
    try {
      const response = await fetch(`http://localhost:9000/user/${username}`);
      if (!response.ok) throw new Error("No se pudo obtener el usuario");
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      setUser(null);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:9000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciales inválidas");

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        setToken(data.accessToken);
        return true;
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };