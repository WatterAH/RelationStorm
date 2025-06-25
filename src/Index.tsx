import { useState } from "react";
import SchemaCard from "./components/schemas/SchemaCard";
import SchemaNavbar from "./components/schemas/SchemaNavbar";
import { Zap } from "lucide-react";

interface Base {
  title: string;
  description: string;
  color: string;
}

const Index = () => {
  const [bases, setBases] = useState<Base[]>([]);

  return (
    <>
      <SchemaNavbar
        agregarBase={(nuevaBase: Base) => setBases([...bases, nuevaBase])}
      />
      <div className="max-w-7xl mx-auto px-6 ">
        <div className="min-h-screen bg-white p-5">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Acceso Rápido
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bases.map((base, index) => (
                <SchemaCard
                  key={index}
                  title={base.title}
                  description={base.description}
                  color={base.color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
