"use client";

import { useState }
  from "react";

import { Button }
  from "@/components/ui/button";

import { validateColumnType, }
  from "@/lib/schema/validateColumnType";

import { validateSqlName }
  from "@/lib/sql/validateSqlName";


import { authenticatedFetch }
  from "@/lib/frontend/authenticatedFetch";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  PreviewData,
} from "@/types/preview";

interface Props {

  projectId: string;

  preview: PreviewData;

  setPreview: (
    preview: PreviewData
  ) => void;

  onDeploy: () => void;
}

const PAGE_SIZE = 10;

export default function
  EditableDataGrid({

    projectId,

    preview,

    setPreview,

    onDeploy,

  }: Props) {

  const table =
    preview.schema.tables[0];

  const [page, setPage] =
    useState(1);
  const [deploying,
    setDeploying] =
    useState(false);

  const [deployError,
    setDeployError] =
    useState("");

  const start =
    (page - 1) * PAGE_SIZE;

  const end =
    start + PAGE_SIZE;

  const paginatedRows =
    preview.rows.slice(
      start,
      end
    );

  const totalPages =
    Math.ceil(
      preview.rows.length /
      PAGE_SIZE
    );
  async function handleDeploy() {

    try {

      setDeployError("");

      const typeErrors:
        string[] = [];
      console.log(
        "Current fields:",
        preview.schema.tables[0]
          .fields
      );

      for (
        const field
        of preview.schema.tables[0].fields
      ) {
        console.log(
          field.name,
          field.type
        );
        const result =
          validateColumnType(

            preview.rows,

            field.name,

            field.type
          );

        if (
          !result.valid
        ) {

          typeErrors.push(

            `${field.name}: ${result.invalidCount} incompatible value(s) for ${field.type}`

          );
        }
      }

      if (
        typeErrors.length > 0
      ) {

        setDeployError(

          typeErrors.join("\n")

        );

        return;
      }

      const hasErrors =

        preview.schema.tables[0].fields.some(
          (field) =>

            !validateSqlName(

              field.name,

              preview.schema.tables[0].fields.map(
                (f) => f.name
              )

            ).valid
        );

      if (hasErrors) {

        setDeployError(
          "Fix field names before deployment"
        );

        return;
      }

      setDeploying(true);


      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await authenticatedFetch(
          `/api/projects/${projectId}/deploy`,
          {
            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              schema:
                preview.schema,

              rows:
                preview.rows,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setDeployError(
          data.error ||
          "Deployment failed"
        );

        return;
      }

      // Success callback
      onDeploy();

    } catch (error) {

      console.error(error);

      setDeployError(
        "Something went wrong"
      );

    } finally {

      setDeploying(false);
    }
  }


  function updateCell(
    rowIndex: number,
    column: string,
    value: string
  ) {

    const updatedRows =
      [...preview.rows];

    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [column]: value,
    };

    setDeployError("");

    setPreview({
      ...preview,
      rows: updatedRows,
    });
  }

  function deleteRow(
    rowIndex: number
  ) {

    const updatedRows =
      preview.rows.filter(
        (_, index) =>
          index !== rowIndex
      );
    setDeployError("");
    setPreview({
      ...preview,
      rows: updatedRows,
    });
  }

  function addRow() {

    const emptyRow:
      Record<
        string,
        any
      > = {};

    table.fields.forEach(
      (field) => {

        emptyRow[
          field.name
        ] = "";
      }
    );
    setDeployError("");
    setPreview({
      ...preview,
      rows: [
        ...preview.rows,
        emptyRow,
      ],
    });
  }
  function updateFieldName(
    fieldIndex: number,
    value: string
  ) {

    const oldName =
      table.fields[fieldIndex].name;

    const updated =
      structuredClone(
        preview
      );

    // Update schema field
    updated.schema.tables[0]
      .fields[fieldIndex]
      .name = value;

    // Rename row keys
    updated.rows =
      updated.rows.map(
        (row) => {

          const newRow = {
            ...row,
          };

          newRow[value] =
            newRow[oldName];

          delete newRow[
            oldName
          ];

          return newRow;
        }
      );

    setDeployError("");
    setPreview(updated);
  }
  return (
    <Card>

      <CardHeader
        className="
          flex
          flex-row
          items-center
          justify-between
        "
      >

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
            Table Name
          </p>

          <input

            value={
              table.name
            }

            onChange={(e) => {

              const updated =
                structuredClone(
                  preview
                );

              updated.schema.tables[0]
                .name =

                e.target.value

                  .toLowerCase()

                  .replace(
                    /[\s-]+/g,
                    "_"
                  )

                  .replace(
                    /[^a-z0-9_]/g,
                    ""
                  );

              setPreview(updated);
            }}

            placeholder="
      Enter table name
    "

            className="
      border
      rounded-md
      px-3
      py-2
      text-sm
      w-[250px]
    "
          />

        </div>

        <div
          className="
    flex
    gap-2
  "
        >

          <Button
            onClick={addRow}
          >
            Add Row
          </Button>

          <Button
            onClick={handleDeploy}
            disabled={deploying}
          >

            {deploying
              ? "Generating..."
              : "Generate API"}

          </Button>

        </div>
      </CardHeader>

      <CardContent>

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

            <thead
              className="
                sticky
                top-0
                bg-background
              "
            >

              <tr>

                {table.fields.map(
                  (field, index) => (

                    <th
                      key={index}
                      className="
                        border-b
                        p-3
                        text-left
                        min-w-[180px]
                      "
                    >

                      <div
                        className="
    space-y-1
  "
                      >

                        <input

                          value={
                            field.name
                          }

                          onChange={(e) =>
                            updateFieldName(
                              index,
                              e.target.value
                            )
                          }

                          className="
      w-full
      border
      rounded
      px-2
      py-1
      text-sm
    "
                        />

                        {!validateSqlName(
                          field.name,

                          table.fields.map(
                            (f) => f.name
                          )
                        ).valid && (

                            <p
                              className="
        text-xs
        text-red-500
      "
                            >

                              {
                                validateSqlName(
                                  field.name,

                                  table.fields.map(
                                    (f) => f.name
                                  )
                                ).error
                              }

                            </p>

                          )}

                      </div>
                      <div
                        className="
                          text-xs
                          text-muted-foreground
                        "
                      >
                        <select
                          value={field.type}
                          onChange={(e) => {

                            const updated =
                              structuredClone(
                                preview
                              );

                            updated.schema.tables[0]
                              .fields[index]
                              .type =
                              e.target.value;

                            setDeployError("");

                            setPreview(updated);
                          }}
                        >

                          <option value="text">
                            text
                          </option>

                          <option value="number">
                            number
                          </option>

                          <option value="boolean">
                            boolean
                          </option>

                          <option value="date">
                            date
                          </option>

                        </select>
                      </div>

                    </th>
                  )
                )}

                <th
                  className="
                    border-b
                    p-3
                  "
                >
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {paginatedRows.map(
                (
                  row,
                  rowIndex
                ) => {

                  const actualIndex =
                    start +
                    rowIndex;

                  return (

                    <tr
                      key={
                        actualIndex
                      }
                    >

                      {table.fields.map(
                        (
                          field
                        ) => (

                          <td
                            key={
                              field.name
                            }
                            className="
                              border-b
                              p-2
                            "
                          >

                            <input
                              value={
                                row[
                                field.name
                                ] ?? ""
                              }

                              onChange={(
                                e
                              ) =>
                                updateCell(
                                  actualIndex,
                                  field.name,
                                  e.target.value
                                )
                              }

                              className="
                                w-full
                                bg-transparent
                                outline-none
                              "
                            />

                          </td>
                        )
                      )}

                      <td
                        className="
                          border-b
                          p-2
                        "
                      >

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            deleteRow(
                              actualIndex
                            )
                          }
                        >
                          Delete
                        </Button>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

        <div
          className="
            flex
            items-center
            justify-between
            mt-4
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

          <span>
            Page {page} of{" "}
            {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={
              page === totalPages
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

      </CardContent>
      {deployError && (

        <pre
          className="
      text-sm
      text-red-500
      whitespace-pre-wrap
    "
        >
          {deployError}
        </pre>

      )}
    </Card>
  );
}