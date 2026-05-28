"use client";

import { useState }
  from "react";

import { Button }
  from "@/components/ui/button";

import { authenticatedFetch }
  from "@/lib/frontend/authenticatedFetch";

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
  SpreadsheetUploader({
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

    try {

      setError("");

      if (!file) {

        setError(
          "Spreadsheet file required"
        );

        return;
      }

      // ===============================================
      // FILE TYPE
      // ===============================================

      const fileName =
        file.name.toLowerCase();

      const isCSV =
        fileName.endsWith(
          ".csv"
        );

      const isXLSX =
        fileName.endsWith(
          ".xlsx"
        );

      if (
        !isCSV &&
        !isXLSX
      ) {

        setError(
          "Only CSV and XLSX files are supported"
        );

        return;
      }

      // ===============================================
      // ENDPOINT
      // ===============================================

      const endpoint =
        isCSV

          ? "csv"

          : "xlsx";

      // ===============================================
      // REQUEST
      // ===============================================

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
        await authenticatedFetch(
          `/api/projects/${projectId}/preview/${endpoint}`,
          {
            method: "POST",
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
        accept=".csv,.xlsx"
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
          : "Preview Spreadsheet"}

      </Button>

    </div>
  );
}