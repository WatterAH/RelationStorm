import TableDef from "./TableDef";
import Tables from "./Tables";

const Sidebar = () => {
  return (
    <div className="w-80 border-r bg-white/50 backdrop-blur-sm min-h-screen sticky">
      <div className="p-4 space-y-6">
        <TableDef />
        <Tables />
      </div>
    </div>
  );
};

export default Sidebar;
