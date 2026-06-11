import { NextRequest, NextResponse } from "next/server";

import { authorizeProject }
    from "@/lib/auth/authorizeProject";

import { pool } from "@/lib/db";

import { validateSchemaStructure }
    from "@/lib/input/validateSchema";

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

        const body = await req.json();

        const schema = body.schema;

        // Validate structure
        const valid =
            validateSchemaStructure(schema);

        if (!valid) {
            return NextResponse.json(
                {
                    error: "Invalid schema structure",
                },
                {
                    status: 400,
                }
            );
        }

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
                "Schema uploaded and deployed",
            queries,
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Upload failed",
            },
            {
                status: 500,
            }
        );
    }
}