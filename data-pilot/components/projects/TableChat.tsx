"use client";

import { useState } from "react";

import {
  Send
} from "lucide-react";

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

  <Card
  className="
    border-white/10

    bg-white/[0.03]

    backdrop-blur-xl
    p-4
  "
>

      <>
  <p
    className="
      text-sm

      uppercase

      tracking-[0.2em]
      m-4

      text-white/40
    "
  >
    AI Assistant
  </p>

  <CardTitle
    className="
          mx-4
      

      text-2xl
      font-semibold

      text-white
    "
  >
    Query Your Data
  </CardTitle>
</>

      <CardContent
        className="
          space-y-4
        "
      >



        {messages.length > 0 && (

          <div
            className="
      h-[500px]

      overflow-y-auto

      rounded-[28px]

      border
      border-white/10

      bg-black/10

      p-6

      space-y-4
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

                    message.role === "user"

                      ? `
        ml-auto

        max-w-[75%]

        rounded-[24px]
        rounded-br-md

        bg-white

        px-5
        py-4

        text-black

        shadow-lg
      `

                      : `
        mr-auto

        max-w-[75%]

        rounded-[24px]
        rounded-bl-md

        border
        border-white/10

        bg-white/[0.05]

        px-5
        py-4

        text-white
      `
                  }
                >

                  {message.content}

                </div>
              )
            )}

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
        <div
          className="
    flex
    items-end
    gap-3
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
            min-h-[50px]
            border
            rounded-md
            p-1
          "
            placeholder="
Ask about your data...
"
          />

          <Button
            onClick={askAI}
            disabled={
              loading ||
              !question.trim()
            }
            size="icon"
            className="
    h-14
    w-14
    rounded-full
  "
          >
            <Send
              className="
      h-5
      w-5
    "
            />
          </Button>
        </div>

      </CardContent>

    </Card>
  );
}