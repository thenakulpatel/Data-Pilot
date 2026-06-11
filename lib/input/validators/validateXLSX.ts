import * as XLSX from "xlsx";

export function validateXLSX(
  workbook: XLSX.WorkBook
) {

  if (
    workbook.SheetNames.length === 0
  ) {
    return {
      valid: false,
      error:
        "Workbook contains no sheets",
    };
  }

  for (const sheetName of workbook.SheetNames) {

    const worksheet =
      workbook.Sheets[sheetName];

    const records =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    if (records.length === 0) {
      return {
        valid: false,
        error:
          `Sheet "${sheetName}" is empty`,
      };
    }

    const headers =
      Object.keys(records[0] as object);

    const uniqueHeaders =
      new Set(headers);

    if (
      uniqueHeaders.size !== headers.length
    ) {
      return {
        valid: false,
        error:
          `Duplicate columns in "${sheetName}"`,
      };
    }
  }

  return {
    valid: true,
  };
}