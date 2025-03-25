import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import NavBar from "./components/NavBar";
import './index.css';
import Home from "./sections/Home";
import Memberships from "./sections/Memberships";
import Error404 from "./sections/Error404"
import Signup from "./sections/Signup"
import Login from "./sections/Login"

function Layout() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="*" element={<Navigate to="/error" replace />} />
        <Route path="/error" element={<Error404 />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Home />} />
        <Route path="/memberships" element={<Memberships />} />
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
