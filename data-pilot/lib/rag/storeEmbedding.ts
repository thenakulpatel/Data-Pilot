import { pool }
from "@/lib/db";

export async function
storeEmbedding({

  projectId,

  tableName,

  rowData,

  embedding,

}: {

  projectId: string;

  tableName: string;

  rowData: Record<
    string,
    any
  >;

  embedding: number[];

}) {

  await pool.query(
    `
    INSERT INTO
    table_row_embeddings
    (
      project_id,
      table_name,
      row_data,
      embedding
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4
    )
    `,
    [
      projectId,
      tableName,
      rowData,
      `[${embedding.join(",")}]`,
    ]
  );
}