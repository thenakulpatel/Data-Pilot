import {
  NextRequest,
  NextResponse,
} from "next/server";

import { createClient }
from "@supabase/supabase-js";

const supabase =
  createClient(

    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,

    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export async function GET(
  req: NextRequest
) {

  try {

    // ==============================================
    // AUTH HEADER
    // ==============================================

    const authHeader =
      req.headers.get(
        "authorization"
      );

    // ==============================================
    // NO TOKEN
    // ==============================================

    if (
      !authHeader?.startsWith(
        "Bearer "
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ==============================================
    // TOKEN
    // ==============================================

    const token =
      authHeader.replace(
        "Bearer ",
        ""
      );

    // ==============================================
    // VALIDATE USER
    // ==============================================

    const {
      data,
      error,
    } =
      await supabase.auth.getUser(
        token
      );

    // ==============================================
    // INVALID
    // ==============================================

    if (
      error ||
      !data.user
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid session",
        },
        {
          status: 401,
        }
      );
    }

    // ==============================================
    // SUCCESS
    // ==============================================

    return NextResponse.json({
      user: data.user,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
}