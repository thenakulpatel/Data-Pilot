'use client';

import { Button }
  from "@/components/ui/button";

import DeleteTableButton
  from "./DeleteTableButton";

import { ArrowUpRight } from "lucide-react";



import { useRouter }
  from "next/navigation";

import { authenticatedFetch }
  from "@/lib/frontend/authenticatedFetch";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Schema,
} from "@/types/schema";

interface Props {

  projectId: string;

  schema: Schema | null;

  onRefresh: () => void;
}

export default function
  ExistingTables({
    projectId,
    schema,
    onRefresh,
  }: Props) {
  const router = useRouter();

  if (
    !schema ||
    schema.tables.length === 0
  ) {

    return (
      <Card>

        <CardContent

        >

          <p
            className="
              text-muted-foreground
            "
          >
            No tables deployed yet
          </p>

        </CardContent>

      </Card>
    );
  }

  return (
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

            <CardHeader
              className="
                flex
                p-2
                flex-row
                items-center
                justify-between
              "
            >

              <CardTitle
                className="
    text-xl
    font-semibold
    text-white
    pl-2
  "
              >
                {table.name}
              </CardTitle>

              <p
                className="
    mt-2

    text-sm

    text-white/50
  "
              >
                {table.fields.length} columns
              </p>

              <div
                className="
    flex
    gap-2
  "
              >


                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    router.push(
                      `/projects/${projectId}/tables/${table.name}`
                    )
                  }
                >
                  <ArrowUpRight className="h-4 w-4 " />
                </Button>

                <DeleteTableButton
                  projectId={projectId}
                  tableName={table.name}
                  onDeleted={onRefresh}
                />

              </div>

            </CardHeader>

            <CardContent>

              <div
                className="
    space-y-3
  "
              >

                <div
                  className="
      flex
      flex-wrap
      gap-2 pb-2 mb-2
    "
                >

                  {table.fields
                    .slice(0, 3)
                    .map((field) => (

                      <span
                        key={field.name}
                        className="
            rounded-full

            border
            border-white/10

            bg-white/[0.03]

            px-3
            py-1

            text-xs
            text-white/60
          "
                      >
                        {field.name}
                      </span>

                    ))}

                  {table.fields.length > 3 && (

                    <span
                      className="
          rounded-full

          border
          border-white/10

          bg-white/[0.03]

          px-3
          py-1

          text-xs
          text-white/40
        "
                    >
                      +{table.fields.length - 3}
                    </span>

                  )}

                </div>

              </div>

            </CardContent>

          </Card>
        )
      )}

    </div>
  );
}