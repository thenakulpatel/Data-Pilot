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
    <form
      onSubmit={handleCreate}
      className="
        flex
        gap-3
      "
    >

      <Input
        placeholder="Project name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <Button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Creating..."
          : "Create"}
      </Button>

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

    </form>
  );
}