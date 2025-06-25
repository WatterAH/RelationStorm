import type { Table } from "@/interfaces/Table";
import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Edit3, Grid2X2Plus, Trash2 } from "lucide-react";
import SchemaEditor from "./TableEditor";
import { useSchemas } from "@/context/SchemaContext";
import InserRecord from "./InserRecord";

const TableCard: React.FC<Table> = (table) => {
  const { removeTable } = useSchemas();

  return (
    <Card className="cursor-pointer group shadow-none rounded-2xl">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-medium text-gray-900">{table.name}</div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500 mt-1">
                {table.attributes.length}{" "}
                {table.attributes.length !== 1 ? "atributos" : "atributo"}
              </div>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog>
              {table.attributes.length > 0 && (
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Grid2X2Plus className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
              )}
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold">
                    Insertar registro en {table.name}
                  </DialogTitle>
                </DialogHeader>
                <InserRecord {...table} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit3 className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold">
                    Editar {table.name}
                  </DialogTitle>
                </DialogHeader>
                <SchemaEditor table={table} />
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeTable(table.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableCard;
