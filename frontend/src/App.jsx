import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import './index.css';

import Home from "./sections/Home";
import Memberships from "./sections/Memberships";
import Error404 from "./sections/Error404";
import Signup from "./sections/Signup";
import Login from "./sections/Login";
import AboutUs from "./sections/AboutUs";
import ConfirmAccount from "./sections/ConfirmAccount";
import AdminDashboard from "./sections/AdminDashboard";

import { AuthProvider, AuthContext } from "./AuthContext";
import { useContext } from "react";

function Layout() {
  const { token, isAdmin } = useContext(AuthContext);

  if (token && isAdmin === false) {
    return null; 
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/confirm-account/:token" element={<ConfirmAccount />} />

        {/* Ruta protegida para admin */}
        <Route
          path="/admin"
          element={
            token && isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/error" replace />
            )
          }
        />

        <Route path="/error" element={<Error404 />} />
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
