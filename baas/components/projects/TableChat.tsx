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

type Message = {

  role:
  | "user"
  | "assistant";

  content: string;
};

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

  const [messages,
    setMessages] =
    useState<Message[]>(
      []
    );

  const [error,
    setError] =
    useState("");

  async function askAI() {

    setError("");

    try {

      setLoading(true);

      const userMessage = {

        role: "user",

        content: question,
      };

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
              messages
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

      setMessages(
        previous => [

          ...previous,

          {
            role: "user",
            content: question,
          },

          {
            role: "assistant",
            content:
              data.answer,
          },
        ]
      );

      setQuestion("");

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

        <div
          className="
    h-[400px]
    overflow-y-auto
    border
    rounded-lg
    p-4
    space-y-3
    bg-background
  "
        >

          {messages.map(
            (
              message,
              index
            ) => (

              <div
                key={index}
                className={

                  message.role ===
                    "user"

                    ? `
              ml-auto
              max-w-[80%]
              rounded-lg
              bg-blue-500/10
              p-3
            `

                    : `
              mr-auto
              max-w-[80%]
              rounded-lg
              border
              p-3
            `
                }
              >

                {message.content}

              </div>
            )
          )}

        </div>
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