import {
  NextRequest,
  NextResponse,
} from "next/server";

import { authorizeProject }
  from "@/lib/auth/authorizeProject";

import { parseCSV }
  from "@/lib/input/parsers/csvParser";

import { sanitizeSqlName }
  from "@/lib/sql/sanitizeSqlName";

import { validateCSV }
  from "@/lib/input/validators/validateCSV";

import { csvToSchema }
  from "@/lib/input/csvToSchema";

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

    // Auth check
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

    // Read form data
    const formData =
      await req.formData();

    const file =
      formData.get("file");

    // Validate file
    if (
      !file ||
      !(file instanceof File)
    ) {

      return NextResponse.json(
        {
          error:
            "CSV file required",
        },
        {
          status: 400,
        }
      );
    }

    // Optional:
    // Validate extension
    if (
      !file.name.endsWith(".csv")
    ) {

      return NextResponse.json(
        {
          error:
            "Only CSV files allowed",
        },
        {
          status: 400,
        }
      );
    }

    // Read file content
    const content =
      await file.text();

    // Parse CSV
    const rows =
      parseCSV(content);

    // Validate parsed CSV
    const validation =
      validateCSV(rows);

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

    // Infer table name
    const tableName =
      file.name.replace(
        ".csv",
        ""
      );

    // Generate schema
    const result =
      csvToSchema(
        tableName,
        rows
      );


    return NextResponse.json({

      schema:
        result.schema,

      rows:
        result.rows,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Preview generation failed",
      },
      {
        status: 500,
      }
    );
  }
}