"use client";

import { useState }
  from "react";

import { Button }
  from "@/components/ui/button";

import { Input }
  from "@/components/ui/input";

import { getToken }
  from "@/lib/frontend/auth";

interface Props {
  onProjectCreated: () => void;
}

export default function
  CreateProjectForm({
    onProjectCreated,
  }: Props) {

  const [name, setName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleCreate(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(
        "Project name is required"
      );

      return;
    }

    try {

      setLoading(true);

      const token =
        getToken();

      const response =
        await fetch(
          "/api/projects",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Failed to create project"
        );

        return;
      }

      setName("");

      onProjectCreated();

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
    <div
      className="
      rounded-[32px]
      border
      border-white/10

      bg-white/[0.03]

      p-6
      md:p-6
    "
    >
      <div className="mb-6">

        <h2
          className="
          text-2xl
          font-semibold
          text-white
        "
        >
          Create Project
        </h2>

        <p
          className="
          mt-2
          text-sm
          text-white/60
        "
        >
          Generate a new backend workspace,
          database and API infrastructure.
        </p>

      </div>

      <form
        onSubmit={handleCreate}
        className="
        space-y-4
      "
      >
        <Input
          placeholder="Enter project name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        {error && (
          <div
            className="
            rounded-2xl

            border
            border-red-500/20

            bg-red-500/10

            px-4
            py-3

            text-sm
            text-red-300
          "
          >
            {error}
          </div>
        )}

        <div
          className="
          flex
          justify-end
        "
        >
          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
}