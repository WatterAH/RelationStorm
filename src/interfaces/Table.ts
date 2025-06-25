export interface Table {
  id: string;
  schemaName: string;
  name: string;
  attributes: Attribute[];
}

export type Row = Record<string, any>;
export type TableData = Record<string, Row[]>;

export interface Attribute {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  referencedTable?: string;
  referencedAttribute?: string;
}
