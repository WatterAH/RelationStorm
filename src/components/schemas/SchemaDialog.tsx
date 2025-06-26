import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import type { Base } from "@/interfaces/Schema";
import { colors } from "@/constants/Colors";

interface Props {
  agregarBase: (base: Base) => void;
}

const SchemaDialog = ({ agregarBase }: Props) => {
  const [form, setForm] = useState<Base>({
    id: "",
    title: "",
    description: "",
    color: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title.trim()) {
      const newForm = { ...form, id: Date.now().toString() };
      agregarBase(newForm);
      setForm({ id: "", title: "", description: "", color: 0 });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Nueva Base de Datos
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Crear Nueva Base de Datos
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base">Nombre</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="ej. E-Commerce, Blog, CRM..."
              required
            />
          </div>

          <div>
            <Label className="text-base">Descripción</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe el propósito de la base de datos"
            />
          </div>

          <div>
            <Label className="text-base">Color</Label>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {colors.map((color, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setForm({ ...form, color: idx })}
                  className={`h-12 rounded-xl bg-gradient-to-r ${color} transition-all hover:scale-105 ${
                    form.color === idx
                      ? "ring-4 ring-offset-2 ring-gray-300"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <DialogClose asChild>
              <Button type="submit">Crear</Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SchemaDialog;
