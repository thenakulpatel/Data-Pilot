// app/api/test-embedding/route.ts

import {
  generateEmbedding,
}
from "@/lib/rag/generateEmbedding";

import {
  NextResponse,
}
from "next/server";

export async function GET() {

  const embedding =
    await generateEmbedding(
      "Virat Kohli"
    );

  return NextResponse.json({
    dimensions:
      embedding.length,
  });
}