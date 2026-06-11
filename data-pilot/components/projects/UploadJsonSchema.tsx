"use client";

import { useState }
from "react";

import { Button }
from "@/components/ui/button";

import { Textarea }
from "@/components/ui/textarea";

import { getToken }
from "@/lib/frontend/auth";

interface Props {
  projectId: string;

  onUploaded: () => void;
}

export default function
UploadJsonSchema({
  projectId,
  onUploaded,
}: Props) {

  const [json, setJson] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleUpload() {

    setError("");

    if (!json.trim()) {

      setError(
        "JSON schema is required"
      );

      return;
    }

    try {

      setLoading(true);

      let parsed;

      try {

        parsed =
          JSON.parse(json);
          console.log(parsed);

      } catch {

        setError(
          "Invalid JSON"
        );

        setLoading(false);

        return;
      }

      const token =
        getToken();

      const response =
        await fetch(
          `/api/projects/${projectId}/upload/json`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify(
              parsed
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Upload failed"
        );

        return;
      }

      setJson("");

      onUploaded();

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
        space-y-4
      "
    >

      <Textarea
        placeholder="Paste schema JSON here..."
        value={json}
        onChange={(e) =>
          setJson(e.target.value)
        }
        rows={12}
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
        onClick={handleUpload}
        disabled={loading}
      >
        {loading
          ? "Uploading..."
          : "Upload JSON"}
      </Button>

    </div>
  );
}