import {
  NextRequest,
  NextResponse,
} from "next/server";

import { generateApiKey }
from "@/lib/auth/generateApiKey";

import { pool }
from "@/lib/db";

import { getUser }
from "@/lib/auth/getUser";

export async function POST(
  req: NextRequest
) {
  try {

    // ==========================================
    // AUTH HEADER
    // ==========================================

    const authHeader =
      req.headers.get(
        "authorization"
      );

    if (!authHeader) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ==========================================
    // TOKEN
    // ==========================================

    const token =
      authHeader.replace(
        "Bearer ",
        ""
      );

    // ==========================================
    // USER
    // ==========================================

    const user =
      await getUser(token);

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid token",
        },
        {
          status: 401,
        }
      );
    }

    // ==========================================
    // BODY
    // ==========================================

    const body =
      await req.json();

    const name =
      body.name?.trim();

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Project name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length < 3) {
      return NextResponse.json(
        {
          error:
            "Project name must be at least 3 characters",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // DUPLICATE CHECK
    // ==========================================

    const existingProject =
      await pool.query(
        `
        SELECT id
        FROM projects
        WHERE user_id = $1
        AND LOWER(name) = LOWER($2)
        LIMIT 1
        `,
        [
          user.id,
          name,
        ]
      );

    if (
      existingProject.rows.length > 0
    ) {
      return NextResponse.json(
        {
          error:
            "A project with this name already exists",
        },
        {
          status: 409,
        }
      );
    }

    // ==========================================
    // CREATE PROJECT
    // ==========================================

    const apiKey =
      generateApiKey();

    const result =
      await pool.query(
        `
        INSERT INTO projects
        (
          name,
          user_id,
          api_key
        )
        VALUES
        (
          $1,
          $2,
          $3
        )
        RETURNING *;
        `,
        [
          name,
          user.id,
          apiKey,
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
          "Failed to create project",
      },
      {
        status: 500,
      }
    );
  }
}