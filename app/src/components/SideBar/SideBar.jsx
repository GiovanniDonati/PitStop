import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  ZapIcon,
  ChartColumnBigIcon,
  Package,
} from "lucide-react";

function SideBar() {
  const [sideBarActive, setSideBarActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setSideBarActive(true)}
      onMouseLeave={() => setSideBarActive(false)}
      className={`bg-white flex flex-col items-center p-4 transition-all duration-200 ${
        sideBarActive ? "w-60" : "w-20"
      } transition-all`}
    >
      <h1 className="flex flex-col items-center gap-2 text-2xl font-bold mb-10">
        <ZapIcon />
        {sideBarActive && "PitStop"}
      </h1>
      <nav className="space-y-4">
        <button className="flex items-center gap-2">
          <LayoutDashboard /> {sideBarActive && "Dashboard"}
        </button>
        <button className="flex items-center gap-2">
          <Calendar /> {sideBarActive && "Agendamentos"}
        </button>
        <button className="flex items-center gap-2">
          <Package /> {sideBarActive && "Estoque"}
        </button>
        <button className="flex items-center gap-2">
          <ChartColumnBigIcon /> {sideBarActive && "Finaceiro"}
        </button>
      </nav>
    </div>
  );
}

export default SideBar;
