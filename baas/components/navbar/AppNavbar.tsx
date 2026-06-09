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

export default function AppNavbar() {

    const pathname =
        usePathname();

    function isActive(
        href: string
    ) {
        return pathname.startsWith(
            href
        );
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
                        B
                    </div>

                    <div>
                        <p
                            className="
                text-sm
                text-white/50
              "
                        >
                            Backend Generator
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
                        href="/dashboard"
                        className={`
              rounded-full
              px-4
              py-2
              text-sm
              transition-colors

              ${isActive("/dashboard")
                                ? "bg-white/10 text-white"
                                : "text-white/60 hover:text-white"
                            }
            `}
                    >
                        Dashboard
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

                <AlertDialog>

                    <AlertDialogTrigger asChild>

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
        hover:bg-red-500/15
        hover:text-red-300
      "
                        >
                            Logout
                        </button>

                    </AlertDialogTrigger>

                    <AlertDialogContent
                        className="
      border-white/10
      bg-zinc-950
      text-white
    "
                    >

                        <AlertDialogHeader>

                            <AlertDialogTitle>
                                Logout?
                            </AlertDialogTitle>

                            <AlertDialogDescription
                                className="
          text-white/60
        "
                            >
                                Are you sure you want to logout from your account?
                            </AlertDialogDescription>

                        </AlertDialogHeader>

                        <AlertDialogFooter>

                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                onClick={logout}
                                className="
          bg-red-600
          hover:bg-red-700
        "
                            >
                                Logout
                            </AlertDialogAction>

                        </AlertDialogFooter>

                    </AlertDialogContent>

                </AlertDialog>
            </div>
        </header>
    );
}