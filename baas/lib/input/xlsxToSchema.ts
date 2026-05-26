import * as XLSX from "xlsx";

import { inferType }
from "./inferTypes";

import { Schema, Table }
from "@/lib/schema/types";

export function xlsxToSchema(
  workbook: XLSX.WorkBook
): Schema {

  const tables: Table[] = [];

  for (const sheetName of workbook.SheetNames) {

    const worksheet =
      workbook.Sheets[sheetName];

    const records =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    if (records.length === 0) {
      continue;
    }

    const sample =
      records[0] as Record<string, any>;

    const fields =
      Object.keys(sample).map(
        (key) => ({
          name: key,
          type: inferType(
            sample[key]
          ),
        })
      );

    tables.push({
      name: sheetName.toLowerCase(),
      fields,
    });
  }

  return {
    tables,
  };
}