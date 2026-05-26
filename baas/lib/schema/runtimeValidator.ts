export function validateTable(
  schema: any,
  table: string
) {
  return schema.tables.some(
    (t: any) => t.name === table
  );
}

export function validateFields(
  schema: any,
  table: string,
  fields: string[]
) {
  const foundTable = schema.tables.find(
    (t: any) => t.name === table
  );

  if (!foundTable) return false;

  const allowedFields =
    foundTable.fields.map(
      (f: any) => f.name
    );

  return fields.every((field) =>
    allowedFields.includes(field)
  );
}