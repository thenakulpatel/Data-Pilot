import {
  NextRequest,
  NextResponse,
} from "next/server";

import * as XLSX
  from "xlsx";

import { authorizeProject }
  from "@/lib/auth/authorizeProject";

import { parseXLSX }
  from "@/lib/input/parsers/xlsxParser";

import { validateXLSX }
  from "@/lib/input/validators/validateXLSX";

import { xlsxToSchema }
  from "@/lib/input/xlsxToSchema";

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
            "XLSX file required",
        },
        {
          status: 400,
        }
      );
    }

    // Validate extension
    if (
      !file.name.endsWith(
        ".xlsx"
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Only XLSX files allowed",
        },
        {
          status: 400,
        }
      );
    }

    // Read file
    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // Parse workbook
    const workbook =
      parseXLSX(buffer);

    // Validate workbook
    const validation =
      validateXLSX(
        workbook
      );

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

    // First sheet
    const firstSheet =
      workbook.SheetNames[0];

    const worksheet =
      workbook.Sheets[
      firstSheet
      ];

    // Convert to rows[]
    const rows: Record<
      string,
      string | number | boolean | null
    >[] =
      XLSX.utils.sheet_to_json(
        worksheet
      );

    // Infer table name
    const tableName =
      file.name.replace(
        ".xlsx",
        ""
      );

    // Generate schema
    const schema =
      xlsxToSchema(
        tableName,
        rows
      );

    return NextResponse.json({
      schema,
      rows,
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