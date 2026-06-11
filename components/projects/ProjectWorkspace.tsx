"use client";

import {
  useEffect,
  useState,
} from "react";

import AiSchemaGenerator
  from "./AiSchemaGenerator";

import LiveTableViewer
  from "./LiveTableViewer";

import { logout }
  from "@/lib/frontend/logout";

import { Button }
  from "@/components/ui/button";

import SpreadsheetUploader
  from "./SpreadsheetUploader";

import EditableDataGrid
  from "./EditableDataGrid";

import ExistingTables
  from "./ExistingTables";

import { authenticatedFetch }
  from "@/lib/frontend/authenticatedFetch";

import {
  Schema,
} from "@/types/schema";

import {
  PreviewData,
} from "@/types/preview";

import ApiKeyCard
  from "./ApiKeyCard";

import { Card, CardContent } from "../ui/card";


interface Props {
  projectId: string;
  apiKey: string;
}

export default function
  ProjectWorkspace({
    projectId,
    apiKey,
  }: Props) {

  const [schema, setSchema] =
    useState<Schema | null>(
      null
    );

  const [preview, setPreview] =
    useState<PreviewData | null>(
      null
    );


  const [creationMode,
    setCreationMode] =
    useState<
      "upload" |
      "ai" |
      null
    >(null);



  async function fetchSchema() {

    try {


      const response =
        await authenticatedFetch(
          `/api/projects/${projectId}/schema`,
        );

      if (
        response.status === 404
      ) {

        setSchema(null);

        return;
      }

      const data =
        await response.json();

      if (response.status === 401) {

        logout();

        return;
      }

      if (!response.ok) {

        return;
      }

      setSchema(
        data.schema || data
      );

    } catch (error) {

      console.error(error);
    }
  }

  useEffect(() => {
    fetchSchema();
  }, []);

  return (
    <div
      className="
        space-y-8
      "
    >

      <div>

        <p
          className="
        text-sm
        uppercase
        tracking-widest
        text-white/40
      "
        >
          Project Workspace
        </p>

        <h1
          className="
        mt-2
        text-5xl
        font-bold
        text-white
      "
        >
          Manage Tables
        </h1>

      </div>



      <ApiKeyCard
        apiKey={apiKey}
      />

      <Card
        className="
    glass-card

    overflow-hidden
  "
      >

        <CardContent
          className="
      p-6
    "
        >

          <h2
            className="
        text-2xl
        font-semibold
      "
          >
            Create Table
          </h2>

          <p
            className="
        mt-2
        text-white/50
      "
          >
            Choose how you want to create
            your next table.
          </p>

          <div
            className="
    mt-8

    grid
    gap-5

    md:grid-cols-2
  "
          >

            {/* Upload */}

            <button
              onClick={() =>
                setCreationMode(
                  creationMode === "upload"
                    ? null
                    : "upload"
                )
              }
              className={`
    glass-panel

    rounded-3xl

    p-6

    text-left

    transition-all
    duration-300

    hover:-translate-y-1

    ${creationMode === "upload"
                  ? `
          border-white/20
          shadow-[0_0_30px_rgba(255,255,255,0.08)]
        `
                  : ""
                }
  `}
            >

              <div className="text-3xl">
                📄
              </div>

              <h3
                className="
      mt-4
      text-lg
      font-semibold
      text-white
    "
              >
                Upload CSV / XLSX
              </h3>

              <p
                className="
      mt-2
      text-sm
      text-white/50
    "
              >
                Import spreadsheets and
                instantly generate tables.
              </p>

            </button>

            {/* AI */}

            <button
              onClick={() =>
                setCreationMode(
                  creationMode === "ai"
                    ? null
                    : "ai"
                )
              }
              className={`
    glass-panel

    rounded-3xl

    p-6

    text-left

    transition-all
    duration-300

    hover:-translate-y-1

    ${creationMode === "ai"
                  ? `
          border-white/20
          shadow-[0_0_30px_rgba(255,255,255,0.08)]
        `
                  : ""
                }
  `}
            >

              <div className="text-3xl">
                🤖
              </div>

              <h3
                className="
      mt-4
      text-lg
      font-semibold
      text-white
    "
              >
                Generate with AI
              </h3>

              <p
                className="
      mt-2
      text-sm
      text-white/50
    "
              >
                Describe your schema and
                let AI build it for you.
              </p>

            </button>


          </div>

        </CardContent>

      </Card>

      {creationMode === "upload" && (

        <div
          className="
      animate-in
      fade-in
      slide-in-from-top-2
    "
        >
          <SpreadsheetUploader
            projectId={projectId}
            onPreviewReady={
              setPreview
            }
          />
        </div>

      )}

      {creationMode === "ai" && (

        <div
          className="
      animate-in
      fade-in
      slide-in-from-top-2
    "
        >
          <AiSchemaGenerator
            projectId={projectId}
            onGenerated={setPreview}
          />
        </div>

      )}
       {preview && (

        <div
          className="
      pt-10
      space-y-6
    "
        >

          <div>

            <p
              className="
          text-sm
          uppercase
          tracking-[0.25em]
          text-white/40
        "
            >
              Preview
            </p>

            <h2
              className="
          mt-2
          text-4xl
          font-bold
          text-white
        "
            >
              Review Before Deploy
            </h2>

            <p
              className="
          mt-2
          text-white/50
        "
            >
              Edit fields, rows and
              table structure before
              generating APIs.
            </p>

          </div>

          <EditableDataGrid
            projectId={projectId}
            preview={preview}
            setPreview={setPreview}
            onDeploy={async () => {

              await fetchSchema();

              setPreview(null);

              setCreationMode(null);
            }}
          />

        </div>

      )}


      <div
        className="
    pt-4
  "
      >
        <p
          className="
      text-sm
      uppercase
      tracking-[0.25em]

      text-white/40
    "
        >
          Database
        </p>

        <h2
          className="
      mt-3

      text-4xl
      font-bold

      text-white
    "
        >
          Existing Tables
        </h2>

        <p
          className="
      mt-3

      text-white/50
    "
        >
          Browse, manage and open
          your deployed tables.
        </p>
      </div>

      <ExistingTables
        projectId={projectId}
        schema={schema}
        onRefresh={fetchSchema}
      />



     

    </div>
  );
}