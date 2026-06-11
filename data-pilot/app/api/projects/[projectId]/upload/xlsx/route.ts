import { NextResponse, NextRequest } from "next/server";

import { authorizeProject }
    from "@/lib/auth/authorizeProject";

import * as XLSX
    from "xlsx";

import { parseXLSX }
    from "@/lib/input/parsers/xlsxParser";

import { validateXLSX }
    from "@/lib/input/validators/validateXLSX";

import { xlsxToSchema }
    from "@/lib/input/xlsxToSchema";

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
                    error: "XLSX file required",
                },
                {
                    status: 400,
                }
            );
        }

        const bytes =
            await file.arrayBuffer();

        const buffer =
            Buffer.from(bytes);

        // Parse workbook
        const workbook =
            parseXLSX(buffer);

        const validation =
            validateXLSX(workbook);

        if (!validation.valid) {
            return NextResponse.json(
                {
                    error:
                        validation.error,
                },
                {
                    status: 400,
                }
            );
        }

        // ================================================
        // EXTRACT FIRST SHEET
        // ================================================

        const sheetName =
            workbook.SheetNames[0];

        const worksheet =
            workbook.Sheets[sheetName];

        const rows =
            XLSX.utils.sheet_to_json(
                worksheet
            );

        // ================================================
        // INFER SCHEMA
        // ================================================

        const result =
            xlsxToSchema(
                file.name.replace(
                    ".xlsx",
                    ""
                ),
                rows as Record<string, any>[]
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
                "XLSX uploaded and deployed",
            schema,
            queries,
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "XLSX upload failed",
            },
            {
                status: 500,
            }
        );
    }
}