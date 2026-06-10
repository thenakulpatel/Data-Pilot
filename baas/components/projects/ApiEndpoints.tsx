"use client";

import { useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Copy,
    Check,
} from "lucide-react";

interface Props {

    projectId: string;

    tableName: string;
}

export default function
    ApiEndpoints({
        projectId,
        tableName,
    }: Props) {

    const base =
        `/api/projects/${projectId}/data/${tableName}`;



    const endpoints = [

        {
            method: "GET",
            path: base,
            description:
                "Fetch all rows",
        },

        {
            method: "POST",
            path: base,
            description:
                "Insert new row",
        },

        {
            method: "PUT",
            path: `${base}/:id`,
            description:
                "Update row by ID",
        },

        {
            method: "DELETE",
            path: `${base}/:id`,
            description:
                "Delete row by ID",
        },
    ];

    const [copiedEndpoint,
        setCopiedEndpoint] =
        useState<string | null>(
            null
        );

    async function copyEndpoint(
        path: string
    ) {

        await navigator
            .clipboard
            .writeText(path);

        setCopiedEndpoint(path);

        setTimeout(() => {

            setCopiedEndpoint(null);

        }, 2000);
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

            <CardHeader>

                <p
                    className="
      text-sm

      uppercase

      tracking-[0.2em]

      text-white/40
    "
                >
                    API Reference
                </p>

                <CardTitle
                    className="
      mt-2

      text-2xl
      font-semibold

      text-white
    "
                >
                    Generated APIs
                </CardTitle>

                <p
                    className="
      mt-2

      text-white/50
    "
                >
                    Ready-to-use CRUD endpoints
                    generated for this table.
                </p>

            </CardHeader>

            <CardContent
                className="
          space-y-4
        "
            >

                {endpoints.map(
                    (endpoint) => (

                        <div
                            key={
                                endpoint.method
                            }
                            className="
  rounded-3xl

  border
  border-white/10

  bg-white/[0.03]

  p-5

  transition-all

  hover:border-white/20
  hover:bg-white/[0.05]
"
                        >

                            <div
                                className="
                  flex
                  items-center
                  gap-3
                "
                            >

                                <div
                                    className={`
  rounded-full

  px-3
  py-1

  text-xs
  font-semibold

  border

  ${endpoint.method === "GET"

                                            ? `
          border-green-500/30
          bg-green-500/15
          text-green-400
        `

                                            : endpoint.method === "POST"

                                                ? `
          border-blue-500/30
          bg-blue-500/15
          text-blue-400
        `

                                                : endpoint.method === "PUT"

                                                    ? `
          border-yellow-500/30
          bg-yellow-500/15
          text-yellow-400
        `

                                                    : `
          border-red-500/30
          bg-red-500/15
          text-red-400
        `
                                        }
`}
                                >
                                    {endpoint.method}
                                </div>

                                <code
                                    className="
    rounded-xl

    bg-black/20

    px-3
    py-2

    text-sm

    text-white/80

    break-all
  "
                                >
                                    {endpoint.path}
                                </code>
                                <button
                                    onClick={() =>
                                        copyEndpoint(
                                            endpoint.path
                                        )
                                    }
                                    className="
    flex

    h-9
    w-9

    items-center
    justify-center

    rounded-full

    border
    border-white/10

    bg-white/[0.03]

    transition-all
    duration-300

    hover:bg-white/[0.08]
    hover:scale-105
  "
                                >

                                    {copiedEndpoint ===
                                        endpoint.path ? (

                                        <Check
                                            className="
        h-4
        w-4

        text-green-400
      "
                                        />

                                    ) : (

                                        <Copy
                                            className="
        h-4
        w-4

        text-white/60
      "
                                        />

                                    )}

                                </button>

                            </div>

                            <p
                                className="
  mt-3

  text-sm

  text-white/50
"
                            >
                                {endpoint.description}
                            </p>

                        </div>
                    )
                )}

            </CardContent>

        </Card>
    );
}