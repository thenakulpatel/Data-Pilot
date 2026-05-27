"use client";

import {
  useEffect,
  useState,
} from "react";

import LiveTableViewer
  from "./LiveTableViewer";

import { Button }
  from "@/components/ui/button";

import SpreadsheetUploader
  from "./SpreadsheetUploader";

import EditableDataGrid
  from "./EditableDataGrid";

import ExistingTables
  from "./ExistingTables";

import { getToken }
  from "@/lib/frontend/auth";

import {
  Schema,
} from "@/types/schema";

import {
  PreviewData,
} from "@/types/preview";

import ApiKeyCard
  from "./ApiKeyCard";


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

  const [selectedTable,
    setSelectedTable] =
    useState<string | null>(
      null
    );

  const [showUploader,
    setShowUploader] =
    useState(false);

  async function fetchSchema() {

    try {

      const token =
        getToken();

      const response =
        await fetch(
          `/api/projects/${projectId}/schema`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (
        response.status === 404
      ) {

        setSchema(null);

        return;
      }

      const data =
        await response.json();

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
          items-center
          justify-between
        "
      >

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Project Workspace
        </h1>

        <Button
          onClick={() =>
            setShowUploader(
              !showUploader
            )
          }
        >
          Create New Table
        </Button>

      </div>

      <ApiKeyCard
        apiKey={apiKey}
      />

      <ExistingTables
        schema={schema}
        onOpenTable={
          setSelectedTable
        }
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
      {selectedTable && (

        <LiveTableViewer
          projectId={projectId}
          tableName={
            selectedTable
          }
        />

      )}

    </div>
  );
}