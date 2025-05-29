import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  ZapIcon,
  ChartColumnBigIcon,
  Package,
  FileText,
} from "lucide-react";

function SideBar() {
  const [sideBarActive, setSideBarActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setSideBarActive(true)}
      onMouseLeave={() => setSideBarActive(false)}
      className={`bg-white flex flex-col items-center p-4 transition-all duration-700 ${
        sideBarActive ? "w-48" : "w-20"
      } transition-all`}
    >
      <h1 className="flex flex-col items-center gap-2 text-2xl font-bold mb-10">
        <ZapIcon />
        {sideBarActive && "PitStop"}
      </h1>
      <nav className="fixed space-y-8 mt-28">
        <Link to="/" className="flex items-center gap-2">
          <LayoutDashboard /> {sideBarActive && "Dashboard"}
        </Link>
        <Link to="/agendamento" className="flex items-center gap-2">
          <Calendar /> {sideBarActive && "Agendamento"}
        </Link>
        <Link to="/orcamento" className="flex items-center gap-2">
          <FileText /> {sideBarActive && "Orçamento"}
        </Link>
        <Link to="/stock" className="flex items-center gap-2">
          <Package /> {sideBarActive && "Estoque"}
        </Link>
        <Link to="/financeiro" className="flex items-center gap-2">
          <ChartColumnBigIcon /> {sideBarActive && "Finaceiro"}
        </Link>
      </nav>
    </div>
  );
}

export default SideBar;
