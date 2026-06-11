import {
  NextRequest,
  NextResponse,
} from "next/server";

import Groq
from "groq-sdk";

import {
  searchRows,
} from "@/lib/rag/searchRows";

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

    const {
      projectId,
    } =
      await context.params;

    const body =
      await req.json();

    const {
      tableName,
      question,
    } = body;

    // ==========================================
    // VECTOR SEARCH
    // ==========================================

    const rows =
      await searchRows({

        projectId,

        tableName,

        question,

        limit: 5,
      });

    if (
      rows.length === 0
    ) {

      return NextResponse.json({

        answer:
          "No relevant records found.",
      });
    }

    // ==========================================
    // CONTEXT
    // ==========================================

    const contextText =
      rows
        .map(
          (
            row: any,
            index: number
          ) =>

            `Record ${index + 1}:
${JSON.stringify(
  row.row_data
)}`
        )
        .join("\n\n");

    // ==========================================
    // AI ANSWER
    // ==========================================

    const completion =
      await groq.chat.completions.create({

        model:
          "llama-3.1-8b-instant",

        temperature: 0,

        messages: [

          {
            role: "system",

            content: `

You are a database assistant.

Answer ONLY using
the provided records.

If the answer
cannot be determined,
say:

"I could not find that information."

`,
          },

          {
            role: "user",

            content: `

Question:

${question}

Records:

${contextText}

`,
          },
        ],
      });

    const answer =
      completion
        .choices[0]
        .message
        .content;

    return NextResponse.json({

      answer,

      rows,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Vector query failed",
      },
      {
        status: 500,
      }
    );
  }
}