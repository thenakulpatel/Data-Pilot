import { Schema }
  from "@/types/schema";

import { getPhysicalTableName }
  from "./getPhysicalTableName";

export function generateSQL(
  schema: Schema,
  projectId: string
) {

  const queries: string[] = [];

  schema.tables.forEach(
    (table) => {

      const physicalTableName =
        getPhysicalTableName(
          projectId,
          table.name
        );

      const fields =
        table.fields
          .map((field) => {

            let sqlType = "TEXT";

            switch (field.type) {

              case "number":
                sqlType = "NUMERIC";
                break;

              case "text":
                sqlType = "TEXT";
                break;

              case "boolean":
                sqlType = "BOOLEAN";
                break;

              case "date":
                sqlType = "DATE";
                break;
            }

            return `${field.name} ${sqlType}`;
          })
          .join(", ");

      const query = `
        CREATE TABLE IF NOT EXISTS ${physicalTableName} (
          id SERIAL PRIMARY KEY,
          ${fields}
        );
      `;

      queries.push(query);
    }
  );

  return queries;
}