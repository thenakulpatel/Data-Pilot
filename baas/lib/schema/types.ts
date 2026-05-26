export type Field = {
  name: string;
  type: string;
};

export type Table = {
  name: string;
  fields: Field[];
};

export type Schema = {
  tables: Table[];
};