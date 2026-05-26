import {
  NextRequest,
  NextResponse
} from "next/server";

import { pool }
from "@/lib/db";

import { authorizeProject }
from "@/lib/auth/authorizeProject";

export async function POST(
  req: NextRequest
) {
  try {

    const body =
      await req.json();

    const {
      projectId,
      schema
    } = body;

    // Verify ownership
    const auth =
      await authorizeProject(
        req,
        projectId
      );

    if ("error" in auth) {
      return NextResponse.json(
        {
          error: auth.error,
        },
        {
          status: auth.status,
        }
      );
    }

    // Save schema
    const result =
      await pool.query(
        `
        INSERT INTO schemas
        (project_id, schema)
        VALUES ($1, $2)

        ON CONFLICT (project_id)
        DO UPDATE SET
        schema = EXCLUDED.schema

        RETURNING *;
        `,
        [
          projectId,
          JSON.stringify(schema)
        ]
      );

    return NextResponse.json(
      result.rows[0]
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to save schema",
      },
      {
        status: 500,
      }
    );
  }
}