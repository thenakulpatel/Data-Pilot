import {
  NextRequest,
  NextResponse,
} from "next/server";

import { pool }
from "@/lib/db";

import { authorizeApiAccess }
from "@/lib/auth/authorizeApiAccess";

import { getProjectSchema }
from "@/lib/schema/getProjectSchema";

import { getPhysicalTableName }
from "@/lib/schema/getPhysicalTableName";

import {
  validateTable,
  validateFields,
} from "@/lib/schema/runtimeValidator";

export async function PUT(
  req: NextRequest,
  context: {
    params: Promise<{
      projectId: string;
      table: string;
      id: string;
    }>;
  }
) {

  try {

    const {
      projectId,
      table,
      id,
    } = await context.params;

    // ================================================
    // AUTHORIZATION
    // ================================================

    const auth =
      await authorizeApiAccess(
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

    // ================================================
    // SCHEMA
    // ================================================

    const schema =
      await getProjectSchema(
        projectId
      );

    if (!schema) {

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

    // ================================================
    // VALIDATE TABLE
    // ================================================

    const validTable =
      validateTable(
        schema,
        table
      );

    if (!validTable) {

      return NextResponse.json(
        {
          error:
            "Invalid table",
        },
        {
          status: 400,
        }
      );
    }

    // ================================================
    // BODY
    // ================================================

    const body =
      await req.json();

    const keys =
      Object.keys(body);

    const values =
      Object.values(body);

    // ================================================
    // VALIDATE FIELDS
    // ================================================

    const validFields =
      validateFields(
        schema,
        table,
        keys
      );

    if (!validFields) {

      return NextResponse.json(
        {
          error:
            "Invalid fields",
        },
        {
          status: 400,
        }
      );
    }

    // ================================================
    // TABLE NAME
    // ================================================

    const physicalTableName =
      getPhysicalTableName(
        projectId,
        table
      );

    // ================================================
    // UPDATE QUERY
    // ================================================

    const setClause =
      keys
        .map(
          (
            key,
            index
          ) =>
            `${key} = $${index + 1}`
        )
        .join(", ");

    const query = `
      UPDATE ${physicalTableName}

      SET ${setClause}

      WHERE id = $${keys.length + 1}

      RETURNING *;
    `;

    const result =
      await pool.query(
        query,
        [
          ...values,
          id,
        ]
      );

    return NextResponse.json(
      result.rows[0]
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Update failed",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{
      projectId: string;
      table: string;
      id: string;
    }>;
  }
) {

  try {

    const {
      projectId,
      table,
      id,
    } = await context.params;

    // ================================================
    // AUTHORIZATION
    // ================================================

    const auth =
      await authorizeApiAccess(
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

    // ================================================
    // SCHEMA
    // ================================================

    const schema =
      await getProjectSchema(
        projectId
      );

    if (!schema) {

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

    // ================================================
    // VALIDATE TABLE
    // ================================================

    const validTable =
      validateTable(
        schema,
        table
      );

    if (!validTable) {

      return NextResponse.json(
        {
          error:
            "Invalid table",
        },
        {
          status: 400,
        }
      );
    }

    // ================================================
    // TABLE NAME
    // ================================================

    const physicalTableName =
      getPhysicalTableName(
        projectId,
        table
      );

    // ================================================
    // DELETE QUERY
    // ================================================

    await pool.query(
      `
      DELETE FROM ${physicalTableName}

      WHERE id = $1
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}