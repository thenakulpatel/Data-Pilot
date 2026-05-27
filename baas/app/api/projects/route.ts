import { NextRequest, NextResponse }
  from "next/server";

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

    // Extract auth header
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

    // Extract token
    const token =
      authHeader.replace(
        "Bearer ",
        ""
      );

    // Fetch authenticated user
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

    // Parse request body
    const body =
      await req.json();

    const { name } = body;

    const apiKey =
      generateApiKey();

    // Create owned project
    const result =
      await pool.query(
        `
        INSERT INTO projects
        (name, user_id,api_key)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [name, user.id, apiKey]
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