import { Button }
from "@/components/ui/button";

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

  schema: Schema | null;

  onOpenTable: (
    tableName: string
  ) => void;
}

export default function
ExistingTables({
  schema,
  onOpenTable,
}: Props) {

  if (
    !schema ||
    schema.tables.length === 0
  ) {

    return (
      <Card>

        <CardContent
          className="
            p-6
          "
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
                flex-row
                items-center
                justify-between
              "
            >

              <CardTitle>
                {table.name}
              </CardTitle>

              <Button
                onClick={() =>
                  onOpenTable(
                    table.name
                  )
                }
              >
                Open Table
              </Button>

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
                        justify-between
                      "
                    >

                      <span>
                        {field.name}
                      </span>

                      <span
                        className="
                          text-sm
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
  );
}