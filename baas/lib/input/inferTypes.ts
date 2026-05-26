export function inferType(value: any) {

  if (!isNaN(Number(value))) {
    return "integer";
  }

  if (
    value === "true" ||
    value === "false"
  ) {
    return "boolean";
  }

  return "text";
}