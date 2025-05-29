import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import Dashboard from "./pages/Dashboard";
// import Agendamento from "./pages/Agendamento";
// import Orcamento from "./pages/Orcamento";
import Financeiro from "./pages/Financeiro";
import Stock from "./pages/Stock";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/agendamento" element={<Agendamento />} /> */}
            {/* <Route path="/orcamento" element={<Orcamento />} /> */}
            <Route path="/stock" element={<Stock />} />
            <Route path="/financeiro" element={<Financeiro />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
