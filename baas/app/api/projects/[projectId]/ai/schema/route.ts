import {
  NextRequest,
  NextResponse,
} from "next/server";

import Groq
  from "groq-sdk";

import { authorizeProject }
  from "@/lib/auth/authorizeProject";

const groq =
  new Groq({

    apiKey:
      process.env
        .GROQ_API_KEY,
  });

export async function POST(
  req: NextRequest,

  context: {
    params: Promise<{
      projectId: string;
    }>;
  }
) {

  try {

    // ================================================
    // PARAMS
    // ================================================

    const { projectId } =
      await context.params;

    // ================================================
    // AUTH
    // ================================================

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

    // ================================================
    // BODY
    // ================================================

    const body =
      await req.json();

    const {
      prompt,
      generateMockData,
      rowCount,
    } = body;

    // ================================================
    // VALIDATION
    // ================================================
    const safeRowCount =
      Math.min(
        Math.max(
          rowCount || 5,
          1
        ),
        100
      );
    if (
      !prompt ||
      typeof prompt !==
      "string"
    ) {

      return NextResponse.json(
        {
          error:
            "Prompt required",
        },
        {
          status: 400,
        }
      );
    }

    // ================================================
    // AI SCHEMA GENERATION
    // ================================================

    const completion =
      await groq.chat.completions.create({

        model:
          "llama-3.1-8b-instant",

        temperature: 0,
        response_format: { type: "json_object" },
        messages: [

          {
            role: "system",

            content: `

You are an expert backend architect.

Your job is to generate production-style database schema table
for backend API systems.

Return ONLY valid JSON.

================================================
OUTPUT FORMAT
================================================

{
  "tables": [
    {
      "name": "table_name",
      "fields": [
        {
          "name": "field_name",
          "type": "text"
        }
      ]
    }
  ]
}

================================================
ALLOWED FIELD TYPES
================================================

- text
- number
- boolean
- date

================================================
NAMING RULES
================================================

- Use snake_case only
- Table names must be plural
- Field names must be concise
- Never use spaces
- Never use special characters

================================================
BEHAVIOR RULES
================================================

1. Always generate ONLY ONE table.

2. The table should represent the main
   entity described by the user.

4. Prefer practical backend design.

5. Keep schemas MVP-friendly.

6. Avoid excessive complexity.


================================================
STRICT RULES
================================================

- Return ONLY JSON
- No markdown
- No explanations
- No comments
- No extra text
- No trailing commas

`,
          },

          {
            role: "user",

            content: prompt,
          },
        ],
      });

    // ================================================
    // RESPONSE
    // ================================================

    const content =
      completion
        .choices[0]
        .message
        .content;

    if (!content) {

      return NextResponse.json(
        {
          error:
            "AI generation failed",
        },
        {
          status: 500,
        }
      );
    }

    // ================================================
    // PARSE SCHEMA
    // ================================================

    let schema;

    try {

      schema =
        JSON.parse(content);


      const allowedTypes = [
        "text",
        "integer",
        "float",
        "boolean",
        "date",
      ];
      if (
        schema.tables.length !== 1
      ) {

        return NextResponse.json(
          {
            error:
              "AI generated multiple tables. Only one table is currently supported."
          },
          {
            status: 400
          }
        );
      }

      schema.tables =
        schema.tables.map(
          (table: any) => ({

            // ============================================
            // TABLE
            // ============================================

            name:
              table.name

                ?.toLowerCase()

                .replace(
                  /[\s-]+/g,
                  "_"
                )

                .replace(
                  /[^a-z0-9_]/g,
                  ""
                ),

            // ============================================
            // FIELDS
            // ============================================

            fields:
              table.fields

                // remove duplicate id
                .filter(
                  (field: any) =>

                    field.name !== "id"
                )

                .map(
                  (field: any) => ({

                    name:
                      field.name

                        ?.toLowerCase()

                        .replace(
                          /[\s-]+/g,
                          "_"
                        )

                        .replace(
                          /[^a-z0-9_]/g,
                          ""
                        ),

                    type:
                      allowedTypes.includes(
                        field.type
                      )

                        ? field.type

                        : "text",
                  })
                ),
          })
        );

    } catch {

      return NextResponse.json(
        {
          error:
            "Invalid AI response",
        },
        {
          status: 500,
        }
      );
    }

    // ================================================
    // MOCK DATA
    // ================================================

    let rows = [];

    if (generateMockData) {

      const mockCompletion =
        await groq.chat.completions.create({

          model:
            "llama-3.1-8b-instant",

          temperature: 0.7,
          response_format: { type: "json_object" },

          messages: [

            {
              role: "system",

              content: `

Generate exactly ${safeRowCount} realistic mock rows.

Return ONLY valid JSON.

FORMAT:

{
  "rows": [
    {
      "field": "value"
    }
  ]
}

RULES:
- realistic values
- use correct data types
- no markdown
- no explanations
- JSON only

`,
            },

            {
              role: "user",

              content: `
              Context Prompt: "${prompt}"

          Schema:

          ${JSON.stringify(schema)}

          `,
            },
          ],
        });

      const mockContent =
        mockCompletion
          .choices[0]
          .message
          .content;

      if (mockContent) {

        try {

          const parsed =
            JSON.parse(
              mockContent
            );

          rows =
            parsed.rows || [];

        } catch {

          rows = [];
        }
      }
    }

    // ================================================
    // SUCCESS
    // ================================================

    return NextResponse.json({

      schema,

      rows,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "AI schema generation failed",
      },
      {
        status: 500,
      }
    );
  }
}