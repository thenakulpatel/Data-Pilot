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
      glass-card
      rounded-[32px]
      p-2
      md:p-8
    "
  >
    <div
      className="
        flex
        items-start
        justify-between
        gap-6
      "
    >

      <div>

        <h2
          className="
            text-3xl
            font-bold

            text-white
          "
        >
          Create Project
        </h2>

        <p
          className="
            mt-3

            max-w-xl

            text-white/55
            leading-relaxed
          "
        >
          Create a new backend project with
          database schemas, API generation,
          authentication and deployment tools.
        </p>

      </div>

      <div
        className="
          hidden
          lg:flex

          h-16
          w-16

          items-center
          justify-center

          rounded-2xl

          border
          border-white/10

          bg-white/[0.04]

          text-2xl
        "
      >
        +
      </div>

    </div>

    <form
      onSubmit={handleCreate}
      className="
        mt-8
        space-y-5
      "
    >

      <div>

        <label
          className="
            mb-3
            block

            text-lg
            font-medium

            text-white/90
          "
        >
          Project Name
        </label>

        <Input
          placeholder="e.g. Ecommerce Backend"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

      </div>

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
          size="sm"
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