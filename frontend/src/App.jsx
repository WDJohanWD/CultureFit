import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import NavBar from "./components/NavBar";
import './index.css';
import Home from "./sections/Home";
import Memberships from "./sections/Memberships";
import Error404 from "./sections/Error404"
import Signup from "./sections/Signup"
import Login from "./sections/Login"
import AboutUs from "./sections/AboutUs";
import ConfirmAccount from "./sections/ConfirmAccount";
import Administration from "./sections/Admin/Administration";

function Layout() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="*" element={<Navigate to="/error" replace />} />
        <Route path="/confirm-account/:token" element={<ConfirmAccount />} />
        <Route path="/error" element={<Error404 />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Home />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/aboutus" element={<AboutUs />}/>
        <Route path="/admin" element={<Administration />}/>
        
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
