import { useEffect, useState } from "react";
import SchemaCard from "./components/schemas/SchemaCard";
import SchemaNavbar from "./components/schemas/SchemaNavbar";
import { Zap } from "lucide-react";

interface Base {
  id: string;
  title: string;
  description: string;
  color: string;
}

const Index = () => {
  const [bases, setBases] = useState<Base[]>(() => {
    const saved = localStorage.getItem("bases");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("bases", JSON.stringify(bases));
  }, [bases]);

  const agregarBase = (nuevaBase: Base) => {
    setBases((prev) => [...prev, nuevaBase]);
  };

  const eliminarBase = (id: string) => {
    setBases((prev) => prev.filter((base) => base.id !== id));
  };

  const editarBase = (baseEditada: Base) => {
    setBases((prev) =>
      prev.map((base) =>
        base.id === baseEditada.id ? { ...baseEditada } : base
      )
    );
  };

  return (
    <>
      <SchemaNavbar agregarBase={agregarBase} />

      <div className="max-w-7xl mx-auto px-6">
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
              {bases.map((base) => (
                <SchemaCard
                  key={base.id}
                  {...base}
                  eliminarBase={eliminarBase}
                  editarBase={editarBase}
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
