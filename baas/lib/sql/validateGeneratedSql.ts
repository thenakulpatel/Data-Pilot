export function
    validateGeneratedSql(
        sql: string,
        physicalTableName: string
    ) {
    if (
        !sql.includes(
            physicalTableName
        )
    ) {

        throw new Error(
            "Query references an invalid table"
        );
    }
    const statements =
        sql
            .split(";")
            .filter(
                statement =>
                    statement.trim().length > 0
            );

    if (
        statements.length > 1
    ) {

        throw new Error(
            "Multiple SQL statements are not allowed"
        );
    }

    const normalized =
        sql
            .trim()
            .toUpperCase();

    if (
        !normalized.startsWith(
            "SELECT"
        )
    ) {

        throw new Error(
            "Only SELECT queries allowed"
        );
    }

    const forbidden = [

        "INSERT",
        "UPDATE",
        "DELETE",
        "DROP",
        "ALTER",
        "TRUNCATE",
        "CREATE",
        "GRANT",
        "REVOKE",
        "EXECUTE",

    ];

    for (
        const keyword
        of forbidden
    ) {

        if (
            normalized.includes(
                keyword
            )
        ) {

            throw new Error(
                `Forbidden keyword: ${keyword}`
            );
        }
    }

    return true;
}