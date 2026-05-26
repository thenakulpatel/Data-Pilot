"use client";

import { useRouter }
from "next/navigation";

import { Button }
from "@/components/ui/button";

import { removeToken }
from "@/lib/frontend/auth";

export default function LogoutButton() {

  const router =
    useRouter();

  function handleLogout() {

    removeToken();

    router.push("/login");
  }

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}