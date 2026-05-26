import { parse } from "csv-parse/sync";

export function parseCSV(
  csvContent: string
) {
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  return records;
}