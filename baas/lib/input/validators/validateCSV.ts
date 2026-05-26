export function validateCSV(
  records: any[]
) {

  if (records.length === 0) {
    return {
      valid: false,
      error: "CSV is empty",
    };
  }

  const headers =
    Object.keys(records[0]);

  if (headers.length === 0) {
    return {
      valid: false,
      error: "CSV has no headers",
    };
  }

  const uniqueHeaders =
    new Set(headers);

  if (
    uniqueHeaders.size !== headers.length
  ) {
    return {
      valid: false,
      error:
        "Duplicate column names found",
    };
  }

  return {
    valid: true,
  };
}