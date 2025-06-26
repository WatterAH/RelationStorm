import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "../ui/card";
import { Database, Edit, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SchemaAlert from "@/components/schemas/SchemaAlert";
import { Label } from "@/components/ui/label";

interface Base {
  id: string;
  title: string;
  description: string;
  color: string;
}

interface SchemaCardProps extends Base {
  eliminarBase: (id: string) => void;
  editarBase: (baseEditada: Base) => void;
}

const colors = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-green-500 to-green-600",
  "from-orange-500 to-orange-600",
  "from-red-500 to-red-600",
  "from-teal-500 to-teal-600",
  "from-indigo-500 to-indigo-600",
  "from-pink-500 to-pink-600",
];

const SchemaCard = ({
  id,
  title,
  description,
  color,
  eliminarBase,
  editarBase,
}: SchemaCardProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Base>({ id, title, description, color });
  const [showAlert, setShowAlert] = useState(false);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.title.trim() && form.description.trim()) {
      editarBase(form);
      setShowAlert(false);
      setOpen(false);
    } else {
      setShowAlert(true);
    }
  };

  const URL = `/schema/${id}`;

  return (
    <div className="relative group">
      <a href={URL}>
        <Card className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <Database className="h-7 w-7 text-white" />
              </div>
              <div className="flex gap-2 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    eliminarBase(id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {description}
              </p>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          </CardContent>
        </Card>
      </a>

      {/* Dialog para editar */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Base</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleGuardar} className="space-y-6">
            <div>
              <Label className="text-base">Nombre</Label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Título"
                className="border p-2 w-full mb-4 rounded"
              />
            </div>

            <div>
              <Label className="text-base">Descripción</Label>
              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Descripción"
                className="border p-2 w-full mb-4 rounded"
              />
            </div>

            <div>
              <Label className="text-base">Color</Label>
              <div className="grid grid-cols-4 gap-3 mt-3">
                {colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setForm({ ...form, color: c })}
                    className={`h-12 rounded-xl bg-gradient-to-r ${c} transition-all hover:scale-105 ${
                      form.color === c ? "ring-4 ring-offset-2 ring-gray-300" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Guardar Cambios
            </Button>
          </form>

          {showAlert && (
            <SchemaAlert
              title="Campos incompletos"
              description="Por favor completa todos los campos antes de continuar."
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchemaCard;
