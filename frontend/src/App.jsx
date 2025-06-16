import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, AuthContext } from "./AuthContext";
import { useContext, Suspense, lazy } from "react";
import GymSpinnerLoader from "./components/Loading";

// Lazy-loaded components
const Home = lazy(() => import("./sections/Home"));
const Memberships = lazy(() => import("./sections/Memberships"));
const Error404 = lazy(() => import("./sections/Error404"));
const Signup = lazy(() => import("./sections/Signup"));
const AboutUs = lazy(() => import("./sections/AboutUs"));
const ConfirmAccount = lazy(() => import("./sections/ConfirmAccount"));
const AdminDashboard = lazy(() => import("./sections/AdminDashboard"));
const YourProgress = lazy(() => import("./sections/YourProgress"));
const Workout = lazy(() => import("./sections/Workout"));
const Profile = lazy(() => import("./sections/Profile"));
const AppointmentData = lazy(() => import("./sections/AppointmentData"));
const Public_Profile = lazy(() => import("./sections/Public_Profile"));
const Lessons = lazy(() => import("./sections/Lessons"));
const Appointment = lazy(() => import("./sections/Appointment"));
const ResetPassword = lazy(() => import("./sections/SetNewPassword"));
const Login = lazy(() => import("./sections/LoginModal"));
const PaymentSuccess = lazy(() => import("./sections/PaymentSuccess"))
const PaymentError = lazy(() => import("./sections/PaymentError"))

function Layout() {
  const { token, isAdmin, loading, user } = useContext(AuthContext);

  if (loading) {
    return <><GymSpinnerLoader message="Cargando..."/></>;
  }

  return (
    <>
      <NavBar />
      <Suspense fallback={<div className="text-center mt-10"><GymSpinnerLoader message="Cargando sección..."/></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/confirm-account/:token" element={<ConfirmAccount />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile/:username" element={<Public_Profile />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-error" element={<PaymentError />} />


          <Route path="/lessons" element={user ? <Lessons /> : <Navigate to="/error" replace />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/error" replace />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/error" replace />} />
          <Route path="/appointment" element={user ? <Appointment /> : <Navigate to="/error" replace />} />
          <Route path="/appointment/:id" element={user ? <AppointmentData /> : <Navigate to="/error" replace />} />
          <Route path="/your-progress" element={user ? <YourProgress /> : <Navigate to="/error" replace />} />
          <Route path="/workout" element={user ? <Workout /> : <Navigate to="/error" replace />} />
          <Route path="/admin" element={token && isAdmin ? <AdminDashboard /> : <Navigate to="/error" replace />} />

          <Route path="/error" element={<Error404 />} />
          <Route path="*" element={<Navigate to="/error" replace />} />
        </Routes>
      </Suspense>
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
