import { pool }
    from "@/lib/db";

import {
    generateEmbedding,
}
    from "./generateEmbedding";

export async function
    searchRows({

        projectId,

        tableName,

        question,

        limit = 5,

    }: {

        projectId: string;

        tableName: string;

        question: string;

        limit?: number;

    }) {

    // ========================================
    // QUERY EMBEDDING
    // ========================================

    const embedding =
        await generateEmbedding(
            question
        );

    // ========================================
    // VECTOR SEARCH
    // ========================================

    const result =
        await pool.query(
            `
      SELECT

        row_data,

        1 -
        (
          embedding
          <=>
          $1::vector
        )
        AS similarity

      FROM
        table_row_embeddings

     WHERE
    project_id = $2

    AND
    table_name = $3

      ORDER BY
        embedding
        <=>
        $1::vector

      LIMIT $4
      `,
            [
                `[${embedding.join(",")}]`,
                projectId,
                tableName,
                limit,
            ]
        );
    console.log(
        result.rows.map(
            row => ({
                similarity:
                    row.similarity,
                row:
                    row.row_data,
            })
        )
    );
    return result.rows;
}