import {
  NextRequest,
  NextResponse
} from "next/server";

import { pool }
from "@/lib/db";

import { authorizeProject }
from "@/lib/auth/authorizeProject";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      projectId: string;
    }>;
  }
) {
  try {

    const { projectId } =
      await context.params;

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

    // Fetch schema
    const result =
      await pool.query(
        `
        SELECT schema
        FROM schemas
        WHERE project_id = $1
        `,
        [projectId]
      );

    if (
      result.rows.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Schema not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      result.rows[0]
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch schema",
      },
      {
        status: 500,
      }
    );
  }
}