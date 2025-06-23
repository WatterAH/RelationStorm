import SchemaDef from "../schemas/SchemaDef";
import Schemas from "./Schemas";

const Sidebar = () => {
  return (
    <div className="w-80 border-r bg-white/50 backdrop-blur-sm min-h-screen sticky">
      <div className="p-4 space-y-6">
        <SchemaDef />
        <Schemas />
      </div>
    </div>
  );
};

export default Sidebar;
