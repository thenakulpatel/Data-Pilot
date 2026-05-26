import { pool }
from "@/lib/db";

export async function
checkProjectOwnership(
  projectId: string,
  userId: string
) {

  const result =
    await pool.query(
      `
      SELECT *
      FROM projects
      WHERE id = $1
      AND user_id = $2
      `,
      [projectId, userId]
    );

  return result.rows.length > 0;
}