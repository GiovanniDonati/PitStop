import Dashboard from "./components/Dashboard/Dashboard";
import SideBar from "./components/SideBar/SideBar";

function App() {
  return (
    <div className="w-full h-screen flex">
      <SideBar />
      <Dashboard />
    </div>
  );
}

export default App;
