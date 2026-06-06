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


  const [showUploader,
    setShowUploader] =
    useState(false);

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

      <div
        className="
    flex
    flex-col
    gap-4
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

      </div>

      <ApiKeyCard
        apiKey={apiKey}
      />

      <Card>

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
        mt-6

        grid
        gap-4

        md:grid-cols-3
      "
          >

            {/* Upload */}

            <button
              onClick={() => {

                setShowUploader(true);

              }}
              className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          text-left
        "
            >
              Upload CSV/XLSX
            </button>

            {/* AI */}

            <button
              className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          text-left
        "
            >
              Generate with AI
            </button>

            {/* Empty */}

            <button
              className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          p-6
          text-left
        "
            >
              Empty Table
            </button>

          </div>

        </CardContent>

      </Card>

      <AiSchemaGenerator
        projectId={projectId}
        onGenerated={setPreview}
      />

      <ExistingTables
        projectId={projectId}
        schema={schema}
        onRefresh={fetchSchema}
      />

      {showUploader && (

        <SpreadsheetUploader
          projectId={projectId}
          onPreviewReady={
            setPreview
          }
        />

      )}

      {preview && (

        <EditableDataGrid
          projectId={projectId}
          preview={preview}
          setPreview={setPreview}
          onDeploy={async () => {

            // Refresh deployed tables
            await fetchSchema();

            // Clear preview state
            setPreview(null);

            // Hide uploader
            setShowUploader(false);
          }}
        />

      )}

    </div>
  );
}