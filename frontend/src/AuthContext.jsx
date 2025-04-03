import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getUser();
  }, [token]);

  async function getUser(){
    if (token) {
      try {
        const decodedUser = jwtDecode(token).sub;
        const response = await fetch("http://localhost:9000/user/" + decodedUser);

        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:9000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Error en el login");

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (data.accessToken) {
        setToken(data.accessToken);
        localStorage.setItem("token", data.accessToken);
        return true
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token")
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };