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
    glass-card

    rounded-[32px]

    p-8

    space-y-6

    overflow-hidden
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
        <div
          className="
    flex
    items-start
    gap-4
  "
        >

          <div
            className="
      flex
      h-14
      w-14

      items-center
      justify-center

      rounded-2xl

      glass-panel

      text-2xl
    "
          >
            🤖
          </div>

          <div>

            <p
              className="
        text-sm
        uppercase
        tracking-[0.2em]

        text-white/40
      "
            >
              AI Builder
            </p>

            <h2
              className="
        mt-2

        text-3xl
        font-bold

        text-white
      "
            >
              Generate Database Schema
            </h2>

            <p
              className="
        mt-2

        text-white/50
      "
            >
              Describe your backend and let AI
              generate tables, fields and sample data.
            </p>

          </div>

        </div>

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
  min-h-[220px]
  w-full

  rounded-3xl

  border
  border-white/10

  bg-white/[0.04]

  p-5

  text-white

  placeholder:text-white/50

  backdrop-blur-xl

  resize-none

  focus:outline-none
  focus:border-white/20
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
  mt-3

  h-12
  w-20

  rounded-full

  border
  border-white/10

  bg-white/[0.05]

  px-4

  text-white

  focus:outline-none
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