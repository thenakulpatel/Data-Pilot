import { inferType } from "./inferTypes";

export function csvToSchema(
  tableName: string,
  records: any[]
) {
  if (records.length === 0) {
    throw new Error("CSV is empty");
  }

  const sample = records[0];

  const fields = Object.keys(sample).map(
    (key) => ({
      name: key,
      type: inferType(sample[key]),
    })
  );

  return {
    tables: [
      {
        name: tableName,
        fields,
      },
    ],
  };
}