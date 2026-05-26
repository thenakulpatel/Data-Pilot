import {
  NextRequest,
  NextResponse
} from "next/server";

import { pool }
from "@/lib/db";

import { getUser }
from "@/lib/auth/getUser";

export async function GET(
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

    // Fetch current user
    const user =
      await getUser(token);

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Invalid token",
        },
        {
          status: 401,
        }
      );
    }

    // Fetch owned projects
    const result =
      await pool.query(
        `
        SELECT *
        FROM projects
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [user.id]
      );

    return NextResponse.json(
      result.rows
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch projects",
      },
      {
        status: 500,
      }
    );
  }
}