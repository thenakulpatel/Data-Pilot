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

  async function handleSignup(
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

      if (
        data.session?.access_token
      ) {

        saveToken(
          data.session.access_token
        );

        router.push(
          "/dashboard"
        );

      } else {

        router.push("/login");
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
      onSubmit={handleSignup}
      className="
        space-y-4
      "
    >

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

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
          : "Signup"}
      </Button>

    </form>
  );
}