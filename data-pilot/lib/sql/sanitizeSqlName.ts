export function
sanitizeSqlName(
  name: string
) {

  return name

    // lowercase
    .toLowerCase()

    // replace spaces/dashes
    .replace(
      /[\s-]+/g,
      "_"
    )

    // remove invalid chars
    .replace(
      /[^a-z0-9_]/g,
      ""
    )

    // prevent starting number
    .replace(
      /^[0-9]/,
      "_$&"
    );
}