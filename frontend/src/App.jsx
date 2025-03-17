import { BrowserRouter} from "react-router-dom";
import NavBar from "./componentes/NavBar";
import './index.css';

function Layout() {
  return (
    <>
      <NavBar />
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
