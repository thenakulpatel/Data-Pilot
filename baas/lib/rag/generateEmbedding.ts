import { pipeline }
from "@xenova/transformers";

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