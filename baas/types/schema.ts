export interface Field {
  name: string;
  type: string;
}

export interface Table {
  name: string;
  fields: Field[];
}

export interface Schema {
  tables: Table[];
}