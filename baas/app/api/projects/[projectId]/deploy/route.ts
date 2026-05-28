import {
  NextRequest,
  NextResponse,
} from "next/server";

import { pool }
  from "@/lib/db";

  import { sanitizeSqlName }
from "@/lib/sql/sanitizeSqlName";

import { authorizeProject }
  from "@/lib/auth/authorizeProject";

import { generateSQL }
  from "@/lib/schema/sqlGenerator";

import { executeQueries }
  from "@/lib/schema/executeSQL";

import {
  validateSchemaStructure,
} from "@/lib/input/validateSchema";

import {
  Schema,
} from "@/types/schema";

import { getPhysicalTableName }
  from "@/lib/schema/getPhysicalTableName";

export async function POST(
  req: NextRequest,
  context: {
    params: Promise<{
      projectId: string;
    }>;
  }
) {

  try {

    // =====================================================
    // GET PROJECT ID
    // =====================================================

    const { projectId } =
      await context.params;

    // =====================================================
    // AUTHORIZATION
    // =====================================================

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

    // =====================================================
    // PARSE BODY
    // =====================================================

    const body =
      await req.json();

    const {
      schema,
      rows,
    } = body;

    // console.log("DEPLOY START");
    // console.log("SCHEMA:", schema);
    // console.log("ROWS:", rows.length);

    // =====================================================
    // VALIDATE SCHEMA
    // =====================================================

    const valid =
      validateSchemaStructure(
        schema
      );

    if (!valid) {

      return NextResponse.json(
        {
          error:
            "Invalid schema",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // VALIDATE ROWS
    // =====================================================

    if (
      !Array.isArray(rows)
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid rows",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // CHECK DUPLICATE TABLES
    // =====================================================

    const existingResult =
      await pool.query(
        `
        SELECT schema
        FROM schemas
        WHERE project_id = $1
        `,
        [projectId]
      );

    let existingSchema:
      Schema = {
      tables: [],
    };

    if (
      existingResult.rows.length > 0
    ) {

      existingSchema =
        existingResult.rows[0]
          .schema;
    }

    for (
      const newTable of schema.tables
    ) {

      const duplicate =
        existingSchema.tables.find(
          (table) =>
            table.name ===
            newTable.name
        );

      if (duplicate) {

        return NextResponse.json(
          {
            error:
              `Table "${newTable.name}" already exists`,
          },
          {
            status: 400,
          }
        );
      }
    }
    console.log(schema);
    // =====================================================
    // GENERATE SQL
    // =====================================================

    const queries =
      generateSQL(
        schema,
        projectId
      );

    // =====================================================
    // CREATE TABLES
    // =====================================================

    await executeQueries(
      queries
    );

    // =====================================================
    // INSERT ROWS
    // =====================================================

    for (
      const table of schema.tables
    ) {

      const physicalTableName =
        getPhysicalTableName(
          projectId,
          table.name
        );

      for (
        const row of rows
      ) {

        const keys =
          Object.keys(row).filter(
            (key) => key !== "id"
          );

        const values =
          keys.map(
            (key) => row[key]
          );

        const columns =
          keys.join(", ");

        const placeholders =
          values
            .map(
              (_, index) =>
                `$${index + 1}`
            )
            .join(", ");

        await pool.query(
          `
          INSERT INTO ${physicalTableName}
          (${columns})
          VALUES (${placeholders})
          `,
          values
        );
      }
    }

    // =====================================================
    // UPDATE PROJECT SCHEMA
    // =====================================================

    existingSchema.tables.push(
      ...schema.tables
    );

    // =====================================================
    // UPSERT SCHEMA
    // =====================================================

    await pool.query(
      `
      INSERT INTO schemas
      (project_id, schema)

      VALUES ($1, $2)

      ON CONFLICT (project_id)

      DO UPDATE SET
      schema = $2
      `,
      [
        projectId,
        JSON.stringify(
          existingSchema
        ),
      ]
    );

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json({
      message:
        "API generated successfully",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Deployment failed",
      },
      {
        status: 500,
      }
    );
  }
}