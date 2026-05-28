"use client";

import {
  useEffect,
  useState,
} from "react";

import { getToken }
from "@/lib/frontend/auth";

import { authenticatedFetch }
from "@/lib/frontend/authenticatedFetch";

export default function
DashboardGuard({

  children,

}: {
  children: React.ReactNode;
}) {

  const [checking,
    setChecking] =
    useState(true);

  useEffect(() => {

    async function validate() {

      try {

        // ==========================================
        // TOKEN
        // ==========================================

        const token =
          getToken();

        // ==========================================
        // NO TOKEN
        // ==========================================

        if (!token) {

          window.location.replace(
            "/login"
          );

          return;
        }

        // ==========================================
        // VALIDATE SESSION
        // ==========================================

        await authenticatedFetch(
          "/api/auth/me"
        );

        // ==========================================
        // SUCCESS
        // ==========================================

        setChecking(false);

      } catch {

        // authenticatedFetch
        // handles redirect
      }
    }

    validate();

  }, []);

  // ================================================
  // LOADING
  // ================================================

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

  // ================================================
  // CONTENT
  // ================================================

  return <>{children}</>;
}