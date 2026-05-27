"use client";

import {
    useState,
} from "react";

import { Button }
    from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const PAGE_SIZE = 10;

interface Props {

    projectId: string;

    tableName: string;
}

export default function
    ApiPlayground({
        projectId,
        tableName,
    }: Props) {

    // ===================================================
    // STATES
    // ===================================================

    const [method, setMethod] =
        useState("GET");

    const [rowId, setRowId] =
        useState("");

    const [body, setBody] =
        useState(`{
  
}`);

    const [response,
        setResponse] =
        useState<any>(null);

    const [page, setPage] =
        useState(1);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // ===================================================
    // URL
    // ===================================================

    function getUrl() {

        const base =
            `/api/projects/${projectId}/data/${tableName}`;

        if (
            method === "PUT" ||
            method === "DELETE"
        ) {

            return `${base}/${rowId}`;
        }

        return base;
    }

    // ===================================================
    // REQUEST
    // ===================================================

    async function handleSend() {

        try {

            setLoading(true);

            setError("");

            setResponse("");

            const token =
                localStorage.getItem(
                    "token"
                );

            const headers:
                Record<
                    string,
                    string
                > = {

                Authorization:
                    `Bearer ${token}`,
            };

            // JSON methods
            if (
                method !== "GET" &&
                method !== "DELETE"
            ) {

                headers[
                    "Content-Type"
                ] =
                    "application/json";
            }

            let parsedBody =
                undefined;

            if (
                method === "POST" ||
                method === "PUT"
            ) {

                parsedBody =
                    JSON.parse(body);
            }

            const res =
                await fetch(
                    getUrl(),
                    {

                        method,

                        headers,

                        body:
                            parsedBody
                                ? JSON.stringify(
                                    parsedBody
                                )
                                : undefined,
                    }
                );

            const data =
                await res.json();

            setResponse(data);

            setPage(1);

        } catch (error) {

            console.error(error);

            setError(
                "Request failed"
            );

        } finally {

            setLoading(false);
        }
    }

    // ===================================================
    // RENDER
    // ===================================================
    // ================================================
    // ARRAY RESPONSE
    // ================================================

    const isArrayResponse =
        Array.isArray(response);

    // ================================================
    // PAGINATION
    // ================================================

    const totalPages =
        isArrayResponse

            ? Math.max(
                1,
                Math.ceil(
                    response.length /
                    PAGE_SIZE
                )
            )

            : 1;

    const paginatedResponse =
        isArrayResponse

            ? response.slice(
                (page - 1) *
                PAGE_SIZE,

                page * PAGE_SIZE
            )

            : response;
    return (
        <Card>

            <CardHeader>

                <CardTitle>
                    API Playground
                </CardTitle>

            </CardHeader>

            <CardContent
                className="
          space-y-4
        "
            >

                {/* ============================================
            METHOD
        ============================================= */}

                <div
                    className="
            flex
            gap-2
            flex-wrap
          "
                >

                    {[
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                    ].map(
                        (value) => (

                            <Button
                                key={value}

                                variant={
                                    method === value
                                        ? "default"
                                        : "outline"
                                }

                                onClick={() =>
                                    setMethod(value)
                                }
                            >
                                {value}
                            </Button>
                        )
                    )}

                </div>

                {/* ============================================
            URL
        ============================================= */}

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
                        Endpoint
                    </p>

                    <code
                        className="
              block
              p-3
              rounded-md
              border
              text-sm
              break-all
            "
                    >
                        {getUrl()}
                    </code>

                </div>

                {/* ============================================
            ROW ID
        ============================================= */}

                {(method === "PUT" ||
                    method === "DELETE") && (

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
                                Row ID
                            </p>

                            <input
                                value={rowId}

                                onChange={(e) =>
                                    setRowId(
                                        e.target.value
                                    )
                                }

                                placeholder="Enter row ID"

                                className="
                w-full
                border
                rounded-md
                p-2
              "
                            />

                        </div>
                    )}

                {/* ============================================
            REQUEST BODY
        ============================================= */}

                {(method === "POST" ||
                    method === "PUT") && (

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
                                JSON Body
                            </p>

                            <textarea
                                value={body}

                                onChange={(e) =>
                                    setBody(
                                        e.target.value
                                    )
                                }

                                rows={10}

                                className="
                w-full
                border
                rounded-md
                p-3
                font-mono
                text-sm
              "
                            />

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
                    onClick={handleSend}
                    disabled={loading}
                >

                    {loading
                        ? "Sending..."
                        : "Send Request"}

                </Button>

                {/* ============================================
            RESPONSE
        ============================================= */}

                {response && (

                    <div
                        className="
      space-y-4
    "
                    >

                        <p
                            className="
        text-sm
        font-medium
      "
                        >
                            Response
                        </p>

                        {/* ============================================
        ARRAY RESPONSE
    ============================================= */}

                        {isArrayResponse ? (

                            <div
                                className="
          space-y-4
        "
                            >

                                {/* ========================================
            SCROLL CONTAINER
        ========================================= */}

                                <div
                                    className="
            border
            rounded-md
            overflow-auto
            max-h-[500px]
          "
                                >

                                    <pre
                                        className="
              p-4
              text-sm
              min-w-[700px]
            "
                                    >
                                        {JSON.stringify(
                                            paginatedResponse,
                                            null,
                                            2
                                        )}
                                    </pre>

                                </div>

                                {/* ========================================
            PAGINATION
        ========================================= */}

                                <div
                                    className="
            flex
            items-center
            justify-between
          "
                                >

                                    <Button
                                        variant="outline"

                                        disabled={
                                            page === 1
                                        }

                                        onClick={() =>
                                            setPage(
                                                page - 1
                                            )
                                        }
                                    >
                                        Previous
                                    </Button>

                                    <div
                                        className="
              text-sm
            "
                                    >
                                        Page {page} of{" "}
                                        {totalPages}
                                    </div>

                                    <Button
                                        variant="outline"

                                        disabled={
                                            page ===
                                            totalPages
                                        }

                                        onClick={() =>
                                            setPage(
                                                page + 1
                                            )
                                        }
                                    >
                                        Next
                                    </Button>

                                </div>

                            </div>

                        ) : (

                            /* ==========================================
                                NORMAL RESPONSE
                            =========================================== */

                            <div
                                className="
          border
          rounded-md
          overflow-auto
          max-h-[500px]
        "
                            >

                                <pre
                                    className="
            p-4
            text-sm
            min-w-[700px]
          "
                                >
                                    {JSON.stringify(
                                        response,
                                        null,
                                        2
                                    )}
                                </pre>

                            </div>

                        )}

                    </div>
                )}

            </CardContent>

        </Card>
    );
}