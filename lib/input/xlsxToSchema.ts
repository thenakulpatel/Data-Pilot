import { inferType }
from "./inferTypes";

import { sanitizeSqlName }
from "@/lib/sql/sanitizeSqlName";

export function xlsxToSchema(
  tableName: string,
  rows: Record<string, any>[]
) {

  // ================================================
  // EMPTY FILE
  // ================================================

  if (rows.length === 0) {

    return {

      schema: {
        tables: [],
      },

      rows: [],
    };
  }

  // ================================================
  // SANITIZE ROWS
  // ================================================

  const sanitizedRows =

    rows.map((row) => {

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
  // SAMPLE ROW
  // ================================================

  const sample =
    sanitizedRows[0];

  // ================================================
  // INFER FIELDS
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
  // RETURN
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
      sanitizedRows,
  };
}