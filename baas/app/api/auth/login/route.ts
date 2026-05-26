import { NextRequest, NextResponse }
from "next/server";

import { supabase }
from "@/lib/supabase";

export async function POST(
  req: NextRequest
) {
  try {

    const body =
      await req.json();

    const { email, password } =
      body;

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      message:
        "Login successful",
      session: data.session,
      user: data.user,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}