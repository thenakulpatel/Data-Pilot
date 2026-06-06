"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button }
  from "@/components/ui/button";

import { authenticatedFetch }
  from "@/lib/frontend/authenticatedFetch";

interface Props {

  projectId: string;

  tableName: string;
}

export default function
  TableChat({
    projectId,
    tableName,
  }: Props) {

  const [question,
    setQuestion] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [answer,
    setAnswer] =
    useState("");

  const [error,
    setError] =
    useState("");

  async function askAI() {

    setError("");

    setAnswer("");

    try {

      setLoading(true);

      const response =
        await authenticatedFetch(
          `/api/projects/${projectId}/ai/query`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              tableName,
              question,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          "Something went wrong. Please try another question."
        );

        return;
      }

      setAnswer(
        data.answer
      );

    } catch (error) {

      console.error(error);

      setError(
        "Failed to contact AI service"
      );
    } finally {

      setLoading(false);
    }
  }

  return (

    <Card>

      <CardHeader>

        <CardTitle>
          AI Assistant
        </CardTitle>

      </CardHeader>

      <CardContent
        className="
          space-y-4
        "
      >

        <textarea
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          className="
            w-full
            min-h-[120px]
            border
            rounded-md
            p-3
          "
          placeholder="
Ask about your data...
"
        />

        <Button
          onClick={askAI}
        >
          {
            loading
              ? "Thinking..."
              : "Ask AI"
          }
        </Button>

        {answer && (

          <div
            className="
              rounded-md
              border
              p-4
            "
          >
            {answer}
          </div>

        )}
        {error && (

          <div
            className="
      rounded-md
      border
      border-red-500/30
      bg-red-500/10
      p-3
      text-red-500
    "
          >
            {error}
          </div>

        )}

      </CardContent>

    </Card>
  );
}