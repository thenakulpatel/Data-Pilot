import {
  NextRequest,
  NextResponse,
} from "next/server";

export function middleware(
  req: NextRequest
) {

  // ================================================
  // TOKEN
  // ================================================

  const token =
    req.cookies.get(
      "token"
    )?.value;

  // ================================================
  // PROTECTED ROUTES
  // ================================================

  const isProtectedRoute =

    req.nextUrl.pathname.startsWith(
      "/dashboard"
    )

    ||

    req.nextUrl.pathname.startsWith(
      "/projects"
    );

  // ================================================
  // BLOCK ACCESS
  // ================================================

  if (
    isProtectedRoute &&
    !token
  ) {

    return NextResponse.redirect(

      new URL(
        "/login",
        req.url
      )
    );
  }

  // ================================================
  // ALLOW
  // ================================================

  return NextResponse.next();
}

// ================================================
// MATCHER
// ================================================

export const config = {

  matcher: [

    "/dashboard/:path*",
    "/projects/:path*",
  ],
};