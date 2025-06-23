import type { Attribute, Row, Schema, TableData } from "@/interfaces/Schema";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

interface SchemaContextProps {
  schemas: Schema[];
  addSchema: (relationName: string, callback?: () => void) => void;
  removeSchema: (id: string) => void;
  addAttribute: (schemaId: string, attribute: Attribute) => void;
  removeAttribute: (schemaId: string, attributeName: string) => void;

  data: TableData;
  setTableData: (tableName: string, rows: Row[]) => void;
}

interface ProviderProps {
  children: ReactNode;
}

const defaultSchemaContext: SchemaContextProps = {
  schemas: [],
  addSchema: () => null,
  removeSchema: () => null,
  addAttribute: () => null,
  removeAttribute: () => null,
  setTableData: () => null,
  data: {},
};

export const SchemaContext =
  createContext<SchemaContextProps>(defaultSchemaContext);

export const SchemaProvider: React.FC<ProviderProps> = ({ children }) => {
  const [schemas, setSchemas] = useState<Schema[]>(() => {
    const saved = localStorage.getItem("schemas");
    return saved ? JSON.parse(saved) : [];
  });

  const [data, setData] = useState<TableData>(() => {
    const saved = localStorage.getItem("data");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("schemas", JSON.stringify(schemas));
  }, [schemas]);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  function setTableData(tableName: string, rows: Row[]) {
    setData((prev) => ({
      ...prev,
      [tableName]: [...(prev[tableName] ?? []), ...rows],
    }));
  }

  function addSchema(relationName: string, callback?: () => void) {
    if (!relationName.trim()) {
      return toast.error("El nombre del esquema no puede estar vacío!");
    }

    if (schemas.some((s) => s.name === relationName)) {
      return toast.error("Ya existe un esquema con ese nombre!");
    }

    const newSchema: Schema = {
      id: Date.now().toString(),
      name: relationName,
      attributes: [],
    };

    setSchemas([...schemas, newSchema]);
    setTableData(relationName, []);

    if (callback) callback();
  }

  function removeSchema(id: string) {
    const schema = schemas.find((s) => s.id === id);
    if (schema) {
      const { [schema.name]: _, ...rest } = data;
      setData(rest);
    }

    setSchemas(schemas.filter((s) => s.id !== id));
  }

  function addAttribute(schemaId: string, attribute: Attribute) {
    setSchemas((prev) =>
      prev.map((s) =>
        s.id == schemaId
          ? { ...s, attributes: [...s.attributes, attribute] }
          : s
      )
    );
  }

  function removeAttribute(schemaId: string, attributeName: string) {
    setSchemas((prev) =>
      prev.map((s) =>
        s.id === schemaId
          ? {
              ...s,
              attributes: s.attributes.filter((a) => a.name !== attributeName),
            }
          : s
      )
    );
  }

  return (
    <SchemaContext.Provider
      value={{
        schemas,
        addSchema,
        removeSchema,
        addAttribute,
        removeAttribute,
        setTableData,
        data,
      }}
    >
      {children}
    </SchemaContext.Provider>
  );
};

export const useSchemas = () => useContext(SchemaContext);
