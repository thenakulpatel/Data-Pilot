import { NextRequest }
from "next/server";

import { supabase }
from "@/lib/supabase";

import { pool }
from "@/lib/db";

export async function
authorizeApiAccess(
  req: NextRequest,
  projectId: string
) {

  // ================================================
  // JWT AUTH (SUPABASE)
  // ================================================

  const authHeader =
    req.headers.get(
      "authorization"
    );

  if (
    authHeader?.startsWith(
      "Bearer "
    )
  ) {

    try {

      const token =
        authHeader.replace(
          "Bearer ",
          ""
        );

      const {
        data,
        error,
      } =
        await supabase.auth.getUser(
          token
        );

      if (
        !error &&
        data.user
      ) {

        const result =
          await pool.query(
            `
            SELECT *
            FROM projects
            WHERE id = $1
            AND user_id = $2
            `,
            [
              projectId,
              data.user.id,
            ]
          );

        if (
          result.rows.length > 0
        ) {

          return {
            success: true,
          };
        }
      }

    } catch (error) {

      console.error(error);
    }
  }

  // ================================================
  // API KEY AUTH
  // ================================================

  const apiKey =
    req.headers.get(
      "x-api-key"
    );

  if (apiKey) {

    const result =
      await pool.query(
        `
        SELECT *
        FROM projects
        WHERE id = $1
        AND api_key = $2
        `,
        [
          projectId,
          apiKey,
        ]
      );

    if (
      result.rows.length > 0
    ) {

      return {
        success: true,
      };
    }
  }

  // ================================================
  // FAILED
  // ================================================

  return {
    error:
      "Unauthorized",

    status: 401,
  };
}