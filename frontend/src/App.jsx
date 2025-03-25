import { BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./componentes/NavBar";
import './index.css';
import PaginaInicio from "./secciones/PaginaInicio";
import PaginaPlanes from "./secciones/PaginaPlanes";
import PaginaQuienesSomos from "./secciones/PaginaQuienesSomos";

function Layout() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/planes" element={<PaginaPlanes />} />
        <Route path="/aboutus" element={<PaginaQuienesSomos />}/>
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
