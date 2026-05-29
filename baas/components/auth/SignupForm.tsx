"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

export default function SignupForm() {

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

  const [success, setSuccess] =
    useState(false);

  async function handleSignup(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");

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

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    try {

      setLoading(true);

      const response =
        await fetch(
          "/api/auth/signup",
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

      if (!response.ok) {

        setError(
          data.error ||
          "Signup failed"
        );

        return;
      }

      setSuccess(true);

    } catch (error) {

      console.error(error);

      setError(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  }

  if (success) {

    return (
      <div
        className="
          space-y-6
          text-center
        "
      >
        <div
          className="
            text-5xl
          "
        >
          ✓
        </div>

        <div className="space-y-2">

          <h2
            className="
              text-3xl
              font-semibold
              text-white
            "
          >
            Verify Your Email
          </h2>

          <p
            className="
              text-white/60
              leading-relaxed
            "
          >
            We've sent a verification
            link to
          </p>

          <p
            className="
              font-medium
              text-white
            "
          >
            {email}
          </p>

          <p
            className="
              text-sm
              text-white/40
            "
          >
            Open your inbox and click
            the verification link
            before logging in.
          </p>

        </div>

        <Button
          type="button"
          className="w-full"
          onClick={() =>
            router.push("/login")
          }
        >
          Go To Login
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSignup}
      className="
        space-y-4
      "
    >

      <div className="space-y-2">

        <label
          className="
            py-3
            pl-3
            text-base
            font-medium
            text-white/90
          "
        >
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

        <label
          className="
            py-3
            pl-3
            text-base
            font-medium
            text-white/90
          "
        >
          Password
        </label>

        <Input
          className="mt-1"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <p
          className="
            pl-3
            text-sm
            text-white/50
          "
        >
          Must contain at least
          6 characters.
        </p>

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

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Creating account..."
          : "Create Account"}
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

      <div
        className="
          text-center
          text-sm
          text-white/60
        "
      >
        Already have an account?

        <button
          type="button"
          onClick={() =>
            router.push("/login")
          }
          className="
            ml-2
            text-base
            font-medium
            text-white
            hover:text-white/60
          "
        >
          Login
        </button>
      </div>

    </form>
  );
}