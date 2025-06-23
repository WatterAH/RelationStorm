import React, { useState } from "react";
import type { Attribute, Schema } from "@/interfaces/Schema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useSchemas } from "@/context/SchemaContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { dataTypes } from "@/constants/DataTypes";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface Props {
  schema: Schema;
}

const SchemaEditor: React.FC<Props> = (props) => {
  const { schema } = props;
  const { schemas, addAttribute, removeAttribute } = useSchemas();
  const [newAttribute, setNewAttribute] = useState<Attribute>({
    name: "",
    type: "String",
    isPrimaryKey: false,
    isForeignKey: false,
    referencedTable: "",
    referencedAttribute: "",
  });

  return (
    <div className="space-y-6">
      {/* Add Attribute */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="-mb-2">
          <CardTitle className="text-xl font-semibold text-blue-900">
            Agregar Atributo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={newAttribute.name}
                onChange={(e) =>
                  setNewAttribute({ ...newAttribute, name: e.target.value })
                }
                placeholder="nombre_atributo"
              />
            </div>
            <div className="space-y-3">
              <Label>Tipo</Label>
              <Select
                value={newAttribute.type}
                onValueChange={(value) =>
                  setNewAttribute({ ...newAttribute, type: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dataTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pk"
                checked={newAttribute.isPrimaryKey}
                onCheckedChange={(checked: boolean) =>
                  setNewAttribute({ ...newAttribute, isPrimaryKey: checked })
                }
              />
              <Label htmlFor="pk">Clave Primaria</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fk"
                checked={newAttribute.isForeignKey}
                onCheckedChange={(checked: boolean) =>
                  setNewAttribute({
                    ...newAttribute,
                    isForeignKey: checked,
                    referencedTable: "",
                    referencedAttribute: "",
                  })
                }
              />
              <Label htmlFor="fk">Clave Foránea</Label>
            </div>
          </div>

          {newAttribute.isForeignKey && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
              <div className="space-y-2">
                <Label>Tabla Referenciada</Label>
                <Select
                  value={newAttribute.referencedTable}
                  onValueChange={(value) =>
                    setNewAttribute({
                      ...newAttribute,
                      referencedTable: value,
                      referencedAttribute: "",
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tabla" />
                  </SelectTrigger>
                  <SelectContent>
                    {schemas
                      .filter((r: any) => r.id !== schema?.id)
                      .map((rel: any) => (
                        <SelectItem key={rel.id} value={rel.name}>
                          {rel.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Atributo Referenciado</Label>
                <Select
                  value={newAttribute.referencedAttribute}
                  onValueChange={(value) =>
                    setNewAttribute({
                      ...newAttribute,
                      referencedAttribute: value,
                    })
                  }
                  disabled={!newAttribute.referencedTable}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar atributo" />
                  </SelectTrigger>
                  <SelectContent>
                    {newAttribute.referencedTable &&
                      schemas
                        .find(
                          (r: any) => r.name === newAttribute.referencedTable
                        )
                        ?.attributes.map((attr: any) => (
                          <SelectItem key={attr.name} value={attr.name}>
                            {attr.name} ({attr.type})
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button
            onClick={() => addAttribute(schema.id, newAttribute)}
            className="w-full rounded-lg"
          >
            <Plus className="h-4 w-4 mt-1" />
            Agregar Atributo
          </Button>
        </CardContent>
      </Card>

      {/* Existing Attributes */}
      {schema && schema.attributes.length > 0 && (
        <Card>
          <CardHeader className="-mb-2">
            <CardTitle className="font-semibold text-xl">
              Atributos Existentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {schema.attributes.map((attr: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 px-6 bg-gray-100 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{attr.name}</span>
                    <Badge variant="outline">{attr.type}</Badge>
                    {attr.isPrimaryKey && <Badge>PK</Badge>}
                    {attr.isForeignKey && <Badge variant="secondary">FK</Badge>}
                    {attr.isForeignKey && attr.referencedTable && (
                      <span className="text-sm text-blue-600">
                        → {attr.referencedTable}.{attr.referencedAttribute}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttribute(schema.id, attr.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SchemaEditor;
