import { NextRequest, NextResponse } from "next/server";

import { authorizeApiAccess }
  from "@/lib/auth/authorizeApiAccess";

import { pool } from "@/lib/db";

import { getPhysicalTableName }
  from "@/lib/schema/getPhysicalTableName";

import { getProjectSchema }
  from "@/lib/schema/getProjectSchema";

import {
  validateTable,
  validateFields,
} from "@/lib/schema/runtimeValidator";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      projectId: string;
      table: string;
    }>;
  }
) {
  try {

    const { projectId, table } =
      await context.params;

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

    // Convert logical table
    // to physical table
    const physicalTableName =
      getPhysicalTableName(
        projectId,
        table
      );

    // Fetch schema dynamically
    const schema =
      await getProjectSchema(
        projectId
      );

    // Check schema exists
    if (!schema) {
      return NextResponse.json(
        {
          error: "Schema not found",
        },
        {
          status: 404,
        }
      );
    }

    // Validate logical table
    const validTable =
      validateTable(
        schema,
        table
      );

    if (!validTable) {
      return NextResponse.json(
        {
          error: "Invalid table",
        },
        {
          status: 400,
        }
      );
    }

    // Execute query on physical table
    const result =
      await pool.query(
        `
        SELECT *
        FROM ${physicalTableName}
        ORDER BY id ASC
        `
      );

    return NextResponse.json(
      result.rows
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch data",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: {
    params: Promise<{
      projectId: string;
      table: string;
    }>;
  }
) {
  try {

    const { projectId, table } =
      await context.params;

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

    // Convert logical table
    // to physical table
    const physicalTableName =
      getPhysicalTableName(
        projectId,
        table
      );

    // Fetch schema dynamically
    const schema =
      await getProjectSchema(
        projectId
      );

    // Check schema exists
    if (!schema) {
      return NextResponse.json(
        {
          error: "Schema not found",
        },
        {
          status: 404,
        }
      );
    }

    // Validate logical table
    const validTable =
      validateTable(
        schema,
        table
      );

    if (!validTable) {
      return NextResponse.json(
        {
          error: "Invalid table",
        },
        {
          status: 400,
        }
      );
    }

    // Parse request body
    const body =
      await req.json();

    const keys =
      Object.keys(body);

    const values =
      Object.values(body);

    // Validate fields
    const validFields =
      validateFields(
        schema,
        table,
        keys
      );

    if (!validFields) {
      return NextResponse.json(
        {
          error: "Invalid fields",
        },
        {
          status: 400,
        }
      );
    }

    const columns =
      keys.join(", ");

    const placeholders =
      values
        .map(
          (_, i) => `$${i + 1}`
        )
        .join(", ");

    // Insert into physical table
    const query = `
      INSERT INTO ${physicalTableName}
      (${columns})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const result =
      await pool.query(
        query,
        values
      );

    return NextResponse.json(
      result.rows[0]
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to insert data",
      },
      {
        status: 500,
      }
    );
  }
}