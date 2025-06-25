import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Plus, Zap } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSchemas } from "@/context/SchemaContext";

const SchemaDef = () => {
  const { addTable } = useSchemas();
  const [name, setName] = useState("");

  const clearName = () => setName("");

  return (
    <Card className="border-0 rounded-xl shadow-xs bg-gradient-to-br from-blue-100 to-indigo-200">
      <CardContent className="px-4 py-2">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-6 w-6 text-blue-800" />
          <span className="font-semibold text-blue-900 text-lg">
            Crear esquema
          </span>
        </div>
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la tabla..."
            className="text-sm bg-white"
          />
          <Button
            onClick={() => addTable(name, clearName)}
            size="sm"
            className="px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchemaDef;
