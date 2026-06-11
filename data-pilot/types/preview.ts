import { Schema }
from "./schema";

export interface PreviewData {
  schema: Schema;

  rows: Record<
    string,
    any
  >[];
}