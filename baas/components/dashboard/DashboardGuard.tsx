"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter }
from "next/navigation";

import { getToken }
from "@/lib/frontend/auth";

export default function DashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {

  const router =
    useRouter();

  const [checking, setChecking] =
    useState(true);

  useEffect(() => {

    const token =
      getToken();

    if (!token) {

      router.push("/login");

    } else {

      setChecking(false);
    }

  }, [router]);

  if (checking) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >
        <p>
          Loading...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}