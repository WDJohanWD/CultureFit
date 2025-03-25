import { BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./componentes/NavBar";
import './index.css';
import PaginaInicio from "./secciones/PaginaInicio";
import PaginaPlanes from "./secciones/PaginaPlanes";
import Pagina404 from "./secciones/Pagina404";

function Layout() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="*" element={<Pagina404/>}/>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/planes" element={<PaginaPlanes />} />
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
