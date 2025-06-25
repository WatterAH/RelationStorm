import TableCard from "./TableCard";
import { Database } from "lucide-react";
import { useSchemas } from "@/context/SchemaContext";

const Tables = () => {
  const { tables } = useSchemas();

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Database className="h-6 w-6 text-gray-600" />
        <span className="font-medium text-gray-900 text-lg">
          Esquemas ({tables.length})
        </span>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tables.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Database className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>Sin esquemas</p>
          </div>
        ) : (
          tables.map((table) => <TableCard key={table.id} {...table} />)
        )}
      </div>
    </div>
  );
};

export default Tables;
