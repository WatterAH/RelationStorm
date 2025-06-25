import type { Table } from "./Table";

export interface Schema {
  name: string;
  description?: string;
  createdAt: Date;
  tables: Table[];
}
