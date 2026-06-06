export function rowToText(
  row: Record<string, any>
) {

  return Object.entries(row)

    .filter(
      ([key]) =>
        key !== "id"
    )

    .map(
      ([key, value]) =>
        `${key} is ${value}`
    )

    .join(". ");
}