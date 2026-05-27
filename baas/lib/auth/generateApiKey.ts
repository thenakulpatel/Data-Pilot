import crypto
from "crypto";

export function
generateApiKey() {

  const random =
    crypto.randomBytes(32)
      .toString("hex");

  return `bs_live_${random}`;
}