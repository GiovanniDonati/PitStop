import { Package, Warehouse, Truck, Bell, Settings, User2 } from 'lucide-react';

import SidebarButton from "./SidebarButton"

const Sidebar = () => {
	return (
		<aside
			className="w-16 bg-green-500 text-white h-screen flex flex-col items-center py-4 space-y-6">
			<div
				className="w-10 h-10 rounded-full bg-orange-200 flex flex-col items-center justify-center text-green-700 font-bold">
				<User2 />
			</div>

			<nav className="flex flex-col space-y-6 mt-4">
				<SidebarButton icon={<Package />} />
				<SidebarButton icon={<Warehouse />} />
				<SidebarButton icon={<Truck />} />
				<SidebarButton icon={<Bell />} />
				<SidebarButton icon={<Settings />} />
			</nav>
		</aside>
	);
};
export default Sidebar;