"use client";

import { useState }
from "react";

import { Button }
from "@/components/ui/button";

import { getToken }
from "@/lib/frontend/auth";

import {
  PreviewData,
} from "@/types/preview";

interface Props {
  projectId: string;

  onPreviewReady: (
    data: PreviewData
  ) => void;
}

export default function
CsvUploader({
  projectId,
  onPreviewReady,
}: Props) {

  const [file, setFile] =
    useState<File | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleUpload() {

    setError("");

    if (!file) {

      setError(
        "CSV file required"
      );

      return;
    }

    try {

      setLoading(true);

      const token =
        getToken();

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          `/api/projects/${projectId}/preview/csv`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Preview failed"
        );

        return;
      }

      onPreviewReady(data);

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

      <input
        type="file"
        accept=".csv"
        onChange={(e) => {

          const selected =
            e.target.files?.[0];

          if (selected) {
            setFile(selected);
          }
        }}
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
          ? "Processing..."
          : "Preview CSV"}

      </Button>

    </div>
  );
}