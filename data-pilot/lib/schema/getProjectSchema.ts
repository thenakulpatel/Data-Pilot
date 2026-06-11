import { pool } from "@/lib/db";

export async function getProjectSchema(
  projectId: string
) {
  const result = await pool.query(
    `
    SELECT schema
    FROM schemas
    WHERE project_id = $1
    ORDER BY created_at DESC
    LIMIT 1;
    `,
    [projectId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].schema;
}