import React, { useState } from "react";
import type { Row, Table } from "@/interfaces/Table";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSchemas } from "@/context/SchemaContext";
import { toast } from "sonner";

const InserRecord: React.FC<Table> = (table) => {
  const { setTableData } = useSchemas();
  const [formData, setFormData] = useState<Row>({});

  const onSubmit = () => {
    setTableData(table.name, [formData]);
    setFormData({});
    toast.success("Se agregó un nuevo registro");
  };

  const parseValue = (value: string, type: string) => {
    switch (type) {
      case "Integer":
        return parseInt(value, 10);
      case "Float":
        return parseFloat(value);
      case "Date":
        return new Date(value);
      default:
        return value;
    }
  };

  return (
    <div className="space-y-6 max-h-80 overflow-y-auto py-2">
      <div className="grid grid-cols-2 gap-4">
        {table.attributes.map((attr) => {
          const { type } = attr;
          let inputType = "";

          switch (type) {
            case "Integer":
            case "Float":
              inputType = "number";
              break;
            case "String":
              inputType = "text";
              break;
            case "Date":
              inputType = "date";
              break;
            default:
              inputType = "text";
              break;
          }

          return (
            <div key={attr.name} className="p-2 space-y-2">
              <Label className="px-2" htmlFor={attr.name}>
                {attr.name}
              </Label>
              <Input
                id={attr.name}
                type={inputType}
                placeholder={attr.name}
                value={formData[attr.name] ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [attr.name]: parseValue(e.target.value, type),
                  })
                }
              />
            </div>
          );
        })}
      </div>

      <Button type="button" className="w-full" onClick={onSubmit}>
        Insertar
      </Button>
    </div>
  );
};

export default InserRecord;
