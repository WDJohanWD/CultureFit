import { BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./componentes/NavBar";
import './index.css';
import PaginaInicio from "./secciones/PaginaInicio";

function Layout() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<PaginaInicio />} />

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
