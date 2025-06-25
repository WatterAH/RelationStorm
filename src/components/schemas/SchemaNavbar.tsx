import SchemaDialog from "./SchemaDialog";
import rstrom from "../img/rstrom.jpg";
import { Badge } from "@/components/ui/badge";

interface Base {
  id: string;
  title: string;
  description: string;
  color: string;
}

interface Props {
  agregarBase: (base: Base) => void;
}

const SchemaNavbar = ({ agregarBase }: Props) => {
  return (
    <div className=" border-b inline-block align-middle p-7 sticky top-0 w-full backdrop-blur-sm z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 ">
        <div className="flex gap-3 items-center">
          <img src={rstrom} alt="logo" className="w-15 h-13 " />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              RelationStorm
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona tus bases de datos y esquemas relacionales
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Badge
            variant="secondary"
            className="hidden sm:flex text-base px-4 py-1 rounded-xl"
          >
            {agregarBase.length} Bases de Datos
          </Badge>
          <SchemaDialog agregarBase={agregarBase} />
        </div>
      </div>
    </div>
  );
};

export default SchemaNavbar;
