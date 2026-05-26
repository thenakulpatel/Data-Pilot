import { NextRequest }
from "next/server";

import { getUser }
from "./getUser";

import { checkProjectOwnership }
from "./checkProjectOwnership";

export async function
authorizeProject(
  req: NextRequest,
  projectId: string
) {

  // Extract auth header
  const authHeader =
    req.headers.get(
      "authorization"
    );

  if (!authHeader) {
    return {
      error: "Unauthorized",
      status: 401,
    };
  }

  // Extract token
  const token =
    authHeader.replace(
      "Bearer ",
      ""
    );

  // Get authenticated user
  const user =
    await getUser(token);

  if (!user) {
    return {
      error: "Invalid token",
      status: 401,
    };
  }

  // Verify ownership
  const ownsProject =
    await checkProjectOwnership(
      projectId,
      user.id
    );

  if (!ownsProject) {
    return {
      error: "Forbidden",
      status: 403,
    };
  }

  return {
    user,
  };
}