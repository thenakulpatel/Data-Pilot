"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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

    return (
        <Card>

            <CardHeader>

                <CardTitle>
                    Generated APIs
                </CardTitle>

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
                border
                rounded-md
                p-4
                space-y-2
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
                    px-2
                    py-1
                    rounded
                    text-xs
                    font-medium

                    ${endpoint.method === "GET"

                                            ? "bg-green-500/10 text-green-600"

                                            : endpoint.method === "POST"

                                                ? "bg-blue-500/10 text-blue-600"

                                                : endpoint.method === "PUT"

                                                    ? "bg-yellow-500/10 text-yellow-600"

                                                    : "bg-red-500/10 text-red-600"
                                        }
                  `}
                                >
                                    {endpoint.method}
                                </div>

                                <code
                                    className="
                    text-sm
                    break-all
                  "
                                >
                                    {endpoint.path}
                                </code>

                            </div>

                            <p
                                className="
                  text-sm
                  text-muted-foreground
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