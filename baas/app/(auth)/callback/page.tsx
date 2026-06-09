"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {

    const router = useRouter();

    useEffect(() => {

        console.log(
            "Current URL:",
            window.location.href
        );

        console.log(
            "Current Hash:",
            window.location.hash
        );

        const params =
            new URLSearchParams(
                window.location.hash.substring(1)
            );

        const accessToken =
            params.get("access_token");

        console.log(
            "Extracted Token:",
            accessToken
        );

        if (accessToken) {

            localStorage.setItem(
                "token",
                accessToken
            );


            document.cookie =
                `token=${accessToken}; path=/`;

            console.log(
                "Stored token"
            );

            window.location.href =
                "/dashboard";

            return;
        }

        console.log(
            "No token found"
        );

        router.push("/login");

    }, [router]);

    return (
        <div>
            Signing you in...
        </div>
    );
}