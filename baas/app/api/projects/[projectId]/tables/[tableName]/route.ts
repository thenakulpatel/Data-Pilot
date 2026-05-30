import {
  NextRequest,
  NextResponse,
} from "next/server";

import { pool }
from "@/lib/db";

import { getUser }
from "@/lib/auth/getUser";

import { getPhysicalTableName }
from "@/lib/schema/getPhysicalTableName";

interface Props {
  params: Promise<{
    projectId: string;
    tableName: string;
  }>;
}

export async function DELETE(
  req: NextRequest,
  { params }: Props
) {

  try {

    // ================================================
    // PARAMS
    // ================================================

    const {
      projectId,
      tableName,
    } = await params;

    // ================================================
    // AUTH
    // ================================================

    const authHeader =
      req.headers.get(
        "authorization"
      );

    if (!authHeader) {

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const token =
      authHeader.replace(
        "Bearer ",
        ""
      );

    const user =
      await getUser(
        token
      );

    if (!user) {

      return NextResponse.json(
        {
          error:
            "Invalid token",
        },
        {
          status: 401,
        }
      );
    }

    // ================================================
    // VERIFY PROJECT OWNERSHIP
    // ================================================

    const projectResult =
      await pool.query(
        `
        SELECT *
        FROM projects
        WHERE id = $1
        AND user_id = $2
        `,
        [
          projectId,
          user.id,
        ]
      );

    if (
      projectResult.rows.length === 0
    ) {

      return NextResponse.json(
        {
          error:
            "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    // ================================================
    // LOAD SCHEMA
    // ================================================

    const schemaResult =
      await pool.query(
        `
        SELECT schema
        FROM schemas
        WHERE project_id = $1
        `,
        [projectId]
      );

    if (
      schemaResult.rows.length === 0
    ) {

      return NextResponse.json(
        {
          error:
            "Schema not found",
        },
        {
          status: 404,
        }
      );
    }

    const schema =
      schemaResult.rows[0]
        .schema;

    // ================================================
    // REMOVE TABLE FROM SCHEMA
    // ================================================

    const updatedTables =

      (schema.tables || [])
        .filter(
          (
            table: {
              name: string;
            }
          ) =>

            table.name !==
            tableName
        );

    // ================================================
    // UPDATE SCHEMA
    // ================================================

    await pool.query(
      `
      UPDATE schemas
      SET schema = $1
      WHERE project_id = $2
      `,
      [
        {
          ...schema,
          tables:
            updatedTables,
        },
        projectId,
      ]
    );

    // ================================================
    // DROP PHYSICAL TABLE
    // ================================================

    const physicalTableName =
      getPhysicalTableName(
        projectId,
        tableName
      );

    await pool.query(
      `
      DROP TABLE IF EXISTS
      ${physicalTableName}
      CASCADE
      `
    );

    // ================================================
    // SUCCESS
    // ================================================

    return NextResponse.json(
      {
        success: true,
      }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to delete table",
      },
      {
        status: 500,
      }
    );
  }
}