export function validateColumnType(
    rows: Record<string, any>[],
    fieldName: string,
    type: string
) {

    let invalidCount = 0;

    for (const row of rows) {

        const value =
            row[fieldName];

        // Skip empty values
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            continue;
        }

        switch (type) {

            case "text":
                break;

            case "number": {

                const stringValue =
                    String(value)
                        .trim();

                const number =
                    Number(stringValue);

                if (

                    stringValue === "" ||

                    Number.isNaN(
                        number
                    ) ||

                    !Number.isFinite(
                        number
                    )

                ) {

                    invalidCount++;
                }

                break;
            }


            case "boolean": {

                const normalized =
                    String(value)
                        .trim()
                        .toLowerCase();

                if (

                    ![
                        "true",
                        "false",
                        "1",
                        "0",
                        "yes",
                        "no",
                    ].includes(
                        normalized
                    )

                ) {

                    invalidCount++;
                }

                break;
            }

            case "date": {

                const stringValue =
                    String(value)
                        .trim();

                const validFormat =
                    /^\d{4}-\d{2}-\d{2}$/.test(
                        stringValue
                    );

                const validDate =

                    validFormat &&

                    !isNaN(
                        new Date(
                            stringValue
                        ).getTime()
                    );

                if (!validDate) {

                    invalidCount++;
                }

                break;
            }

            default:
                break;
        }
    }

    return {

        valid:
            invalidCount === 0,

        invalidCount,
    };
}