import * as XLSX from "xlsx";

export function parseXLSX(
  buffer: Buffer
) {
  const workbook =
    XLSX.read(buffer, {
      type: "buffer",
    });

  return workbook;
}