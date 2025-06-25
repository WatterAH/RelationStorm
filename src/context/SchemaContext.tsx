import type { Attribute, Row, Table, TableData } from "@/interfaces/Table";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

interface TableContextProps {
  tables: Table[];
  addTable: (tableName: string, callback?: () => void) => void;
  removeTable: (id: string) => void;
  addAttribute: (schemaId: string, attribute: Attribute) => void;
  removeAttribute: (schemaId: string, attributeName: string) => void;

  data: TableData;
  setTableData: (tableName: string, rows: Row[]) => void;
}

interface ProviderProps {
  children: ReactNode;
}

const defaultTableContext: TableContextProps = {
  tables: [],
  addTable: () => null,
  removeTable: () => null,
  addAttribute: () => null,
  removeAttribute: () => null,
  setTableData: () => null,
  data: {},
};

export const SchemaContext =
  createContext<TableContextProps>(defaultTableContext);

export const SchemaProvider: React.FC<ProviderProps> = ({ children }) => {
  const { schemaName } = useParams();

  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem("tables");
    return saved ? JSON.parse(saved) : [];
  });

  const [data, setData] = useState<TableData>(() => {
    const saved = localStorage.getItem("data");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("tables", JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  function setTableData(tableName: string, rows: Row[]) {
    setData((prev) => ({
      ...prev,
      [tableName]: [...(prev[tableName] ?? []), ...rows],
    }));
  }

  function addTable(tableName: string, callback?: () => void) {
    if (!tableName.trim() || !schemaName) {
      return toast.error("El nombre del esquema no puede estar vacío!");
    }

    if (tables.some((t) => t.name === tableName)) {
      return toast.error("Ya existe un esquema con ese nombre!");
    }

    const newSchema: Table = {
      id: Date.now().toString(),
      schemaName,
      name: tableName,
      attributes: [],
    };

    setTables([...tables, newSchema]);
    setTableData(tableName, []);

    if (callback) callback();
  }

  function removeTable(id: string) {
    const schema = tables.find((t) => t.id === id);
    if (schema) {
      const { [schema.name]: _, ...rest } = data;
      setData(rest);
    }

    setTables(tables.filter((t) => t.id !== id));
    setData((prev) => {
      const newData = { ...prev };
      delete newData[schemaName || ""];
      return newData;
    });
  }

  function addAttribute(schemaId: string, attribute: Attribute) {
    setTables((prev) =>
      prev.map((t) =>
        t.id == schemaId
          ? { ...t, attributes: [...t.attributes, attribute] }
          : t
      )
    );
  }

  function removeAttribute(schemaId: string, attributeName: string) {
    setTables((prev) =>
      prev.map((t) =>
        t.id === schemaId
          ? {
              ...t,
              attributes: t.attributes.filter((a) => a.name !== attributeName),
            }
          : t
      )
    );
  }

  return (
    <SchemaContext.Provider
      value={{
        tables,
        addTable,
        removeTable,
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
