import { pool }
    from "@/lib/db";

import { rowToText }
    from "./rowToText";

import { generateEmbedding }
    from "./generateEmbedding";

import { storeEmbedding }
    from "./storeEmbedding";

export async function
    indexTable({

        projectId,

        tableName,

        physicalTableName,

    }: {

        projectId: string;

        tableName: string;

        physicalTableName: string;

    }) {

    console.log(
        "Indexing:",
        tableName
    );

    const rows =
        await pool.query(
            `
      SELECT *
      FROM ${physicalTableName}
      `
        );

    for (
        const row
        of rows.rows
    ) {

        const text =
            rowToText(
                row
            );

        const embedding =
            await generateEmbedding(
                text
            );

        await storeEmbedding({

            projectId,

            tableName,

            rowData: row,

            embedding,
        });
    }
}