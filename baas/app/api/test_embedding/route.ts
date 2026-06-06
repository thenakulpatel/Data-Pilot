import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  generateEmbedding,
} from "@/lib/rag/generateEmbedding";

export async function POST(
  req: NextRequest
) {

  const body =
    await req.json();

  const embedding =
    await generateEmbedding(
      body.text
    );

  return NextResponse.json({

    dimensions:
      embedding.length,

    sample:
      embedding.slice(
        0,
        10
      ),
    });
}