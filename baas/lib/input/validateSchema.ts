export function validateSchemaStructure(
  schema: any
): boolean {

  // Schema must exist
  if (
    !schema ||
    typeof schema !== "object"
  ) {
    return false;
  }

  // tables must exist
  if (!schema.tables) {
    return false;
  }

  // tables must be array
  if (
    !Array.isArray(schema.tables)
  ) {
    return false;
  }

  // at least one table
  if (
    schema.tables.length === 0
  ) {
    return false;
  }

  // Validate unique table names
  const tableNames =
    schema.tables.map(
      (table: any) =>
        table.name
    );

  const uniqueTableNames =
    new Set(tableNames);

  if (
    uniqueTableNames.size !==
    tableNames.length
  ) {
    return false;
  }

  // Validate every table
  for (const table of schema.tables) {

    // Table must be object
    if (
      !table ||
      typeof table !== "object"
    ) {
      return false;
    }

    // Table name validation
    if (
      !table.name ||
      typeof table.name !== "string"
    ) {
      return false;
    }

    // Fields must exist
    if (!table.fields) {
      return false;
    }

    // Fields must be array
    if (
      !Array.isArray(table.fields)
    ) {
      return false;
    }

    // At least one field
    if (
      table.fields.length === 0
    ) {
      return false;
    }

    // Validate unique field names
    const fieldNames =
      table.fields.map(
        (field: any) =>
          field.name
      );

    const uniqueFieldNames =
      new Set(fieldNames);

    if (
      uniqueFieldNames.size !==
      fieldNames.length
    ) {
      return false;
    }

    // Validate each field
    for (const field of table.fields) {

      // Field must be object
      if (
        !field ||
        typeof field !== "object"
      ) {
        return false;
      }

      // Field name validation
      if (
        !field.name ||
        typeof field.name !== "string"
      ) {
        return false;
      }

      // Field type validation
      if (
        !field.type ||
        typeof field.type !== "string"
      ) {
        return false;
      }

      // Allowed SQL types
      const allowedTypes = [
        "text",
        "integer",
        "boolean",
        "number",
        "uuid",
        "timestamp",
        "date",
        "float",
      ];

      if (
        !allowedTypes.includes(
          field.type.toLowerCase()
        )
      ) {
        return false;
      }
    }
  }

  return true;
}