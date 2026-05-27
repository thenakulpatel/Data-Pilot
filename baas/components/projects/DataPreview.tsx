import {
  PreviewData,
} from "@/types/preview";

import {
  Schema,
} from "@/types/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  preview: PreviewData;
}

export default function
DataPreview({
  preview,
}: Props) {

  const table =
    preview.schema.tables[0];

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          {table.name}
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div
          className="
            overflow-auto
          "
        >

          <table
            className="
              w-full
              border-collapse
            "
          >

            <thead>

              <tr>

                {table.fields.map(
                  (field) => (

                    <th
                      key={field.name}
                      className="
                        border-b
                        p-2
                        text-left
                      "
                    >

                      <div>
                        {field.name}
                      </div>

                      <div
                        className="
                          text-xs
                          text-muted-foreground
                        "
                      >
                        {field.type}
                      </div>

                    </th>
                  )
                )}

              </tr>

            </thead>

            <tbody>

              {preview.rows.map(
                (row, index) => (

                  <tr key={index}>

                    {table.fields.map(
                      (field) => (

                        <td
                          key={field.name}
                          className="
                            border-b
                            p-2
                          "
                        >

                          {String(
                            row[
                              field.name
                            ]
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

      </CardContent>

    </Card>
  );
}