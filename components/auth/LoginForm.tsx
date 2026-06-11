"use client";

import { useState }
  from "react";

import { useRouter }
  from "next/navigation";

import { Button }
  from "@/components/ui/button";

import { Input }
  from "@/components/ui/input";

import { saveToken }
  from "@/lib/frontend/auth";

import GoogleLoginButton
  from "@/components/auth/GoogleLoginButton";

export default function LoginForm() {

  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError(
        "Password is required"
      );

      return;
    }

    try {

      setLoading(true);

      const response =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();
      console.log(data);

      if (!response.ok) {

        setError(
          data.error ||
          "Login failed"
        );

        return;
      }

      if (
        data.session?.access_token
      ) {

        saveToken(
          data.session.access_token
        );

        router.push(
          "/dashboard"
        );
      }

    } catch (error) {

      console.error(error);

      setError(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="
          space-y-4
        "
    >
      <div className="space-y-2">
        <label className="py-3 pl-3 text-base
    font-medium
    text-white/90">
          Email
        </label>
        <Input
          className="mt-1"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
      </div>
      <div className="space-y-2">
        <label className="py-3 pl-3 text-base
    font-medium
    text-white/90">
          Password
        </label>
        <Input
          className="mt-1"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
      </div>
      {error && (
        <p
          className="
              text-sm
              text-red-500
            "
        >
          {error}
        </p>
      )}
      <div
        className="
    flex
    justify-end
  "
      >
        <button
          type="button"
          className="
      text-sm
      text-white
      hover:text-white/60
    "
        >
          Forgot password?
        </button>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Logging in..."
          : "Login"}
      </Button>
      <div
        className="
    flex
    items-center
    gap-4
  "
      >
        <div className="h-px flex-1 bg-white/60" />

        <span
          className="
      text-sm
      text-white/60
    "
        >
          OR
        </span>

        <div className="h-px flex-1 bg-white/60" />
      </div>
      <GoogleLoginButton />
      <div
        className="
    text-center
    text-sm
    text-white/60
  "
      >
        Don't have an account?

        <button
          type="button"
          onClick={() =>
            router.push("/signup")
          }
          className="
      ml-2
      font-medium
         text-white
          text-base
      hover:text-white/60
    "
        >
          Sign up
        </button>
      </div>

    </form>
  );
}