"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ApiPlayground
  from "./ApiPlayground";

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

import ApiEndpoints
  from "./ApiEndpoints";

import { getToken }
  from "@/lib/frontend/auth";

interface Props {

  projectId: string;

  tableName: string;
}

const PAGE_SIZE = 5;

export default function
  LiveTableViewer({
    projectId,
    tableName,
  }: Props) {

  // ===================================================
  // STATES
  // ===================================================

  const [rows, setRows] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  // ===================================================
  // FETCH DATA
  // ===================================================

  async function fetchRows() {

    try {

      setLoading(true);

      setError("");

      const token =
        getToken();

      const response =
        await authenticatedFetch(
          `/api/projects/${projectId}/data/${tableName}`,
        );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.error ||
          "Failed to fetch rows"
        );

        return;
      }

      setRows(data);

    } catch (error) {

      console.error(error);

      setError(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  }

  // ===================================================
  // EFFECTS
  // ===================================================

  useEffect(() => {

    fetchRows();

  }, [tableName]);

  // Reset page when table changes
  useEffect(() => {

    setPage(1);

  }, [tableName]);

  // ===================================================
  // PAGINATION
  // ===================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        rows.length /
        PAGE_SIZE
      )
    );

  const paginatedRows =
    useMemo(() => {

      const start =
        (page - 1) *
        PAGE_SIZE;

      const end =
        start + PAGE_SIZE;

      return rows.slice(
        start,
        end
      );

    }, [rows, page]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (
      <p>
        Loading table...
      </p>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {

    return (
      <p
        className="
          text-red-500
        "
      >
        {error}
      </p>
    );
  }

  // ===================================================
  // EMPTY STATE
  // ===================================================

  if (rows.length === 0) {

    return (
      <Card
        className="
    border-white/10
    bg-white/[0.03]
    backdrop-blur-xl
  "
      >

        <CardHeader>

          <CardTitle>
            {tableName}
          </CardTitle>

        </CardHeader>

        <CardContent>

          <p
            className="
              text-muted-foreground
            "
          >
            No records found
          </p>

        </CardContent>

      </Card>
    );
  }

  // ===================================================
  // TABLE HEADERS
  // ===================================================

  const columns =
    Object.keys(rows[0]);

  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div
      className="
      space-y-6
    "
    >

      <ApiEndpoints
        projectId={projectId}
        tableName={tableName}
      />

      <ApiPlayground
        projectId={projectId}
        tableName={tableName}
      />

      <Card
        className="
    border-white/10
    bg-white/[0.03]
    backdrop-blur-xl
    py-3
    px-4
  "
      >
        <CardHeader
          className="
    border-b
    border-white/10 

  "
        >

          <CardTitle
            className="
    text-2xl
    font-semibold
    text-white
  "
          >
            Table Records
          </CardTitle>

          <div
            className="
            text-sm
            text-muted-foreground
          "
          >
            {rows.length} rows
          </div>

        </CardHeader>

        <CardContent>

          {/* ============================================
            SCROLL CONTAINER
        ============================================= */}

          <div
            className="
            overflow-auto
            border
            rounded-md
            max-h-[600px]
          "
          >

            <table
              className="
              w-full
              border-collapse
            "
            >

              {/* ========================================
                HEADERS
            ========================================= */}

              <thead
                className="
                sticky
                top-0
                bg-background
                z-10
              "
              >

                <tr>

                  {columns.map(
                    (column) => (

                      <th
                        key={column}
                        className="
                        border-b
                        p-3
                        text-left
                        min-w-[180px]
                        font-medium
                      "
                      >
                        {column}
                      </th>
                    )
                  )}

                </tr>

              </thead>

              {/* ========================================
                ROWS
            ========================================= */}

              <tbody>

                {paginatedRows.map(
                  (
                    row,
                    rowIndex
                  ) => (

                    <tr
                      key={rowIndex}
                    >

                      {columns.map(
                        (column) => (

                          <td
                            key={column}
                            className="
                            border-b
                            p-3
                            whitespace-nowrap
                          "
                          >

                            {String(
                              row[column]
                            )}

                          </td>
                        )
                      )}

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* ============================================
            PAGINATION
        ============================================= */}

          <div
            className="
    mt-8

    flex
    justify-center
  "
          >
            <div
              className="
      inline-flex

      items-center
      gap-2

      rounded-full

      border
      border-white/10

      bg-white/[0.03]

      p-2
    "
            >

              <Button
                variant="ghost"
                disabled={page === 1}
                onClick={() =>
                  setPage(page - 1)
                }
              >
                ←
              </Button>
              {Array.from(
                { length: totalPages }
              ).map((_, index) => {

                const pageNumber =
                  index + 1;

                return (
                  <button
                    key={pageNumber}
                    onClick={() =>
                      setPage(pageNumber)
                    }
                    className={`
        h-10
        w-10

        rounded-full

        transition-all

        ${pageNumber === page
                        ? "bg-white text-black"
                        : "text-white hover:bg-white/10"
                      }
      `}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <Button
                variant="ghost"
                disabled={
                  page === totalPages
                }
                onClick={() =>
                  setPage(page + 1)
                }
              >
                →
              </Button>

            </div>
          </div>

        </CardContent>

      </Card>

    </div>
  );
}