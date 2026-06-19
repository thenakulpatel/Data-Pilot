// lib/rag/generateEmbedding.ts

let extractor: any =
  null;

export async function
generateEmbedding(
  text: string
): Promise<number[]> {

  if (!extractor) {

    console.log(
      "Loading embedding model..."
    );

    const {
      pipeline,
      env,
    } =
      await import(
        "@xenova/transformers"
      );

    env.allowLocalModels =
      false;

    extractor =
      await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
  }

  const output =
    await extractor(
      text,
      {
        pooling: "mean",
        normalize: true,
      }
    );

  return Array.from(
    output.data
  );
}