import { pool } from "../db";

export async function executeQueries(
  queries: string[]
) {
  for (const query of queries) {
    try {
      console.log("Executing:", query);

      await pool.query(query);

      console.log("Success");
    } catch (error) {
      console.error("SQL ERROR:", error);

      throw error;
    }
  }
}