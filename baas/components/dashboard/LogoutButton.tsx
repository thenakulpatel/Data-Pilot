"use client";

import { useRouter }
  from "next/navigation";

import { Button }
  from "@/components/ui/button";

import { logout }
  from "@/lib/frontend/logout";

export default function LogoutButton() {

  const router =
    useRouter();

  function handleLogout() {
    logout();
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