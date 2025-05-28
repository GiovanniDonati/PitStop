import Dashboard from "./components/Dashboard/Dashboard";
import Stock from "./components/Stock/Stock";
import SideBar from "./components/SideBar/SideBar";

function App() {
  return (
    <div className="w-full h-screen flex">
      <SideBar />
      {/* <Dashboard /> */}
      <Stock />
    </div>
  );
}

export default App;
