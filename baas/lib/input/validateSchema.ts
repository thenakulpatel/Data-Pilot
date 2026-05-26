export function validateSchemaStructure(
    schema: any
) {

    if (!schema.tables) {
        return false;
    }

    if (!Array.isArray(schema.tables)) {
        return false;
    }

    if (schema.tables.length === 0) {
        return false;
    }

    const tableNames =
        schema.tables.map(
            (t: any) => t.name
        );

    const uniqueTableNames =
        new Set(tableNames);

    if (
        uniqueTableNames.size !==
        tableNames.length
    ) {
        return false;
    }

    for (const table of schema.tables) {

        if (!table.name || !table.fields) {
            return false;
        }

        if (!Array.isArray(table.fields)) {
            return false;
        }

        if (table.fields.length === 0) {
            return false;
        }

        const fieldNames =
            table.fields.map(
                (f: any) => f.name
            );

        const uniqueFieldNames =
            new Set(fieldNames);

        if (
            uniqueFieldNames.size !==
            fieldNames.length
        ) {
            return false;
        }

        for (const field of table.fields) {

            if (
                !field.name ||
                !field.type
            ) {
                return false;
            }
        }
    }

    return true;
}