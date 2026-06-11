import { NextResponse,NextRequest } from "next/server";

import { authorizeProject }
from "@/lib/auth/authorizeProject";

import { validateCSV }
    from "@/lib/input/validators/validateCSV";

import { parseCSV }
    from "@/lib/input/parsers/csvParser";

import { csvToSchema }
    from "@/lib/input/csvToSchema";

import { pool } from "@/lib/db";

import { generateSQL }
    from "@/lib/schema/sqlGenerator";

import { executeQueries }
    from "@/lib/schema/executeSQL";

export async function POST(
    req: NextRequest,
    context: {
        params: Promise<{
            projectId: string;
        }>;
    }
) {
    try {

        const { projectId } =
            await context.params;

             const auth =
            await authorizeProject(
                req,
                projectId
            );

        if ("error" in auth) {
            return NextResponse.json(
                {
                    error: auth.error,
                },
                {
                    status: auth.status,
                }
            );
        }

        const formData =
            await req.formData();

        const file =
            formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                {
                    error: "CSV file required",
                },
                {
                    status: 400,
                }
            );
        }

        const content =
            await file.text();

        const records =
            parseCSV(content);

        const validation =
            validateCSV(records);

        if (!validation.valid) {
            return NextResponse.json(
                {
                    error: validation.error,
                },
                {
                    status: 400,
                }
            );
        }

        const tableName =
            file.name.replace(".csv", "");

       const result =
  csvToSchema(
    tableName,
    records
  );

const schema =
  result.schema;

        // Store schema
        await pool.query(
            `
      INSERT INTO schemas
      (project_id, schema)
      VALUES ($1, $2)
      `,
            [projectId, JSON.stringify(schema)]
        );

        // Generate SQL
        const queries =
            generateSQL(
                schema,
                projectId
            );

        // Execute SQL
        await executeQueries(queries);

        return NextResponse.json({
            message:
                "CSV uploaded and deployed",
            schema,
            queries,
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "CSV upload failed",
            },
            {
                status: 500,
            }
        );
    }
}