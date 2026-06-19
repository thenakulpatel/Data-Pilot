// lib/rag/generateEmbedding.ts

export async function
generateEmbedding(
  text: string
): Promise<number[]> {

  const response =
    await fetch(
      "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${process.env.HUGGINGFACE_API_KEY}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          inputs: text,
        }),
      }
    );

  if (!response.ok) {

    const error =
      await response.text();

    throw new Error(error);
  }

  const embedding =
    await response.json();

  // flatten if nested
  return Array.isArray(
    embedding[0]
  )
    ? embedding[0]
    : embedding;
}