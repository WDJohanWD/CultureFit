import { BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./componentes/NavBar";
import './index.css';
import Home from "./sections/Home";
import Memberships from "./sections/Memberships";

function Layout() {
  return (
    <>
      <NavBar />
      <Routes>
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
