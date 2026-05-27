import { inferType }
from "./inferTypes";

import {
  Schema,
} from "@/lib/schema/types";

export function xlsxToSchema(
  tableName: string,
  rows: Record<string, any>[]
): Schema {

  // ================================================
  // EMPTY FILE
  // ================================================

  if (rows.length === 0) {

    return {
      tables: [],
    };
  }

  // ================================================
  // SAMPLE ROW
  // ================================================

  const sample =
    rows[0];

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
  // RETURN SCHEMA
  // ================================================

  return {

    tables: [

      {
        name:
          tableName
            .toLowerCase()
            .replace(/\s+/g, "_"),

        fields,
      },
    ],
  };
}