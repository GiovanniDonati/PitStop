
type SidebarButtonProps = {
	icon: React.ReactNode;
};

const SidebarButton = ({ icon }: SidebarButtonProps) => (
	<button
		className="w-12 h-12 bg-green-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
		{icon}
	</button>
);

export default SidebarButton;