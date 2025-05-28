import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import './index.css';
import { Toaster } from "@/components/ui/toaster";

import Home from "./sections/Home";
import Memberships from "./sections/Memberships";
import Error404 from "./sections/Error404";
import Signup from "./sections/Signup";
import Login from "./sections/LoginModal";
import AboutUs from "./sections/AboutUs";
import ConfirmAccount from "./sections/ConfirmAccount";
import AdminDashboard from "./sections/AdminDashboard";
import YourProgress from "./sections/YourProgress";
import Workout from "./sections/Workout"
import Profile from "./sections/Profile";
import AppointmentData from "./sections/AppointmentData";
import Public_Profile from "./sections/Public_Profile";
import Lessons from "./sections/Lessons";
import { AuthProvider, AuthContext } from "./AuthContext";
import { useContext } from "react";
import { Appointment } from "./sections/Appointment";
import ResetPassword from "./sections/SetNewPassword";
function Layout() {
  const { token, isAdmin, loading, user } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/confirm-account/:token" element={<ConfirmAccount />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile/:username" element={<Public_Profile />} />

        <Route path="/lessons" element={
            user != null? (
              <Lessons />
            ) : (
              <Navigate to="/error" replace />
            )
          } />
        <Route path="/signup" element={
            user == null? (
              <Signup />
            ) : (
              <Navigate to="/error" replace />
            )
          } />
        <Route path="/login" element={
            user == null? (
              <Login />
            ) : (
              <Navigate to="/error" replace />
            )
          } />
        <Route path="/appointment" element={
            user!= null? (
              <Appointment />
            ) : (
              <Navigate to="/error" replace />
            )
          } />
        <Route path="/appointment/:id" element={
            user != null ? (
              <AppointmentData />
            ) : (
              <Navigate to="/error" replace />
            )
          } />

        <Route path="/your-progress" element={
            user != null ? (
              <YourProgress />
            ) : (
              <Navigate to="/error" replace />
            )
          } />

        <Route path="/workout" element={
          user != null ? (
            <Workout />
          ) : (
            <Navigate to="/error" replace />
          )
        } />

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
      <Toaster />
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
