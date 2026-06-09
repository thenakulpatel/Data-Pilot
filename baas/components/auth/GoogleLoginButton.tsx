"use client";

import { supabase }
    from "@/lib/supabase";

export default function
    GoogleLoginButton() {

    async function handleGoogleLogin() {

        console.log("Starting Google OAuth");

        const { error } =
            await supabase.auth
                .signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo:
                            `${window.location.origin}/callback`,
                    },
                });

        console.log("OAuth result:", error);

        if (error) {
            console.error(error);
        }
    }

    return (

        <button
            onClick={
                handleGoogleLogin
            }
            className="
        flex
        w-full
        items-center
        justify-center
        gap-3

        rounded-lg

        border
        border-white/10

        bg-white/5

        px-4
        py-3

        text-white

        transition

        hover:bg-white/10
      "
        >
            Google
        </button>
    );
}