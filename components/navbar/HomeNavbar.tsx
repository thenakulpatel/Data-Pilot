"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { logout } from "@/lib/frontend/logout";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HomeNavbar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname.startsWith(href);
  }

  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50

        border-b
        border-white/10

        bg-black/20
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          max-w-7xl
          items-center
          justify-between
          px-6
        "
      >
        {/* Left */}

        <Link
          href="/"
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-full

              border
              border-white/15

              bg-white/5

              text-lg
              font-bold
              text-white
            "
          >
            æ
          </div>

          <div>
            <p
              className="
                text-lg
                text-white/70
              "
            >
              Data - Pilot
            </p>
          </div>
        </Link>

        {/* Center */}

        <nav
          className="
            hidden
            items-center
            gap-2

            md:flex
          "
        >
          <Link
            href="/login"
            className={`
              rounded-full
              px-4
              py-2
              text-sm
              transition-colors

              ${
                isActive("/login")
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white"
              }
            `}
          >
            Upload
          </Link>

          <Link
            href="/dashboard"
            className="
              rounded-full
              px-4
              py-2

              text-sm
              text-white/60

              transition-colors

              hover:text-white
            "
          >
            Documentation
          </Link>
        </nav>

        {/* Right */}
        <Link href="/signup">
          <button
            className="
        rounded-full
        border
        border-white/10
        bg-white/5
        px-5
        py-2
        text-sm
        font-medium
        text-white
        transition-all
        hover:bg-gray-500/15
        hover:text-gray-300
      "
          >
            Get Started
          </button>
        </Link>
      </div>
    </header>
  );
}
