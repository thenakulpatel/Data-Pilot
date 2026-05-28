"use client";

import {
  useState,
} from "react";

import { Button }
  from "@/components/ui/button";

import { authenticatedFetch }
  from "@/lib/frontend/authenticatedFetch";

import {
  PreviewData,
} from "@/types/preview";

interface Props {

  projectId: string;

  onGenerated: (
    data: PreviewData
  ) => void;
}

export default function
  AiSchemaGenerator({

    projectId,

    onGenerated,

  }: Props) {

  // ================================================
  // STATE
  // ================================================

  const [prompt, setPrompt] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    generateMockData,

    setGenerateMockData,

  ] = useState(true);

  const [rowCount,
    setRowCount] =
    useState(5);

  // ================================================
  // GENERATE
  // ================================================

  async function handleGenerate() {

    try {

      setError("");

      if (!prompt.trim()) {

        setError(
          "Prompt required"
        );

        return;
      }

      setLoading(true);

      const response =
        await authenticatedFetch(
          `/api/projects/${projectId}/ai/schema`,

          {

            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              prompt,
              generateMockData,
              rowCount,

            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "AI generation failed"
        );

        return;
      }

      // ============================================
      // PREVIEW FLOW
      // ============================================

      onGenerated(data);

    } catch (error) {

      console.error(error);

      setError(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  }

  // ================================================
  // UI
  // ================================================

  return (

    <div
      className="
        border
        rounded-xl
        p-5
        space-y-5
      "
    >

      {/* ============================================
          HEADER
      ============================================= */}

      <div
        className="
          space-y-2
        "
      >

        <h2
          className="
            text-xl
            font-semibold
          "
        >
          AI Backend Generator
        </h2>

        <p
          className="
            text-sm
            text-muted-foreground
          "
        >
          Describe the backend
          system you want.
        </p>

      </div>

      {/* ============================================
          PROMPT
      ============================================= */}

      <textarea

        value={prompt}

        onChange={(e) =>
          setPrompt(
            e.target.value
          )
        }

        placeholder={`

Create a single employee table with:
- name
- salary
- joining_date

        `}

        rows={8}

        className="
          w-full
          border
          rounded-md
          p-3
          text-sm
        "
      />

      {/* ============================================
          MOCK DATA
      ============================================= */}

      <label
        className="
          flex
          items-center
          gap-3
          text-sm
        "
      >

        <input
          type="checkbox"

          checked={
            generateMockData
          }

          onChange={(e) =>
            setGenerateMockData(
              e.target.checked
            )
          }
        />

        Generate realistic
        mock data

      </label>

      {/* ============================================
          ROW COUNT
      ============================================= */}

      {generateMockData && (

        <div
          className="
            space-y-2
          "
        >

          <p
            className="
              text-sm
              font-medium
            "
          >
            Number of rows
          </p>

          <input
            type="number"

            min={1}

            max={100}

            value={rowCount}

            onChange={(e) =>

              setRowCount(

                Math.min(
                  Math.max(
                    Number(
                      e.target.value
                    ),
                    1
                  ),
                  100
                )
              )
            }

            className="
              w-full
              border
              rounded-md
              p-2
            "
          />

          <p
            className="
              text-xs
              text-muted-foreground
            "
          >
            Maximum 100 rows
          </p>

        </div>
      )}

      {/* ============================================
          ERROR
      ============================================= */}

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

      {/* ============================================
          ACTION
      ============================================= */}

      <Button
        onClick={handleGenerate}
        disabled={loading}
      >

        {loading

          ? "Generating..."

          : "Generate Backend"}

      </Button>

    </div>
  );
}