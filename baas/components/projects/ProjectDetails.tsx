"use client";

import EmptyProjectState
  from "./EmptyProjectState";

import {
  useEffect,
  useState,
} from "react";

import { getToken }
  from "@/lib/frontend/auth";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Field {
  name: string;
  type: string;
}

interface Table {
  name: string;
  fields: Field[];
}

interface Schema {
  tables: Table[];
}

interface Props {
  projectId: string;
}

export default function
  ProjectDetails({
    projectId,
  }: Props) {

  const [schema, setSchema] =
    useState<Schema | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function fetchSchema() {

    try {

      setLoading(true);

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

      const data =
        await response.json();

      if (response.status === 404) {

        setSchema(null);

        return;
      }

      if (!response.ok) {

        setError(
          data.error ||
          "Failed to fetch schema"
        );

        return;
      }
      // console.log(data);

      setSchema(
        data.schema || data
      );

    } catch (error) {

      console.error(error);

      setError(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSchema();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

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

  if (
    !schema ||
    !schema.tables
  ) {
    return (
      <EmptyProjectState
        projectId={projectId}
        onUploaded={fetchSchema}
      />
    );
  }
  return (
    <div
      className="
        space-y-6
      "
    >

      <h1
        className="
          text-3xl
          font-bold
        "
      >
        Project Schema
      </h1>

      <div
        className="
          grid
          gap-4
        "
      >

        {schema.tables.map(
          (table) => (

            <Card
              key={table.name}
            >

              <CardHeader>

                <CardTitle>
                  {table.name}
                </CardTitle>

              </CardHeader>

              <CardContent>

                <div
                  className="
                    space-y-2
                  "
                >

                  {table.fields.map(
                    (field) => (

                      <div
                        key={field.name}
                        className="
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <span>
                          {field.name}
                        </span>

                        <span
                          className="
                            text-muted-foreground
                          "
                        >
                          {field.type}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </CardContent>

            </Card>
          )
        )}

      </div>

    </div>
  );
}