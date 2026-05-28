import { inferType }
  from "./inferTypes";

import { sanitizeSqlName }
  from "@/lib/sql/sanitizeSqlName";

export function csvToSchema(
  tableName: string,
  records: any[]
) {

  if (records.length === 0) {

    throw new Error(
      "CSV is empty"
    );
  }

  // ================================================
  // SANITIZE ROWS
  // ================================================

  const sanitizedRecords =

    records.map((row) => {

      const newRow:
        Record<string, any>
        = {};

      Object.entries(row)
        .forEach(

          ([key, value]) => {

            newRow[
              sanitizeSqlName(
                key
              )
            ] = value;
          }
        );

      return newRow;
    });

  // ================================================
  // SAMPLE
  // ================================================

  const sample =
    sanitizedRecords[0];

  // ================================================
  // FIELDS
  // ================================================

  const fields =
    Object.keys(sample).map(
      (key) => ({

        name: key,

        type: inferType(
          sample[key]
        ),
      })
    );

  // ================================================
  // SCHEMA
  // ================================================

  return {

    schema: {

      tables: [

        {

          name: sanitizeSqlName(
            tableName
          ),

          fields,
        },
      ],
    },

    rows:
      sanitizedRecords,
  };
}